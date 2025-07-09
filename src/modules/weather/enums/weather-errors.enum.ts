const WeatherErrors = {
  CITY_NOT_FOUND: "City not found",
  API_ERROR: "No data returned from API",
  API_REQUEST_FAILED: "API request failed",
  PROVIDERS_NOT_AVAILABLE: "No weather providers available",
} as const;

type WeatherErrors = (typeof WeatherErrors)[keyof typeof WeatherErrors];

export { WeatherErrors };
