import { Frequency } from "../../../src/modules/subscription/enums/frequency.enum.js";
import { Subscription } from "../../../src/modules/subscription/types/types.js";

const SubscriptionMock = {
  responsefromRepository: {
    emailExist: new Subscription(
      "123e4567-e89b-12d3-a456-555555555",
      "exist@example.com",
      "Kyiv",
      Frequency.HOURLY,
      "123e4567-e89b-12d3-a456-555555555",
      false,
      new Date(),
      new Date()
    ),
    emailExistAndConfirmed: new Subscription(
      "123e4567-e89b-12d3-a456-88888888",
      "existandconfirm@example.com",
      "Kyiv",
      Frequency.HOURLY,
      "123e4567-e89b-12d3-a456-88888888",
      true,
      new Date(),
      new Date()
    ),
    emailNotExist: new Subscription(
      "123e4567-e89b-12d3-a456-99999999",
      "new@example.com",
      "Kyiv",
      Frequency.HOURLY,
      "123e4567-e89b-12d3-a456-99999999",
      false,
      new Date(),
      new Date()
    ),
    hourly: [
      {
        id: "123e4567-e89b-12d3-a456-555555555",
        email: "exist@example.com",
        token: "123e4567-e89b-12d3-a456-555555555",
        city: "Lviv",
        frequency: Frequency.HOURLY,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "123e4567-e89b-12d3-a456-88888888",
        email: "existandconfirm@example.com",
        token: "123e4567-e89b-12d3-a456-88888888",
        city: "Kyiv",
        frequency: Frequency.HOURLY,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "123e4567-e89b-12d3-a456-99999999",
        email: "new@example.com",
        token: "123e4567-e89b-12d3-a456-99999999",
        city: "Kyiv",
        frequency: Frequency.HOURLY,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    daily: [
      {
        id: "123e4567-e89b-12d3-a456-555555555",
        email: "exist@example.com",
        token: "123e4567-e89b-12d3-a456-555555555",
        city: "Lviv",
        frequency: Frequency.DAILY,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "123e4567-e89b-12d3-a456-88888888",
        email: "existandconfirm@example.com",
        token: "123e4567-e89b-12d3-a456-88888888",
        city: "Kyiv",
        frequency: Frequency.DAILY,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "123e4567-e89b-12d3-a456-99999999",
        email: "new@example.com",
        token: "123e4567-e89b-12d3-a456-99999999",
        city: "Kyiv",
        frequency: Frequency.DAILY,
        confirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },

  request: {
    emailExist: {
      email: "exist@example.com",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
    },
    emailExistAndConfirmed: {
      email: "existandconfirm@example.com",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
    },
    emailNotExist: {
      email: "new@example.com",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
    },
    invalidToken: "Invalid token",
  },

  response: {
    emailExist: {
      token: "123e4567-e89b-12d3-a456-555555555",
    },
    emailNotExist: {
      token: "123e4567-e89b-12d3-a456-99999999",
    },
  },
};

export { SubscriptionMock };
