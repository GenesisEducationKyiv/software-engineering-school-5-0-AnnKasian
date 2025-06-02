import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";

import { WeatherController } from "./weather.controller.js";
import { WeatherRepository } from "./weather.repository.js";
import { WeatherService } from "./weather.service.js";

@Module({
  controllers: [WeatherController],
  imports: [HttpModule],
  providers: [WeatherRepository, WeatherService],
  exports: [WeatherService],
})
class WeatherModule {}

export { WeatherModule };
