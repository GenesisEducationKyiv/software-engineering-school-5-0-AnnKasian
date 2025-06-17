import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionEntity } from "./entities/entities.js";
import { SubscriptionController } from "./subscription.controller.js";
import { SubscriptionRepository } from "./subscription.repository.js";
import { SubscriptionService } from "./subscription.service.js";
import { WeatherModule } from "../weather/weather.module.js";
import { SubscriptionEmailService } from "./subscription-email.service.js";

@Module({
  controllers: [SubscriptionController],
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), WeatherModule],
  providers: [
    SubscriptionRepository,
    SubscriptionService,
    SubscriptionEmailService,
  ],
  exports: [SubscriptionService],
})
class SubscriptionModule {}

export { SubscriptionModule };
