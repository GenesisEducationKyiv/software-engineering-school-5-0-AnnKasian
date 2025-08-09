import { CONFIG_KEYS } from "../../libs/enums/enums.js";
import { type SamplingConfig } from "./libs/types/types.js";

const samplingConfig: SamplingConfig = {
  enabled: process.env.LOG_SAMPLING_ENABLED === "true" || false,
  rates: {
    debug: parseFloat(
      process.env[CONFIG_KEYS.LOG_SAMPLING_DEBUG_RATE] || "0.1"
    ),
    info: parseFloat(process.env[CONFIG_KEYS.LOG_SAMPLING_INFO_RATE] || "0.5"),
    warn: parseFloat(process.env[CONFIG_KEYS.LOG_SAMPLING_WARN_RATE] || "0.8"),
    error: parseFloat(
      process.env[CONFIG_KEYS.LOG_SAMPLING_ERROR_RATE] || "1.0"
    ),
  },
  rules: {
    alwaysLogErrors: process.env[CONFIG_KEYS.LOG_ALWAYS_LOG_ERRORS] !== "false",
    alwaysLogFirstInTrace: parseInt(
      process.env[CONFIG_KEYS.LOG_FIRST_IN_TRACE] || "3"
    ),
    excludeKeywords: (
      process.env[CONFIG_KEYS.LOG_EXCLUDE_KEYWORDS] || "password,token,secret"
    ).split(","),
  },
};

export { samplingConfig };
