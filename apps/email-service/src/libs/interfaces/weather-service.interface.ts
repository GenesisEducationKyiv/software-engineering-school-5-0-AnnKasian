import {
  WeatherType,
  WeatherQueryType,
} from "../../../../../shared/libs/types/types.js";

interface IWeatherService {
  get(city: WeatherQueryType): Promise<WeatherType>;
}

export { type IWeatherService };
