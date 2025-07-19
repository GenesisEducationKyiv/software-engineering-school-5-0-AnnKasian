import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisConfig } from "../redis.config.js";
import { WeatherModule } from "./modules/weather/weather.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      ...RedisConfig,
      isGlobal: true,
    }),
    WeatherModule,
  ],
})
class AppModule {}

export { AppModule };
