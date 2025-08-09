type LogContext = {
  context?: string;
  traceId?: string;
  userId?: string;
  action?: string;
  duration?: number;
  [key: string]: unknown;
};

export { type LogContext };
