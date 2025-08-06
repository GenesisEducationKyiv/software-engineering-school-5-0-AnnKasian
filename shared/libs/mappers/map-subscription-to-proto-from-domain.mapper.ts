import {
  FrequencyProto,
  type SubscriptionProto,
} from "../../generated/email.js";
import { Frequency } from "../enums/enums.js";
import { type Subscription } from "../types/types.js";

const frequencyMap: Record<Frequency, FrequencyProto> = {
  [Frequency.HOURLY]: FrequencyProto.hourly,
  [Frequency.DAILY]: FrequencyProto.daily,
};

const MapSubscriptionToProtoFromDomain = (
  subscription: Subscription
): SubscriptionProto => {
  return {
    id: subscription.id,
    email: subscription.email,
    city: subscription.city,
    frequency: frequencyMap[subscription.frequency],
    token: subscription.token,
    confirmed: subscription.confirmed,
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString(),
  };
};

export { MapSubscriptionToProtoFromDomain };
