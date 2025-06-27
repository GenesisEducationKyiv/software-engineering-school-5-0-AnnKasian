import { type WeatherDto } from "../types/types.js";

interface IWeatherRepository {
  get(city: string): Promise<WeatherDto | null>;
}

export { type IWeatherRepository };
