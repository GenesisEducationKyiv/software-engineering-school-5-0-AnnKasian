import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
  SendEmailsRequest,
  SendEmailsResponse,
  SendConfirmationEmailRequest,
  SendEmailConfirmationResponse,
} from "../../../../../shared/generated/email.js";
import { grpcErrorHandler } from "../../../../../shared/libs/helpers/helpers.js";
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
    try {
      if (payload.subscription) {
        const subscriptions = payload.subscription.map((subscription) =>
          MapSubscriptionToDomainFromProto(subscription)
        );

        await this.emailService.sendEmails(subscriptions);

        return {};
      } else {
        throw new DataIsRequiredException();
      }
    } catch (error: unknown) {
      return grpcErrorHandler(error);
    }
  }

  @GrpcMethod("EmailService", "SendConfirmationEmail")
  public async SendConfirmationEmail(
    payload: SendConfirmationEmailRequest
  ): Promise<SendEmailConfirmationResponse> {
    try {
      const subscription = MapSubscriptionToDomainFromProto(
        payload.subscription
      );
      await this.emailService.sendConfirmationEmail(subscription);

      return {};
    } catch (error: unknown) {
      return grpcErrorHandler(error);
    }
  }
}

export { EmailController };
