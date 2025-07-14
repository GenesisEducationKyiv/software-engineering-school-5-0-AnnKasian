import { type Frequency } from "../../../../../shared/libs/enums/enums.js";

type SubscriptionType = {
  email: string;
  city: string;
  frequency: Frequency;
  confirmed?: boolean;
};

export { type SubscriptionType };
