import { type ValidationError } from "class-validator";
import { ERROR_STATUS_CODES } from "../../../../../shared/libs/enums/enums.js";
import { BaseException } from "../../../../../shared/libs/exceptions/exceptions.js";
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

class EmailServiceException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.EMAIL_SERVICE_ERROR;
  public statusCode = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;

  constructor(
    message: string = SUBSCRIPTION_ERROR_MESSAGES.EMAIL_SERVICE_ERROR
  ) {
    super(message);
  }
}

class ValidationException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.VALIDATION_EXCEPTION;
  public statusCode = ERROR_STATUS_CODES.BAD_REQUEST;

  constructor(
    errors: ValidationError[],
    message: string = SUBSCRIPTION_ERROR_MESSAGES.VALIDATION_EXCEPTION
  ) {
    super(message);
    errors.forEach((error) => {
      this.details.push(JSON.stringify(error.constraints));
    });
  }
}

export {
  InvalidSubscriptionInputException,
  EmailAlreadyExistsException,
  TokenNotFoundException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
  EmailServiceException,
  ValidationException,
};
