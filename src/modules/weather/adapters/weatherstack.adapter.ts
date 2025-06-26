import {
  type WeatherAdapter,
  type WeatherstackResponseDto,
  type WeatherDto,
} from "../types/types.js";

const weatherstackAdapter: WeatherAdapter<WeatherstackResponseDto> = {
  buildParams: (city: string, apiKey: string) => ({
    access_key: apiKey,
    query: city,
  }),

  parseResponse: (data: WeatherstackResponseDto): WeatherDto => {
    if (data.success === false) {
      throw new Error(data.error?.info);
    }

    return {
      description: data.current?.weather_descriptions[0],
      humidity: data.current?.humidity,
      temperature: data.current?.temperature,
    };
  },
};

export { weatherstackAdapter };
