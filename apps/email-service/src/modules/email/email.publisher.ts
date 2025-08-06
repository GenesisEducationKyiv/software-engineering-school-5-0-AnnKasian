import { Inject, Injectable } from "@nestjs/common";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import {
  EMAIL_INJECTION_TOKENS,
  EmailCommandTypes,
} from "../../libs/enums/enums.js";
import { createBatchesHelper } from "../../libs/helpers/helpers.js";
import { IMessageBroker } from "../../libs/interfaces/interfaces.js";
import {
  type EmailConfirmationCommand,
  BatchEmailCommand,
} from "../../libs/types/types.js";

@Injectable()
class EmailPublisher {
  public constructor(
    @Inject(EMAIL_INJECTION_TOKENS.MESSAGE_BROKER)
    private readonly messageBrokerService: IMessageBroker,
    private readonly topic: string
  ) {}

  async sendConfirmationEmail(subscription: Subscription): Promise<void> {
    const command: EmailConfirmationCommand = {
      type: EmailCommandTypes.emailConfirmation,
      subscription,
    };

    await this.messageBrokerService.publish(this.topic, command);
  }

  async sendEmails(subscriptions: Subscription[]): Promise<void> {
    const batches = createBatchesHelper(subscriptions);

    for (const batch of batches) {
      const command: BatchEmailCommand = {
        type: EmailCommandTypes.batchEmail,
        subscriptions: batch,
      };

      await this.messageBrokerService.publish(this.topic, command);
    }
  }
}

export { EmailPublisher };
