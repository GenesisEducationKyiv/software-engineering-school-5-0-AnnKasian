import { ERROR_STATUS_CODES } from "../../../../../shared/libs/enums/enums.js";
import { EMAIL_ERROR_CODES, EMAIL_ERROR_MESSAGES } from "../enums/enums.js";
import { BaseException } from "../../../../../shared/libs/exceptions/base.exception.js";

class EmailSendFailException extends BaseException {
  public code = EMAIL_ERROR_CODES.EMAIL_SEND_FAILED;
  public statusCode = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;

  constructor(message: string = EMAIL_ERROR_MESSAGES.EMAIL_SEND_FAILED) {
    super(message);
  }
}

class DataIsRequiredException extends BaseException {
  public code = EMAIL_ERROR_CODES.DATA_IS_REQUIRED;
  public statusCode = ERROR_STATUS_CODES.BAD_REQUEST;

  constructor(message: string = EMAIL_ERROR_MESSAGES.DATA_IS_REQUIRED) {
    super(message);
  }
}

export { EmailSendFailException, DataIsRequiredException };
