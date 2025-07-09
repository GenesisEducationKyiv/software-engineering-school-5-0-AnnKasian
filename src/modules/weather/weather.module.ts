import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  WEATHER_INJECTION_TOKENS,
  WEATHER_PROVIDER_CONFIGS,
} from "./enums/enums.js";
import { FileLogger, WeatherErrorHandler } from "./helpers/helpers.js";
import { IWeatherProvider } from "./interfaces/interfaces.js";
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
        const apiUrl = configService.get(url) as string;
        const apiKey = configService.get(key) as string;
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
        weatherstackProvider: IWeatherProvider
      ) => {
        weatherApiProvider
          .setNext(weatherbitProvider)
          .setNext(weatherstackProvider);

        return new WeatherRepository(weatherApiProvider);
      },
      inject: [
        WEATHER_INJECTION_TOKENS.WEATHER_API_PROVIDER,
        WEATHER_INJECTION_TOKENS.WEATHERBIT_PROVIDER,
        WEATHER_INJECTION_TOKENS.WEATHERSTACK_PROVIDER,
      ],
    },
  ],
  exports: [WeatherService],
})
class WeatherModule {}

export { WeatherModule };
