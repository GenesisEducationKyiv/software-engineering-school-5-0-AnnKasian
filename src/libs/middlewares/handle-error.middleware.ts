import { Response } from "express";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { ERROR_MESSAGES, ERROR_STATUS_CODES } from "../enums/enums.js";
import { BaseException } from "../exceptions/exceptions.js";

@Catch()
class HandleErrorMiddleware implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const contextType = host.getType();

    if (contextType === "http") {
      return this.handleHttpException(error, host);
    }

    throw error;
  }

  private handleHttpException(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let status;
    let message;

    if (error instanceof BaseException) {
      status = error.statusCode;
      const { message: errorMessage } = error;
      message = errorMessage;
    } else if (error instanceof HttpException) {
      status = error.getStatus();
      const { message: errorMessage } = error;
      message = errorMessage;
    } else {
      status = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;
      message = ERROR_MESSAGES.UNKNOWN_ERROR;
    }

    response.status(status).json({ message, statusCode: status });
  }
}

export { HandleErrorMiddleware };
