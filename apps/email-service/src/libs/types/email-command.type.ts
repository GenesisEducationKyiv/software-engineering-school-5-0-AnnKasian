import { type Subscription } from "../../../../../shared/libs/types/types.js";
import { type EmailCommandTypes } from "../enums/enums.js";

type EmailConfirmationCommand = {
  type: typeof EmailCommandTypes.emailConfirmation;
  subscription: Subscription;
};

type WeatherEmailCommand = {
  type: typeof EmailCommandTypes.weatherEmail;
  subscriptions: Subscription[];
};

type BatchEmailCommand = {
  type: typeof EmailCommandTypes.batchEmail;
  subscriptions: Subscription[];
};

type EmailCommand =
  | EmailConfirmationCommand
  | WeatherEmailCommand
  | BatchEmailCommand;

export {
  type EmailCommand,
  type EmailConfirmationCommand,
  type WeatherEmailCommand,
  type BatchEmailCommand,
};
