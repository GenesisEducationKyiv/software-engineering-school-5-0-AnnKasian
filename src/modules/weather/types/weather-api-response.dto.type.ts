type WeatherApiResponseDto = {
  current?: {
    temp_c: number;
    condition: {
      text: string;
    };
    humidity?: number;
  };
};

export { type WeatherApiResponseDto };
