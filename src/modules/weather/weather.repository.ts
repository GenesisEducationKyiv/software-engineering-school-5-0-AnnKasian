import { Injectable } from "@nestjs/common";

import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { WeatherApiResponseDto, WeatherDto } from "./types/types.js";
import { firstValueFrom } from "rxjs";

@Injectable()
class WeatherRepository {
  private readonly API_URL: string;
  private readonly API_KEY: string;

  public constructor(
    private readonly httpService: HttpService,
    configService: ConfigService
  ) {
    this.API_URL = configService.get("API_URL") as string;
    this.API_KEY = configService.get("API_KEY") as string;
  }

  public async get(city: string): Promise<WeatherDto> {
    const { data } = await firstValueFrom(
      this.httpService.get<WeatherApiResponseDto>(this.API_URL, {
        params: { key: this.API_KEY, q: city },
      })
    );

    return {
      description: data.current?.condition.text,
      humidity: data.current?.humidity,
      temperature: data.current?.temp_c,
    };
  }
}

export { WeatherRepository };
