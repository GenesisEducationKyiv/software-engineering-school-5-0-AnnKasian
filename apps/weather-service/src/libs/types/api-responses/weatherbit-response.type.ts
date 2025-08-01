type WeatherbitResponseType = {
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

export { type WeatherbitResponseType };
