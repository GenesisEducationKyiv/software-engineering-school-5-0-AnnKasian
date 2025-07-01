import { Module } from "@nestjs/common";
import { HttpModule, HttpService } from "@nestjs/axios";
import {
  WEATHER_INJECTION_TOKENS,
  WEATHER_PROVIDER_CONFIGS,
} from "./enums/enums.js";
import { WeatherController } from "./weather.controller.js";
import { WeatherService } from "./weather.service.js";
import { ConfigService } from "@nestjs/config";
import { IWeatherProvider } from "./interfaces/interfaces.js";
import { WeatherRepository } from "./weather.repository.js";
import { FileLogger, WeatherErrorHandler } from "./helpers/helpers.js";

@Module({
  controllers: [WeatherController],
  imports: [HttpModule],
  providers: [
    WeatherService,
    WeatherErrorHandler,
    {
      provide: WEATHER_INJECTION_TOKENS.FILE_LOGGER,
      useFactory: () => (context: string) => new FileLogger(context),
    },
    ...WEATHER_PROVIDER_CONFIGS.map(({ token, url, key, providerClass }) => ({
      provide: token,
      useFactory: (
        httpService: HttpService,
        configService: ConfigService,
        weatherErrorHandler: WeatherErrorHandler,
        fileLogger: (context: string) => FileLogger
      ) => {
        const apiUrl = configService.get(url) as string;
        const apiKey = configService.get(key) as string;
        const logger = fileLogger(providerClass.name);

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
        WeatherErrorHandler,
        WEATHER_INJECTION_TOKENS.FILE_LOGGER,
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
