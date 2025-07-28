import { Inject, Injectable } from "@nestjs/common";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import { SUBSCRIPTION_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import {
  EmailAlreadyExistsException,
  InvalidTokenException,
  SubscriptionAlreadyConfirmedException,
  TokenNotFoundException,
} from "../../libs/exceptions/exceptions.js";
import { ISubscriptionRepository } from "../../libs/interfaces/interfaces.js";
import {
  SubscribeFilterType,
  SubscribeResponseType,
  type SubscriptionType,
} from "../../libs/types/types.js";
import { SubscriptionEmailClient } from "./subscription-email.client.js";

@Injectable()
class SubscriptionService {
  public constructor(
    @Inject(SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_EMAIL_CLIENT)
    private readonly subscriptionEmailService: SubscriptionEmailClient
  ) {}

  public async sendEmails(frequency: Frequency): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByFrequency(
      frequency
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
