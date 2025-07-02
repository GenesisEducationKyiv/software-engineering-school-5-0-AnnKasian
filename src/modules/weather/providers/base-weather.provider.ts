import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { IWeatherProvider } from "../interfaces/interfaces.js";
import { WeatherConfig, WeatherDto } from "../types/types.js";
import { WeatherErrorHandler, FileLogger } from "../helpers/helpers.js";
import { WeatherErrors } from "../enums/enums.js";

@Injectable()
abstract class BaseWeatherProvider<TResponse> implements IWeatherProvider {
  private nextProvider: IWeatherProvider | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: WeatherConfig,
    private weatherErrorHandler: WeatherErrorHandler,
    private logger: FileLogger
  ) {
    this.logger = new FileLogger(this.getProviderName());
  }

  abstract getProviderName(): string;
  abstract buildParams(city: string, apiKey: string): Record<string, string>;
  abstract parseResponse(data: TResponse): WeatherDto;

  setNext(provider: IWeatherProvider): IWeatherProvider {
    this.nextProvider = provider;

    return provider;
  }

  async getWeather(city: string): Promise<WeatherDto> {
    return await this.getWeatherWithErrors(city, []);
  }

  async getWeatherWithErrors(
    city: string,
    previousErrors: unknown[]
  ): Promise<WeatherDto> {
    try {
      const weather = await this.fetchWeatherFromApi(city);
      this.logger.response(city, JSON.stringify(weather));

      return weather;
    } catch (error: unknown) {
      const allErrors = [...previousErrors, error];

      return await this.tryNextProvider(city, allErrors);
    }
  }

  private async tryNextProvider(
    city: string,
    allErrors: unknown[]
  ): Promise<WeatherDto> {
    if (this.nextProvider) {
      return await this.nextProvider.getWeatherWithErrors(city, allErrors);
    }

    return await this.analyzeAllErrors(allErrors);
  }

  private analyzeAllErrors(allErrors: unknown[]): Promise<WeatherDto> {
    const hasCityNotFoundError = allErrors.some((error) =>
      this.weatherErrorHandler.isCityNotFoundError(error)
    );

    if (hasCityNotFoundError) {
      return this.weatherErrorHandler.handleError(
        new Error(WeatherErrors.CITY_NOT_FOUND),
        this.getProviderName()
      );
    }

    return this.weatherErrorHandler.handleError(
      new Error(WeatherErrors.PROVIDERS_NOT_AVAILABLE),
      this.getProviderName()
    );
  }

  private async fetchWeatherFromApi(city: string): Promise<WeatherDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<TResponse>(this.config.apiUrl, {
          params: this.buildParams(city, this.config.apiKey),
        })
      );

      const response = this.parseResponse(data);

      if (
        response.description === undefined &&
        response.humidity === undefined &&
        response.temperature === undefined
      ) {
        return this.weatherErrorHandler.handleError(
          new Error(WeatherErrors.API_ERROR),
          this.getProviderName()
        );
      }

      return response;
    } catch (error: unknown) {
      return this.weatherErrorHandler.handleError(
        error,
        this.getProviderName()
      );
    }
  }
}

export { BaseWeatherProvider };
