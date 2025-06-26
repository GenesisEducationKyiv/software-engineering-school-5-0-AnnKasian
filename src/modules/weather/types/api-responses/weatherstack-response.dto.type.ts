type WeatherstackResponseDto = {
  current?: {
    temperature: number;
    weather_descriptions: string[];
    humidity?: number;
  };
  success?: boolean;
  error?: {
    info: string;
  };
};

export { type WeatherstackResponseDto };
