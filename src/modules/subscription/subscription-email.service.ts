import { Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { WeatherService } from "../weather/weather.service.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { EmailSubject, EmailTemplate } from "./email-data/email-data.js";
import { SubscriptionConfig } from "./types/types.js";
import { MailerService } from "@nestjs-modules/mailer";
import { EmailSendFailException } from "./exceptions/exceptions.js";
import { SUBSCRIPTION_EMAIL_STATUS } from "./enums/enums.js";
import { WeatherDto } from "../weather/types/types.js";
import { ERROR_MESSAGES } from "../../libs/enums/enums.js";

@Injectable()
class SubscriptionEmailService {
  private readonly logger: Logger;

  public constructor(
    private readonly mailerService: MailerService,
    private readonly config: SubscriptionConfig,
    private readonly weatherService: WeatherService,
    private readonly cacheManager: Cache
  ) {
    this.logger = new Logger(SubscriptionEmailService.name);
  }

  async sendWeatherEmail(
    city: string,
    subscriptions: SubscriptionEntity[]
  ): Promise<void> {
    const cachedWeather = await this.getCachedWeather(city);
    const weather = cachedWeather ?? (await this.weatherService.get(city));

    this.logger.log(
      cachedWeather
        ? `Weather loaded from cache for ${city}`
        : `Weather fetched from API for ${city}`
    );

    if (!cachedWeather) {
      await this.cacheWeather(city, weather);
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
      if (error instanceof Error) {
        throw new EmailSendFailException(error.message);
      }

      throw new EmailSendFailException(ERROR_MESSAGES.UNKNOWN_ERROR);
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

      throw new EmailSendFailException(firstError.message);
    }
  }

  private async cacheWeather(city: string, weather: WeatherDto) {
    await this.cacheManager.set(city, weather, this.config.cacheTTL);
  }

  private async getCachedWeather(city: string): Promise<WeatherDto | null> {
    const cachedData = await this.cacheManager.get<WeatherDto>(city);

    return cachedData ?? null;
  }
}

export { SubscriptionEmailService };
