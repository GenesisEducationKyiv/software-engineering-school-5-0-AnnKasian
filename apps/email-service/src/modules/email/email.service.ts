import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable } from "@nestjs/common";
import { ERROR_MESSAGES } from "../../../../../shared/libs/enums/enums.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import {
  EmailSubject,
  EmailTemplate,
} from "../../libs/email-data/email-data.js";
import {
  EMAIL_INJECTION_TOKENS,
  EMAIL_STATUS,
  EMAIL_URLS,
} from "../../libs/enums/enums.js";
import { EmailSendFailException } from "../../libs/exceptions/exceptions.js";
import { EmailWeatherClient } from "./email-weather.client.js";

@Injectable()
class EmailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly baseUrl: string,
    @Inject(EMAIL_INJECTION_TOKENS.EMAIL_WEATHER_CLIENT)
    private readonly emaiWeatherClient: EmailWeatherClient
  ) {}

  async sendConfirmationEmail(subscription: Subscription) {
    const currentDate = new Date();

    try {
      await this.mailerService.sendMail({
        to: subscription.email,
        subject: EmailSubject.CONFIRM,
        template: EmailTemplate.CONFIRM,
        context: {
          year: currentDate.getFullYear(),
          confirmUrl: `${this.baseUrl}${EMAIL_URLS.CONFIRM}${subscription.token}`,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new EmailSendFailException(error.message);
      }

      throw new EmailSendFailException(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

  async sendEmails(subscriptions: Subscription[]): Promise<void> {
    const cities: Record<string, Subscription[]> = {};
    subscriptions.forEach((subscription) => {
      cities[subscription.city] ??= [];
      cities[subscription.city].push(subscription);
    });

    await Promise.allSettled(
      Object.entries(cities).map(([city, subscriptions]) =>
        this.sendWeatherEmail(city, subscriptions)
      )
    );
  }

  async sendWeatherEmail(
    city: string,
    subscriptions: Subscription[]
  ): Promise<void> {
    const weather = await this.emaiWeatherClient.get(city);

    const currentDate = new Date();

    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        this.mailerService.sendMail({
          to: subscription.email,
          subject: EmailSubject.SUBSCRIBE,
          template: EmailTemplate.WEATHER_NOTIFY,
          context: {
            city: subscription.city,
            temperature: weather.temperature,
            humidity: weather.humidity,
            description: weather.description,
            year: currentDate.getFullYear(),
            unsubscribeUrl: `${this.baseUrl}${EMAIL_URLS.UNSUBSCRIBE}${subscription.token}`,
          },
        })
      )
    );

    this.handleEmailFailures(results);
  }

  private handleEmailFailures(results: PromiseSettledResult<void>[]) {
    const failures = results.filter(
      (result) => result.status === EMAIL_STATUS.REJECTED
    );

    if (failures.length) {
      const firstError = failures[0].reason as Error;

      throw new EmailSendFailException(firstError.message);
    }
  }
}

export { EmailService };
