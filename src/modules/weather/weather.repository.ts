import { WeatherDto } from "./types/types.js";

import {
  IWeatherProvider,
  IWeatherRepository,
} from "./interfaces/interfaces.js";
import { Injectable } from "@nestjs/common";

@Injectable()
class WeatherRepository implements IWeatherRepository {
  constructor(private readonly firstProvider: IWeatherProvider) {}

  async get(city: string): Promise<WeatherDto | null> {
    return await this.firstProvider.getWeather(city);
  }
}

export { WeatherRepository };
