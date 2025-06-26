import {
  type WeatherAdapter,
  type WeatherApiResponseDto,
  type WeatherDto,
} from "../types/types.js";

const weatherApiAdapter: WeatherAdapter<WeatherApiResponseDto> = {
  buildParams: (city: string, apiKey: string) => ({
    key: apiKey,
    q: city,
  }),

  parseResponse: (data: WeatherApiResponseDto): WeatherDto => {
    return {
      description: data.current?.condition?.text,
      humidity: data.current?.humidity,
      temperature: data.current?.temp_c,
    };
  },
};

export { weatherApiAdapter };
