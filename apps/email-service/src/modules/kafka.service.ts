import { Kafka, Producer, Consumer } from "kafkajs";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { TIMEOUT } from "../../../../shared/libs/enums/enums.js";
import { MessageBrokerException } from "../libs/exceptions/exceptions.js";
import { IMessageBroker } from "../libs/interfaces/interfaces.js";
import { EmailCommand } from "../libs/types/types.js";

@Injectable()
class KafkaService implements OnModuleInit, IMessageBroker {
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

  async publish(topic: string, message: EmailCommand): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message), key: message.type }],
    });
  }

  async subscribe(
    topic: string,
    handler: (message: EmailCommand) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic });

    await this.consumer.run({
      partitionsConsumedConcurrently: 1,
      eachMessage: async ({ message }) => {
        try {
          const command = JSON.parse(
            message.value?.toString() || "{}"
          ) as EmailCommand;
          await handler(command);
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
}

export { KafkaService };
