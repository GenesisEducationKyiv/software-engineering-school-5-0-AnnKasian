import { Injectable } from "@nestjs/common";
import { BaseWeatherProvider } from "./base-weather.provider.js";
import { WeatherstackResponseDto, WeatherDto } from "../types/types.js";
import {
  WEATHER_PROVIDERS,
  WeatherErrors,
  WeatherstackErrorCodes,
} from "../enums/enums.js";

@Injectable()
class WeatherstackProvider extends BaseWeatherProvider<WeatherstackResponseDto> {
  getProviderName(): string {
    return WEATHER_PROVIDERS.WEATHERSTACK_PROVIDER;
  }

  buildParams(city: string, apiKey: string): Record<string, string> {
    return {
      access_key: apiKey,
      query: city,
    };
  }

  parseResponse(data: WeatherstackResponseDto): WeatherDto {
    if (data.success === false) {
      if (data.error?.code === WeatherstackErrorCodes.CITY_NOT_FOUND) {
        throw new Error(WeatherErrors.CITY_NOT_FOUND);
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
