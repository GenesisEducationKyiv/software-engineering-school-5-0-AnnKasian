import { type HttpService } from "@nestjs/axios";
import { type IWeatherProvider } from "../interfaces/interfaces.js";
import {
  type FileLogger,
  type WeatherErrorHandler,
} from "../helpers/helpers.js";

type WeatherProviderConfig = {
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

export { type WeatherProviderConfig };
