const WEATHER_ERROR_MESSAGES = {
  INVALID_REQUEST: "Invalid request.",
  CITY_NOT_FOUND: "City not found.",
  API_REQUEST_FAILED: "API request failed.",
  PROVIDERS_NOT_AVAILABLE: "Providers not available.",
  API_ERROR: "No data returned from API",
} as const;

type WEATHER_ERROR_MESSAGES =
  (typeof WEATHER_ERROR_MESSAGES)[keyof typeof WEATHER_ERROR_MESSAGES];

export { WEATHER_ERROR_MESSAGES };
