import { SubscriptionIntegrationMock } from "./mock-data/subscription.integration.mock.js";
import { Test, type TestingModule } from "@nestjs/testing";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SubscriptionEmailService } from "../../src/modules/subscription/subscription-email.service.js";
import ms from "smtp-tester";
import { WeatherService } from "../../src/modules/weather/weather.js";
import { WeatherMock } from "../weather/mock-data/mock-data.js";
import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import { HttpException } from "@nestjs/common";

describe("SubscriptionEmailService Integration Tests", () => {
  let module: TestingModule;
  let service: SubscriptionEmailService;
  let mailServer: ms.MailServer;

  const baseUrl = "http://localhost:3000";

  const mockWeatherService = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
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
            weatherService: WeatherService
          ) => {
            return new SubscriptionEmailService(
              mailerService,
              { baseUrl },
              weatherService
            );
          },
          inject: [MailerService, WeatherService],
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
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.city,
        [SubscriptionIntegrationMock.newData.subscriptionToConfirm]
      );

      expect(mockWeatherService.get).toHaveBeenCalledWith(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.city
      );

      const capturedEmail = await mailServer.captureOne(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.email,
        { wait: 5000 }
      );

      expect(capturedEmail.email.headers.to).toBe(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.email
      );
    });

    it("should throw HttpException if email is not valid", async () => {
      mockWeatherService.get.mockResolvedValue(WeatherMock.response);

      await expect(
        service.sendWeatherEmail(
          SubscriptionIntegrationMock.newData.invalidSubscriptionToConfirm.city,
          [SubscriptionIntegrationMock.newData.invalidSubscriptionToConfirm]
        )
      ).rejects.toThrow(HttpException);
    });
  });

  describe("sendConfirmationEmail", () => {
    it("should send confirmatuion email to subscription", async () => {
      await service.sendConfirmationEmail(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm
      );

      const capturedEmail = await mailServer.captureOne(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.email,
        { wait: 5000 }
      );

      expect(capturedEmail.email.headers.to).toBe(
        SubscriptionIntegrationMock.newData.subscriptionToConfirm.email
      );
    });

    it("should throw HttpException if email is not valid", async () => {
      await expect(
        service.sendConfirmationEmail(
          SubscriptionIntegrationMock.newData.invalidSubscriptionToConfirm
        )
      ).rejects.toThrow(HttpException);
    });
  });
});
