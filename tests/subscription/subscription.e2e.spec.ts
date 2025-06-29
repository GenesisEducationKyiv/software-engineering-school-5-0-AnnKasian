import request from "supertest";
import { MailerModule } from "@nestjs-modules/mailer";
import { WeatherModule } from "../../src/modules/weather/weather.module";
import { Test, type TestingModule } from "@nestjs/testing";
import { SubscriptionModule } from "../../src/modules/subscription/subscription.module";
import { ValidationPipe, type INestApplication } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, type Repository } from "typeorm";
import { SubscriptionEntity } from "../../src/modules/subscription/subscription.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { testDatabaseConfig } from "../text-database.config.js";
import { SubscriptionE2eMock } from "./mock-data/mock-data.js";
import { type App } from "supertest/types";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import ms from "smtp-tester";
import { CacheModule } from "@nestjs/cache-manager";
import { TestRedisConfig } from "../test-redis.config.js";

describe("Subscription", () => {
  let app: INestApplication<App>;
  let module: TestingModule;
  let db: Repository<SubscriptionEntity>;
  let dataSource: DataSource;
  let mailServer: ms.MailServer;

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
        CacheModule.registerAsync(TestRedisConfig),
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            transport: {
              host: "localhost",
              port: 7081,
              secure: false,
            },
            defaults: {
              from: "test@example.com",
            },
            template: {
              dir: process.cwd() + "/email-templates/",
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true,
              },
            },
          }),
        }),
        TypeOrmModule.forFeature([SubscriptionEntity]),
        WeatherModule,
        SubscriptionModule,
      ],
    }).compile();

    app = module.createNestApplication();
    dataSource = module.get<DataSource>(DataSource);
    db = dataSource.getRepository(SubscriptionEntity);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    mailServer = ms.init(7081);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
    await app.close();
    await new Promise<void>((resolve) => {
      mailServer.stop(resolve);
    });
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
      const response = await request(app.getHttpServer())
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

      const capturedEmail = await mailServer.captureOne(
        SubscriptionE2eMock.newSubscription.email,
        { wait: 5000 }
      );

      expect(capturedEmail.email.headers.to).toBe(
        SubscriptionE2eMock.newSubscription.email
      );
    });

    it("should return a message that email already confirmed", async () => {
      await createTestSubscription({
        email: SubscriptionE2eMock.newSubscription.email,
        confirmed: true,
      });

      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionE2eMock.newSubscription)
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: expect.any(String),
      });
    });

    it("should return a message that data is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionE2eMock.invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(Array),
      });
    });
  });

  describe("/GET confirm", () => {
    it("should confirm subscription", async () => {
      const subscription = await createTestSubscription();

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
        .get(`/confirm/${subscription.token}`)
        .send(subscription.token)
        .expect(409);

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
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
      const response = await request(app.getHttpServer())
        .get(`/unsubscribe/${SubscriptionE2eMock.token}`)
        .send(SubscriptionE2eMock.token)
        .expect(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      const response = await request(app.getHttpServer())
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
