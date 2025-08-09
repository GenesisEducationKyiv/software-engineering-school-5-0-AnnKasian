import { type LogLevel } from "./log-level.type.js";

type LogConfig = {
  level: LogLevel;
  enableConsole: boolean;
  enableLoki: boolean;
  loki?: {
    host: string;
    labels: Record<string, string>;
    auth?: string;
  };
};

export { type LogConfig };
