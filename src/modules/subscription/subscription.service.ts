import { Inject, Injectable } from "@nestjs/common";
import {
  SubscribeFilterDto,
  SubscribeResponseDto,
  type SubscriptionDto,
} from "./types/types.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { SubscriptionEmailService } from "./subscription-email.service.js";
import { Frequency, SUBSCRIPTION_INJECTION_TOKENS } from "./enums/enums.js";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ISubscriptionRepository } from "./interfaces/interfaces.js";
import {
  EmailAlreadyExistsException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
  TokenNotFoundException,
} from "./exceptions/exceptions.js";

@Injectable()
class SubscriptionService {
  public constructor(
    @Inject(SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly subscriptionEmailService: SubscriptionEmailService
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async sendHourlyEmails(): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByFrequency(
      Frequency.HOURLY
    );
    await this.subscriptionEmailService.sendEmails(subscriptions);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  public async sendDailyEmails(): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByFrequency(
      Frequency.DAILY
    );
    await this.subscriptionEmailService.sendEmails(subscriptions);
  }

  public async subscribe(data: SubscriptionDto): Promise<SubscribeResponseDto> {
    const existingSubscribe = await this.subscriptionRepository.find({
      email: data.email,
    });

    if (existingSubscribe) {
      if (existingSubscribe.confirmed === true) {
        throw new EmailAlreadyExistsException();
      }

      await this.subscriptionEmailService.sendConfirmationEmail(
        existingSubscribe
      );

      return { token: existingSubscribe.token };
    }

    const subscription = await this.subscriptionRepository.create(data);
    await this.subscriptionEmailService.sendConfirmationEmail(subscription);

    return { token: subscription.token };
  }

  public async confirm(token: string): Promise<void> {
    const subscription = await this.findToken({ token });

    if (subscription.confirmed === true) {
      throw new SubscriptionAlreadyConfirmedException();
    }

    await this.subscriptionRepository.confirm(subscription);
  }

  public async unsubscribe(token: string): Promise<void> {
    const subscription = await this.findToken({ token });
    await this.subscriptionRepository.delete(subscription?.id);
  }

  private async findToken({
    token,
  }: SubscribeFilterDto): Promise<SubscriptionEntity> {
    let existingSubscribe: SubscriptionEntity | null = null;

    try {
      existingSubscribe = await this.subscriptionRepository.find({
        token,
      });
    } catch {
      throw new InvalidTokenException();
    }

    if (!existingSubscribe) {
      throw new TokenNotFoundException();
    }

    return existingSubscribe;
  }
}

export { SubscriptionService };
