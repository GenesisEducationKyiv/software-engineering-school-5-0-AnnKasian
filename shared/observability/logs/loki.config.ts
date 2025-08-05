import { createLogger, format, transports, Logger } from "winston";
import LokiTransport from "winston-loki";
import { Injectable } from "@nestjs/common";
import { LoggerException } from "shared/libs/exceptions/exceptions.js";
import { LOKI_ERROR_MESSAGES } from "./libs/enums/enums.js";
import { type WinstonLogInfo } from "./libs/types/types.js";
import { loggerConfig } from "./logger.config.js";

@Injectable()
class LokiConfigService {
  private logger?: Logger;

  createLogger(): Logger {
    if (this.logger) {
      return this.logger;
    }

    this.validateConfig();

    const transportsArray: (
      | transports.ConsoleTransportInstance
      | LokiTransport
    )[] = [];

    if (loggerConfig.enableConsole) {
      transportsArray.push(
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            format.printf((info: WinstonLogInfo) => {
              const timestamp = info.timestamp || "";
              const level = info.level?.toUpperCase() || "";
              const message = info.message || "";
              const context = info.context || "App";
              const sampled = info.sampled ? "[SAMPLED]" : "";
              const requestId = info.requestId || "";
              const traceId = info.traceId || "";

              return `${timestamp} ${requestId as string} ${
                traceId as string
              } [${context}] ${level}${sampled}: ${message as string}`;
            })
          ),
        })
      );
    }

    if (loggerConfig.enableLoki && loggerConfig.loki) {
      transportsArray.push(
        new LokiTransport({
          host: loggerConfig.loki.host,
          labels: loggerConfig.loki.labels,
          json: true,
          basicAuth: loggerConfig.loki.auth || undefined,
          format: format.json(),
          replaceTimestamp: true,
          onConnectionError: (error: unknown) => {
            if (error instanceof Error) {
              throw new LoggerException(error.message);
            }

            throw new LoggerException(error as string);
          },
        })
      );
    }

    return createLogger({
      level: loggerConfig.level,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      transports: transportsArray,
    });
  }

  getTransportsConfig() {
    return {
      console: loggerConfig.enableConsole,
      loki: loggerConfig.enableLoki,
      lokiHost: loggerConfig.loki?.host,
      level: loggerConfig.level,
    };
  }

  validateConfig(): boolean {
    if (loggerConfig.enableLoki && !loggerConfig.loki?.host) {
      throw new LoggerException(LOKI_ERROR_MESSAGES.HOST_REQUIRED);
    }

    if (!loggerConfig.enableConsole && !loggerConfig.enableLoki) {
      throw new LoggerException(LOKI_ERROR_MESSAGES.TRANSPORT_REQUIRED);
    }

    return true;
  }
}

export { LokiConfigService };
