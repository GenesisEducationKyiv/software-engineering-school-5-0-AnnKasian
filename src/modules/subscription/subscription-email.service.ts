import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { WeatherService } from "../weather/weather.service.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { EmailSubject, EmailTemplate } from "./email-data/email-data.js";
import { ConfigKeys } from "../../libs/enums/enums.js";

@Injectable()
class SubscriptionEmailService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly weatherService: WeatherService
  ) {}

  async sendWeatherEmail(
    city: string,
    subscriptions: SubscriptionEntity[]
  ): Promise<void> {
    const weather = await this.weatherService.get(city);

    const currentDate = new Date();

    await Promise.all(
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
            unsubscribeUrl: `${this.configService.get(
              ConfigKeys.BASE_URL
            )}/action.html?action=unsubscribe&token=${subscription.token}`,
          },
        })
      )
    );
  }

  async sendConfirmationEmail(subscription: SubscriptionEntity) {
    const currentDate = new Date();
    await this.mailerService.sendMail({
      to: subscription.email,
      subject: EmailSubject.CONFIRM,
      template: EmailTemplate.CONFIRM,
      context: {
        year: currentDate.getFullYear(),
        confirmUrl: `${this.configService.get(
          ConfigKeys.BASE_URL
        )}/action.html?action=confirm&token=${subscription.token}`,
      },
    });
  }

  async sendEmails(subscriptions: SubscriptionEntity[]): Promise<void> {
    const cities: Record<string, SubscriptionEntity[]> = {};
    subscriptions.forEach((subscription) => {
      cities[subscription.city] ??= [];
      cities[subscription.city].push(subscription);
    });

    await Promise.all(
      Object.entries(cities).map(([city, subscriptions]) =>
        this.sendWeatherEmail(city, subscriptions)
      )
    );
  }
}

export { SubscriptionEmailService };
