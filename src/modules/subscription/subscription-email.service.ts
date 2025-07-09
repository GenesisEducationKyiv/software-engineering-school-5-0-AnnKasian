import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { WeatherService } from "../weather/weather.service.js";
import { EmailSubject, EmailTemplate } from "./email-data/email-data.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { SUBSCRIPTION_EMAIL_STATUS } from "./enums/enums.js";
import { SubscriptionEmailErrorHandler } from "./helpers/helpers.js";

@Injectable()
class SubscriptionEmailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly baseUrl: string,
    private readonly weatherService: WeatherService
  ) {}

  async sendWeatherEmail(
    city: string,
    subscriptions: SubscriptionEntity[]
  ): Promise<void> {
    const weather = await this.weatherService.get(city);

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

  async sendConfirmationEmail(subscription: SubscriptionEntity) {
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
      SubscriptionEmailErrorHandler(error);
    }
  }

  async sendEmails(subscriptions: SubscriptionEntity[]): Promise<void> {
    const cities: Record<string, SubscriptionEntity[]> = {};
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

      SubscriptionEmailErrorHandler(firstError);
    }
  }
}

export { SubscriptionEmailService };
