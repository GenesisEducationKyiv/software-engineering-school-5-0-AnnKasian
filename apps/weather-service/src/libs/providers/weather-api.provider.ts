import { Injectable } from "@nestjs/common";
import { WeatherType } from "../../../../../shared/libs/types/types.js";
import { WEATHER_PROVIDERS } from "../enums/enums.js";
import { WeatherApiResponseType } from "../types/types.js";
import { BaseWeatherProvider } from "./base-weather.provider.js";

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
      temperature: Number(data.current?.temp_c.toFixed()),
    };
  }
}

export { WeatherApiProvider };
