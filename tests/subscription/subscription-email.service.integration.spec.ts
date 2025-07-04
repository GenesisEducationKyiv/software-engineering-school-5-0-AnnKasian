import { SubscriptionIntegrationMock } from "./mock-data/subscription.integration.mock.js";
import { Test, type TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { type Cache } from "cache-manager";
import { SubscriptionEmailService } from "../../src/modules/subscription/subscription-email.service.js";
import { EmailSendFailException } from "../../src/modules/subscription/exceptions/exceptions.js";
import ms from "smtp-tester";
import { WeatherService } from "../../src/modules/weather/weather.js";
import { WeatherMock } from "../weather/mock-data/mock-data.js";
import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import { CACHE_MANAGER, CacheModule } from "@nestjs/cache-manager";
import { TestRedisConfig } from "../test-redis.config.js";

describe("SubscriptionEmailService Integration Tests", () => {
  let module: TestingModule;
  let service: SubscriptionEmailService;
  let mailServer: ms.MailServer;

  const baseUrl = "http://localhost:3000";
  const cacheTTL = 1000;

  const mockWeatherService = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.registerAsync({ ...TestRedisConfig, isGlobal: true }),
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
      ],
      providers: [
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
        {
          provide: SubscriptionEmailService,
          useFactory: (
            mailerService: MailerService,
            weatherService: WeatherService,
            casheManager: Cache
          ) => {
            return new SubscriptionEmailService(
              mailerService,
              { baseUrl, cacheTTL },
              weatherService,
              casheManager
            );
          },
          inject: [MailerService, WeatherService, CACHE_MANAGER],
        },
      ],
    }).compile();

    service = module.get<SubscriptionEmailService>(SubscriptionEmailService);
    mailServer = ms.init(7081);
  });

  afterAll(async () => {
    await module.close();
    await new Promise<void>((resolve) => {
      mailServer.stop(resolve);
    });
  });

  describe("sendWeatherEmail", () => {
    it("should send email to subscription", async () => {
      mockWeatherService.get.mockResolvedValue(WeatherMock.response);

      await service.sendWeatherEmail(
        SubscriptionIntegrationMock.newData.newSubscription.city,
        [SubscriptionIntegrationMock.newData.newSubscription]
      );

      expect(mockWeatherService.get).toHaveBeenCalledWith({
        city: SubscriptionIntegrationMock.newData.newSubscription.city,
      });

      const capturedEmail = await mailServer.captureOne(
        SubscriptionIntegrationMock.newData.newSubscription.email,
        { wait: 5000 }
      );

      expect(capturedEmail.email.headers.to).toBe(
        SubscriptionIntegrationMock.newData.newSubscription.email
      );
    });

    it("should throw HttpException if email is not valid", async () => {
      mockWeatherService.get.mockResolvedValue(WeatherMock.response);

      await expect(
        service.sendWeatherEmail(
          SubscriptionIntegrationMock.newData.invalidSubscriptionToConfirm.city,
          [SubscriptionIntegrationMock.newData.invalidSubscriptionToConfirm]
        )
      ).rejects.toThrow(EmailSendFailException);
    });
  });

  describe("sendConfirmationEmail", () => {
    it("should send confirmatuion email to subscription", async () => {
      await service.sendConfirmationEmail(
        SubscriptionIntegrationMock.newData.newSubscription
      );

      const capturedEmail = await mailServer.captureOne(
        SubscriptionIntegrationMock.newData.newSubscription.email,
        { wait: 5000 }
      );

      expect(capturedEmail.email.headers.to).toBe(
        SubscriptionIntegrationMock.newData.newSubscription.email
      );
    });

    it("should throw HttpException if email is not valid", async () => {
      await expect(
        service.sendConfirmationEmail(
          SubscriptionIntegrationMock.newData.invalidSubscriptionToConfirm
        )
      ).rejects.toThrow(EmailSendFailException);
    });
  });
});
