import { Frequency } from "../../../../../shared/libs/enums/enums.js";

const SubscriptionE2eMock = {
  newSubscription: {
    email: "new@example.com",
    city: "Kyiv",
    frequency: Frequency.HOURLY,
    confirmed: false,
  },
  token: "123e4567-e89b-12d3-a456-426614174000",
  invalidData: {
    email: "new@example.com",
    city: 55,
    frequency: Frequency.HOURLY,
    confirmed: false,
  },
  invalidToken: "invalid-token",
  emailHeaders: {
    subject: "Subject",
  },
};

export { SubscriptionE2eMock };
