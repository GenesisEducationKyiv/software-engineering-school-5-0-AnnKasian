import { SubscriptionDto } from "../types/types.js";

const SwaggerBody = {
  SUBSCRIBE: {
    type: SubscriptionDto,
    examples: {
      example: {
        value: {
          email: "example@example.com",
          city: "Kyiv",
          frequency: "hourly",
        },
      },
    },
  },
};

export { SwaggerBody };
