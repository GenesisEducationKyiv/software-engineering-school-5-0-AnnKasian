import { WeatherRepository } from "../../src/modules/weather/weather.repository.js";
import { Test, type TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import nock from "nock";
import { WeatherMock } from "./mock-data/weather-service.mock.js";
import { HttpModule } from "@nestjs/axios";
import { HttpException } from "@nestjs/common";

describe("WeatherRepository  Integration Tests", () => {
  let module: TestingModule;
  let repository: WeatherRepository;
  let server: nock.Scope;

  beforeAll(async () => {
    const TEST_API_URL = "https://api.weatherapi/current";
    const TEST_API_KEY = "test-api-key";

    process.env.API_URL = TEST_API_URL;
    process.env.API_KEY = TEST_API_KEY;
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        HttpModule,
      ],
      providers: [WeatherRepository],
    }).compile();

    repository = module.get<WeatherRepository>(WeatherRepository);
  });

  beforeEach(() => {
    server = nock("https://api.weatherapi");
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.restore();
    await module.close();
    delete process.env.API_URL;
    delete process.env.API_KEY;
  });

  describe("get", () => {
    let handler: nock.Interceptor;

    beforeEach(() => {
      handler = server.get("/current");
    });

    it("should get weather data for city", async () => {
      handler
        .query({
          key: WeatherMock.request.key,
          q: WeatherMock.request.corectCity,
        })
        .reply(200, WeatherMock.apiResponse);

      const result = await repository.get(WeatherMock.request.corectCity);
      expect(result).toEqual(WeatherMock.response);
    });

    it("should return null when city not found", async () => {
      handler
        .query({
          key: WeatherMock.request.key,
          q: WeatherMock.request.wrongCity,
        })
        .reply(400, { error: { code: 1006, message: expect.any(String) } });

      const result = await repository.get(WeatherMock.request.wrongCity);
      expect(result).toBeNull();
    });

    it("should throw HttpException if serwer is not responding", async () => {
      handler
        .query({
          key: WeatherMock.request.key,
          q: WeatherMock.request.corectCity,
        })
        .reply(500, { error: { code: 500, message: expect.any(String) } });

      await expect(
        repository.get(WeatherMock.request.corectCity)
      ).rejects.toThrow(HttpException);
    });
  });
});
