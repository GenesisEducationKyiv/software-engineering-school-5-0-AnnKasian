import { type SubscriptionProto } from "../../generated/email.js";
import { Subscription } from "../types/types.js";

const MapSubscriptionToDomainFromProto = (
  proto: SubscriptionProto
): Subscription => {
  return new Subscription(
    proto.id,
    proto.email,
    proto.city,
    proto.frequency,
    proto.token,
    proto.confirmed || false,
    new Date(proto.createdAt),
    new Date(proto.updatedAt)
  );
};

export { MapSubscriptionToDomainFromProto };
