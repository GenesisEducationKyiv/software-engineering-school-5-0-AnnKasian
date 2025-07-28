import { type ValidationError } from "class-validator";
import { SUBSCRIPTION_ERROR_CODES } from "../../../../../shared/libs/enums/enums.js";
import { BaseException } from "../../../../../shared/libs/exceptions/exceptions.js";
import { SUBSCRIPTION_ERROR_MESSAGES } from "../enums/enums.js";

class InvalidSubscriptionInputException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.INVALID_INPUT;

  constructor(
    errors: ValidationError[],
    message: string = SUBSCRIPTION_ERROR_MESSAGES.INVALID_INPUT
  ) {
    super(message);
    errors.forEach((error) => {
      this.details.push(JSON.stringify(error.constraints));
    });
  }
}

class EmailAlreadyExistsException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.EMAIL_ALREADY_EXISTS;

  constructor(
    message: string = SUBSCRIPTION_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
  ) {
    super(message);
  }
}

class SubscriptionAlreadyConfirmedException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.SUBSCRIPTION_ALREADY_CONFIRMED;

  constructor(
    message: string = SUBSCRIPTION_ERROR_MESSAGES.SUBSCRIPTION_ALREADY_CONFIRMED
  ) {
    super(message);
  }
}

class TokenNotFoundException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.TOKEN_NOT_FOUND;

  constructor(message: string = SUBSCRIPTION_ERROR_MESSAGES.TOKEN_NOT_FOUND) {
    super(message);
  }
}

class InvalidTokenException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.INVALID_TOKEN;

  constructor(message: string = SUBSCRIPTION_ERROR_MESSAGES.INVALID_TOKEN) {
    super(message);
  }
}

class EmailServiceException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.EMAIL_SERVICE_ERROR;

  constructor(
    message: string = SUBSCRIPTION_ERROR_MESSAGES.EMAIL_SERVICE_ERROR
  ) {
    super(message);
  }
}

export {
  InvalidSubscriptionInputException,
  EmailAlreadyExistsException,
  TokenNotFoundException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
  EmailServiceException,
};
