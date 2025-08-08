import {
  register,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from "prom-client";
import { Injectable } from "@nestjs/common";
import {
  DB_QUERY_DURATION_BUCKETS,
  HTTP_DURATION_BUCKETS,
  METRICS_HELP,
  METRICS_LABELS,
  METRICS_NAME,
} from "./libs/enums/enums.js";

@Injectable()
class CustomMetricsService {
  private readonly httpRequestsTotal: Counter;
  private readonly httpRequestDuration: Histogram;

  private readonly appStatus: Gauge;

  private readonly dbConnectionsActive: Gauge;
  private readonly dbQueriesTotal: Counter;
  private readonly dbQueryDuration: Histogram;

  private readonly errorsTotal: Counter;

  constructor() {
    collectDefaultMetrics({ register });

    this.httpRequestsTotal = new Counter({
      name: METRICS_NAME.HTTP_REQUESTS_TOTAL,
      help: METRICS_HELP.HTTP_REQUESTS_TOTAL,
      labelNames: [
        METRICS_LABELS.METHOD,
        METRICS_LABELS.ROUTE,
        METRICS_LABELS.STATUS_CODE,
      ],
      registers: [register],
    });

    this.httpRequestDuration = new Histogram({
      name: METRICS_NAME.HTTP_REQUEST_DURATION,
      help: METRICS_HELP.HTTP_REQUEST_DURATION,
      labelNames: [METRICS_LABELS.METHOD, METRICS_LABELS.ROUTE],
      buckets: HTTP_DURATION_BUCKETS,
      registers: [register],
    });

    this.appStatus = new Gauge({
      name: METRICS_NAME.APP_STATUS,
      help: METRICS_HELP.APP_STATUS,
      registers: [register],
    });

    this.dbConnectionsActive = new Gauge({
      name: METRICS_NAME.DB_CONNECTIONS_ACTIVE,
      help: METRICS_HELP.DB_CONNECTIONS_ACTIVE,
      registers: [register],
    });

    this.dbQueriesTotal = new Counter({
      name: METRICS_NAME.DB_QUERIES_TOTAL,
      help: METRICS_HELP.DB_QUERIES_TOTAL,
      labelNames: [
        METRICS_LABELS.OPERATION,
        METRICS_LABELS.TABLE,
        METRICS_LABELS.IS_SUCCESS,
      ],
      registers: [register],
    });

    this.dbQueryDuration = new Histogram({
      name: METRICS_NAME.DB_QUERY_DURATION,
      help: METRICS_HELP.DB_QUERY_DURATION,
      labelNames: [
        METRICS_LABELS.OPERATION,
        METRICS_LABELS.TABLE,
        METRICS_LABELS.IS_SUCCESS,
      ],
      buckets: DB_QUERY_DURATION_BUCKETS,
      registers: [register],
    });

    this.errorsTotal = new Counter({
      name: METRICS_NAME.ERRORS_TOTAL,
      help: METRICS_HELP.ERRORS_TOTAL,
      labelNames: [METRICS_LABELS.TYPE, METRICS_LABELS.SERVICE],
      registers: [register],
    });

    this.appStatus.set(1);
  }

  incrementHttpRequests(
    method: string,
    route: string,
    statusCode: number
  ): void {
    this.httpRequestsTotal.inc({
      method,
      route,
      status_code: statusCode.toString(),
    });
  }

  observeHttpDuration(method: string, route: string, duration: number): void {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  setAppHealthy(): void {
    this.appStatus.set(1);
  }

  setAppUnhealthy(): void {
    this.appStatus.set(0);
  }

  setActiveConnections(count: number): void {
    this.dbConnectionsActive.set(count);
  }

  incrementDbQueries(operation: string, table: string, isSuccess = true): void {
    this.dbQueriesTotal.inc({
      operation,
      table,
      is_success: isSuccess.toString(),
    });
  }

  observeDbQueryDuration(
    operation: string,
    table: string,
    duration: number,
    isSuccess = true
  ): void {
    this.dbQueryDuration.observe(
      { operation, table, is_success: isSuccess.toString() },
      duration
    );
  }

  incrementErrors(type: string, service: string): void {
    this.errorsTotal.inc({ type, service });
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }

  clearMetrics(): void {
    register.clear();
  }
}

export { CustomMetricsService };
