import { Controller, Get, Query } from "@nestjs/common";

import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ErrorDto } from "../../libs/types/types.js";
import { WeatherService } from "./weather.service.js";
import { WeatherDto, WeatherQueryDto } from "./types/types.js";

@ApiTags("weather")
@Controller("weather")
class WeatherController {
  public constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({
    summary: "Get current weather for a city",
    description:
      "Returns the current weather forecast for the specified city using WeatherAPI.com.",
  })
  @ApiQuery({
    name: "city",
    type: "string",
    description: "City name for weather forecast",
    required: true,
    example: "city",
  })
  @ApiResponse({
    status: 200,
    description: "Successful operation - current weather forecast returned.",
    type: WeatherDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid request",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "City not found",
    type: ErrorDto,
  })
  public getOne(@Query() payload: WeatherQueryDto): Promise<WeatherDto> {
    return this.weatherService.get(payload.city);
  }
}

export { WeatherController };
