import { type HttpService } from "@nestjs/axios";
import {
  type FileLogger,
  type WeatherErrorHandler,
} from "../helpers/helpers.js";
import { type IWeatherProvider } from "../interfaces/interfaces.js";

type WeatherProviderConfigType = {
  token: string;
  url: string;
  key: string;
  providerClass: new (
    httpService: HttpService,
    config: { apiUrl: string; apiKey: string },
    weatherErrorHandler: WeatherErrorHandler,
    logger: FileLogger
  ) => IWeatherProvider;
};

export { type WeatherProviderConfigType };
