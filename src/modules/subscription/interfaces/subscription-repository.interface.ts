import { type Frequency } from "../enums/enums.js";
import {
  type Subscription,
  type SubscribeFilterType,
  type SubscriptionType,
} from "../types/types.js";

interface ISubscriptionRepository {
  create(data: SubscriptionType): Promise<Subscription>;
  save(data: Subscription): Promise<Subscription>;
  delete(id: string): Promise<void>;
  findByFrequency(frequency: Frequency): Promise<Subscription[]>;
  find({ email, token }: SubscribeFilterType): Promise<Subscription | null>;
}

export { type ISubscriptionRepository };
