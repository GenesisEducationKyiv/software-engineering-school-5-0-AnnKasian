import { ERROR_STATUS_CODES } from "../../../libs/enums/enums.js";
import { BaseException } from "../../../libs/exceptions/exceptions.js";
import {
  SUBSCRIPTION_ERROR_CODES,
  SUBSCRIPTION_ERROR_MESSAGES,
} from "../enums/enums.js";

class InvalidSubscriptionInputException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.INVALID_INPUT;
  public statusCode = ERROR_STATUS_CODES.BAD_REQUEST;

  constructor(message: string = SUBSCRIPTION_ERROR_MESSAGES.INVALID_INPUT) {
    super(message);
  }
}

class EmailAlreadyExistsException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.EMAIL_ALREADY_EXISTS;
  public statusCode = ERROR_STATUS_CODES.CONFLICT;

  constructor(
    message: string = SUBSCRIPTION_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
  ) {
    super(message);
  }
}

class SubscriptionAlreadyConfirmedException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.SUBSCRIPTION_ALREADY_CONFIRMED;
  public statusCode = ERROR_STATUS_CODES.CONFLICT;

  constructor(
    message: string = SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_ALREADY_CONFIRMED
  ) {
    super(message);
  }
}

class TokenNotFoundException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.TOKEN_NOT_FOUND;
  public statusCode = ERROR_STATUS_CODES.NOT_FOUND;

  constructor(message: string = SUBSCRIPTION_ERROR_MESSAGES.TOKEN_NOT_FOUND) {
    super(message);
  }
}

class InvalidTokenException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.INVALID_TOKEN;
  public statusCode = ERROR_STATUS_CODES.BAD_REQUEST;

  constructor(message: string = SUBSCRIPTION_ERROR_MESSAGES.INVALID_TOKEN) {
    super(message);
  }
}

export {
  InvalidSubscriptionInputException,
  EmailAlreadyExistsException,
  TokenNotFoundException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
};
