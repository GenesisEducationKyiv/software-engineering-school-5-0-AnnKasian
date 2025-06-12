import { Controller, Get, Query } from "@nestjs/common";

import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { WeatherService } from "./weather.service.js";
import { WeatherDto, WeatherQueryDto } from "./types/types.js";
import {
  SwaggerOperation,
  SwaggerQuery,
  SwaggerResponse,
} from "./swagger-docs/swagger-docs.js";

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
  public getOne(@Query() payload: WeatherQueryDto): Promise<WeatherDto> {
    return this.weatherService.get(payload.city);
  }
}

export { WeatherController };
