import { Injectable } from "@nestjs/common";
import { type AxiosError, isAxiosError } from "axios";
import { type WeatherError } from "../types/types.js";
import { ERROR_MESSAGES } from "../../../libs/enums/enums.js";
import { FileLogger } from "./file-logger.helper.js";
import {
  CityNotFoundException,
  InvalidRequestException,
  NotAvailableException,
  UnknownErrorException,
} from "../exceptions/exceptions.js";
import {
  WEATHER_ERROR_MESSAGES,
  WEATHER_PROVIDERS_ERROR_CODES,
} from "../enums/enums.js";

@Injectable()
class WeatherErrorHandler {
  public handleError(error: unknown, providerName: string): never {
    const logger = new FileLogger(providerName);

    if (!(error instanceof Error)) {
      logger.unknownError(error);

      throw new UnknownErrorException();
    }

    if (isAxiosError(error)) {
      return this.handleAxiosError(
        error as AxiosError<WeatherError>,
        providerName
      );
    }

    if (error.message === WEATHER_ERROR_MESSAGES.CITY_NOT_FOUND) {
      logger.invalidCity(error.message);

      throw new CityNotFoundException();
    }

    if (error.message === WEATHER_ERROR_MESSAGES.PROVIDERS_NOT_AVAILABLE) {
      logger.allProvidersFailed(error.message);

      throw new NotAvailableException();
    }

    throw new InvalidRequestException(error.message);
  }

  public isCityNotFoundError(error: unknown): boolean {
    if (isAxiosError(error)) {
      return (
        error.response?.status === WEATHER_PROVIDERS_ERROR_CODES.BAD_REQUEST
      );
    }

    return (
      error instanceof Error &&
      error.message === WEATHER_ERROR_MESSAGES.CITY_NOT_FOUND
    );
  }

  private handleAxiosError(
    axiosError: AxiosError<WeatherError>,
    providerName: string
  ): never {
    const logger = new FileLogger(providerName);

    if (
      axiosError.response?.status === WEATHER_PROVIDERS_ERROR_CODES.BAD_REQUEST
    ) {
      logger.invalidCity(
        this.extractErrorMessage(axiosError.response.data.error)
      );

      throw new InvalidRequestException(axiosError.message);
    }

    const errorMessage =
      this.extractErrorMessage(axiosError.response?.data?.error) ??
      axiosError.message ??
      ERROR_MESSAGES.UNKNOWN_ERROR;

    const statusCode =
      axiosError.response?.status ??
      WEATHER_PROVIDERS_ERROR_CODES.INTERNAL_SERVER_ERROR;

    logger.apiError(statusCode, errorMessage);

    throw new UnknownErrorException(errorMessage, statusCode);
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

    return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

export { WeatherErrorHandler };
