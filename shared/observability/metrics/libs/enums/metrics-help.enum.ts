const METRICS_HELP = {
  HTTP_REQUESTS_TOTAL: "Total number of HTTP requests",
  HTTP_REQUEST_DURATION: "Duration of HTTP requests in seconds",
  APP_STATUS: "Application status (1 = healthy, 0 = unhealthy)",
  DB_CONNECTIONS_ACTIVE: "Number of active database connections",
  DB_QUERIES_TOTAL: "Total number of database queries",
  DB_QUERY_DURATION: "Duration of database queries in seconds",
  ERRORS_TOTAL: "Total number of errors",
} as const;

export { METRICS_HELP };
