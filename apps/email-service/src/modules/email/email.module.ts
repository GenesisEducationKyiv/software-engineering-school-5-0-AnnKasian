import { MailerService } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientGrpc } from "@nestjs/microservices";
import { CONFIG_KEYS } from "../../../../../shared/libs/enums/enums.js";
import { EMAIL_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import { IWeatherService } from "../../libs/interfaces/interfaces.js";
import { GrpcClientsModule } from "../grpc-client.module.js";
import { EmailWeatherClient } from "./email-weather.client.js";
import { EmailController } from "./email.controller.js";
import { EmailService } from "./email.service.js";

@Module({
  controllers: [EmailController],
  imports: [GrpcClientsModule],
  providers: [
    {
      provide: EMAIL_INJECTION_TOKENS.EMAIL_WEATHER_CLIENT,
      useFactory: (weatherService: IWeatherService) =>
        new EmailWeatherClient(weatherService),
      inject: [EMAIL_INJECTION_TOKENS.WEATHER_SERVICE],
    },
    {
      provide: EMAIL_INJECTION_TOKENS.WEATHER_SERVICE,
      useFactory: (client: ClientGrpc) =>
        client.getService<IWeatherService>("WeatherService"),
      inject: ["WEATHER_SERVICE"],
    },
    {
      provide: EmailService,
      useFactory: (
        mailerService: MailerService,
        emaiWeatherClient: EmailWeatherClient,
        configService: ConfigService
      ) => {
        const baseUrl = configService.get(CONFIG_KEYS.BASE_URL) as string;

        return new EmailService(mailerService, baseUrl, emaiWeatherClient);
      },
      inject: [
        MailerService,
        EMAIL_INJECTION_TOKENS.EMAIL_WEATHER_CLIENT,
        ConfigService,
      ],
    },
  ],

  exports: [EmailService],
})
class EmailModule {}

export { EmailModule };
