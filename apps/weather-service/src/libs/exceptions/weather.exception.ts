import { BaseException } from "../../../../../shared/libs/exceptions/exceptions.js";
import { WEATHER_ERROR_CODES, WEATHER_ERROR_MESSAGES } from "../enums/enums.js";
import { ERROR_STATUS_CODES } from "../../../../../shared/libs/enums/enums.js";

class InvalidRequestException extends BaseException {
  public code = WEATHER_ERROR_CODES.INVALID_REQUEST;
  public statusCode = ERROR_STATUS_CODES.BAD_REQUEST;

  constructor(message: string = WEATHER_ERROR_MESSAGES.INVALID_REQUEST) {
    super(message);
  }
}

class CityNotFoundException extends BaseException {
  public code = WEATHER_ERROR_CODES.CITY_NOT_FOUND;
  public statusCode = ERROR_STATUS_CODES.NOT_FOUND;

  constructor(message: string = WEATHER_ERROR_MESSAGES.CITY_NOT_FOUND) {
    super(message);
  }
}

export { InvalidRequestException, CityNotFoundException };
