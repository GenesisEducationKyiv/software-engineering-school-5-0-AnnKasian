const SUBSCRIPTION_ERROR_MESSAGES = {
  INVALID_INPUT: "Invalid input.",
  EMAIL_ALREADY_EXISTS: "Email already subscribed.",
  SUBSCRIPTION_ALREADY_CONFIRMED: "Subscription already confirmed.",
  TOKEN_NOT_FOUND: "Token not found.",
  INVALID_TOKEN: "Invalid token.",
  EMAIL_SERVICE_ERROR: "Email service error.",
  VALIDATION_EXCEPTION: "Validation failed.",
} as const;

export { SUBSCRIPTION_ERROR_MESSAGES };
