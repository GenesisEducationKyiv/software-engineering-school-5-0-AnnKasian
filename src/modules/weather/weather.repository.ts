import { WeatherType } from "./types/types.js";
import { Cache } from "cache-manager";
import {
  IWeatherProvider,
  IWeatherRepository,
} from "./interfaces/interfaces.js";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
class WeatherRepository implements IWeatherRepository {
  private readonly logger: Logger;

  constructor(
    private readonly provider: IWeatherProvider,
    private readonly cacheManager: Cache,
    private readonly cacheTTL: number
  ) {
    this.logger = new Logger(WeatherRepository.name);
  }

  async get(city: string): Promise<WeatherType> {
    const cachedWeather = await this.getCachedWeather(city);
    const weather = cachedWeather ?? (await this.provider.getWeather(city));

    this.logger.log(
      cachedWeather
        ? `Weather loaded from cache for ${city}`
        : `Weather fetched from API for ${city}`
    );

    if (!cachedWeather) {
      await this.cacheWeather(city, weather);
    }

    return weather;
  }

  private async cacheWeather(city: string, weather: WeatherType) {
    await this.cacheManager.set(city, weather, this.cacheTTL);
  }

  private async getCachedWeather(city: string): Promise<WeatherType | null> {
    const cachedData = await this.cacheManager.get<WeatherType>(city);

    return cachedData ?? null;
  }
}

export { WeatherRepository };
