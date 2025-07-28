import { type Frequency } from "../enums/enums.js";

type SubscriptionType = {
  email: string;
  city: string;
  frequency: Frequency;
  confirmed?: boolean;
};

export { type SubscriptionType };
