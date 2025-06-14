import { firstValueFrom } from "rxjs";
import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";
import {
  ConfigKeys,
  ErrorMessage,
  ErrorStatusCode,
} from "../../libs/enums/enums.js";
import {
  WeatherApiResponseDto,
  WeatherDto,
  WeatherError,
} from "./types/types.js";
import { WeatherErrorCode } from "./enums/enums.js";

@Injectable()
class WeatherRepository {
  private readonly API_URL: string;
  private readonly API_KEY: string;

  public constructor(
    private readonly httpService: HttpService,
    configService: ConfigService
  ) {
    this.API_URL = configService.get(ConfigKeys.API_URL) as string;
    this.API_KEY = configService.get(ConfigKeys.API_KEY) as string;
  }

  public async get(city: string): Promise<WeatherDto | null> {
    try {
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
