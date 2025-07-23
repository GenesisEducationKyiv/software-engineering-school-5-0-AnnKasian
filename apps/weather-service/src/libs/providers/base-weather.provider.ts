import { firstValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { WeatherType } from "../../../../../shared/libs/types/types.js";
import { WEATHER_ERROR_MESSAGES } from "../enums/enums.js";
import { WeatherLogException } from "../exceptions/exceptions.js";
import { WeatherErrorHandler, FileLogger } from "../helpers/helpers.js";
import { IWeatherProvider } from "../interfaces/interfaces.js";
import { WeatherConfigType } from "../types/types.js";

@Injectable()
abstract class BaseWeatherProvider<TResponse> implements IWeatherProvider {
  private nextProvider: IWeatherProvider | null = null;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: WeatherConfigType,
    private readonly weatherErrorHandler: WeatherErrorHandler,
    private readonly logger: FileLogger
  ) {}

  abstract getProviderName(): string;
  abstract buildParams(city: string, apiKey: string): Record<string, string>;
  abstract parseResponse(data: TResponse): WeatherType;

  setNext(provider: IWeatherProvider): IWeatherProvider {
    this.nextProvider = provider;

    return provider;
  }

  async getWeather(city: string): Promise<WeatherType> {
    return await this.getWeatherWithErrors(city, []);
  }

  async getWeatherWithErrors(
    city: string,
    previousErrors: unknown[]
  ): Promise<WeatherType> {
    try {
      const weather = await this.fetchWeatherFromApi(city);
      weather.temperature = Number(weather.temperature?.toFixed());

      this.logger.response(
        city,
        JSON.stringify(weather),
        this.getProviderName()
      );

      return weather;
    } catch (error: unknown) {
      if (error instanceof WeatherLogException) {
        return this.weatherErrorHandler.handleError(error.message, error.name);
      }

      const allErrors = [...previousErrors, error];

      return await this.tryNextProvider(city, allErrors);
    }
  }

  private async tryNextProvider(
    city: string,
    allErrors: unknown[]
  ): Promise<WeatherType> {
    if (this.nextProvider) {
      return await this.nextProvider.getWeatherWithErrors(city, allErrors);
    }

    return await this.analyzeAllErrors(allErrors);
  }

  private analyzeAllErrors(allErrors: unknown[]): Promise<WeatherType> {
    const hasCityNotFoundError = allErrors.some((error) =>
      this.weatherErrorHandler.isCityNotFoundError(error)
    );

    if (hasCityNotFoundError) {
      return this.weatherErrorHandler.handleError(
        new Error(WEATHER_ERROR_MESSAGES.CITY_NOT_FOUND),
        this.getProviderName()
      );
    }

    return this.weatherErrorHandler.handleError(
      new Error(WEATHER_ERROR_MESSAGES.PROVIDERS_NOT_AVAILABLE),
      this.getProviderName()
    );
  }

  private async fetchWeatherFromApi(city: string): Promise<WeatherType> {
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
          new Error(WEATHER_ERROR_MESSAGES.API_ERROR),
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
