import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import { DB_METRICS_OPERATIONS } from "../../libs/enums/enums.js";
import {
  MetricsHelper,
  postgresErrorHandler,
} from "../../libs/helpers/helpers.js";
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
    private readonly subscription: Repository<SubscriptionEntity>,
    private readonly metricsHelper: MetricsHelper
  ) {}

  public async create(data: SubscriptionType): Promise<Subscription> {
    try {
      const result = await this.metricsHelper.withMetrics(
        DB_METRICS_OPERATIONS.INSERT,
        async () => {
          const entity = new SubscriptionEntity(data);
          const savedEntity = await this.subscription.save(entity);

          return MapToDomain(savedEntity);
        }
      );

      return result;
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }

  public async save(subscription: Subscription): Promise<Subscription> {
    try {
      const result = await this.metricsHelper.withMetrics(
        DB_METRICS_OPERATIONS.UPDATE,
        async () => {
          const entity = MapToEntity(subscription);
          const savedEntity = await this.subscription.save(entity);

          return MapToDomain(savedEntity);
        }
      );

      return result;
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.metricsHelper.withMetrics(
        DB_METRICS_OPERATIONS.DELETE,
        async () => {
          await this.subscription.delete(id);
        }
      );
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }

  public async findByFrequency(frequency: Frequency): Promise<Subscription[]> {
    try {
      const result = await this.metricsHelper.withMetrics(
        DB_METRICS_OPERATIONS.FIND,
        async () => {
          const entities = await this.subscription.find({
            where: {
              frequency,
              confirmed: true,
            },
          });

          return entities.map((entity) => MapToDomain(entity));
        }
      );

      return result;
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }

  public async find({
    email,
    token,
  }: SubscribeFilterType): Promise<Subscription | null> {
    try {
      const result = await this.metricsHelper.withMetrics(
        DB_METRICS_OPERATIONS.FIND,
        async () => {
          const entities = await this.subscription.findOne({
            where: { email, token },
          });

          return entities ? MapToDomain(entities) : null;
        }
      );

      return result;
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }
}

export { SubscriptionRepository };
