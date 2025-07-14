import {
  FrequencyProto,
  type SubscriptionProto,
} from "../../generated/email.js";
import { type Frequency } from "../enums/enums.js";
import { Subscription } from "../types/types.js";

function mapFrequency(protoFreq: unknown): Frequency {
  if (
    protoFreq !== FrequencyProto.daily &&
    protoFreq !== FrequencyProto.hourly
  ) {
    throw new Error(`Invalid frequency: ${protoFreq as string}`);
  }

  return protoFreq as Frequency;
}

const MapSubscriptionToDomainFromProto = (
  proto: SubscriptionProto
): Subscription => {
  return new Subscription(
    proto.id,
    proto.email,
    proto.city,
    mapFrequency(proto.frequency),
    proto.token,
    proto.confirmed || false,
    new Date(proto.createdAt),
    new Date(proto.updatedAt)
  );
};

export { MapSubscriptionToDomainFromProto };
