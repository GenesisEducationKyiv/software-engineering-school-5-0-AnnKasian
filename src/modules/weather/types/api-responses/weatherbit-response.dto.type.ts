type WeatherbitResponseDto = {
  data?: [
    {
      temp: number;
      weather?: {
        description: string;
      };
      rh?: number;
    }
  ];
};

export { type WeatherbitResponseDto };
