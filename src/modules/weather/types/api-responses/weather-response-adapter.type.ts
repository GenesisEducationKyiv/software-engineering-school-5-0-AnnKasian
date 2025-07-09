import { type WeatherDto } from "../weather.dto.type.js";

type WeatherAdapter<T> = {
  buildParams(city: string, apiKey: string): Record<string, string>;
  parseResponse(data: T): WeatherDto;
};

export { type WeatherAdapter };
