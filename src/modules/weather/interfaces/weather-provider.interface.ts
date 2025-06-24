import { type WeatherDto } from "../types/types";

interface IWeatherProvider {
  setNext(provider: IWeatherProvider): IWeatherProvider;
  getWeather(city: string): Promise<WeatherDto | null>;
}

export { type IWeatherProvider };
