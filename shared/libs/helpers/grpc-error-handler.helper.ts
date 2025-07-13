import { RpcException } from "@nestjs/microservices";
import { ERROR_MESSAGES } from "../enums/enums.js";
import { BaseException } from "../exceptions/exceptions.js";

const grpcErrorHandler = (error: unknown): never => {
  if (error instanceof BaseException) {
    throw new RpcException(error.message);
  }

  throw new RpcException(ERROR_MESSAGES.UNKNOWN_ERROR);
};

export { grpcErrorHandler };
