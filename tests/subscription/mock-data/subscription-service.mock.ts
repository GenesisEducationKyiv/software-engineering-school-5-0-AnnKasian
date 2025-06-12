import { Frequency } from "../../../src/modules/subscription/enums/frequency.enum.js";

const subscriptionMock = {
  responsefromRepository: {
    emailExist: {
      id: "123e4567-e89b-12d3-a456-555555555",
      email: "exist@example.com",
      token: "123e4567-e89b-12d3-a456-555555555",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    emailExistAndConfirmed: {
      id: "123e4567-e89b-12d3-a456-88888888",
      email: "existandconfirm@example.com",
      token: "123e4567-e89b-12d3-a456-88888888",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
      confirmed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    emailNotExist: {
      id: "123e4567-e89b-12d3-a456-99999999",
      email: "new@example.com",
      token: "123e4567-e89b-12d3-a456-99999999",
      city: "Kyiv",
      frequency: Frequency.HOURLY,
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    frequency: [
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
    tokenConfirm: {
      token: "123e4567-e89b-12d3-a456-88888888",
    },
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

export { subscriptionMock };
