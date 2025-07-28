import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
  GetWeatherRequest,
  GetWeatherResponse,
} from "../../../../../shared/generated/weather.js";
import {
  GRPC_METHODS,
  GRPC_SERVICES,
} from "../../../../../shared/libs/enums/enums.js";
import { WeatherService } from "./weather.service.js";

@Controller("weather")
class WeatherGrpcController {
  public constructor(private readonly weatherService: WeatherService) {}

  @GrpcMethod(GRPC_SERVICES.WEATHER_SERVICE, GRPC_METHODS.GET_WEATHER)
  public async GetWeather(
    payload: GetWeatherRequest
  ): Promise<GetWeatherResponse> {
    return await this.weatherService.get(payload);
  }
}

export { WeatherGrpcController };
