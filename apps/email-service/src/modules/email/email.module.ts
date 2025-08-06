import { MailerService } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientGrpc } from "@nestjs/microservices";
import {
  CONFIG_KEYS,
  GRPC_SERVICES,
} from "../../../../../shared/libs/enums/enums.js";
import { EMAIL_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import {
  IMessageBroker,
  IWeatherService,
} from "../../libs/interfaces/interfaces.js";
import { EmailCommand } from "../../libs/types/types.js";
import { GrpcClientsModule } from "../grpc-client.module.js";
import { KafkaService } from "../kafka.service.js";
import { EmailWeatherClient } from "./email-weather.client.js";
import { EmailConsumer } from "./email.consumer.js";
import { EmailController } from "./email.controller.js";
import { EmailPublisher } from "./email.publisher.js";

@Module({
  controllers: [EmailController],
  imports: [GrpcClientsModule],
  providers: [
    {
      provide: EMAIL_INJECTION_TOKENS.MESSAGE_BROKER,
      useFactory: (configService: ConfigService) => {
        const brokerHost = configService.get<string>(
          CONFIG_KEYS.KAFKA_HOST
        ) as string;

        const clientId = configService.get<string>(
          CONFIG_KEYS.EMAIL_SERVICE_HOST
        ) as string;

        const groupId = configService.get<string>(
          CONFIG_KEYS.KAFKA_GROUP_ID
        ) as string;

        const retry = configService.get<number>(
          CONFIG_KEYS.SEND_RETRY
        ) as number;

        return new KafkaService(brokerHost, clientId, groupId, retry);
      },
      inject: [ConfigService],
    },
    {
      provide: EMAIL_INJECTION_TOKENS.EMAIL_WEATHER_CLIENT,
      useFactory: (weatherService: IWeatherService) =>
        new EmailWeatherClient(weatherService),
      inject: [EMAIL_INJECTION_TOKENS.WEATHER_SERVICE],
    },
    {
      provide: EMAIL_INJECTION_TOKENS.WEATHER_SERVICE,
      useFactory: (client: ClientGrpc) =>
        client.getService<IWeatherService>(GRPC_SERVICES.WEATHER_SERVICE),
      inject: ["WEATHER_SERVICE"],
    },
    {
      provide: EmailConsumer,
      useFactory: (
        mailerService: MailerService,
        emailWeatherClient: EmailWeatherClient,
        configService: ConfigService,
        messageBrokerService: IMessageBroker<EmailCommand>
      ) => {
        const baseUrl = configService.get<string>(
          CONFIG_KEYS.BASE_URL
        ) as string;

        const topic = configService.get<string>(
          CONFIG_KEYS.EMAIL_TOPIC
        ) as string;

        return new EmailConsumer(
          mailerService,
          baseUrl,
          emailWeatherClient,
          messageBrokerService,
          topic
        );
      },
      inject: [
        MailerService,
        EMAIL_INJECTION_TOKENS.EMAIL_WEATHER_CLIENT,
        ConfigService,
        EMAIL_INJECTION_TOKENS.MESSAGE_BROKER,
      ],
    },
    {
      provide: EmailPublisher,
      useFactory: (
        configService: ConfigService,
        messageBrokerService: IMessageBroker
      ) => {
        const topic = configService.get<string>(
          CONFIG_KEYS.EMAIL_TOPIC
        ) as string;

        return new EmailPublisher(messageBrokerService, topic);
      },
      inject: [ConfigService, EMAIL_INJECTION_TOKENS.MESSAGE_BROKER],
    },
  ],

  exports: [EmailPublisher],
})
class EmailModule {}

export { EmailModule };
