import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SubscriptionEntity } from "./entities/entities.js";
import { Frequency } from "./enums/enums.js";
import { ISubscriptionRepository } from "./interfaces/interfaces.js";
import { MapToDomain, MapToEntity } from "./mappers/mappers.js";
import {
  SubscriptionType,
  SubscribeFilterType,
  Subscription,
} from "./types/types.js";

@Injectable()
class SubscriptionRepository implements ISubscriptionRepository {
  public constructor(
    @InjectRepository(SubscriptionEntity)
    private readonly subscription: Repository<SubscriptionEntity>
  ) {}

  public async create(data: SubscriptionType): Promise<Subscription> {
    const entity = new SubscriptionEntity(data);
    const savedEntity = await this.subscription.save(entity);

    return MapToDomain(savedEntity);
  }

  public async save(subscription: Subscription): Promise<Subscription> {
    const entity = MapToEntity(subscription);
    const savedEntity = await this.subscription.save(entity);

    return MapToDomain(savedEntity);
  }

  public async delete(id: string): Promise<void> {
    await this.subscription.delete(id);
  }

  public async findByFrequency(frequency: Frequency): Promise<Subscription[]> {
    const entities = await this.subscription.find({
      where: {
        frequency,
        confirmed: true,
      },
    });

    return entities.map((entity) => MapToDomain(entity));
  }

  public async find({
    email,
    token,
  }: SubscribeFilterType): Promise<Subscription | null> {
    const entities = await this.subscription.findOne({
      where: { email, token },
    });

    return entities ? MapToDomain(entities) : null;
  }
}

export { SubscriptionRepository };
