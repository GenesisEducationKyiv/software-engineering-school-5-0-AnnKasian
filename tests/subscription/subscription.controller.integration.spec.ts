import request from "supertest";
import { SubscriptionIntegrationMock } from "./mock-data/subscription.integration.mock.js";
import { Test } from "@nestjs/testing";
import { SubscriptionService } from "../../src/modules/subscription/subscription.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  ValidationPipe,
  type INestApplication,
} from "@nestjs/common";
import { SubscriptionController } from "../../src/modules/subscription/subscription.controller.js";
import { type App } from "supertest/types.js";

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
        token: SubscriptionIntegrationMock.newData.subscriptionToConfirm.token,
      });

      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionIntegrationMock.newData.newSubscription)
        .expect(201);

      expect(mockSubscriptionService.subscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newSubscription
      );

      expect(response.body).toEqual({
        token: SubscriptionIntegrationMock.newData.subscriptionToConfirm.token,
      });
    });

    it("should return a message that email already confirmed", async () => {
      mockSubscriptionService.subscribe.mockRejectedValue(
        new ConflictException("Email already subscribed.")
      );

      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionIntegrationMock.newData.newSubscription)
        .expect(409);

      expect(mockSubscriptionService.subscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.newSubscription
      );

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: expect.any(String),
      });
    });

    it("should return a message that data is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post("/subscribe")
        .send(SubscriptionIntegrationMock.newData.invalidData)
        .expect(400);

      expect(mockSubscriptionService.subscribe).not.toHaveBeenCalled();

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(Array),
      });
    });
  });

  describe("confirm", () => {
    it("should сonfirm subscription", async () => {
      mockSubscriptionService.confirm.mockReturnValue(undefined);
      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.subscriptionToConfirm.token}`
        )
        .send(SubscriptionIntegrationMock.newData.subscriptionToConfirm.token)
        .expect(200);

      expect(mockSubscriptionService.confirm).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.token
      );
      expect(response.body).toMatchObject({
        statusCode: 200,
        message: expect.any(String),
      });
    });

    it("should return a message that subscription already confirmed", async () => {
      mockSubscriptionService.confirm.mockRejectedValue(
        new ConflictException("Email already confirmed.")
      );
      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.subscriptionToConfirm.token}`
        )
        .send(SubscriptionIntegrationMock.newData.subscriptionToConfirm.token)
        .expect(409);

      expect(mockSubscriptionService.confirm).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.token
      );

      expect(response.body).toMatchObject({
        statusCode: 409,
        message: expect.any(String),
      });
    });

    it("should return a message that token not found", async () => {
      mockSubscriptionService.confirm.mockRejectedValue(
        new NotFoundException("Token not found")
      );
      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.subscriptionToConfirm.token}`
        )
        .send(SubscriptionIntegrationMock.newData.subscriptionToConfirm.token)
        .expect(404);

      expect(mockSubscriptionService.confirm).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.token
      );

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      mockSubscriptionService.confirm.mockRejectedValue(
        new BadRequestException("Invalid token")
      );

      const response = await request(app.getHttpServer())
        .get(
          `/confirm/${SubscriptionIntegrationMock.newData.invalidToken.token}`
        )
        .send(SubscriptionIntegrationMock.newData.invalidToken.token)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(String),
      });
    });
  });

  describe("unsubscribe", () => {
    it("should delete subscription", async () => {
      mockSubscriptionService.unsubscribe.mockResolvedValue(undefined);
      const response = await request(app.getHttpServer())
        .get(
          `/unsubscribe/${SubscriptionIntegrationMock.newData.subscriptionToConfirm.token}`
        )
        .send(SubscriptionIntegrationMock.newData.subscriptionToConfirm.token)
        .expect(200);

      expect(mockSubscriptionService.unsubscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.token
      );
      expect(response.body).toMatchObject({
        statusCode: 200,
        message: expect.any(String),
      });
    });

    it("should return a message that token not found", async () => {
      mockSubscriptionService.unsubscribe.mockRejectedValue(
        new NotFoundException("Token not found")
      );

      const response = await request(app.getHttpServer())
        .get(
          `/unsubscribe/${SubscriptionIntegrationMock.newData.subscriptionToConfirm.token}`
        )
        .send(SubscriptionIntegrationMock.newData.subscriptionToConfirm.token)
        .expect(404);

      expect(mockSubscriptionService.unsubscribe).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.token
      );

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: expect.any(String),
      });
    });

    it("should return a message that token is invalid", async () => {
      mockSubscriptionService.unsubscribe.mockRejectedValue(
        new BadRequestException("Invalid token")
      );

      const response = await request(app.getHttpServer())
        .get(
          `/unsubscribe/${SubscriptionIntegrationMock.newData.invalidToken.token}`
        )
        .send(SubscriptionIntegrationMock.newData.invalidToken.token)
        .expect(400);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: expect.any(String),
      });
    });
  });
});
