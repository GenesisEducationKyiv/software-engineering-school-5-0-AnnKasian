import { type WeatherDto } from "../types/types";

interface IWeatherProvider {
  setNext(provider: IWeatherProvider): IWeatherProvider;
  getWeather(city: string): Promise<WeatherDto>;
  getWeatherWithErrors(city: string, allErrors: unknown[]): Promise<WeatherDto>;
}

export { type IWeatherProvider };
