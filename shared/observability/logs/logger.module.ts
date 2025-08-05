import { Global, Module } from "@nestjs/common";
import { SamplingService } from "../samplings/sampling.service.js";
import { LogFormatterService } from "./log-formatter.service.js";
import { CustomLoggerService } from "./logger.service.js";
import { LokiConfigService } from "./loki.config.js";

@Global()
@Module({
  providers: [
    SamplingService,
    LokiConfigService,
    LogFormatterService,
    CustomLoggerService,
  ],
  exports: [CustomLoggerService],
})
class LoggerModule {}

export { LoggerModule };
