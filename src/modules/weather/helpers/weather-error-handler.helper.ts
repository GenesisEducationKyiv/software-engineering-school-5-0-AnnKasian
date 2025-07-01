import { HttpException, Injectable } from "@nestjs/common";
import { type AxiosError, isAxiosError } from "axios";
import { type WeatherError } from "../types/types.js";
import { ErrorMessage, ErrorStatusCode } from "../../../libs/enums/enums.js";
import { FileLogger } from "./file-logger.helper.js";
import { WeatherErrors } from "../enums/enums.js";

@Injectable()
class WeatherErrorHandler {
  public handleError(error: unknown, providerName: string): never {
    const logger = new FileLogger(providerName);

    if (!(error instanceof Error)) {
      logger.unknownError(error);

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

    if (error.message === WeatherErrors.CITY_NOT_FOUND) {
      logger.invalidCity(error.message);

      throw new HttpException(
        WeatherErrors.CITY_NOT_FOUND,
        ErrorStatusCode.BAD_REQUEST
      );
    }

    if (error.message === WeatherErrors.PROVIDERS_NOT_AVAILABLE) {
      logger.allProvidersFailed(error.message);

      throw new HttpException(
        WeatherErrors.PROVIDERS_NOT_AVAILABLE,
        ErrorStatusCode.INTERNAL_SERVER_ERROR
      );
    }

    throw new HttpException(error.message, ErrorStatusCode.BAD_REQUEST);
  }

  public isCityNotFoundError(error: unknown): boolean {
    if (isAxiosError(error)) {
      return error.response?.status === ErrorStatusCode.BAD_REQUEST;
    }

    return (
      error instanceof Error && error.message === WeatherErrors.CITY_NOT_FOUND
    );
  }

  private handleAxiosError(
    axiosError: AxiosError<WeatherError>,
    providerName: string
  ): never {
    const logger = new FileLogger(providerName);

    if (axiosError.response?.status === ErrorStatusCode.BAD_REQUEST) {
      logger.invalidCity(
        this.extractErrorMessage(axiosError.response.data.error)
      );

      throw new HttpException(axiosError.message, ErrorStatusCode.BAD_REQUEST);
    }

    const errorMessage =
      this.extractErrorMessage(axiosError.response?.data?.error) ??
      axiosError.message ??
      ErrorMessage.UNKNOWN_ERROR;

    const statusCode =
      axiosError.response?.status ?? ErrorStatusCode.INTERNAL_SERVER_ERROR;

    logger.apiError(statusCode, errorMessage);

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
