import { Response } from "express";
import { Controller, Get, Res } from "@nestjs/common";
import { RESPONSE_HEADERS } from "./libs/enums/enums.js";
import { CustomMetricsService } from "./metrics.service.js";

@Controller("metrics")
class MetricsController {
  constructor(private readonly metricsService: CustomMetricsService) {}

  @Get()
  async getMetrics(@Res() response: Response): Promise<void> {
    const metrics = await this.metricsService.getMetrics();

    response.set(
      RESPONSE_HEADERS.CONTENT_TYPE,
      RESPONSE_HEADERS.CONTENT_TYPE_VERSION
    );

    response.send(metrics);
  }
}

export { MetricsController };
