import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";

import { WeatherController } from "./weather.controller.js";
import { WeatherRepository } from "./weather.repository.js";
import { WeatherService } from "./weather.service.js";
import { WEATHER_INJECTION_TOKENS } from "./enums/weather-injection-tokens.enum.js";
import { ConfigService } from "@nestjs/config";
import { ConfigKeys } from "../../libs/enums/enums.js";

@Module({
  controllers: [WeatherController],
  imports: [HttpModule],
  providers: [
    WeatherService,
    {
      provide: WEATHER_INJECTION_TOKENS.WEATHER_REPOSITORY,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        const apiUrl = configService.get(ConfigKeys.API_URL) as string;
        const apiKey = configService.get(ConfigKeys.API_KEY) as string;

        return new WeatherRepository(httpService, { apiUrl, apiKey });
      },
      inject: [HttpService, ConfigService],
    },
  ],
  exports: [WeatherService],
})
class WeatherModule {}

export { WeatherModule };
