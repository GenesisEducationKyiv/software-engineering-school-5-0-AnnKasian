import { decode } from "quoted-printable";
import request from "supertest";
import { DataSource, type Repository } from "typeorm";
import { Test, type TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TIMEOUT } from "../../../../shared/libs/enums/enums.js";
import { SubscriptionEntity } from "../../src/modules/subscription/subscription.js";
import { MailHogClient } from "../mailhog.client.js";
import { testDatabaseConfig } from "../text-database.config.js";
import { SubscriptionE2eMock } from "./mock-data/mock-data.js";

describe("Subscription", () => {
  let module: TestingModule;
  let db: Repository<SubscriptionEntity>;
  let dataSource: DataSource;
  let mailHog: MailHogClient;

  const baseUrl = "http://localhost:7072";

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...testDatabaseConfig,
          entities: [SubscriptionEntity],
        }),
        TypeOrmModule.forFeature([SubscriptionEntity]),
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    db = dataSource.getRepository(SubscriptionEntity);
    mailHog = new MailHogClient();
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
    await mailHog.clearMessages();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  const createTestSubscription = (
    overrideData: Partial<SubscriptionEntity> = {}
  ) => {
    return db.save({
      ...SubscriptionE2eMock.newSubscription,
      ...overrideData,
    });
  };

  describe("/POST subscription", () => {
    it("should create subscription, send email, and return token", async () => {
      const response = await request(baseUrl)
        .post("/subscribe")
        .send(SubscriptionE2eMock.newSubscription)
        .expect(201);

      const result = await db.findOne({
        where: {
          email: SubscriptionE2eMock.newSubscription.email,
        },
      });

      expect(result).not.toBeNull();

      expect(response.body).toEqual({
        token: result?.token,
      });

      const capturedEmail = await mailHog.waitForMessage(
        SubscriptionE2eMock.newSubscription.email,
        TIMEOUT.DEFAULT_TIMEOUT
      );

      expect(capturedEmail).toBeDefined();
      expect(capturedEmail.To[0].Mailbox).toBe(
        SubscriptionE2eMock.newSubscription.email.split("@")[0]
      );

      const decodedBody = decode(capturedEmail.Content.Body).toString();

      expect(decodedBody).toContain(result?.token);
    });

    it("should return a message that email already confirmed", async () => {
      await createTestSubscription({
        email: SubscriptionE2eMock.newSubscription.email,
        confirmed: true,
      });

      const response = await request(baseUrl)
        .post("/subscribe")
        .send(SubscriptionE2eMock.newSubscription)
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: expect.any(String),
      });
    });

    it("should return a message that data is invalid", async () => {
      const response = await request(baseUrl)
        .post("/subscribe")
        .send(SubscriptionE2eMock.invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(String),
        details: expect.any(Array),
      });
    });
  });

  describe("/GET confirm", () => {
    it("should confirm subscription", async () => {
      const subscription = await createTestSubscription();

      const response = await request(baseUrl)
        .get(`/confirm/${subscription.token}`)
        .send(subscription.token)
        .expect(200);

      const result = await db.findOne({
        where: {
          token: subscription.token,
        },
      });

      expect(result).not.toBeNull();
      expect(result?.confirmed).toBe(true);

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: expect.any(String),
      });
    });

    it("should return a message that subscription already confirmed", async () => {
      const subscription = await createTestSubscription({
        email: SubscriptionE2eMock.newSubscription.email,
        confirmed: true,
      });

      const response = await request(baseUrl)
        .get(`/confirm/${subscription.token}`)
        .send(subscription.token)
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      const response = await request(baseUrl)
        .get(`/confirm/${SubscriptionE2eMock.invalidToken}`)
        .send(SubscriptionE2eMock.invalidToken)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(String),
      });
    });
  });

  describe("/GET unsubscribe", () => {
    it("should delete subscription", async () => {
      const subscription = await createTestSubscription();

      const response = await request(baseUrl)
        .get(`/unsubscribe/${subscription.token}`)
        .send(subscription.token)
        .expect(200);

      const result = await db.findOne({
        where: {
          token: subscription.token,
        },
      });

      expect(result).toBeNull();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: expect.any(String),
      });
    });

    it("should return a message that token not found", async () => {
      const response = await request(baseUrl)
        .get(`/unsubscribe/${SubscriptionE2eMock.token}`)
        .send(SubscriptionE2eMock.token)
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      const response = await request(baseUrl)
        .get(`/unsubscribe/${SubscriptionE2eMock.invalidToken}`)
        .send(SubscriptionE2eMock.invalidToken)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(String),
      });
    });
  });
});
