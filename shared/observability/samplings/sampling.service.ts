import { Injectable } from "@nestjs/common";
import { LogLevel } from "../logs/libs/types/types.js";
import { TRACE_LOG_COUNT } from "./libs/enums/enums.js";
import { samplingConfig } from "./sampling.config.js";

@Injectable()
class SamplingService {
  private readonly traceLogCounts = new Map<string, number>();

  private totalSampled = 0;
  private totalSkipped = 0;
  private readonly sampledByLevel = new Map<LogLevel, number>();
  private readonly skippedByLevel = new Map<LogLevel, number>();

  constructor() {
    Object.values(LogLevel).forEach((level) => {
      this.sampledByLevel.set(level, 0);
      this.skippedByLevel.set(level, 0);
    });
  }

  shouldSample(level: LogLevel, message: string, traceId?: string): boolean {
    if (!samplingConfig.enabled) {
      this.incrementSampled(level);

      return true;
    }

    if (level === LogLevel.ERROR && samplingConfig.rules.alwaysLogErrors) {
      this.incrementSampled(level);

      return true;
    }

    if (this.hasExcludedKeyword(message)) {
      this.incrementSkipped(level);

      return false;
    }

    if (traceId && this.shouldLogFirstInTrace(traceId)) {
      this.incrementSampled(level);

      return true;
    }

    const shouldLog = Math.random() < samplingConfig.rates[level];

    if (shouldLog) {
      this.incrementSampled(level);
    } else {
      this.incrementSkipped(level);
    }

    return shouldLog;
  }

  private incrementSampled(level: LogLevel): void {
    this.totalSampled++;
    this.sampledByLevel.set(level, (this.sampledByLevel.get(level) || 0) + 1);
  }

  private incrementSkipped(level: LogLevel): void {
    this.totalSkipped++;
    this.skippedByLevel.set(level, (this.skippedByLevel.get(level) || 0) + 1);
  }

  private hasExcludedKeyword(message: string): boolean {
    const lowerMessage = message.toLowerCase();

    return samplingConfig.rules.excludeKeywords.some((keyword) =>
      lowerMessage.includes(keyword.toLowerCase())
    );
  }

  private shouldLogFirstInTrace(traceId: string): boolean {
    const currentCount = this.traceLogCounts.get(traceId) || 0;

    if (currentCount < samplingConfig.rules.alwaysLogFirstInTrace) {
      this.traceLogCounts.set(traceId, currentCount + 1);
      this.cleanupTraceCache();

      return true;
    }

    return false;
  }

  private cleanupTraceCache(): void {
    if (this.traceLogCounts.size > TRACE_LOG_COUNT.MAX) {
      const firstKey = this.traceLogCounts.keys().next().value;

      if (firstKey) {
        this.traceLogCounts.delete(firstKey);
      }
    }
  }

  getStats() {
    const sampledByLevel: Record<LogLevel, number> = {} as Record<
      LogLevel,
      number
    >;
    const skippedByLevel: Record<LogLevel, number> = {} as Record<
      LogLevel,
      number
    >;

    Object.values(LogLevel).forEach((level) => {
      sampledByLevel[level] = this.sampledByLevel.get(level) || 0;
      skippedByLevel[level] = this.skippedByLevel.get(level) || 0;
    });

    return {
      enabled: samplingConfig.enabled,
      rates: samplingConfig.rates,
      rules: samplingConfig.rules,
      activeTraces: this.traceLogCounts.size,
      totalSampled: this.totalSampled,
      totalSkipped: this.totalSkipped,
      sampledByLevel,
      skippedByLevel,
    };
  }
}

export { SamplingService };
