import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
  SendEmailsRequest,
  SendEmailsResponse,
  SendConfirmationEmailRequest,
  SendEmailConfirmationResponse,
} from "../../../../../shared/generated/email.js";
import { MapSubscriptionToDomainFromProto } from "../../../../../shared/libs/mappers/mappers.js";
import { DataIsRequiredException } from "../../libs/exceptions/exceptions.js";
import { EmailService } from "./email.service.js";

@Controller()
class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @GrpcMethod("EmailService", "SendEmails")
  public async SendEmails(
    payload: SendEmailsRequest
  ): Promise<SendEmailsResponse> {
    if (payload.subscription) {
      const subscriptions = payload.subscription.map((subscription) =>
        MapSubscriptionToDomainFromProto(subscription)
      );

      await this.emailService.sendEmails(subscriptions);

      return {};
    } else {
      throw new DataIsRequiredException();
    }
  }

  @GrpcMethod("EmailService", "SendConfirmationEmail")
  public async SendConfirmationEmail(
    payload: SendConfirmationEmailRequest
  ): Promise<SendEmailConfirmationResponse> {
    const subscription = MapSubscriptionToDomainFromProto(payload.subscription);
    await this.emailService.sendConfirmationEmail(subscription);

    return {};
  }
}

export { EmailController };
