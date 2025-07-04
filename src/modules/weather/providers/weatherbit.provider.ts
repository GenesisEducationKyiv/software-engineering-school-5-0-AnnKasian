import { Injectable } from "@nestjs/common";
import { BaseWeatherProvider } from "./base-weather.provider.js";
import { WeatherbitResponseType, WeatherType } from "../types/types.js";
import { WEATHER_PROVIDERS } from "../enums/enums.js";

@Injectable()
class WeatherbitProvider extends BaseWeatherProvider<WeatherbitResponseType> {
  getProviderName(): string {
    return WEATHER_PROVIDERS.WEATHERBIT_PROVIDER;
  }

  buildParams(city: string, apiKey: string): Record<string, string> {
    return {
      key: apiKey,
      q: city,
    };
  }

  parseResponse(data: WeatherbitResponseType): WeatherType {
    return {
      description: data.data?.[0].weather?.description,
      humidity: data.data?.[0].rh,
      temperature: data.data?.[0].temp,
    };
  }
}

export { WeatherbitProvider };
