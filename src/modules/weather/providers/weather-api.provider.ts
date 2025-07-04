import { Injectable } from "@nestjs/common";
import { BaseWeatherProvider } from "./base-weather.provider.js";
import { WeatherApiResponseType, WeatherType } from "../types/types.js";
import { WEATHER_PROVIDERS } from "../enums/enums.js";

@Injectable()
class WeatherApiProvider extends BaseWeatherProvider<WeatherApiResponseType> {
  getProviderName(): string {
    return WEATHER_PROVIDERS.WEATHER_API_PROVIDER;
  }

  buildParams(city: string, apiKey: string): Record<string, string> {
    return {
      key: apiKey,
      q: city,
    };
  }

  parseResponse(data: WeatherApiResponseType): WeatherType {
    return {
      description: data.current?.condition?.text,
      humidity: data.current?.humidity,
      temperature: data.current?.temp_c,
    };
  }
}

export { WeatherApiProvider };
