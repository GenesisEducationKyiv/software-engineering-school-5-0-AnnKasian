import { HttpException } from "@nestjs/common";
import { type AxiosError, isAxiosError } from "axios";
import { type WeatherError } from "../types/types.js";
import { ErrorMessage, ErrorStatusCode } from "../../../libs/enums/enums.js";
import { fileLogger } from "./helpers.js";

class WeatherErrorHandler {
  public handleError(error: unknown, providerName: string): null {
    if (!(error instanceof Error)) {
      fileLogger(providerName, `Unknown error: ${typeof error}`);

      throw new HttpException(
        ErrorMessage.UNKNOWN_ERROR,
        ErrorStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    if (isAxiosError(error)) {
      return this.handleAxiosError(
        error as AxiosError<WeatherError>,
        providerName
      );
    }

    fileLogger(providerName, `Adapter error: ${error.message}`);

    throw new HttpException(error.message, ErrorStatusCode.BAD_REQUEST);
  }

  private handleAxiosError(
    axiosError: AxiosError<WeatherError>,
    providerName: string
  ): null {
    if (axiosError.response?.status === ErrorStatusCode.BAD_REQUEST) {
      fileLogger(
        providerName,
        `Invalid city: ${this.extractErrorMessage(
          axiosError.response.data.error
        )}`
      );

      return null;
    }

    const errorMessage =
      this.extractErrorMessage(axiosError.response?.data?.error) ??
      axiosError.message ??
      ErrorMessage.UNKNOWN_ERROR;

    const statusCode =
      axiosError.response?.status ?? ErrorStatusCode.INTERNAL_SERVER_ERROR;

    fileLogger(providerName, `API Error: (${statusCode}) - ${errorMessage}`);

    throw new HttpException(errorMessage, statusCode);
  }

  private extractErrorMessage(
    error: { code: number; message: string } | string | undefined
  ): string {
    if (typeof error === "string") {
      return error;
    }

    if (error && typeof error === "object" && "message" in error) {
      return error.message;
    }

    return ErrorMessage.UNKNOWN_ERROR;
  }
}

export { WeatherErrorHandler };
