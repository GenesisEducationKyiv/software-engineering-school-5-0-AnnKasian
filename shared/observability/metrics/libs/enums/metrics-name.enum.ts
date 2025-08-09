const METRICS_NAME = {
  HTTP_REQUESTS_TOTAL: "http_requests_total",
  HTTP_REQUEST_DURATION: "http_request_duration_seconds",
  APP_STATUS: "app_status",
  DB_CONNECTIONS_ACTIVE: "db_connections_active",
  DB_QUERIES_TOTAL: "db_queries_total",
  DB_QUERY_DURATION: "db_query_duration_seconds",
  ERRORS_TOTAL: "errors_total",
} as const;

export { METRICS_NAME };
