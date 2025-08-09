import { Logger } from "winston";
import { Injectable, LoggerService } from "@nestjs/common";
import { SamplingService } from "../samplings/sampling.service.js";
import { LOG_ACTIONS, LOG_PREFIXES } from "./libs/enums/enums.js";
import { LogInput, LogContext, LogLevel } from "./libs/types/types.js";
import { LogFormatterService } from "./log-formatter.service.js";
import { LogTransportsConfigService } from "./log-transport.config.js";

@Injectable()
class CustomLoggerService implements LoggerService {
  private readonly customLogger: Logger;
  protected context: string = "App";
  private traceId?: string;
  private requestId?: string;

  constructor(
    private readonly samplingService: SamplingService,
    private readonly loggerConfig: LogTransportsConfigService,
    private readonly formatter: LogFormatterService
  ) {
    this.customLogger = this.loggerConfig.createLogger();
  }

  setContext(context: string): void {
    this.context = context;
  }

  setTraceId(traceId: string): void {
    this.traceId = traceId;
  }

  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  generateTraceId(): string {
    return crypto.randomUUID();
  }

  generateRequestId(): string {
    return `${Date.now()}_${crypto.randomUUID()}`;
  }

  log(message: string | LogInput, context?: string | LogContext): void {
    this.writeLog(LogLevel.INFO, message, context);
  }

  error(
    message: string | LogInput,
    stackOrTrace?: string,
    context?: string | LogContext
  ): void {
    this.writeLog(LogLevel.ERROR, message, context, stackOrTrace);
  }

  warn(message: string | LogInput, context?: string | LogContext): void {
    this.writeLog(LogLevel.WARN, message, context);
  }

  debug(message: string | LogInput, context?: string | LogContext): void {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  verbose(message: string | LogInput, context?: string | LogContext): void {
    this.writeLog(LogLevel.DEBUG, message, context);
  }

  private writeLog(
    level: LogLevel,
    message: string | LogInput,
    context?: string | LogContext,
    stack?: string
  ): void {
    const messageStr =
      typeof message === "string" ? message : message.message || "";

    if (!this.samplingService.shouldSample(level, messageStr, this.traceId)) {
      return;
    }

    const logData = this.formatter.format(
      message,
      context,
      this.context,
      this.traceId,
      stack
    );

    const enrichedLogData = {
      ...logData,
      requestId: this.requestId,
      sampled: true,
    };

    this.customLogger[level](enrichedLogData);
  }

  logOperation(operation: string, data?: Record<string, unknown>): void {
    this.log(`${LOG_PREFIXES.OPERATION} ${operation}`, {
      action: LOG_ACTIONS.OPERATION,
      operation,
      ...data,
    });
  }

  logStart(operation: string, data?: Record<string, unknown>): void {
    this.log(`${LOG_PREFIXES.START} ${operation}`, {
      action: LOG_ACTIONS.START,
      operation,
      ...data,
    });
  }

  logComplete(
    operation: string,
    duration?: number,
    data?: Record<string, unknown>
  ): void {
    this.log(`${LOG_PREFIXES.COMPLETE} ${operation}`, {
      action: LOG_ACTIONS.COMPLETE,
      operation,
      duration,
      ...data,
    });
  }

  logFailed(
    operation: string,
    error?: Error,
    data?: Record<string, unknown>
  ): void {
    const errorInfo = error
      ? {
          errorName: error.name,
          errorMessage: error.message,
          stack: error.stack,
        }
      : {};

    this.error(`${LOG_PREFIXES.FAILED} ${operation}`, error?.stack, {
      action: LOG_ACTIONS.FAILED,
      operation,
      ...errorInfo,
      ...data,
    });
  }

  getSamplingStats() {
    return this.samplingService.getStats();
  }

  getLoggerConfig() {
    return this.loggerConfig.getTransportsConfig();
  }
}

export { CustomLoggerService };
