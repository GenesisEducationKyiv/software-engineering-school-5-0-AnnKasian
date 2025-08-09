import { Injectable } from "@nestjs/common";
import { LogInput, LogContext } from "./libs/types/types.js";
import { loggerConfig } from "./logger.config.js";

@Injectable()
class LogFormatterService {
  format(
    message: LogInput,
    context?: LogContext | string,
    defaultContext?: string,
    traceId?: string,
    stack?: string
  ): Record<string, unknown> {
    const { baseMessage, additionalData } = this.extractMessageData(message);

    const logData: Record<string, unknown> = {
      message: baseMessage,
      context: this.getContext(context, defaultContext),
      traceId,
      service: loggerConfig.loki?.labels.app,
      environment: loggerConfig.loki?.labels.env,
      timestamp: new Date().toISOString(),
      ...additionalData,
      ...(typeof context === "object" ? context : {}),
    };

    if (stack) {
      logData.stack = stack;
    }

    return this.removeUndefinedValues(logData);
  }

  private extractMessageData(message: LogInput): {
    baseMessage: string;
    additionalData: Record<string, unknown>;
  } {
    if (message instanceof Error) {
      return {
        baseMessage: message.message,
        additionalData: {
          name: message.name,
          stack: message.stack,
        },
      };
    }

    if (typeof message === "string") {
      return { baseMessage: message, additionalData: {} };
    }

    const { message: msg, ...rest } = message;

    return { baseMessage: msg, additionalData: rest };
  }

  private getContext(
    context?: LogContext | string,
    defaultContext?: string
  ): string {
    if (typeof context === "string") {
      return context;
    }

    if (context?.context) {
      return context.context;
    }

    return defaultContext || "App";
  }

  private removeUndefinedValues(
    obj: Record<string, unknown>
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined)
    );
  }
}

export { LogFormatterService };
