import { Subscription } from "../../../../../shared/libs/types/types.js";
import {
  type SubscribeFilterType,
  type SubscriptionType,
} from "../types/types.js";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";

interface ISubscriptionRepository {
  create(data: SubscriptionType): Promise<Subscription>;
  save(data: Subscription): Promise<Subscription>;
  delete(id: string): Promise<void>;
  findByFrequency(frequency: Frequency): Promise<Subscription[]>;
  find({ email, token }: SubscribeFilterType): Promise<Subscription | null>;
}

export { type ISubscriptionRepository };
