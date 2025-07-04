import * as fs from "fs";
import { Injectable } from "@nestjs/common";
import { type WeatherLogType } from "../types/types.js";

@Injectable()
class FileLogger {
  constructor(private readonly provider: string) {}

  invalidCity(error: string) {
    this.logResponse(`Invalid city: ${error}`);
  }

  apiError(statusCode: number, errorMessage: string) {
    this.logResponse(`API Error: (${statusCode}) - ${errorMessage}`);
  }

  allProvidersFailed(errorMessage: string) {
    this.logResponse(`All providers failed: ${errorMessage}`);
  }

  unknownError(error: unknown) {
    this.logResponse(`Unknown error: ${typeof error}`);
  }

  response(city: string, weather: string) {
    this.logResponse(`Response : ${city} - ${JSON.stringify(weather)}`);
  }

  private logResponse(response: string) {
    const log: WeatherLogType = {
      className: this.provider,
      response,
    };
    this.write(log);
  }

  private write(message: WeatherLogType) {
    try {
      if (!fs.existsSync("logs")) {
        fs.mkdirSync("logs", { recursive: true });
      }

      fs.appendFileSync("logs/weather.log", `${JSON.stringify(message)}\n`);
    } catch (error) {
      throw new Error(`Error logging to file: ${error as string}`);
    }
  }
}

export { FileLogger };
