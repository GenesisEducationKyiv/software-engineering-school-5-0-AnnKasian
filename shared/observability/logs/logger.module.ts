import { Global, Module } from "@nestjs/common";
import { SamplingService } from "../samplings/sampling.service.js";
import { LogFormatterService } from "./log-formatter.service.js";
import { CustomLoggerService } from "./logger.service.js";
import { LogTransportsConfigService } from "./log-transport.config.js";

@Global()
@Module({
  providers: [
    SamplingService,
    LogTransportsConfigService,
    LogFormatterService,
    CustomLoggerService,
  ],
  exports: [CustomLoggerService],
})
class LoggerModule {}

export { LoggerModule };
