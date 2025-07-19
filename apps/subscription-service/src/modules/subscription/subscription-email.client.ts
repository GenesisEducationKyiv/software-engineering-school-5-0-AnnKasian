import { firstValueFrom } from "rxjs";
import { Inject } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { MapSubscriptionToProtoFromDomain } from "../../../../../shared/libs/mappers/mappers.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import { SUBSCRIPTION_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import { EmailServiceException } from "../../libs/exceptions/subscription.exception.js";
import { IEmailService } from "../../libs/interfaces/interfaces.js";

class SubscriptionEmailClient {
  constructor(
    @Inject(SUBSCRIPTION_INJECTION_TOKENS.EMAIL_SERVICE)
    private readonly subscriptionEmailService: IEmailService
  ) {}

  async sendEmails(subscriptions: Subscription[]): Promise<void> {
    const subscription = subscriptions.map((subscription) =>
      MapSubscriptionToProtoFromDomain(subscription)
    );

    try {
      await firstValueFrom(
        this.subscriptionEmailService.sendEmails({
          subscription,
        })
      );
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        throw new EmailServiceException(error.message);
      }

      throw new EmailServiceException();
    }
  }

  async sendConfirmationEmail(subscription: Subscription): Promise<void> {
    try {
      await firstValueFrom(
        this.subscriptionEmailService.sendConfirmationEmail({
          subscription: MapSubscriptionToProtoFromDomain(subscription),
        })
      );
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        throw new EmailServiceException(error.message);
      }

      throw new EmailServiceException();
    }
  }
}

export { SubscriptionEmailClient };
