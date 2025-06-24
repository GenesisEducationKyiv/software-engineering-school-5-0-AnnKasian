import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { BaseWeatherProvider } from "./base-weather.provider.js";
import { WeatherApiResponseDto, WeatherConfig } from "../types/types.js";
import { weatherApiAdapter } from "../adapters/adapters.js";
import { WEATHER_PROVIDERS } from "../enums/enums.js";

@Injectable()
class WeatherApiProvider extends BaseWeatherProvider<WeatherApiResponseDto> {
  constructor(httpService: HttpService, config: WeatherConfig) {
    super(
      httpService,
      config,
      weatherApiAdapter,
      WEATHER_PROVIDERS.WEATHER_API_PROVIDER
    );
  }
}

export { WeatherApiProvider };
