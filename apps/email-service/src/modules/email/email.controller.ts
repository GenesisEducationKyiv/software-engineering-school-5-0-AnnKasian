import { Controller } from "@nestjs/common";
import { EmailService } from "./email.service.js";
import { GrpcMethod } from "@nestjs/microservices";
import {
  SendEmailsRequest,
  SendEmailsResponse,
  SendConfirmationEmailRequest,
  SendEmailConfirmationResponse,
} from "../../../generated/email.js";
import { grpcErrorHandler } from "../../../../../shared/libs/helpers/helpers.js";
import { MapToDomainFromProto } from "../../libs/mappers/mappers.js";
import { DataIsRequiredException } from "../../libs/exceptions/exceptions.js";

@Controller()
class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @GrpcMethod("EmailService", "SendEmails")
  public async SendEmails(
    payload: SendEmailsRequest
  ): Promise<SendEmailsResponse> {
    try {
      if (payload.subscription && payload.subscription.length > 0) {
        const subscriptions = payload.subscription.map((subscription) =>
          MapToDomainFromProto(subscription)
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

  @GrpcMethod("EmailService", "sendConfirmationEmail")
  public async sendConfirmationEmail(
    payload: SendConfirmationEmailRequest
  ): Promise<SendEmailConfirmationResponse> {
    try {
      const subscription = MapToDomainFromProto(payload.subscription);
      await this.emailService.sendConfirmationEmail(subscription);

      return {};
    } catch (error: unknown) {
      return grpcErrorHandler(error);
    }
  }
}

export { EmailController };
