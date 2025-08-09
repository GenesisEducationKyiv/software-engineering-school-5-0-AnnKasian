import path from "path";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";
import { HandleErrorMiddleware } from "../../../shared/libs/middlewares/middlewares.js";
import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          package: "email",
          protoPath: path.join(process.cwd(), "shared/proto/email.proto"),
          url: `${process.env[CONFIG_KEYS.EMAIL_SERVICE_HOST]}:${
            process.env[CONFIG_KEYS.GRPC_EMAIL_SERVICE_PORT]
          }`,
        },
      }
    );

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HandleErrorMiddleware());
    await app.listen();
  } catch (error: unknown) {
    throw new Error(`Failed to start microservice: ${error as string}`);
  }
}

await bootstrap();
