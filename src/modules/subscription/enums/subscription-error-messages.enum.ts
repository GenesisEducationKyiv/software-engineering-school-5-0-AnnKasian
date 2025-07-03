const SUBSCRIPTION_ERROR_MESSAGES = {
  EMAIL_SEND_FAILED: "Failed to send subscription email.",
  INVALID_INPUT: "Invalid input.",
  EMAIL_ALREADY_EXISTS: "Email already subscribed.",
  SUBSCRIPTION_ALREADY_CONFIRMED: "Subscription already confirmed.",
  TOKEN_NOT_FOUND: "Token not found.",
  INVALID_TOKEN: "Invalid token.",
} as const;

export { SUBSCRIPTION_ERROR_MESSAGES };
