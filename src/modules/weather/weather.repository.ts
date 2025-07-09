import { Injectable } from "@nestjs/common";
import {
  IWeatherProvider,
  IWeatherRepository,
} from "./interfaces/interfaces.js";
import { WeatherDto } from "./types/types.js";

@Injectable()
class WeatherRepository implements IWeatherRepository {
  constructor(private readonly provider: IWeatherProvider) {}

  async get(city: string): Promise<WeatherDto> {
    return await this.provider.getWeather(city);
  }
}

export { WeatherRepository };
