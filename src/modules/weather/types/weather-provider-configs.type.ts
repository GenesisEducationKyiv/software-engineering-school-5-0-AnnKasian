import { type HttpService } from "@nestjs/axios";

import { type IWeatherProvider } from "../interfaces/interfaces.js";

type WeatherProviderConfig = {
  token: string;
  url: string;
  key: string;
  providerClass: new (
    httpService: HttpService,
    config: { apiUrl: string; apiKey: string }
  ) => IWeatherProvider;
};

export { type WeatherProviderConfig };
