import { ConfigKeys } from "../../../libs/enums/enums.js";
import { type WeatherProviderConfig } from "../types/types.js";
import { WEATHER_INJECTION_TOKENS } from "./weather-injection-tokens.enum.js";
import {
  WeatherApiProvider,
  WeatherbitProvider,
  WeatherstackProvider,
} from "../providers/providers.js";

const WEATHER_PROVIDER_CONFIGS: WeatherProviderConfig[] = [
  {
    token: WEATHER_INJECTION_TOKENS.WEATHER_API_PROVIDER,
    url: ConfigKeys.WEATHER_API_URL,
    key: ConfigKeys.WEATHER_API_KEY,
    providerClass: WeatherApiProvider,
  },
  {
    token: WEATHER_INJECTION_TOKENS.WEATHERBIT_PROVIDER,
    url: ConfigKeys.WEATHERBIT_URL,
    key: ConfigKeys.WEATHERBIT_KEY,
    providerClass: WeatherbitProvider,
  },
  {
    token: WEATHER_INJECTION_TOKENS.WEATHERSTACK_PROVIDER,
    url: ConfigKeys.WEATHERSTACK_URL,
    key: ConfigKeys.WEATHERSTACK_KEY,
    providerClass: WeatherstackProvider,
  },
];

export { WEATHER_PROVIDER_CONFIGS };
