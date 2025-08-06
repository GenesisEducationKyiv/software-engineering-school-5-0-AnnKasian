import {
  ERROR_MESSAGES,
  WEATHER_ERROR_CODES,
} from "../../../../../shared/libs/enums/enums.js";
import { BaseException } from "../../../../../shared/libs/exceptions/exceptions.js";
import { WEATHER_ERROR_MESSAGES } from "../enums/enums.js";

class UnknownErrorException extends BaseException {
  public code = WEATHER_ERROR_CODES.UNKNOWN_ERROR;

  constructor(message: string = ERROR_MESSAGES.UNKNOWN_ERROR) {
    super(message);
  }
}

class ApiErrorException extends BaseException {
  public code = WEATHER_ERROR_CODES.APP_ERROR;

  constructor(message: string = WEATHER_ERROR_MESSAGES.API_ERROR) {
    super(message);
  }
}

class NotAvailableException extends BaseException {
  public code = WEATHER_ERROR_CODES.PROVIDERS_NOT_AVAILABLE;

  constructor(
    message: string = WEATHER_ERROR_MESSAGES.PROVIDERS_NOT_AVAILABLE
  ) {
    super(message);
  }
}

export { UnknownErrorException, NotAvailableException, ApiErrorException };
