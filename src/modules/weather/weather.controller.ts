import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  SwaggerOperation,
  SwaggerQuery,
  SwaggerResponse,
} from "./swagger-docs/swagger-docs.js";
import { WeatherDto, WeatherQueryDto } from "./types/types.js";
import { WeatherService } from "./weather.service.js";

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
    return await this.weatherService.get(payload);
  }
}

export { WeatherController };
