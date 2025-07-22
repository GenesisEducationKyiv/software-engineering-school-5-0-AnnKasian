import { ERROR_STATUS_CODES } from "../../../libs/enums/enums.js";
import { BaseException } from "../../../libs/exceptions/exceptions.js";
import {
  SUBSCRIPTION_ERROR_CODES,
  SUBSCRIPTION_ERROR_MESSAGES,
} from "../enums/enums.js";

class EmailSendFailException extends BaseException {
  public code = SUBSCRIPTION_ERROR_CODES.EMAIL_SEND_FAILED;
  public statusCode = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;

  constructor(message: string = SUBSCRIPTION_ERROR_MESSAGES.EMAIL_SEND_FAILED) {
    super(message);
  }
}

export { EmailSendFailException };
