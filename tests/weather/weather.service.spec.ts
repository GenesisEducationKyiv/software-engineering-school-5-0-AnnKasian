import { Test } from "@nestjs/testing";
import { WeatherService } from "../../src/modules/weather/weather.js";
import { type WeatherDto } from "../../src/modules/weather/types/weather.dto.type.js";
import { weatherMock } from "./mock-data/mock-data.js";
import { NotFoundException } from "@nestjs/common";
import { WeatherRepository } from "../../src/modules/weather/weather.repository.js";

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
          provide: WeatherRepository,
          useValue: mockWeatherRepository,
        },
      ],
    }).compile();
    weatherService = moduleRef.get(WeatherService);
  });

  describe("get", () => {
    test("should return an object with data from the weather service (temperature, humidity, description)", async () => {
      const weather: WeatherDto = weatherMock.response;

      mockWeatherRepository.get.mockResolvedValue(weather);

      expect(await weatherService.get(weatherMock.request.corectCity)).toEqual(
        weather
      );
      expect(mockWeatherRepository.get).toHaveBeenCalledWith(
        weatherMock.request.corectCity
      );
    });
  });

  test("should throw NotFoundException if city not found", async () => {
    mockWeatherRepository.get.mockRejectedValue(new Error("error"));

    await expect(
      weatherService.get(weatherMock.request.wrongCity)
    ).rejects.toThrow(NotFoundException);
  });
});
