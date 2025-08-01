import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";
import { SubscriptionService } from "../../modules/subscription/subscription.service.js";

@Injectable()
class EmailSchedulerCron {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Cron(CronExpression.EVERY_HOUR)
  public async hourly(): Promise<void> {
    await this.subscriptionService.sendEmails(Frequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  public async daily(): Promise<void> {
    await this.subscriptionService.sendEmails(Frequency.DAILY);
  }
}

export { EmailSchedulerCron };
