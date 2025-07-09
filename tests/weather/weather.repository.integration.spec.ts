import { type Cache } from "cache-manager";
import nock from "nock";
import { HttpModule, HttpService } from "@nestjs/axios";
import { CACHE_MANAGER, CacheModule } from "@nestjs/cache-manager";
import { ConfigModule } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import {
  WEATHER_INJECTION_TOKENS,
  WEATHER_PROVIDERS_ERROR_CODES,
} from "../../src/modules/weather/enums/enums.js";
import {
  CityNotFoundException,
  NotAvailableException,
} from "../../src/modules/weather/exceptions/exceptions.js";
import {
  FileLogger,
  WeatherErrorHandler,
} from "../../src/modules/weather/helpers/helpers.js";
import { type IWeatherProvider } from "../../src/modules/weather/interfaces/interfaces.js";
import {
  WeatherApiProvider,
  WeatherbitProvider,
  WeatherstackProvider,
} from "../../src/modules/weather/providers/providers.js";
import { WeatherRepository } from "../../src/modules/weather/weather.repository.js";
import { TestRedisConfig } from "../test-redis.config.js";
import { WeatherMock } from "./mock-data/weather-service.mock.js";

describe("WeatherRepository  Integration Tests", () => {
  let module: TestingModule;
  let repository: WeatherRepository;
  let weatherApiServer: nock.Scope;
  let weatherbitServer: nock.Scope;
  let weatherstackServer: nock.Scope;

  const cacheTTL = 60;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.registerAsync({ ...TestRedisConfig, isGlobal: true }),
        HttpModule,
      ],

      providers: [
        {
          provide: WEATHER_INJECTION_TOKENS.FILE_LOGGER,
          useClass: FileLogger,
        },
        {
          provide: WeatherErrorHandler,
          useFactory: (logger: FileLogger) => {
            return new WeatherErrorHandler(logger);
          },
          inject: [WEATHER_INJECTION_TOKENS.FILE_LOGGER],
        },
        {
          provide: WEATHER_INJECTION_TOKENS.WEATHER_API_PROVIDER,
          useFactory: (
            httpService: HttpService,
            fileLogger: FileLogger,
            weatherErrorHandler: WeatherErrorHandler
          ) => {
            return new WeatherApiProvider(
              httpService,
              {
                apiUrl: "https://api.weatherapi/current",
                apiKey: WeatherMock.request.weatherApiKey,
              },
              weatherErrorHandler,
              fileLogger
            );
          },
          inject: [
            HttpService,
            WEATHER_INJECTION_TOKENS.FILE_LOGGER,
            WeatherErrorHandler,
          ],
        },
        {
          provide: WEATHER_INJECTION_TOKENS.WEATHERBIT_PROVIDER,
          useFactory: (
            httpService: HttpService,
            fileLogger: FileLogger,
            weatherErrorHandler: WeatherErrorHandler
          ) => {
            return new WeatherbitProvider(
              httpService,
              {
                apiUrl: "https://api.weatherbit/current",
                apiKey: WeatherMock.request.weatherbitKey,
              },
              weatherErrorHandler,
              fileLogger
            );
          },
          inject: [
            HttpService,
            WEATHER_INJECTION_TOKENS.FILE_LOGGER,
            WeatherErrorHandler,
          ],
        },
        {
          provide: WEATHER_INJECTION_TOKENS.WEATHERSTACK_PROVIDER,
          useFactory: (
            httpService: HttpService,
            fileLogger: FileLogger,
            weatherErrorHandler: WeatherErrorHandler
          ) => {
            return new WeatherstackProvider(
              httpService,
              {
                apiUrl: "https://api.weatherstack/current",
                apiKey: WeatherMock.request.weatherstackKey,
              },
              weatherErrorHandler,
              fileLogger
            );
          },
          inject: [
            HttpService,
            WEATHER_INJECTION_TOKENS.FILE_LOGGER,
            WeatherErrorHandler,
          ],
        },
        {
          provide: WEATHER_INJECTION_TOKENS.WEATHER_REPOSITORY,
          useFactory: (
            weatherApiProvider: IWeatherProvider,
            weatherbitProvider: IWeatherProvider,
            weatherstackProvider: IWeatherProvider,
            cacheManager: Cache
          ) => {
            weatherApiProvider
              .setNext(weatherbitProvider)
              .setNext(weatherstackProvider);

            return new WeatherRepository(
              weatherApiProvider,
              cacheManager,
              cacheTTL
            );
          },
          inject: [
            WEATHER_INJECTION_TOKENS.WEATHER_API_PROVIDER,
            WEATHER_INJECTION_TOKENS.WEATHERBIT_PROVIDER,
            WEATHER_INJECTION_TOKENS.WEATHERSTACK_PROVIDER,
            CACHE_MANAGER,
          ],
        },
      ],
    }).compile();

    repository = module.get<WeatherRepository>(
      WEATHER_INJECTION_TOKENS.WEATHER_REPOSITORY
    );
  });

  beforeEach(() => {
    weatherApiServer = nock("https://api.weatherapi");
    weatherbitServer = nock("https://api.weatherbit");
    weatherstackServer = nock("https://api.weatherstack");
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.restore();
    await module.close();
  });

  describe("get", () => {
    let weatherApiHandler: nock.Interceptor;
    let weatherbitHandler: nock.Interceptor;
    let weatherstackHandler: nock.Interceptor;

    beforeEach(() => {
      weatherApiHandler = weatherApiServer.get("/current");
      weatherbitHandler = weatherbitServer.get("/current");
      weatherstackHandler = weatherstackServer.get("/current");
    });

    it("should get weather from first provider (WeatherAPI)", async () => {
      weatherApiHandler
        .query({
          key: WeatherMock.request.weatherApiKey,
          q: WeatherMock.request.corectCity,
        })
        .reply(200, WeatherMock.weatherApiResponse);

      const result = await repository.get(WeatherMock.request.corectCity);
      expect(result).toEqual(WeatherMock.response);
    });

    it("should fallback to second provider when first fails", async () => {
      weatherApiHandler
        .query({
          key: WeatherMock.request.wrongWeatherApiKey,
          q: WeatherMock.request.corectCity,
        })
        .reply(401);

      weatherbitHandler
        .query({
          key: WeatherMock.request.weatherbitKey,
          q: WeatherMock.request.corectCity,
        })
        .reply(200, WeatherMock.weatherbitResponse);

      const result = await repository.get(WeatherMock.request.corectCity);
      expect(result).toEqual(WeatherMock.response);
    });

    it("should fallback to third provider when first two fail", async () => {
      weatherApiHandler
        .query({
          key: WeatherMock.request.wrongWeatherApiKey,
          q: WeatherMock.request.corectCity,
        })
        .reply(401);

      weatherbitHandler
        .query({
          key: WeatherMock.request.wrongWeatherbitKey,
          q: WeatherMock.request.corectCity,
        })
        .reply(403);

      weatherstackHandler
        .query({
          access_key: WeatherMock.request.weatherstackKey,
          query: WeatherMock.request.corectCity,
        })
        .reply(200, WeatherMock.weatherstackResponse);

      const result = await repository.get(WeatherMock.request.corectCity);
      expect(result).toEqual(WeatherMock.response);
    });

    it("should  throw HttpException when all providers return 400 (city not found)", async () => {
      weatherApiHandler
        .query({
          key: WeatherMock.request.weatherApiKey,
          q: WeatherMock.request.wrongCity,
        })
        .reply(400, {
          error: { code: expect.any(Number), message: expect.any(String) },
        });

      weatherbitHandler
        .query({
          key: WeatherMock.request.weatherbitKey,
          q: WeatherMock.request.wrongCity,
        })
        .reply(400, { error: expect.any(String) });

      weatherstackHandler
        .query({
          access_key: WeatherMock.request.weatherstackKey,
          query: WeatherMock.request.wrongCity,
        })
        .reply(200, {
          success: false,
          error: {
            code: WEATHER_PROVIDERS_ERROR_CODES.WEATHERSTACK_CITY_NOT_FOUND,
            info: expect.any(String),
          },
        });

      await expect(
        repository.get(WeatherMock.request.wrongCity)
      ).rejects.toThrow(CityNotFoundException);
    });

    it("should throw HttpException if all servers are not responding", async () => {
      weatherApiHandler
        .query({
          key: WeatherMock.request.wrongWeatherApiKey,
          q: WeatherMock.request.corectCity,
        })
        .reply(500, {
          error: { code: expect.any(Number), message: expect.any(String) },
        });

      weatherbitHandler
        .query({
          key: WeatherMock.request.wrongWeatherApiKey,
          q: WeatherMock.request.corectCity,
        })
        .reply(500, { error: expect.any(String) });

      weatherstackHandler
        .query({
          access_key: WeatherMock.request.wrongWeatherstackKey,
          query: WeatherMock.request.wrongCity,
        })
        .reply(200, { success: false, error: expect.any(Object) });

      await expect(
        repository.get(WeatherMock.request.corectCity)
      ).rejects.toThrow(NotAvailableException);
    });
  });
});
