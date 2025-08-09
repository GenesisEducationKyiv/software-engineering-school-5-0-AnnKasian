type SamplingConfig = {
  enabled: boolean;
  rates: {
    debug: number;
    info: number;
    warn: number;
    error: number;
  };
  rules: {
    alwaysLogErrors: boolean;
    alwaysLogFirstInTrace: number;
    excludeKeywords: string[];
  };
};

export { type SamplingConfig };
