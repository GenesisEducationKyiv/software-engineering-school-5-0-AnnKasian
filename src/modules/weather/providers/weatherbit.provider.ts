import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { BaseWeatherProvider } from "./base-weather.provider.js";
import { WeatherbitResponseDto, WeatherConfig } from "../types/types.js";
import { weatherbitAdapter } from "../adapters/adapters.js";
import { WEATHER_PROVIDERS } from "../enums/enums.js";

@Injectable()
class WeatherbitProvider extends BaseWeatherProvider<WeatherbitResponseDto> {
  constructor(httpService: HttpService, config: WeatherConfig) {
    super(
      httpService,
      config,
      weatherbitAdapter,
      WEATHER_PROVIDERS.WEATHERBIT_PROVIDER
    );
  }
}

export { WeatherbitProvider };
