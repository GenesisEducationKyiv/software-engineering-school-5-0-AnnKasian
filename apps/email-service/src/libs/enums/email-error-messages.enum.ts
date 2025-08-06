const EMAIL_ERROR_MESSAGES = {
  EMAIL_SEND_FAILED: "Failed to send email.",
  DATA_IS_REQUIRED: "Data is required.",
  WEATHER_SERVICE_ERROR: "Weather service error.",
  MESSAGE_BROKER_ERROR: "Message broker error.",
  MESSAGE_IS_NULL_OR_UNDEFINED: "Message value is null or undefined",
  MESSAGE_HAS_NO_VALUE: "Message value is empty",
} as const;

export { EMAIL_ERROR_MESSAGES };
