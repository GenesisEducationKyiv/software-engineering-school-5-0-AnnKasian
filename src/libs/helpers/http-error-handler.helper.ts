import { HttpException } from "@nestjs/common";
import { BaseException } from "../exceptions/exceptions.js";
import { ERROR_MESSAGES, ERROR_STATUS_CODES } from "../enums/enums.js";

const httpErrorHandler = (error: unknown): never => {
  if (error instanceof BaseException) {
    throw new HttpException(error.message, error.statusCode);
  }

  throw new HttpException(
    ERROR_MESSAGES.UNKNOWN_ERROR,
    ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR
  );
};

export { httpErrorHandler };
