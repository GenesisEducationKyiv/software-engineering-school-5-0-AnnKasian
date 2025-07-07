import { HttpException, Inject, Injectable } from "@nestjs/common";
import { type AxiosError, isAxiosError } from "axios";
import { type WeatherError } from "../types/types.js";
import { ErrorMessage, ErrorStatusCode } from "../../../libs/enums/enums.js";
import { FileLogger } from "./file-logger.helper.js";
import { WEATHER_INJECTION_TOKENS, WeatherErrors } from "../enums/enums.js";

@Injectable()
class WeatherErrorHandler {
  constructor(
    @Inject(WEATHER_INJECTION_TOKENS.FILE_LOGGER)
    private readonly fileLogger: FileLogger
  ) {}

  public handleError(error: unknown, providerName: string): never {
    if (!(error instanceof Error)) {
      this.fileLogger.unknownError(error, providerName);

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
      this.fileLogger.invalidCity(error.message, providerName);

      throw new HttpException(
        WeatherErrors.CITY_NOT_FOUND,
        ErrorStatusCode.BAD_REQUEST
      );
    }

    if (error.message === WeatherErrors.PROVIDERS_NOT_AVAILABLE) {
      this.fileLogger.allProvidersFailed(error.message, providerName);

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
    if (axiosError.response?.status === ErrorStatusCode.BAD_REQUEST) {
      this.fileLogger.invalidCity(
        this.extractErrorMessage(axiosError.response.data.error),
        providerName
      );

      throw new HttpException(axiosError.message, ErrorStatusCode.BAD_REQUEST);
    }

    const errorMessage =
      this.extractErrorMessage(axiosError.response?.data?.error) ??
      axiosError.message ??
      ErrorMessage.UNKNOWN_ERROR;

    const statusCode =
      axiosError.response?.status ?? ErrorStatusCode.INTERNAL_SERVER_ERROR;

    this.fileLogger.apiError(statusCode, errorMessage, providerName);

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
