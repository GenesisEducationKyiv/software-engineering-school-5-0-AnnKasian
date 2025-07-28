import { Response } from "express";
import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import {
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
  CONTEXT_TYPE,
  SUBSCRIPTION_ERROR_CODES,
  WEATHER_ERROR_CODES,
  EMAIL_ERROR_CODES,
} from "../enums/enums.js";
import { BaseException } from "../exceptions/exceptions.js";

@Catch()
class HandleErrorMiddleware implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const contextType = host.getType();

    if (contextType === CONTEXT_TYPE.HTTP) {
      return this.handleHttpException(error, host);
    } else if (contextType === CONTEXT_TYPE.RPC) {
      return this.handleRpcException(error);
    }

    throw error;
  }

  private handleHttpException(error: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    let status: number = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;
    let message: string = ERROR_MESSAGES.UNKNOWN_ERROR;
    let details: string[] = [];

    if (error instanceof BaseException) {
      status = this.httpStatusCodeMapper(error.code);
      const { message: errorMessage, details: errorDetails } = error;
      message = errorMessage;
      details = errorDetails;
    } else if (error instanceof Error) {
      status = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;
      const { message: errorMessage } = error;
      message = errorMessage;
    }

    response.status(status).json({ message, statusCode: status, details });
  }

  private handleRpcException(error: unknown) {
    let message: string = ERROR_MESSAGES.UNKNOWN_ERROR;

    if (error instanceof BaseException || error instanceof Error) {
      const { message: errorMessage } = error;
      message = errorMessage;
    }

    throw new RpcException(message);
  }

  private httpStatusCodeMapper(code: string): number {
    if (
      code === EMAIL_ERROR_CODES.DATA_IS_REQUIRED ||
      SUBSCRIPTION_ERROR_CODES.INVALID_INPUT ||
      SUBSCRIPTION_ERROR_CODES.INVALID_TOKEN ||
      WEATHER_ERROR_CODES.INVALID_REQUEST
    ) {
      return ERROR_STATUS_CODES.BAD_REQUEST;
    }

    if (
      code === SUBSCRIPTION_ERROR_CODES.TOKEN_NOT_FOUND ||
      WEATHER_ERROR_CODES.CITY_NOT_FOUND
    ) {
      return ERROR_STATUS_CODES.NOT_FOUND;
    }

    if (
      code === SUBSCRIPTION_ERROR_CODES.EMAIL_ALREADY_EXISTS ||
      SUBSCRIPTION_ERROR_CODES.SUBSCRIPTION_ALREADY_CONFIRMED
    ) {
      return ERROR_STATUS_CODES.CONFLICT;
    }

    if (
      code === EMAIL_ERROR_CODES.EMAIL_SEND_FAILED ||
      EMAIL_ERROR_CODES.WEATHER_SERVICE_ERROR ||
      SUBSCRIPTION_ERROR_CODES.EMAIL_SERVICE_ERROR ||
      WEATHER_ERROR_CODES.UNKNOWN_ERROR ||
      WEATHER_ERROR_CODES.APP_ERROR ||
      WEATHER_ERROR_CODES.WEATHER_LOG_EXCEPTION
    ) {
      return ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }

    if (code === WEATHER_ERROR_CODES.PROVIDERS_NOT_AVAILABLE) {
      return ERROR_STATUS_CODES.SERVICE_UNAVAILABLE;
    }

    return ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }
}

export { HandleErrorMiddleware };
