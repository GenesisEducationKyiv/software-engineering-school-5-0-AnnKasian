type WeatherstackResponseType = {
  current?: {
    temperature: number;
    weather_descriptions: string[];
    humidity?: number;
  };
  success?: boolean;
  error?: {
    code: number;
    info: string;
  };
};

export { type WeatherstackResponseType };
