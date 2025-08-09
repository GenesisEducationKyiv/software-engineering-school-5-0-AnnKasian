import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "../../../shared/observability/logs/logger.module.js";
import { MetricsModule } from "../../../shared/observability/metrics/metrics.module.js";
import { RedisConfig } from "../redis.config.js";
import { WeatherModule } from "./modules/weather/weather.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    MetricsModule,
    CacheModule.registerAsync({
      ...RedisConfig,
      isGlobal: true,
    }),
    WeatherModule,
  ],
})
class AppModule {}

export { AppModule };
