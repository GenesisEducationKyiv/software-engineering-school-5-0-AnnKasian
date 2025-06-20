import { Test } from "@nestjs/testing";
import { SubscriptionService } from "../../src/modules/subscription/subscription.js";
import {
  SUBSCRIPTION_INJECTION_TOKENS,
  Frequency,
} from "../../src/modules/subscription/enums/enums.js";
import { SubscriptionMock } from "./mock-data/mock-data.js";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubscriptionEmailService } from "../../src/modules/subscription/subscription-email.service.js";
import { WeatherService } from "../../src/modules/weather/weather.service.js";

describe("SubscriptionService", () => {
  let subscriptionService: SubscriptionService;

  const mockSubscriptionRepository = {
    find: jest.fn(),
    create: jest.fn(),
    confirm: jest.fn(),
    delete: jest.fn(),
    findByFrequency: jest.fn(),
  };

  const mockWeatherService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEmailService = {
    sendConfirmationEmail: jest.fn(),
    sendEmails: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY,
          useValue: mockSubscriptionRepository,
        },
        {
          provide: WeatherService,
          useValue: mockWeatherService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SubscriptionEmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    subscriptionService = moduleRef.get(SubscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("subscribe", () => {
    test("should create subscription, send email, and return token", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(null);
      mockSubscriptionRepository.create.mockResolvedValue(
        SubscriptionMock.responsefromRepository.emailNotExist
      );

      const result = await subscriptionService.subscribe(
        SubscriptionMock.request.emailNotExist
      );

      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        SubscriptionMock.responsefromRepository.emailNotExist
      );

      expect(result).toEqual(SubscriptionMock.response.emailNotExist);
    });

    test("should send email again, and return token", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(
        SubscriptionMock.responsefromRepository.emailExist
      );

      const result = await subscriptionService.subscribe(
        SubscriptionMock.request.emailExist
      );

      expect(mockEmailService.sendConfirmationEmail).toHaveBeenCalledWith(
        SubscriptionMock.responsefromRepository.emailExist
      );

      expect(result).toEqual(SubscriptionMock.response.emailExist);
    });

    test("should throw ConflictException if email is already confirmed", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(
        SubscriptionMock.responsefromRepository.emailExistAndConfirmed
      );

      await expect(
        subscriptionService.subscribe(
          SubscriptionMock.request.emailExistAndConfirmed
        )
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("confirm", () => {
    test("should confirm subscription and return void", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(
        SubscriptionMock.responsefromRepository.emailExist
      );

      await subscriptionService.confirm(
        SubscriptionMock.responsefromRepository.emailExist.token
      );

      expect(mockSubscriptionRepository.find).toHaveBeenCalledWith({
        token: SubscriptionMock.responsefromRepository.emailExist.token,
      });
    });

    test("should throw NotFoundException if token not found", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(null);

      await expect(
        subscriptionService.confirm(
          SubscriptionMock.responsefromRepository.emailNotExist.token
        )
      ).rejects.toThrow(NotFoundException);
    });

    test("should throw ConflictException if email is already confirmed", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(
        SubscriptionMock.responsefromRepository.emailExistAndConfirmed
      );

      await expect(
        subscriptionService.confirm(
          SubscriptionMock.responsefromRepository.emailExistAndConfirmed.token
        )
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("unsubscribe", () => {
    test("should unsubscribe and return void", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(
        SubscriptionMock.responsefromRepository.emailExist
      );

      await subscriptionService.unsubscribe(
        SubscriptionMock.responsefromRepository.emailExist.token
      );

      expect(mockSubscriptionRepository.find).toHaveBeenCalledWith({
        token: SubscriptionMock.responsefromRepository.emailExist.token,
      });
    });

    test("should throw NotFoundException if token not found", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(null);

      await expect(
        subscriptionService.unsubscribe(
          SubscriptionMock.responsefromRepository.emailNotExist.token
        )
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("sendHourlyEmails", () => {
    test("should call sendFrequencyEmails with Frequency.Hourly", async () => {
      mockSubscriptionRepository.findByFrequency.mockResolvedValue(
        SubscriptionMock.responsefromRepository.hourly
      );

      await subscriptionService.sendHourlyEmails();

      expect(mockSubscriptionRepository.findByFrequency).toHaveBeenCalledWith(
        Frequency.HOURLY
      );

      expect(mockEmailService.sendEmails).toHaveBeenCalledWith(
        SubscriptionMock.responsefromRepository.hourly
      );
    });
  });

  describe("sendDailyEmails", () => {
    test("should call sendFrequencyEmails with Frequency.Daily", async () => {
      mockSubscriptionRepository.findByFrequency.mockResolvedValue(
        SubscriptionMock.responsefromRepository.daily
      );

      await subscriptionService.sendDailyEmails();

      expect(mockSubscriptionRepository.findByFrequency).toHaveBeenCalledWith(
        Frequency.DAILY
      );

      expect(mockEmailService.sendEmails).toHaveBeenCalledWith(
        SubscriptionMock.responsefromRepository.daily
      );
    });
  });
});
