import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { type NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT");

  if (!port) {
    throw new Error("PORT is not defined in the environment variables");
  }

  app.enableCors({
    origin: "*",
  });

  const config = new DocumentBuilder()
    .setTitle("Weather Forecast API")
    .setDescription(
      "Weather API application that allows users to subscribe to weather updates for their city."
    )
    .addTag("weather", "Weather forecast operations")
    .addTag("subscription", "Subscription management operations")
    .setVersion("1.0.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port);
}

await bootstrap();
