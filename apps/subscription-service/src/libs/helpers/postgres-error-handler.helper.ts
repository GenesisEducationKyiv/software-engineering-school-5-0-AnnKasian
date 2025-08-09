import { QueryFailedError } from "typeorm";
import { POSTGRE_ERROR_STATUS_CODES } from "../enums/enums.js";
import {
  DatabaseException,
  UniqueConstraintException,
  InvalidInputSyntax,
} from "../exceptions/exceptions.js";

const postgresErrorHandler = (error: unknown): never => {
  if (error instanceof QueryFailedError) {
    const driverError = error.driverError as {
      code?: string;
      detail?: string;
    };

    if (
      driverError?.code ===
      POSTGRE_ERROR_STATUS_CODES.UNIQUE_CONSTRAINT_VIOLATION
    ) {
      throw new UniqueConstraintException(driverError.detail);
    }

    if (driverError?.code === POSTGRE_ERROR_STATUS_CODES.INVALID_INPUT_SYNTAX) {
      throw new InvalidInputSyntax(driverError.detail);
    }
  }

  throw new DatabaseException(error as string);
};

export { postgresErrorHandler };
