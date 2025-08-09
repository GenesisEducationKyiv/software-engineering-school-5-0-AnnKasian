import { CONFIG_KEYS } from "../../libs/enums/enums.js";
import { type LogLevel, type LogConfig } from "./libs/types/types.js";

const loggerConfig: LogConfig = {
  level: (process.env[CONFIG_KEYS.LOG_LEVEL] as LogLevel) || "error",
  enableConsole: process.env[CONFIG_KEYS.ENABLE_CONSOLE_LOG] !== "false",
  enableLoki: process.env[CONFIG_KEYS.ENABLE_LOKI_LOG] === "true",
  loki: {
    host: process.env[CONFIG_KEYS.LOKI_HOST] || "http://localhost:3100",
    labels: {
      app: process.env[CONFIG_KEYS.APP_NAME] || "my-app",
      env: process.env[CONFIG_KEYS.NODE_ENV] || "development",
    },
    auth: process.env[CONFIG_KEYS.LOKI_AUTH],
  },
};

export { loggerConfig };
