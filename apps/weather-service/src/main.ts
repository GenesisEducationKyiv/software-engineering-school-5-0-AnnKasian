import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { type NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module.js";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import path from "path";

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    const httpPort = configService.get<number>(
      CONFIG_KEYS.HTTP_WEATHER_SERVICE_PORT
    );
    const grpcPort = configService.get<number>(
      CONFIG_KEYS.GRPC_WEATHER_SERVICE_PORT
    );

    if (!httpPort) {
      throw new Error(
        "WEATHER_SERVICE_PORT is not defined in the environment variables"
      );
    }

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: "weather",
        protoPath: path.join(process.cwd(), "shared/proto/weather.proto"),
        url: `weather-service:${grpcPort}`,
      },
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.startAllMicroservices();
    await app.listen(httpPort);
  } catch (error) {
    console.error("Failed to start services:", error);
    process.exit(1);
  }
}

await bootstrap();
