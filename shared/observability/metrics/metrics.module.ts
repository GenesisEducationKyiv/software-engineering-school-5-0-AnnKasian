import { Module, Global } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MetricsController } from "./metrics.controller.js";
import { MetricsInterceptor } from "./metrics.interceptor.js";
import { CustomMetricsService } from "./metrics.service.js";

@Global()
@Module({
  controllers: [MetricsController],
  providers: [
    CustomMetricsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [CustomMetricsService],
})
class MetricsModule {}

export { MetricsModule };
