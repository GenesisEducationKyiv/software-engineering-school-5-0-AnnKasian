import { BaseException } from "../../../../../shared/libs/exceptions/exceptions.js";
import { WEATHER_ERROR_CODES, WEATHER_ERROR_MESSAGES } from "../enums/enums.js";
import {
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
} from "../../../../../shared/libs/enums/enums.js";

class UnknownErrorException extends BaseException {
  public code = WEATHER_ERROR_CODES.UNKNOWN_ERROR;
  public statusCode: number;

  constructor(
    message: string = ERROR_MESSAGES.UNKNOWN_ERROR,
    statusCode: number = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ApiErrorException extends BaseException {
  public code = WEATHER_ERROR_CODES.APP_ERROR;
  public statusCode = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;

  constructor(message: string = WEATHER_ERROR_MESSAGES.API_ERROR) {
    super(message);
  }
}

class NotAvailableException extends BaseException {
  public code = WEATHER_ERROR_CODES.PROVIDERS_NOT_AVAILABLE;
  public statusCode = ERROR_STATUS_CODES.SERVICE_UNAVAILABLE;

  constructor(
    message: string = WEATHER_ERROR_MESSAGES.PROVIDERS_NOT_AVAILABLE
  ) {
    super(message);
  }
}

export { UnknownErrorException, NotAvailableException, ApiErrorException };
