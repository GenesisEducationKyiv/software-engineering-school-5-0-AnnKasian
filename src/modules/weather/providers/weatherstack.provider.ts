import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { BaseWeatherProvider } from "./base-weather.provider.js";
import { WeatherstackResponseDto, WeatherConfig } from "../types/types.js";
import { weatherstackAdapter } from "../adapters/adapters.js";
import { WEATHER_PROVIDERS } from "../enums/enums.js";

@Injectable()
class WeatherstackProvider extends BaseWeatherProvider<WeatherstackResponseDto> {
  constructor(httpService: HttpService, config: WeatherConfig) {
    super(
      httpService,
      config,
      weatherstackAdapter,
      WEATHER_PROVIDERS.WEATHERSTACK_PROVIDER
    );
  }
}

export { WeatherstackProvider };
