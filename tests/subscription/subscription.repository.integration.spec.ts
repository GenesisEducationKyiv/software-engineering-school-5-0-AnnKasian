import { SubscriptionRepository } from "../../src/modules/subscription/subscription.repository.js";
import { SubscriptionIntegrationMock } from "./mock-data/subscription.integration.mock.js";
import { Test, type TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { testDatabaseConfig } from "../text-database.config.js";
import { SubscriptionEntity } from "../../src/modules/subscription/subscription.js";
import { DataSource, type Repository } from "typeorm";
import { ConfigModule } from "@nestjs/config";
import { MapToDomain } from "../../src/modules/subscription/mappers/mappers.js";

describe("SubscriptionRepository Integration Tests", () => {
  let module: TestingModule;
  let repository: SubscriptionRepository;
  let db: Repository<SubscriptionEntity>;
  let dataSource: DataSource;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          entities: [SubscriptionEntity],
        }),
        TypeOrmModule.forFeature([SubscriptionEntity]),
      ],
      providers: [SubscriptionRepository],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    repository = module.get<SubscriptionRepository>(SubscriptionRepository);
    db = dataSource.getRepository(SubscriptionEntity);
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  const createTestSubscription = (
    overrideData: Partial<SubscriptionEntity> = {}
  ) => {
    return db.save({
      ...SubscriptionIntegrationMock.newData.newSubscriptionEntity,
      ...overrideData,
    });
  };

  describe("create", () => {
    it("should create and save subscription", async () => {
      const result = await repository.create(
        SubscriptionIntegrationMock.newData.newSubscription
      );

      expect(result.id).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.email).toBe(
        SubscriptionIntegrationMock.newData.newSubscription.email
      );
      expect(result.city).toBe(
        SubscriptionIntegrationMock.newData.newSubscription.city
      );
      expect(result.frequency).toBe(
        SubscriptionIntegrationMock.newData.newSubscription.frequency
      );
      expect(result.confirmed).toBe(false);
      expect(result.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
      expect(result.updatedAt.getTime()).toBeLessThanOrEqual(Date.now());

      const record = await db.findOne({
        where: {
          id: result.id,
        },
      });
      expect(record).toMatchObject({
        token: result.token,
      });
    });
  });

  describe("save", () => {
    it("should update subscription confirm status ", async () => {
      const entityFromDb = await createTestSubscription();
      const subscription = MapToDomain(entityFromDb);
      expect(subscription.isConfirmed()).toBe(false);

      await repository.save(subscription.confirm());
      const confirmed = await db.findOne({
        where: {
          token: subscription.token,
        },
      });

      expect(confirmed?.confirmed).toBe(true);
      expect(confirmed?.id).toBe(subscription.id);
    });
  });

  describe("find", () => {
    it("should find subscription by frequency", async () => {
      await Promise.all([
        createTestSubscription({ confirmed: true }),
        createTestSubscription({
          id: SubscriptionIntegrationMock.newData.newSubscriptionDaily.id,
          email: SubscriptionIntegrationMock.newData.newSubscriptionDaily.email,
          token: SubscriptionIntegrationMock.newData.newSubscriptionDaily.token,
          frequency:
            SubscriptionIntegrationMock.newData.newSubscriptionDaily.frequency,
          confirmed: true,
        }),
      ]);

      const result = await repository.findByFrequency(
        SubscriptionIntegrationMock.newData.newSubscription.frequency
      );

      expect(result).toHaveLength(1);
      expect(result[0].frequency).toBe(
        SubscriptionIntegrationMock.newData.newSubscription.frequency
      );
    });

    it("should return an empty array when no subscriptions match frequency", async () => {
      const result = await repository.findByFrequency(
        SubscriptionIntegrationMock.newData.newSubscription.frequency
      );

      expect(result).toHaveLength(0);
    });

    it("should find subscription by filter", async () => {
      const subscription = await createTestSubscription();

      const result = await repository.find({
        email: subscription.email,
        token: subscription.token,
      });

      expect(result).not.toBeNull();
      expect(result?.id).toBe(subscription.id);
      expect(result?.token).toBe(subscription.token);
      expect(result?.email).toBe(subscription.email);
      expect(result?.city).toBe(subscription.city);
      expect(result?.frequency).toBe(subscription.frequency);
      expect(result?.confirmed).toBe(subscription.confirmed);
      expect(result?.createdAt.getTime()).toBe(
        subscription.createdAt.getTime()
      );
      expect(result?.updatedAt.getTime()).toBe(
        subscription.updatedAt.getTime()
      );
    });

    it("should return null when subscription not found by email", async () => {
      const result = await repository.find({
        email: "nonexistent@example.com",
      });

      expect(result).toBeNull();
    });

    it("should return null when subscription not found by token", async () => {
      const result = await repository.find({
        token: SubscriptionIntegrationMock.newData.newSubscription.token,
      });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete subscription", async () => {
      const subscription = await createTestSubscription();
      const existsBefore = await db.findOne({
        where: {
          token: subscription.token,
        },
      });
      expect(existsBefore).not.toBeNull();

      await repository.delete(subscription.id);
      const existsAfter = await db.findOne({
        where: {
          token: subscription.token,
        },
      });
      expect(existsAfter).toBeNull();
    });
  });
});
