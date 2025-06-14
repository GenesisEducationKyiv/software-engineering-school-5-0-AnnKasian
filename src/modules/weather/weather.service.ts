import { Injectable, NotFoundException } from "@nestjs/common";
import { WeatherDto } from "./types/types";
import { WeatherRepository } from "./weather.repository.js";

@Injectable()
class WeatherService {
  public constructor(private weatherRepository: WeatherRepository) {}

  public async get(city: string): Promise<WeatherDto> {
    const weather = await this.weatherRepository.get(city);

    if (!weather) {
      throw new NotFoundException("City not found");
    }

    return weather;
  }
}

export { WeatherService };
