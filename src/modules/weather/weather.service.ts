import { Inject, Injectable } from "@nestjs/common";
import { WeatherDto } from "./types/types";
import { WEATHER_INJECTION_TOKENS } from "./enums/weather-injection-tokens.enum.js";
import { IWeatherRepository } from "./interfaces/interfaces.js";

@Injectable()
class WeatherService {
  public constructor(
    @Inject(WEATHER_INJECTION_TOKENS.WEATHER_REPOSITORY)
    private readonly weatherRepository: IWeatherRepository
  ) {}

  public async get(city: string): Promise<WeatherDto> {
    return await this.weatherRepository.get(city);
  }
}

export { WeatherService };
