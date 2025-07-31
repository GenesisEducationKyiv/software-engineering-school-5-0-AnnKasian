import path from "path";
import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import ms from "smtp-tester";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, type TestingModule } from "@nestjs/testing";
import { EmailSubject } from "../../../../shared/libs/email-data/email-data.js";
import { CONFIG_KEYS, TIMEOUT } from "../../../../shared/libs/enums/enums.js";
import { EMAIL_INJECTION_TOKENS } from "../../src/libs/enums/enums.js";
import { EmailSendFailException } from "../../src/libs/exceptions/exceptions.js";
import { type EmailWeatherClient } from "../../src/modules/email/email-weather.client.js";
import { EmailService } from "../../src/modules/email/email.service.js";
import { KafkaService } from "../../src/modules/kafka.service.js";
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
          provide: EMAIL_INJECTION_TOKENS.MESSAGE_BROKER,
          useFactory: (configService: ConfigService) => {
            const brokerHost = configService.get<string>(
              CONFIG_KEYS.KAFKA_HOST
            ) as string;

            return new KafkaService(brokerHost);
          },
          inject: [ConfigService],
        },
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
            weatherService: EmailWeatherClient,
            kafkaService: KafkaService
          ) => {
            return new EmailService(
              mailerService,
              baseUrl,
              weatherService,
              kafkaService
            );
          },
          inject: [
            MailerService,
            EMAIL_INJECTION_TOKENS.WEATHER_SERVICE,
            EMAIL_INJECTION_TOKENS.MESSAGE_BROKER,
          ],
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
        [EmailIntegrationMock.newData.newSubscription],
        baseUrl
      );

      expect(mockWeatherService.get).toHaveBeenCalledWith(
        EmailIntegrationMock.newData.newSubscription.city
      );

      const capturedEmail = await mailServer.captureOne(
        EmailIntegrationMock.newData.newSubscription.email,
        { wait: TIMEOUT.DEFAULT_TIMEOUT }
      );

      expect(capturedEmail.email.headers.to).toBe(
        EmailIntegrationMock.newData.newSubscription.email
      );

      expect(capturedEmail.email.headers.subject).toBe(EmailSubject.SUBSCRIBE);

      expect(capturedEmail.email.html).toContain(
        EmailIntegrationMock.emailData.regular
      );
    });

    it("should throw HttpException if email is not valid", async () => {
      mockWeatherService.get.mockResolvedValue(EmailIntegrationMock.weather);

      await expect(
        service.sendWeatherEmail(
          EmailIntegrationMock.newData.invalidSubscriptionToConfirm.city,
          [EmailIntegrationMock.newData.invalidSubscriptionToConfirm],
          baseUrl
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
        { wait: TIMEOUT.DEFAULT_TIMEOUT }
      );

      expect(capturedEmail.email.headers.to).toBe(
        EmailIntegrationMock.newData.newSubscription.email
      );

      expect(capturedEmail.email.headers.subject).toBe(EmailSubject.CONFIRM);

      expect(capturedEmail.email.html).toContain(
        EmailIntegrationMock.emailData.confirm
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
