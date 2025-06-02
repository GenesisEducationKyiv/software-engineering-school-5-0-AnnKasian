import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SubscriptionEntity } from "./entities/entities.js";
import { SubscriptionController } from "./subscription.controller.js";
import { SubscriptionRepository } from "./subscription.repository.js";
import { SubscriptionService } from "./subscription.service.js";
import { WeatherModule } from "../weather/weather.js";

@Module({
  controllers: [SubscriptionController],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([SubscriptionEntity]),
    WeatherModule,
  ],
  providers: [SubscriptionRepository, SubscriptionService],
})
class SubscriptionModule {}

export { SubscriptionModule };
