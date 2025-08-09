import { Inject, Injectable } from "@nestjs/common";
import {
  DURATION,
  METRICS_ERROR_TYPES,
  METRICS_SERVICES,
} from "../../../../../shared/observability/metrics/libs/enums/enums.js";
import { type CustomMetricsService } from "../../../../../shared/observability/metrics/metrics.service.js";
import {
  type DB_METRICS_OPERATIONS,
  DB_METRICS_TABLES,
  SUBSCRIPTION_INJECTION_TOKENS,
} from "../../libs/enums/enums.js";

@Injectable()
class MetricsHelper {
  constructor(
    @Inject(SUBSCRIPTION_INJECTION_TOKENS.METRICS_SERVICE)
    private readonly metricsService: CustomMetricsService
  ) {}

  calculateDuration(startTime: number): number {
    return (Date.now() - startTime) / DURATION.DEFAULT;
  }

  recordDbMetrics(
    operation: DB_METRICS_OPERATIONS,
    duration: number,
    isSuccess: boolean
  ): void {
    this.metricsService.incrementDbQueries(
      operation,
      DB_METRICS_TABLES.SUBSCRIPTIONS,
      isSuccess
    );

    this.metricsService.observeDbQueryDuration(
      operation,
      DB_METRICS_TABLES.SUBSCRIPTIONS,
      duration,
      isSuccess
    );

    if (!isSuccess) {
      this.metricsService.incrementErrors(
        METRICS_ERROR_TYPES.DATABASE,
        METRICS_SERVICES.SUBSCRIPTION_REPOSITORY
      );
    }
  }

  async withMetrics<T>(
    operation: DB_METRICS_OPERATIONS,
    dbOperation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();

    try {
      const result = await dbOperation();
      const duration = this.calculateDuration(startTime);
      this.recordDbMetrics(operation, duration, true);

      return result;
    } catch (error) {
      const duration = this.calculateDuration(startTime);
      this.recordDbMetrics(operation, duration, false);

      throw error;
    }
  }
}

export { MetricsHelper };
