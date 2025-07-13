import { Subscription } from "../../../../../shared/libs/types/types.js";

interface IEmailService {
  sendEmails(subscriptions: Subscription[]): Promise<void>;
  sendConfirmationEmail(subscription: Subscription): Promise<void>;
}

export { type IEmailService };
