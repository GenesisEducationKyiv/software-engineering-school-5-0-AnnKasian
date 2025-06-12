import { Injectable, NotFoundException } from "@nestjs/common";
import { WeatherDto } from "./types/types";
import { WeatherRepository } from "./weather.repository.js";

@Injectable()
class WeatherService {
  public constructor(private weatherRepository: WeatherRepository) {}

  public async get(city: string): Promise<WeatherDto> {
    try {
      return await this.weatherRepository.get(city);
    } catch {
      throw new NotFoundException("City not found");
    }
  }
}

export { WeatherService };
