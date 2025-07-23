import { Subscription } from "../../../../../shared/libs/types/types.js";
import { type SubscriptionEntity } from "../../modules/subscription/entities/entities.js";

const MapToDomain = (entity: SubscriptionEntity): Subscription => {
  return new Subscription(
    entity.id,
    entity.email,
    entity.city,
    entity.frequency,
    entity.token,
    entity.confirmed || false,
    entity.createdAt,
    entity.updatedAt
  );
};

export { MapToDomain };
