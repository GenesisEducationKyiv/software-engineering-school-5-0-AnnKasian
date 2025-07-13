import { Cache } from "cache-manager";
import { Injectable, Logger } from "@nestjs/common";
import { CACHE_PREFIX_KEY } from "../../libs/enums/enums.js";
import {
  IWeatherProvider,
  IWeatherRepository,
} from "../../libs/interfaces/interfaces.js";
import { WeatherDto } from "../../libs/types/types.js";
import { WeatherType } from "../../../../../shared/libs/types/types.js";

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

  async get(city: string): Promise<WeatherDto> {
    const cachedWeather = await this.getCachedWeather(
      `${CACHE_PREFIX_KEY.CURRENT_WEATHER}-${city}`
    );
    const weather = cachedWeather ?? (await this.provider.getWeather(city));

    this.logger.log(
      cachedWeather
        ? `Current weather loaded from cache for ${city}`
        : `Current weather fetched from API for ${city}`
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
