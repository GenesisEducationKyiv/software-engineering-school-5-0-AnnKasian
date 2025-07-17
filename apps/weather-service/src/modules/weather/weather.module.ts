import { HttpModule, HttpService } from "@nestjs/axios";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CONFIG_KEYS } from "../../../../../shared/libs/enums/enums.js";
import {
  WEATHER_INJECTION_TOKENS,
  WEATHER_PROVIDER_CONFIGS,
} from "../../libs/enums/enums.js";
import { FileLogger, WeatherErrorHandler } from "../../libs/helpers/helpers.js";
import { IWeatherProvider } from "../../libs/interfaces/interfaces.js";
import { WeatherController } from "./weather.controller.js";
import { WeatherRepository } from "./weather.repository.js";
import { WeatherService } from "./weather.service.js";

@Module({
  controllers: [WeatherController],
  imports: [HttpModule],
  providers: [
    WeatherService,
    {
      provide: WEATHER_INJECTION_TOKENS.FILE_LOGGER,
      useClass: FileLogger,
    },
    {
      provide: WeatherErrorHandler,
      useFactory: (fileLogger: FileLogger) => {
        return new WeatherErrorHandler(fileLogger);
      },
      inject: [WEATHER_INJECTION_TOKENS.FILE_LOGGER],
    },
    ...WEATHER_PROVIDER_CONFIGS.map(({ token, url, key, providerClass }) => ({
      provide: token,
      useFactory: (
        httpService: HttpService,
        configService: ConfigService,
        fileLogger: FileLogger,
        weatherErrorHandler: WeatherErrorHandler
      ) => {
        const apiUrl = configService.get<string>(url) as string;
        const apiKey = configService.get<string>(key) as string;
        const logger = fileLogger;

        return new providerClass(
          httpService,
          { apiUrl, apiKey },
          weatherErrorHandler,
          logger
        );
      },
      inject: [
        HttpService,
        ConfigService,
        WEATHER_INJECTION_TOKENS.FILE_LOGGER,
        WeatherErrorHandler,
      ],
    })),
    {
      provide: WEATHER_INJECTION_TOKENS.WEATHER_REPOSITORY,
      useFactory: (
        weatherApiProvider: IWeatherProvider,
        weatherbitProvider: IWeatherProvider,
        weatherstackProvider: IWeatherProvider,
        cacheManager: Cache,
        configService: ConfigService
      ) => {
        const cacheTTL = configService.get<number>(
          CONFIG_KEYS.CACHE_TTL
        ) as number;
        weatherApiProvider
          .setNext(weatherbitProvider)
          .setNext(weatherstackProvider);

        return new WeatherRepository(
          weatherApiProvider,
          cacheManager,
          cacheTTL
        );
      },
      inject: [
        WEATHER_INJECTION_TOKENS.WEATHER_API_PROVIDER,
        WEATHER_INJECTION_TOKENS.WEATHERBIT_PROVIDER,
        WEATHER_INJECTION_TOKENS.WEATHERSTACK_PROVIDER,
        CACHE_MANAGER,
        ConfigService,
      ],
    },
  ],
  exports: [WeatherService],
})
class WeatherModule {}

export { WeatherModule };
