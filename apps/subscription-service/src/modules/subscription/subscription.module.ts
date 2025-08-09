import { Repository } from "typeorm";
import { Module } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { GRPC_SERVICES } from "../../../../../shared/libs/enums/enums.js";
import { CustomMetricsService } from "../../../../../shared/observability/metrics/metrics.service.js";
import { EmailSchedulerCron } from "../../libs/cli/cli.js";
import { SUBSCRIPTION_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import { MetricsHelper } from "../../libs/helpers/helpers.js";
import { IEmailService } from "../../libs/interfaces/interfaces.js";
import { GrpcClientsModule } from "../grpc-client.module.js";
import { SubscriptionEntity } from "./entities/entities.js";
import { SubscriptionEmailClient } from "./subscription-email.client.js";
import { SubscriptionController } from "./subscription.controller.js";
import { SubscriptionRepository } from "./subscription.repository.js";
import { SubscriptionService } from "./subscription.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), GrpcClientsModule],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionService,
    EmailSchedulerCron,
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.EMAIL_SERVICE,
      useFactory: (client: ClientGrpc) =>
        client.getService<IEmailService>(GRPC_SERVICES.EMAIL_SERVICE),
      inject: ["EMAIL_SERVICE"],
    },
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_EMAIL_CLIENT,
      useFactory: (emailService: IEmailService) =>
        new SubscriptionEmailClient(emailService),
      inject: [SUBSCRIPTION_INJECTION_TOKENS.EMAIL_SERVICE],
    },
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.METRICS_SERVICE,
      useExisting: CustomMetricsService,
    },
    {
      provide: MetricsHelper,
      useFactory: (metricsService: CustomMetricsService) =>
        new MetricsHelper(metricsService),
      inject: [SUBSCRIPTION_INJECTION_TOKENS.METRICS_SERVICE],
    },
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY,
      useFactory: (
        repository: Repository<SubscriptionEntity>,
        metricsHelper: MetricsHelper
      ) => {
        return new SubscriptionRepository(repository, metricsHelper);
      },
      inject: [getRepositoryToken(SubscriptionEntity), MetricsHelper],
    },
  ],
  exports: [SubscriptionService],
})
class SubscriptionModule {}

export { SubscriptionModule };
