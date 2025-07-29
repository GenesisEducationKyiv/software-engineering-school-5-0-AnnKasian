import { BaseException } from "../../../../../shared/libs/exceptions/exceptions.js";
import {
  DATABASE_ERROR_MESSAGES,
  DATABASE_ERROR_CODES,
} from "../enums/enums.js";

class UniqueConstraintException extends BaseException {
  public code = DATABASE_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION;

  constructor(
    message: string = DATABASE_ERROR_MESSAGES.UNIQUE_CONSTRAINT_VIOLATION
  ) {
    super(message);
  }
}

class InvalidInputSyntax extends BaseException {
  public code = DATABASE_ERROR_CODES.INVALID_INPUT_SYNTAX;

  constructor(message: string = DATABASE_ERROR_MESSAGES.INVALID_INPUT_SYNTAX) {
    super(message);
  }
}

class DatabaseException extends BaseException {
  public code = DATABASE_ERROR_CODES.DATABASE_EXCEPTION;

  constructor(message: string = DATABASE_ERROR_MESSAGES.DATABASE_EXCEPTION) {
    super(message);
  }
}

export { UniqueConstraintException, DatabaseException, InvalidInputSyntax };
