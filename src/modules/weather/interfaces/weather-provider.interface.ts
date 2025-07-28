import { type WeatherType } from "../types/types.js";

interface IWeatherProvider {
  setNext(provider: IWeatherProvider): IWeatherProvider;
  getWeather(city: string): Promise<WeatherType>;
  getWeatherWithErrors(
    city: string,
    allErrors: unknown[]
  ): Promise<WeatherType>;
}

export { type IWeatherProvider };
