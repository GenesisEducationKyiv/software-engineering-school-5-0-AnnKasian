import { Response } from "express";
import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import {
  ERROR_MESSAGES,
  ERROR_STATUS_CODES,
  CONTEXT_TYPE,
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

    if (error instanceof BaseException) {
      status = error.statusCode;
      const { message: errorMessage } = error;
      message = errorMessage;
    } else if (error instanceof Error) {
      status = ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;
      const { message: errorMessage } = error;
      message = errorMessage;
    }

    response.status(status).json({ message, statusCode: status });
  }

  private handleRpcException(error: unknown) {
    let message: string = ERROR_MESSAGES.UNKNOWN_ERROR;

    if (error instanceof BaseException || error instanceof Error) {
      const { message: errorMessage } = error;
      message = errorMessage;
    }

    throw new RpcException(message);
  }
}

export { HandleErrorMiddleware };
