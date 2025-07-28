import * as fs from "fs";
import path from "path";
import { Injectable } from "@nestjs/common";
import { WeatherLogException } from "../exceptions/exceptions.js";
import { type WeatherLogType } from "../types/types.js";

@Injectable()
class FileLogger {
  invalidCity(error: string, provider: string) {
    this.logResponse(`Invalid city: ${error}`, provider);
  }

  apiError(errorMessage: string, provider: string) {
    this.logResponse(`API Error: (${errorMessage}`, provider);
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

      fs.appendFileSync(
        path.resolve(process.cwd(), "apps/weather-service/logs/weather.log"),
        JSON.stringify(message) + "\n"
      );
    } catch (error) {
      throw new WeatherLogException(
        `Error logging to file: ${error as string}`
      );
    }
  }
}

export { FileLogger };
