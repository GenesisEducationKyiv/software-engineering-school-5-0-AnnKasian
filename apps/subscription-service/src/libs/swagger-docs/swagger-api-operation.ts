const SwaggerOperation = {
  SUBSCRIBE: {
    summary: "Subscribe to weather updates",
    description:
      "Subscribe an email to receive weather updates for a specific city with chosen frequency.",
  },
  CONFIRM: {
    summary: "Confirm email subscription",
    description:
      "Confirms a subscription using the token sent in the confirmation email.",
  },
  UNSUBSCRIBE: {
    summary: "Unsubscribe from weather updates",
    description:
      "Unsubscribes an email from weather updates using the token sent in emails.",
  },
};

export { SwaggerOperation };
