import request from "supertest";
import { Test, type TestingModule } from "@nestjs/testing";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { type App } from "supertest/types";
import { HttpModule } from "@nestjs/axios";
import { WeatherModule } from "../../src/modules/weather/weather.module.js";
import { WeatherE2eMock } from "./mock-data/weather.e2e.mock.js";
import { WeatherDto } from "../../src/modules/weather/types/types.js";

describe("Weather Integration", () => {
  let app: INestApplication<App>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        WeatherModule,
        HttpModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();
  });

  afterAll(async () => {
    await module.close();
    await app.close();
  });

  describe("/GET weather", () => {
    it("should get weather data for valid city", async () => {
      const response = await request(app.getHttpServer())
        .get("/weather")
        .query({ city: WeatherE2eMock.validCity })
        .expect(200);

      expect(response.body).not.toBeNull();
      expect(response.body).toMatchObject({ ...WeatherDto });
    });

    it("should return error for invalid city", async () => {
      const response = await request(app.getHttpServer())
        .get("/weather")
        .query({ city: WeatherE2eMock.invalidCity })
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: expect.any(String),
      });
    });

    it("should return error for missing city parameter", async () => {
      const response = await request(app.getHttpServer())
        .get("/weather")
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(Array),
      });
    });
  });
});
