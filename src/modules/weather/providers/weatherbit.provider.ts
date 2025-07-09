import { Injectable } from "@nestjs/common";
import { WEATHER_PROVIDERS } from "../enums/enums.js";
import { WeatherbitResponseDto, WeatherDto } from "../types/types.js";
import { BaseWeatherProvider } from "./base-weather.provider.js";

@Injectable()
class WeatherbitProvider extends BaseWeatherProvider<WeatherbitResponseDto> {
  getProviderName(): string {
    return WEATHER_PROVIDERS.WEATHERBIT_PROVIDER;
  }

  buildParams(city: string, apiKey: string): Record<string, string> {
    return {
      key: apiKey,
      q: city,
    };
  }

  parseResponse(data: WeatherbitResponseDto): WeatherDto {
    return {
      description: data.data?.[0].weather?.description,
      humidity: data.data?.[0].rh,
      temperature: data.data?.[0].temp,
    };
  }
}

export { WeatherbitProvider };
