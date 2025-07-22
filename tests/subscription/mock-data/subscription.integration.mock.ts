import { Frequency } from "../../../src/modules/subscription/enums/enums.js";
import { Subscription } from "../../../src/modules/subscription/types/types.js";

const SubscriptionIntegrationMock = {
  newData: {
    newSubscription: new Subscription(
      "123e4567-e89b-12d3-a456-426614174000",
      "new@example.com",
      "Kyiv",
      Frequency.HOURLY,
      "123e4567-e89b-12d3-a456-426614174000",
      false,
      new Date(),
      new Date()
    ),
    newDtoSubscription: {
      email: "new@example.com",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
      confirmed: false,
    },
    newSubscriptionDaily: new Subscription(
      "123e4567-e89b-12d3-a456-426614174010",
      "daily@example.com",
      "Kyiv",
      Frequency.DAILY,
      "123e4567-e89b-12d3-a456-426614174010",
      false,
      new Date(),
      new Date()
    ),
    invalidData: {
      email: "new@example.com",
      city: 55,
      frequency: Frequency.HOURLY,
      confirmed: false,
    },
    invalidToken: {
      token: "invalid-token",
    },
    invalidSubscriptionToConfirm: new Subscription(
      "123e4567-e89b-12d3-a456-426614174000",
      "ffff",
      "Kyiv",
      Frequency.HOURLY,
      "123e4567-e89b-12d3-a456-426614174000",
      false,
      new Date(),
      new Date()
    ),
    newSubscriptionEntity: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      email: "new@example.com",
      token: "123e4567-e89b-12d3-a456-426614174000",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

export { SubscriptionIntegrationMock };
