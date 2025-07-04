import { WeatherType } from "./types/types.js";
import {
  IWeatherProvider,
  IWeatherRepository,
} from "./interfaces/interfaces.js";
import { Injectable } from "@nestjs/common";

@Injectable()
class WeatherRepository implements IWeatherRepository {
  constructor(private readonly provider: IWeatherProvider) {}

  async get(city: string): Promise<WeatherType> {
    return await this.provider.getWeather(city);
  }
}

export { WeatherRepository };
