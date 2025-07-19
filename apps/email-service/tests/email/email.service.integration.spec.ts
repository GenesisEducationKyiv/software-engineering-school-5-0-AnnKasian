import path from "path";
import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import ms from "smtp-tester";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { EMAIL_INJECTION_TOKENS } from "../../src/libs/enums/enums.js";
import { EmailSendFailException } from "../../src/libs/exceptions/exceptions.js";
import { type EmailWeatherClient } from "../../src/modules/email/email-weather.client.js";
import { EmailService } from "../../src/modules/email/email.service.js";
import { EmailIntegrationMock } from "./mock-data/mock-data.js";

describe("EmailService Integration Tests", () => {
  let module: TestingModule;
  let service: EmailService;
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
              dir: path.join(
                process.cwd(),
                "apps/email-service/email-templates"
              ),
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
          provide: EMAIL_INJECTION_TOKENS.WEATHER_SERVICE,
          useValue: mockWeatherService,
        },
        {
          provide: EMAIL_INJECTION_TOKENS.EMAIL_WEATHER_CLIENT,
          useValue: mockWeatherService,
        },
        {
          provide: EmailService,
          useFactory: (
            mailerService: MailerService,
            weatherService: EmailWeatherClient
          ) => {
            return new EmailService(mailerService, baseUrl, weatherService);
          },
          inject: [MailerService, EMAIL_INJECTION_TOKENS.WEATHER_SERVICE],
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
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
      mockWeatherService.get.mockResolvedValue(EmailIntegrationMock.weather);

      await service.sendWeatherEmail(
        EmailIntegrationMock.newData.newSubscription.city,
        [EmailIntegrationMock.newData.newSubscription]
      );

      expect(mockWeatherService.get).toHaveBeenCalledWith(
        EmailIntegrationMock.newData.newSubscription.city
      );

      const capturedEmail = await mailServer.captureOne(
        EmailIntegrationMock.newData.newSubscription.email,
        { wait: 5000 }
      );

      expect(capturedEmail.email.headers.to).toBe(
        EmailIntegrationMock.newData.newSubscription.email
      );
    });

    it("should throw HttpException if email is not valid", async () => {
      mockWeatherService.get.mockResolvedValue(EmailIntegrationMock.weather);

      await expect(
        service.sendWeatherEmail(
          EmailIntegrationMock.newData.invalidSubscriptionToConfirm.city,
          [EmailIntegrationMock.newData.invalidSubscriptionToConfirm]
        )
      ).rejects.toThrow(EmailSendFailException);
    });
  });

  describe("sendConfirmationEmail", () => {
    it("should send confirmatuion email to subscription", async () => {
      await service.sendConfirmationEmail(
        EmailIntegrationMock.newData.newSubscription
      );

      const capturedEmail = await mailServer.captureOne(
        EmailIntegrationMock.newData.newSubscription.email,
        { wait: 5000 }
      );

      expect(capturedEmail.email.headers.to).toBe(
        EmailIntegrationMock.newData.newSubscription.email
      );
    });

    it("should throw HttpException if email is not valid", async () => {
      await expect(
        service.sendConfirmationEmail(
          EmailIntegrationMock.newData.invalidSubscriptionToConfirm
        )
      ).rejects.toThrow(EmailSendFailException);
    });
  });
});
