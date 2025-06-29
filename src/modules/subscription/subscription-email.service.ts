import { Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { WeatherService } from "../weather/weather.service.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { EmailSubject, EmailTemplate } from "./email-data/email-data.js";
import { SubscriptionConfig } from "./types/subscription-config.type.js";
import { MailerService } from "@nestjs-modules/mailer";
import { SubscriptionEmailErrorHandler } from "./helpers/helpers.js";
import { WeatherDto } from "../weather/types/weather.dto.type.js";

@Injectable()
class SubscriptionEmailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly config: SubscriptionConfig,
    private readonly weatherService: WeatherService,
    private readonly cacheManager: Cache
  ) {}

  async sendWeatherEmail(
    city: string,
    subscriptions: SubscriptionEntity[]
  ): Promise<void> {
    let weather = await this.getCachedWeather(city);

    if (!weather) {
      weather = await this.weatherService.get(city);
      await this.casheWeather(city, weather);
    }

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
            unsubscribeUrl: `${this.config.baseUrl}/action.html?action=unsubscribe&token=${subscription.token}`,
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
          confirmUrl: `${this.config.baseUrl}/action.html?action=confirm&token=${subscription.token}`,
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
    const failures = results.filter((result) => result.status === "rejected");

    if (failures.length) {
      const firstError = failures[0].reason as Error;

      SubscriptionEmailErrorHandler(firstError);
    }
  }

  private async casheWeather(city: string, weather: WeatherDto) {
    await this.cacheManager.set(city, weather, this.config.cacheTTL);
  }

  private async getCachedWeather(city: string): Promise<WeatherDto | null> {
    const cachedData = await this.cacheManager.get<WeatherDto>(city);

    return cachedData ?? null;
  }
}

export { SubscriptionEmailService };
