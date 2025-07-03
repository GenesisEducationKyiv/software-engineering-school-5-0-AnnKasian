import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { WEATHER_INJECTION_TOKENS } from "./enums/weather-injection-tokens.enum.js";
import { IWeatherRepository } from "./interfaces/interfaces.js";
import { WeatherDto } from "./types/types.js";

@Injectable()
class WeatherService {
  public constructor(
    @Inject(WEATHER_INJECTION_TOKENS.WEATHER_REPOSITORY)
    private readonly weatherRepository: IWeatherRepository
  ) {}

  public async get(city: string): Promise<WeatherDto> {
    const weather = await this.weatherRepository.get(city);

    if (!weather) {
      throw new NotFoundException("City not found");
    }

    return weather;
  }
}

export { WeatherService };
