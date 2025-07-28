import request from "supertest";
import { type App } from "supertest/types.js";
import { type INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import {
  EmailAlreadyExistsException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
  TokenNotFoundException,
} from "../../src/libs/exceptions/exceptions.js";
import { SubscriptionController } from "../../src/modules/subscription/subscription.controller.js";
import { SubscriptionService } from "../../src/modules/subscription/subscription.js";
import { SubscriptionIntegrationMock } from "./mock-data/subscription.integration.mock.js";

const mockSubscriptionService = {
  subscribe: jest.fn(),
  confirm: jest.fn(),
  unsubscribe: jest.fn(),
};

describe("SubscriptionController Integration Tests", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
      ],
      controllers: [SubscriptionController],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("create", () => {
    it("should create and save subscription", async () => {
      mockSubscriptionService.subscribe.mockResolvedValue({
        token: SubscriptionIntegrationMock.newData.newSubscription.token,
      });

      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionIntegrationMock.newData.newDtoSubscription)
        .expect(201);

      expect(mockSubscriptionService.subscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newDtoSubscription
      );

      expect(response.body).toEqual({
        token: SubscriptionIntegrationMock.newData.newSubscription.token,
      });
    });

    it("should return a message that email already confirmed", async () => {
      mockSubscriptionService.subscribe.mockRejectedValue(
        new EmailAlreadyExistsException()
      );

      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionIntegrationMock.newData.newDtoSubscription);

      expect(mockSubscriptionService.subscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newDtoSubscription
      );

      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should return a message that data is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionIntegrationMock.newData.invalidData);

      expect(mockSubscriptionService.subscribe).not.toHaveBeenCalled();

      expect(response.body).toMatchObject({
        message: expect.any(Array),
      });
    });
  });

  describe("confirm", () => {
    it("should confirm subscription", async () => {
      mockSubscriptionService.confirm.mockReturnValue(undefined);
      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.newSubscription.token}`
        )
        .send(SubscriptionIntegrationMock.newData.newSubscription.token)
        .expect(200);

      expect(mockSubscriptionService.confirm).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newSubscription.token
      );
      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should return a message that subscription already confirmed", async () => {
      mockSubscriptionService.confirm.mockRejectedValue(
        new SubscriptionAlreadyConfirmedException()
      );
      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.newSubscription.token}`
        )
        .send(SubscriptionIntegrationMock.newData.newSubscription.token);

      expect(mockSubscriptionService.confirm).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newSubscription.token
      );

      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should return a message that token not found", async () => {
      mockSubscriptionService.confirm.mockRejectedValue(
        new TokenNotFoundException()
      );
      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.newSubscription.token}`
        )
        .send(SubscriptionIntegrationMock.newData.newSubscription.token);

      expect(mockSubscriptionService.confirm).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newSubscription.token
      );

      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      mockSubscriptionService.confirm.mockRejectedValue(
        new InvalidTokenException()
      );

      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.invalidToken.token}`
        )
        .send(SubscriptionIntegrationMock.newData.invalidToken.token);

      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });
  });

  describe("unsubscribe", () => {
    it("should delete subscription", async () => {
      mockSubscriptionService.unsubscribe.mockResolvedValue(undefined);
      const response = await request(app.getHttpServer())
        .get(
          `/unsubscribe/${SubscriptionIntegrationMock.newData.newSubscription.token}`
        )
        .send(SubscriptionIntegrationMock.newData.newSubscription.token)
        .expect(200);

      expect(mockSubscriptionService.unsubscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newSubscription.token
      );
      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should return a message that token not found", async () => {
      mockSubscriptionService.unsubscribe.mockRejectedValue(
        new TokenNotFoundException()
      );

      const response = await request(app.getHttpServer())
        .get(
          `/unsubscribe/${SubscriptionIntegrationMock.newData.newSubscription.token}`
        )
        .send(SubscriptionIntegrationMock.newData.newSubscription.token);

      expect(mockSubscriptionService.unsubscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newSubscription.token
      );

      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      mockSubscriptionService.unsubscribe.mockRejectedValue(
        new InvalidTokenException()
      );

      const response = await request(app.getHttpServer())
        .get(
          `/unsubscribe/${SubscriptionIntegrationMock.newData.invalidToken.token}`
        )
        .send(SubscriptionIntegrationMock.newData.invalidToken.token);

      expect(response.body).toMatchObject({
        message: expect.any(String),
      });
    });
  });
});
