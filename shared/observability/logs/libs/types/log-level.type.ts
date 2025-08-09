const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export { LogLevel };
