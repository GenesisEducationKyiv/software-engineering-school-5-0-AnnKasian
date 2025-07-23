import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Frequency } from "../../../../shared/libs/enums/enums.js";
import { SUBSCRIPTION_INJECTION_TOKENS } from "../../src/libs/enums/enums.js";
import {
  EmailAlreadyExistsException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
  TokenNotFoundException,
} from "../../src/libs/exceptions/exceptions.js";
import { SubscriptionService } from "../../src/modules/subscription/subscription.service.js";
import { SubscriptionMock } from "./mock-data/mock-data.js";

describe("SubscriptionService", () => {
  let subscriptionService: SubscriptionService;

  const mockSubscriptionRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findByFrequency: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockSubscriptionEmailClient = {
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
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_EMAIL_CLIENT,
          useValue: mockSubscriptionEmailClient,
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

      expect(
        mockSubscriptionEmailClient.sendConfirmationEmail
      ).toHaveBeenCalledWith(
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

      expect(
        mockSubscriptionEmailClient.sendConfirmationEmail
      ).toHaveBeenCalledWith(
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
      ).rejects.toThrow(EmailAlreadyExistsException);
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
      ).rejects.toThrow(TokenNotFoundException);
    });

    test("should throw ConflictException if email is already confirmed", async () => {
      mockSubscriptionRepository.find.mockResolvedValue(
        SubscriptionMock.responsefromRepository.emailExistAndConfirmed
      );

      await expect(
        subscriptionService.confirm(
          SubscriptionMock.responsefromRepository.emailExistAndConfirmed.token
        )
      ).rejects.toThrow(SubscriptionAlreadyConfirmedException);
    });

    test("should throw BadRequestException if token is invalid", async () => {
      mockSubscriptionRepository.find.mockRejectedValue(new Error());

      await expect(
        subscriptionService.confirm(SubscriptionMock.request.invalidToken)
      ).rejects.toThrow(InvalidTokenException);
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
      ).rejects.toThrow(TokenNotFoundException);
    });

    test("should throw BadRequestException if token is invalid", async () => {
      mockSubscriptionRepository.find.mockRejectedValue(new Error());

      await expect(
        subscriptionService.unsubscribe(SubscriptionMock.request.invalidToken)
      ).rejects.toThrow(InvalidTokenException);
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

      expect(mockSubscriptionEmailClient.sendEmails).toHaveBeenCalledWith(
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

      expect(mockSubscriptionEmailClient.sendEmails).toHaveBeenCalledWith(
        SubscriptionMock.responsefromRepository.daily
      );
    });
  });
});
