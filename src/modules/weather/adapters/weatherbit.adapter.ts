import {
  type WeatherAdapter,
  type WeatherbitResponseDto,
  type WeatherDto,
} from "../types/types.js";

const weatherbitAdapter: WeatherAdapter<WeatherbitResponseDto> = {
  buildParams: (city: string, apiKey: string) => ({
    key: apiKey,
    q: city,
  }),

  parseResponse: (data: WeatherbitResponseDto): WeatherDto => {
    return {
      description: data.data?.[0].weather?.description,
      humidity: data.data?.[0].rh,
      temperature: data.data?.[0].temp,
    };
  },
};

export { weatherbitAdapter };
