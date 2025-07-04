import { Injectable } from "@nestjs/common";
import { BaseWeatherProvider } from "./base-weather.provider.js";
import { WeatherstackResponseType, WeatherType } from "../types/types.js";
import {
  WEATHER_PROVIDERS,
  WEATHER_ERROR_MESSAGES,
  WEATHER_PROVIDERS_ERROR_CODES,
} from "../enums/enums.js";

@Injectable()
class WeatherstackProvider extends BaseWeatherProvider<WeatherstackResponseType> {
  getProviderName(): string {
    return WEATHER_PROVIDERS.WEATHERSTACK_PROVIDER;
  }

  buildParams(city: string, apiKey: string): Record<string, string> {
    return {
      access_key: apiKey,
      query: city,
    };
  }

  parseResponse(data: WeatherstackResponseType): WeatherType {
    if (data.success === false) {
      if (
        data.error?.code ===
        WEATHER_PROVIDERS_ERROR_CODES.WEATHERSTACK_CITY_NOT_FOUND
      ) {
        throw new Error(WEATHER_ERROR_MESSAGES.CITY_NOT_FOUND);
      }

      throw new Error(data.error?.info);
    }

    return {
      description: data.current?.weather_descriptions[0],
      humidity: data.current?.humidity,
      temperature: data.current?.temperature,
    };
  }
}

export { WeatherstackProvider };
