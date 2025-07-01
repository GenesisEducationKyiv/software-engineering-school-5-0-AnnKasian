import { HttpException } from "@nestjs/common";
import { ErrorMessage, ErrorStatusCode } from "../../../libs/enums/enums.js";

const SubscriptionEmailErrorHandler = (error: unknown) => {
  if (error instanceof Error) {
    throw new HttpException(
      error.message,
      ErrorStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  throw new HttpException(
    ErrorMessage.UNKNOWN_ERROR,
    ErrorStatusCode.INTERNAL_SERVER_ERROR
  );
};

export { SubscriptionEmailErrorHandler };
