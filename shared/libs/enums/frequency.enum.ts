const Frequency = {
  HOURLY: "hourly",
  DAILY: "daily",
} as const;

type Frequency = (typeof Frequency)[keyof typeof Frequency];

export { Frequency };
