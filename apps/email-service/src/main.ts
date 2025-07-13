import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import path from "path";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap(): Promise<void> {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.GRPC,
        options: {
          package: "email",
          protoPath: path.join(process.cwd(), "shared/proto/email.proto"),
          url: `email-service:${process.env.GRPC_EMAIL_SERVICE_PORT}`,
        },
      }
    );

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.listen();
  } catch (error) {
    console.error("Failed to start microservice:", error);
    process.exit(1);
  }
}

await bootstrap();
