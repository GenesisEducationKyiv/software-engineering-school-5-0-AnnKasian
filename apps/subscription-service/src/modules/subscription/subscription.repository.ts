import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import { ISubscriptionRepository } from "../../libs/interfaces/interfaces.js";
import { MapToDomain, MapToEntity } from "../../libs/mappers/mappers.js";
import {
  SubscriptionType,
  SubscribeFilterType,
} from "../../libs/types/types.js";
import { SubscriptionEntity } from "./entities/entities.js";

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
