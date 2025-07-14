import {
  FrequencyProto,
  type SubscriptionProto,
} from "../../generated/email.js";
import { Frequency } from "../enums/enums.js";
import { Subscription } from "../types/types.js";

const frequencyMap: Record<FrequencyProto, Frequency> = {
  [FrequencyProto.hourly]: Frequency.HOURLY,
  [FrequencyProto.daily]: Frequency.DAILY,
};

const MapSubscriptionToDomainFromProto = (
  proto: SubscriptionProto
): Subscription => {
  return new Subscription(
    proto.id,
    proto.email,
    proto.city,
    frequencyMap[proto.frequency as FrequencyProto],
    proto.token,
    proto.confirmed || false,
    new Date(proto.createdAt),
    new Date(proto.updatedAt)
  );
};

export { MapSubscriptionToDomainFromProto };
