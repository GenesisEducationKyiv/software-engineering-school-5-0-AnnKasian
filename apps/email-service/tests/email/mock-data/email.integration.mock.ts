import { Frequency } from "../../../../../shared/libs/enums/enums.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";

const EmailIntegrationMock = {
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
  },
  weather: { temperature: 20, humidity: 50, description: "Sunny" },
  emailData: { confirm: "Confirm", regular: "Weather in" },
};

export { EmailIntegrationMock };
