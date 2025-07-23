import { ERROR_STATUS_CODES } from "../../../../../shared/libs/enums/enums.js";
import { BaseException } from "../../../../../shared/libs/exceptions/exceptions.js";
import { WEATHER_ERROR_CODES, WEATHER_ERROR_MESSAGES } from "../enums/enums.js";

class WeatherLogException extends BaseException {
  public code = WEATHER_ERROR_CODES.WEATHER_LOG_EXCEPTION;
  public statusCode = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;

  constructor(message: string = WEATHER_ERROR_MESSAGES.WEATHER_LOG_EXCEPTION) {
    super(message);
  }
}

export { WeatherLogException };
