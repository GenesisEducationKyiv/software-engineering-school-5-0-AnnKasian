import { Module } from "@nestjs/common";
import { EmailService } from "./email.service.js";
import { EMAIL_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import { IWeatherService } from "../../libs/interfaces/interfaces.js";
import { EmailController } from "./email.controller.js";
import { MailerService } from "@nestjs-modules/mailer";
import { CONFIG_KEYS } from "../../../../../shared/libs/enums/enums.js";
import { ConfigService } from "@nestjs/config";
import { GrpcClientsModule } from "../grpc-client.module.js";
import { ClientGrpc } from "@nestjs/microservices";

@Module({
  controllers: [EmailController],
  imports: [GrpcClientsModule],
  providers: [
    {
      provide: EmailService,
      useFactory: (
        mailerService: MailerService,
        weatherService: IWeatherService,
        configService: ConfigService
      ) => {
        const baseUrl = configService.get(CONFIG_KEYS.BASE_URL) as string;

        return new EmailService(mailerService, baseUrl, weatherService);
      },
      inject: [
        MailerService,
        EMAIL_INJECTION_TOKENS.WEATHER_SERVICE,
        ConfigService,
      ],
    },
    {
      provide: EMAIL_INJECTION_TOKENS.WEATHER_SERVICE,
      useFactory: (client: ClientGrpc) =>
        client.getService<IWeatherService>("WeatherService"),
      inject: ["WEATHER_SERVICE"],
    },
  ],

  exports: [EmailService],
})
class EmailModule {}

export { EmailModule };
