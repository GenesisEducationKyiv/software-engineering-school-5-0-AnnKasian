import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SubscriptionEntity } from "./entities/entities.js";
import { SubscriptionDto, SubscribeFilterDto } from "./types/types.js";
import { Frequency } from "./enums/enums.js";

@Injectable()
class SubscriptionRepository {
  public constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscription: Repository<SubscriptionEntity>
  ) {}

  public create(data: SubscriptionDto): Promise<SubscriptionEntity> {
    const newSubscription = new SubscriptionEntity(data);

    return this.subscription.save(newSubscription);
  }

  public async confirm(subscription: SubscriptionEntity): Promise<void> {
    await this.subscription.update(subscription.id, {
      ...subscription,
      confirmed: true,
    });
  }

  public async delete(id: string): Promise<void> {
    await this.subscription.delete(id);
  }

  public findByFrequency(frequency: Frequency): Promise<SubscriptionEntity[]> {
    return this.subscription.find({
      where: {
        frequency,
        confirmed: true,
      },
    });
  }

  public find({
    email,
    token,
  }: SubscribeFilterDto): Promise<SubscriptionEntity | null> {
    return this.subscription.findOne({
      where: { email, token },
    });
  }
}

export { SubscriptionRepository };
