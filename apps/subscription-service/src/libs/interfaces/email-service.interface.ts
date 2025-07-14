import { type Observable } from "rxjs";
import {
  type SendConfirmationEmailRequest,
  type SendEmailsRequest,
} from "../../../../../shared/generated/email.js";

interface IEmailService {
  sendEmails(subscriptions: SendEmailsRequest): Observable<{}>;
  sendConfirmationEmail(
    subscription: SendConfirmationEmailRequest
  ): Observable<{}>;
}

export { type IEmailService };
