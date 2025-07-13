import { SubscriptionEntity } from "../../modules/subscription/entities/entities.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";

const MapToEntity = (domain: Subscription): SubscriptionEntity => {
  return new SubscriptionEntity({
    id: domain.id,
    email: domain.email,
    city: domain.city,
    frequency: domain.frequency,
    token: domain.token,
    confirmed: domain.confirmed,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
  });
};

export { MapToEntity };
