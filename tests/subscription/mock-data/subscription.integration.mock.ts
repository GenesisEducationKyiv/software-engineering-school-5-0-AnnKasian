import { Frequency } from "../../../src/modules/subscription/enums/frequency.enum.js";

const SubscriptionIntegrationMock = {
  newData: {
    newSubscription: {
      email: "new@example.com",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
      confirmed: false,
    },
    newSubscriptionDaily: {
      email: "daily@example.com",
      city: "Lviv",
      frequency: Frequency.DAILY,
      confirmed: false,
    },
    subscriptionToConfirm: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      email: "new@example.com",
      token: "123e4567-e89b-12d3-a456-426614174000",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    invalidData: {
      email: "new@example.com",
      city: 55,
      frequency: Frequency.HOURLY,
      confirmed: false,
    },
    invalidToken: {
      token: "invalid-token",
    },
  },
};

export { SubscriptionIntegrationMock };
