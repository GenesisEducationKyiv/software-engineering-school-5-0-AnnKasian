import { ErrorDto, MessageDto } from "../types/types.js";

const SwaggerResponse = {
  SUBSCRIPTION_SUCCESSFUL: {
    status: 200,
    description: "Subscription successful. Confirmation email sent.",
  },
  SUBSCRIPTION_FAILED: {
    status: 400,
    description: "Invalid input.",
    type: ErrorDto,
  },
  SUBSCRIPTION_ALREADY_EXISTS: {
    status: 409,
    description: "Email already subscribed.",
    type: ErrorDto,
  },
  CONFIRMED_SUCCESSFULLY: {
    status: 200,
    description: "Subscription confirmed successfully.",
    type: MessageDto,
  },
  UNSUBSCRIBED_SUCCESSFULLY: {
    status: 200,
    description: "Subscription unsubscribed successfully.",
    type: MessageDto,
  },
  INVALID_TOKEN: {
    status: 400,
    description: "Invalid token.",
    type: ErrorDto,
  },
  TOKEN_NOT_FOUND: {
    status: 404,
    description: "Token not found.",
    type: ErrorDto,
  },
};

export { SwaggerResponse };
