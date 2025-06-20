import { type SubscriptionEntity } from "../entities/entities.js";
import { type Frequency } from "../enums/enums.js";
import {
  type SubscribeFilterDto,
  type SubscriptionDto,
} from "../types/types.js";

interface ISubscriptionRepository {
  create(data: SubscriptionDto): Promise<SubscriptionEntity>;
  confirm(subscription: SubscriptionEntity): Promise<void>;
  delete(id: string): Promise<void>;
  findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]>;
  find({
    email,
    token,
  }: SubscribeFilterDto): Promise<SubscriptionEntity | null>;
}

export { type ISubscriptionRepository };
