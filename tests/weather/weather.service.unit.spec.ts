import { Test } from "@nestjs/testing";
import { WeatherService } from "../../src/modules/weather/weather.js";
import { type WeatherDto } from "../../src/modules/weather/types/dtos/weather.dto.type.js";
import { WeatherMock } from "./mock-data/mock-data.js";
import { WEATHER_INJECTION_TOKENS } from "../../src/modules/weather/enums/weather-injection-tokens.enum.js";
import { CityNotFoundException } from "../../src/modules/weather/exceptions/exceptions.js";

describe("WeatherService", () => {
  let weatherService: WeatherService;

  const mockWeatherRepository = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: WEATHER_INJECTION_TOKENS.WEATHER_REPOSITORY,
          useValue: mockWeatherRepository,
        },
      ],
    }).compile();

    weatherService = moduleRef.get(WeatherService);
  });

  describe("get", () => {
    test("should return an object with data from the weather service (temperature, humidity, description)", async () => {
      const weather: WeatherDto = WeatherMock.response;

      mockWeatherRepository.get.mockResolvedValue(weather);

      expect(
        await weatherService.get({ city: WeatherMock.request.corectCity })
      ).toEqual(weather);
      expect(mockWeatherRepository.get).toHaveBeenCalledWith(
        WeatherMock.request.corectCity
      );
    });
  });

  test("should throw NotFoundException if city not found", async () => {
    mockWeatherRepository.get.mockRejectedValue(new CityNotFoundException());

    await expect(
      weatherService.get({ city: WeatherMock.request.wrongCity })
    ).rejects.toThrow(CityNotFoundException);
  });
});
