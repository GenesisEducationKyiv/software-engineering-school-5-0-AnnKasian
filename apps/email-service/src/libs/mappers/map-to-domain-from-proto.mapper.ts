import { Subscription } from "../../../../../shared/libs/types/types.js";
import { SubscriptionProto } from "../../../generated/email.js";

const MapToDomainFromProto = (proto: SubscriptionProto): Subscription => {
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

export { MapToDomainFromProto };
