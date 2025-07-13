import { Inject, Injectable } from "@nestjs/common";
import { SUBSCRIPTION_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  IEmailService,
  ISubscriptionRepository,
} from "../../libs/interfaces/interfaces.js";
import {
  EmailAlreadyExistsException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
  TokenNotFoundException,
} from "../../libs/exceptions/exceptions.js";
import {
  SubscribeFilterType,
  SubscribeResponseType,
  type SubscriptionType,
} from "../../libs/types/types.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";

@Injectable()
class SubscriptionService {
  public constructor(
    @Inject(SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(SUBSCRIPTION_INJECTION_TOKENS.EMAIL_SERVICE)
    private readonly subscriptionEmailService: IEmailService
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

  public async subscribe(
    data: SubscriptionType
  ): Promise<SubscribeResponseType> {
    const existingSubscribe = await this.subscriptionRepository.find({
      email: data.email,
    });

    if (existingSubscribe) {
      if (existingSubscribe.isConfirmed()) {
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

    if (subscription.isConfirmed()) {
      throw new SubscriptionAlreadyConfirmedException();
    }

    const confirmedSubscription = subscription.confirm();
    await this.subscriptionRepository.save(confirmedSubscription);
  }

  public async unsubscribe(token: string): Promise<void> {
    const subscription = await this.findToken({ token });
    await this.subscriptionRepository.delete(subscription?.id);
  }

  private async findToken({
    token,
  }: SubscribeFilterType): Promise<Subscription> {
    let existingSubscribe: Subscription | null = null;

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
