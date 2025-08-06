import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {
  EmailSubject,
  EmailTemplate,
} from "../../../../../shared/libs/email-data/email-data.js";
import { ERROR_MESSAGES } from "../../../../../shared/libs/enums/enums.js";
import { Subscription } from "../../../../../shared/libs/types/types.js";
import {
  EMAIL_DISPATCH_SETTINGS,
  EMAIL_INJECTION_TOKENS,
  EMAIL_STATUS,
  EMAIL_URLS,
  EmailCommandTypes,
} from "../../libs/enums/enums.js";
import { EmailSendFailException } from "../../libs/exceptions/exceptions.js";
import { createBatchesHelper } from "../../libs/helpers/helpers.js";
import { IMessageBroker } from "../../libs/interfaces/interfaces.js";
import {
  type WeatherEmailCommand,
  type EmailConfirmationCommand,
  BatchEmailCommand,
} from "../../libs/types/types.js";
import { EmailWeatherClient } from "./email-weather.client.js";

@Injectable()
class EmailConsumer implements OnModuleInit {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly baseUrl: string,
    @Inject(EMAIL_INJECTION_TOKENS.EMAIL_WEATHER_CLIENT)
    private readonly emailWeatherClient: EmailWeatherClient,
    @Inject(EMAIL_INJECTION_TOKENS.MESSAGE_BROKER)
    private readonly messageBrokerService: IMessageBroker,
    private readonly topic: string
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initConsumer();
  }

  private async initConsumer(): Promise<void> {
    await this.messageBrokerService.subscribe(this.topic, async (command) => {
      switch (command.type) {
        case EmailCommandTypes.emailConfirmation:
          await this.processConfirmationEmail(command);
          break;
        case EmailCommandTypes.weatherEmail:
          await this.processEmails(command);
          break;
        case EmailCommandTypes.batchEmail:
          await this.processBatchEmails(command);
          break;
      }
    });
  }

  private async processConfirmationEmail(
    command: EmailConfirmationCommand
  ): Promise<void> {
    const { subscription } = command;
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

  private async processBatchEmails(command: BatchEmailCommand): Promise<void> {
    await this.processEmails({
      type: EmailCommandTypes.weatherEmail,
      subscriptions: command.subscriptions,
    });
  }

  private async processEmails(command: WeatherEmailCommand): Promise<void> {
    const { subscriptions } = command;
    const cities: Record<string, Subscription[]> = {};
    subscriptions.forEach((subscription) => {
      cities[subscription.city] ??= [];
      cities[subscription.city].push(subscription);
    });

    await Promise.allSettled(
      Object.entries(cities).map(([city, subscriptions]) =>
        this.sendWeatherEmailForCity(city, subscriptions)
      )
    );
  }

  private async sendWeatherEmailForCity(
    city: string,
    subscriptions: Subscription[]
  ): Promise<void> {
    const weather = await this.emailWeatherClient.get(city);
    const currentDate = new Date();
    const batches = createBatchesHelper(subscriptions);
    const allResults: PromiseSettledResult<void>[] = [];

    for (const batch of batches) {
      const results = await Promise.allSettled(
        batch.map((subscription) =>
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

      allResults.push(...results);

      if (batch !== batches[batches.length - 1]) {
        await this.delay(EMAIL_DISPATCH_SETTINGS.RATE_LIMIT_DELAY);
      }
    }

    this.handleEmailFailures(allResults);
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
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

export { EmailConsumer };
