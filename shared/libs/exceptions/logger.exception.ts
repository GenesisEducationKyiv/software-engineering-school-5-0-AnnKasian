import {
  OBSERVABILITY_ERROR_MESSAGES,
  OBSERVABILITY_ERROR_CODES,
} from "../enums/enums.js";
import { BaseException } from "./base.exception.js";

class LoggerException extends BaseException {
  public code = OBSERVABILITY_ERROR_CODES.LOGGER_EXCEPTION;

  constructor(message: string = OBSERVABILITY_ERROR_MESSAGES.LOGGER_EXCEPTION) {
    super(message);
  }
}

export { LoggerException };
