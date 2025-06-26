import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { IWeatherProvider } from "../interfaces/interfaces.js";
import { WeatherConfig } from "../types/weather-config.type.js";
import { WeatherAdapter, WeatherDto } from "../types/types.js";
import { fileLogger, WeatherErrorHandler } from "../helpers/helpers.js";

@Injectable()
class BaseWeatherProvider<TResponse> implements IWeatherProvider {
  private readonly providerName: string;
  private nextProvider: IWeatherProvider | null = null;
  private weatherErrorHandler: WeatherErrorHandler = new WeatherErrorHandler();

  constructor(
    private readonly httpService: HttpService,
    private readonly config: WeatherConfig,
    private readonly adapter: WeatherAdapter<TResponse>,
    providerName: string
  ) {
    this.providerName = providerName;
  }

  setNext(provider: IWeatherProvider): IWeatherProvider {
    this.nextProvider = provider;

    return provider;
  }

  async getWeather(city: string): Promise<WeatherDto | null> {
    try {
      const weather = await this.fetchWeatherFromApi(city);

      if (weather) {
        fileLogger(
          this.providerName,
          `Response : ${city} - ${JSON.stringify(weather)}"`
        );

        return weather;
      }

      await this.tryNextProvider(city);

      return null;
    } catch {
      return await this.tryNextProvider(city);
    }
  }

  private async tryNextProvider(city: string): Promise<WeatherDto | null> {
    return this.nextProvider ? await this.nextProvider.getWeather(city) : null;
  }

  private async fetchWeatherFromApi(city: string): Promise<WeatherDto | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<TResponse>(this.config.apiUrl, {
          params: this.adapter.buildParams(city, this.config.apiKey),
        })
      );

      return this.adapter.parseResponse(data);
    } catch (error: unknown) {
      return this.weatherErrorHandler.handleError(error, this.providerName);
    }
  }
}

export { BaseWeatherProvider };
