import { AxiosError } from "axios";
import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { ErrorMessage, ErrorStatusCode } from "../../libs/enums/enums.js";
import { WeatherErrorCode } from "./enums/enums.js";
import { IWeatherRepository } from "./interfaces/interfaces.js";
import {
  WeatherApiResponseDto,
  WeatherConfig,
  WeatherDto,
  WeatherError,
} from "./types/types.js";

@Injectable()
class WeatherRepository implements IWeatherRepository {
  public constructor(
    private readonly httpService: HttpService,
    private readonly config: WeatherConfig
  ) {}

  public async get(city: string): Promise<WeatherDto | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<WeatherApiResponseDto>(this.config.apiUrl, {
          params: { key: this.config.apiKey, q: city },
        })
      );

      return {
        description: data.current?.condition.text,
        humidity: data.current?.humidity,
        temperature: data.current?.temp_c,
      };
    } catch (error: unknown) {
      const axiosError = error as AxiosError<WeatherError>;

      if (axiosError.response?.data.error.code === WeatherErrorCode.NOT_FOUND) {
        return null;
      }

      throw new HttpException(
        axiosError.response?.data.error.message ?? ErrorMessage.UNKNOWN_ERROR,
        axiosError.status ?? ErrorStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export { WeatherRepository };
