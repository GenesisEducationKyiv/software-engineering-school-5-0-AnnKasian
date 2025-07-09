import * as fs from "fs";
import { Injectable } from "@nestjs/common";
import { type WeatherLogType } from "../types/types.js";

@Injectable()
class FileLogger {
  invalidCity(error: string, provider: string) {
    this.logResponse(`Invalid city: ${error}`, provider);
  }

  apiError(statusCode: number, errorMessage: string, provider: string) {
    this.logResponse(`API Error: (${statusCode}) - ${errorMessage}`, provider);
  }

  allProvidersFailed(errorMessage: string, provider: string) {
    this.logResponse(`All providers failed: ${errorMessage}`, provider);
  }

  unknownError(error: unknown, provider: string) {
    this.logResponse(`Unknown error: ${typeof error}`, provider);
  }

  response(city: string, weather: string, provider: string) {
    this.logResponse(
      `Response : ${city} - ${JSON.stringify(weather)}`,
      provider
    );
  }

  private logResponse(response: string, provider: string) {
    const log: WeatherLogType = {
      className: provider,
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
