import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionEntity } from "./entities/entities.js";
import { SubscriptionController } from "./subscription.controller.js";
import { SubscriptionRepository } from "./subscription.repository.js";
import { SubscriptionService } from "./subscription.service.js";
import { WeatherModule } from "../weather/weather.module.js";
import { SubscriptionEmailService } from "./subscription-email.service.js";
import { SUBSCRIPTION_INJECTION_TOKENS } from "./enums/enums.js";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { WeatherService } from "../weather/weather.js";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigKeys } from "../../libs/enums/enums.js";

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
        const baseUrl = configService.get(ConfigKeys.BASE_URL) as string;

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
