import { type Observable } from "rxjs";
import {
  type GetWeatherRequest,
  type GetWeatherResponse,
} from "../../../../../shared/generated/weather.js";

interface IWeatherService {
  getWeather(city: GetWeatherRequest): Observable<GetWeatherResponse>;
}

export { type IWeatherService };
