import { Injectable } from "@nestjs/common";
import { WeatherService } from "../weather/weather.service.js";
import { EmailSubject, EmailTemplate } from "./email-data/email-data.js";
import { Subscription } from "./types/types.js";
import { MailerService } from "@nestjs-modules/mailer";
import { EmailSendFailException } from "./exceptions/exceptions.js";
import { SUBSCRIPTION_EMAIL_STATUS } from "./enums/enums.js";
import { ERROR_MESSAGES } from "../../libs/enums/enums.js";

@Injectable()
class SubscriptionEmailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly baseUrl: string,
    private readonly weatherService: WeatherService
  ) {}

  async sendWeatherEmail(
    city: string,
    subscriptions: Subscription[]
  ): Promise<void> {
    const weather = await this.weatherService.get({ city });

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
            unsubscribeUrl: `${this.baseUrl}/action.html?action=unsubscribe&token=${subscription.token}`,
          },
        })
      )
    );

    this.handleEmailFailures(results);
  }

  async sendConfirmationEmail(subscription: Subscription) {
    const currentDate = new Date();

    try {
      await this.mailerService.sendMail({
        to: subscription.email,
        subject: EmailSubject.CONFIRM,
        template: EmailTemplate.CONFIRM,
        context: {
          year: currentDate.getFullYear(),
          confirmUrl: `${this.baseUrl}/action.html?action=confirm&token=${subscription.token}`,
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

  private handleEmailFailures(results: PromiseSettledResult<void>[]) {
    const failures = results.filter(
      (result) => result.status === SUBSCRIPTION_EMAIL_STATUS.REJECTED
    );

    if (failures.length) {
      const firstError = failures[0].reason as Error;

      throw new EmailSendFailException(firstError.message);
    }
  }
}

export { SubscriptionEmailService };
