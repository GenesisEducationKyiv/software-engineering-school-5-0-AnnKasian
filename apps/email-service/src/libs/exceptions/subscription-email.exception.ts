import { EMAIL_ERROR_CODES } from "../../../../../shared/libs/enums/enums.js";
import { BaseException } from "../../../../../shared/libs/exceptions/base.exception.js";
import { EMAIL_ERROR_MESSAGES } from "../enums/enums.js";

class EmailSendFailException extends BaseException {
  public code = EMAIL_ERROR_CODES.EMAIL_SEND_FAILED;

  constructor(message: string = EMAIL_ERROR_MESSAGES.EMAIL_SEND_FAILED) {
    super(message);
  }
}

class DataIsRequiredException extends BaseException {
  public code = EMAIL_ERROR_CODES.DATA_IS_REQUIRED;

  constructor(message: string = EMAIL_ERROR_MESSAGES.DATA_IS_REQUIRED) {
    super(message);
  }
}

class WeatherServiceException extends BaseException {
  public code = EMAIL_ERROR_CODES.WEATHER_SERVICE_ERROR;

  constructor(message: string = EMAIL_ERROR_MESSAGES.WEATHER_SERVICE_ERROR) {
    super(message);
  }
}

class MessageBrokerException extends BaseException {
  public code = EMAIL_ERROR_CODES.MESSAGE_BROKER_ERROR;

  constructor(message: string = EMAIL_ERROR_MESSAGES.MESSAGE_BROKER_ERROR) {
    super(message);
  }
}

export {
  EmailSendFailException,
  DataIsRequiredException,
  WeatherServiceException,
  MessageBrokerException,
};
