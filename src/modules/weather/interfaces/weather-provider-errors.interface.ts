import { type WeatherErrors } from "../enums/enums.js";

interface WeatherProviderError extends Error {
  type: WeatherErrors;
  statusCode?: number;
}

export { type WeatherProviderError };
