import { Kafka, Producer, Consumer } from "kafkajs";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { TIMEOUT } from "../../../../shared/libs/enums/enums.js";
import { EMAIL_ERROR_MESSAGES } from "../libs/enums/enums.js";
import { MessageBrokerException } from "../libs/exceptions/exceptions.js";
import { IMessageBroker } from "../libs/interfaces/interfaces.js";
import { PublishableMessage } from "../libs/types/types.js";

@Injectable()
class KafkaService implements OnModuleInit, OnModuleDestroy, IMessageBroker {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    brokerHost: string,
    clientId: string,
    groupId: string,
    retry: number
  ) {
    this.kafka = new Kafka({
      clientId,
      brokers: [brokerHost],
      retry: { retries: retry },
    });

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
    });

    this.consumer = this.kafka.consumer({
      groupId,
      maxWaitTimeInMs: TIMEOUT.DEFAULT_TIMEOUT,
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async publish(topic: string, message: unknown): Promise<void> {
    const messageKey = this.extractMessageKey(message);

    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message), key: messageKey }],
    });
  }

  async subscribe(
    topic: string,
    handler: (message: unknown) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic });

    await this.consumer.run({
      partitionsConsumedConcurrently: 1,
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) {
            throw new MessageBrokerException(
              EMAIL_ERROR_MESSAGES.MESSAGE_IS_NULL_OR_UNDEFINED
            );
          }

          if (!message.value.toString().trim()) {
            throw new MessageBrokerException(
              EMAIL_ERROR_MESSAGES.MESSAGE_HAS_NO_VALUE
            );
          }

          const parsedMessage = JSON.parse(message.value.toString()) as unknown;

          await handler(parsedMessage);
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new MessageBrokerException(error.message);
          }

          throw new MessageBrokerException();
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  private extractMessageKey(message: unknown): string | undefined {
    if (typeof message === "object" && message !== null && "type" in message) {
      const typedMessage = message as PublishableMessage;

      return typedMessage.type;
    }

    return undefined;
  }
}

export { KafkaService };
