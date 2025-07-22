import { MailerService } from "@nestjs-modules/mailer";
import { Repository } from "typeorm";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG_KEYS } from "../../libs/enums/enums.js";
import { WeatherService } from "../weather/weather.js";
import { WeatherModule } from "../weather/weather.module.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { SUBSCRIPTION_INJECTION_TOKENS } from "./enums/enums.js";
import { SubscriptionEmailService } from "./subscription-email.service.js";
import { SubscriptionController } from "./subscription.controller.js";
import { SubscriptionRepository } from "./subscription.repository.js";
import { SubscriptionService } from "./subscription.service.js";

@Module({
  controllers: [SubscriptionController],
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), WeatherModule],
  providers: [
    SubscriptionService,
    {
      provide: SubscriptionEmailService,
      useFactory: (
        configService: ConfigService,
        mailerService: MailerService,
        weatherService: WeatherService
      ) => {
        const baseUrl = configService.get(CONFIG_KEYS.BASE_URL) as string;

        return new SubscriptionEmailService(
          mailerService,
          baseUrl,
          weatherService
        );
      },
      inject: [ConfigService, MailerService, WeatherService],
    },
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY,
      useFactory: (repository: Repository<SubscriptionEntity>) => {
        return new SubscriptionRepository(repository);
      },
      inject: [getRepositoryToken(SubscriptionEntity)],
    },
  ],
})
class SubscriptionModule {}

export { SubscriptionModule };
