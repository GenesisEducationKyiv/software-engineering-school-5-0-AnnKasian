import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import {
  SendEmailsRequest,
  SendEmailsResponse,
  SendConfirmationEmailRequest,
  SendEmailConfirmationResponse,
} from "../../../../../shared/generated/email.js";
import {
  GRPC_METHODS,
  GRPC_SERVICES,
} from "../../../../../shared/libs/enums/enums.js";
import { MapSubscriptionToDomainFromProto } from "../../../../../shared/libs/mappers/mappers.js";
import { DataIsRequiredException } from "../../libs/exceptions/exceptions.js";
import { EmailPublisher } from "./email.publisher.js";

@Controller()
class EmailController {
  constructor(private readonly emailService: EmailPublisher) {}

  @GrpcMethod(GRPC_SERVICES.EMAIL_SERVICE, GRPC_METHODS.SEND_EMAILS)
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

  @GrpcMethod(GRPC_SERVICES.EMAIL_SERVICE, GRPC_METHODS.SEND_CONFIRMATION_EMAIL)
  public async SendConfirmationEmail(
    payload: SendConfirmationEmailRequest
  ): Promise<SendEmailConfirmationResponse> {
    const subscription = MapSubscriptionToDomainFromProto(payload.subscription);
    await this.emailService.sendConfirmationEmail(subscription);

    return {};
  }
}

export { EmailController };
