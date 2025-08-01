const EmailCommandTypes = {
  emailConfirmation: "EMAIL_CONFIRMATION",
  weatherEmail: "WEATHER_EMAIL",
  batchEmail: "BATCH_EMAIL",
} as const;

type EmailCommandTypes =
  (typeof EmailCommandTypes)[keyof typeof EmailCommandTypes];

export { EmailCommandTypes };
