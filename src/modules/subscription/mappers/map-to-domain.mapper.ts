import { type SubscriptionEntity } from "../entities/entities.js";
import { Subscription } from "../types/types.js";

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
