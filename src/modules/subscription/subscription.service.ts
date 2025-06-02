import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SubscriptionRepository } from "./subscription.repository.js";
import {
  SubscribeFilterDto,
  SubscribeResponseDto,
  type SubscriptionDto,
} from "./types/types.js";
import { MailerService } from "@nestjs-modules/mailer";
import { WeatherService } from "../weather/weather.service.js";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Frequency } from "./enums/enums.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { ConfigService } from "@nestjs/config";

@Injectable()
class SubscriptionService {
  public constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly weatherService: WeatherService
  ) {}

  private async sendFrequencyEmails(frequency: Frequency): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByFrequency(
      frequency
    );

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

  @Cron(CronExpression.EVERY_HOUR)
  public async sendHourlyEmails(): Promise<void> {
    await this.sendFrequencyEmails(Frequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  public async sendDailyEmails(): Promise<void> {
    await this.sendFrequencyEmails(Frequency.DAILY);
  }

  private async sendWeatherEmail(
    city: string,
    subscriptions: SubscriptionEntity[]
  ): Promise<void> {
    const weather = await this.weatherService.get(city);

    await Promise.all(
      subscriptions.map((subscription) =>
        this.mailerService.sendMail({
          to: subscription.email,
          subject: "Weather subscription",
          template: "weather-notify",
          context: {
            city: subscription.city,
            temperature: weather.temperature,
            humidity: weather.humidity,
            description: weather.description,
            unsubscribeUrl: `${this.configService.get(
              "BASE_URL"
            )}/action.html?action=unsubscribe&token=${subscription.token}`,
          },
        })
      )
    );
  }

  private async sendConfirmationEmail(subscription: SubscriptionEntity) {
    await this.mailerService.sendMail({
      to: subscription.email,
      subject: "Confirmation email",
      template: "confirm",
      context: {
        confirmUrl: `${this.configService.get(
          "BASE_URL"
        )}/action.html?action=confirm&token=${subscription.token}`,
      },
    });
  }

  public async subscribe(data: SubscriptionDto): Promise<SubscribeResponseDto> {
    const existingSubscribe = await this.subscriptionRepository.find({
      email: data.email,
    });

    if (existingSubscribe) {
      if (existingSubscribe.confirmed === true) {
        throw new ConflictException("Email already subscribed.");
      }

      await this.sendConfirmationEmail(existingSubscribe);

      return { token: existingSubscribe.token };
    }

    const subscription = await this.subscriptionRepository.create(data);
    await this.sendConfirmationEmail(subscription);

    return { token: subscription.token };
  }

  private async findToken({
    token,
  }: SubscribeFilterDto): Promise<SubscriptionEntity> {
    const existingSubscribe = await this.subscriptionRepository.find({
      token,
    });

    if (!existingSubscribe) {
      throw new NotFoundException("Token not found.");
    }

    return existingSubscribe;
  }

  public async confirm(token: string): Promise<void> {
    const subscription = await this.findToken({ token });

    if (subscription.confirmed === true) {
      throw new ConflictException("Email already confirmed.");
    }

    await this.subscriptionRepository.confirm(subscription);
  }

  public async unsubscribe(token: string): Promise<void> {
    const subscription = await this.findToken({ token });
    await this.subscriptionRepository.delete(subscription?.id);
  }
}

export { SubscriptionService };
