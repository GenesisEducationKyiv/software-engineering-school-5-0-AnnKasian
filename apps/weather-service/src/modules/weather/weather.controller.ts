import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  SwaggerOperation,
  SwaggerQuery,
  SwaggerResponse,
} from "../../libs/swagger-docs/swagger-docs.js";
import { WeatherDto, WeatherQueryDto } from "../../libs/types/types.js";
import { WeatherService } from "./weather.service.js";
import {
  httpErrorHandler,
  grpcErrorHandler,
} from "../../../../../shared/libs/helpers/helpers.js";
import { GrpcMethod } from "@nestjs/microservices";
import {
  GetWeatherRequest,
  GetWeatherResponse,
} from "../../../generated/weather.js";
@ApiTags("weather")
@Controller("weather")
class WeatherController {
  public constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation(SwaggerOperation.GET_WEATHER)
  @ApiQuery(SwaggerQuery.CITY)
  @ApiResponse(SwaggerResponse.SUCCESSFUL)
  @ApiResponse(SwaggerResponse.FAILED)
  @ApiResponse(SwaggerResponse.NOT_FOUND)
  public async getOne(@Query() payload: WeatherQueryDto): Promise<WeatherDto> {
    try {
      return await this.weatherService.get(payload);
    } catch (error: unknown) {
      return httpErrorHandler(error);
    }
  }

  @GrpcMethod("WeatherService", "GetWeather")
  public async GetWeather(
    payload: GetWeatherRequest
  ): Promise<GetWeatherResponse> {
    try {
      return await this.weatherService.get(payload);
    } catch (error: unknown) {
      return grpcErrorHandler(error);
    }
  }
}

export { WeatherController };
