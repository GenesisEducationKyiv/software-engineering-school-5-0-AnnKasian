import { Controller, Get, Query } from "@nestjs/common";

import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { WeatherService } from "./weather.service.js";
import { WeatherDto, WeatherQueryDto } from "./types/types.js";
import {
  SwaggerOperation,
  SwaggerQuery,
  SwaggerResponse,
} from "./swagger-docs/swagger-docs.js";
import { httpErrorHandler } from "../../libs/helpers/helpers.js";

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
      return await this.weatherService.get(payload.city);
    } catch (error: unknown) {
      return httpErrorHandler(error);
    }
  }
}

export { WeatherController };
