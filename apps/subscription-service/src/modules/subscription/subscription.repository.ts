import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import { DURATION } from "../../../../../shared/observability/metrics/libs/enums/enums.js";
import { CustomMetricsService } from "../../../../../shared/observability/metrics/metrics.service.js";
import { postgresErrorHandler } from "../../libs/helpers/helpers.js";
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
    private readonly metricsService: CustomMetricsService
  ) {}

  public async create(data: SubscriptionType): Promise<Subscription> {
    const startTime = Date.now();
    const entity = new SubscriptionEntity(data);

    try {
      const savedEntity = await this.subscription.save(entity);
      const duration = (Date.now() - startTime) / DURATION.DEFAULT;
      this.metricsService.incrementDbQueries("INSERT", "subscriptions");
      this.metricsService.observeDbQueryDuration(
        "INSERT",
        "subscriptions",
        duration
      );

      return MapToDomain(savedEntity);
    } catch (error: unknown) {
      const duration = (Date.now() - startTime) / DURATION.DEFAULT;
      this.metricsService.incrementDbQueries("INSERT", "subscriptions");
      this.metricsService.observeDbQueryDuration(
        "INSERT",
        "subscriptions",
        duration
      );
      this.metricsService.incrementErrors(
        "database_error",
        "subscription_repository"
      );

      return postgresErrorHandler(error);
    }
  }

  public async save(subscription: Subscription): Promise<Subscription> {
    const entity = MapToEntity(subscription);

    try {
      const savedEntity = await this.subscription.save(entity);

      return MapToDomain(savedEntity);
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      await this.subscription.delete(id);
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }

  public async findByFrequency(frequency: Frequency): Promise<Subscription[]> {
    try {
      const entities = await this.subscription.find({
        where: {
          frequency,
          confirmed: true,
        },
      });

      return entities.map((entity) => MapToDomain(entity));
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }

  public async find({
    email,
    token,
  }: SubscribeFilterType): Promise<Subscription | null> {
    try {
      const entities = await this.subscription.findOne({
        where: { email, token },
      });

      return entities ? MapToDomain(entities) : null;
    } catch (error: unknown) {
      return postgresErrorHandler(error);
    }
  }
}

export { SubscriptionRepository };
