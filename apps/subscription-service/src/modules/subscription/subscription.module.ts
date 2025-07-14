import { Repository } from "typeorm";
import { Module } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { SUBSCRIPTION_INJECTION_TOKENS } from "../../libs/enums/enums.js";
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
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.EMAIL_SERVICE,
      useFactory: (client: ClientGrpc) =>
        client.getService<IEmailService>("EmailService"),
      inject: ["EMAIL_SERVICE"],
    },
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_EMAIL_CLIENT,
      useFactory: (emailService: IEmailService) =>
        new SubscriptionEmailClient(emailService),
      inject: [SUBSCRIPTION_INJECTION_TOKENS.EMAIL_SERVICE],
    },
    {
      provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY,
      useFactory: (repository: Repository<SubscriptionEntity>) => {
        return new SubscriptionRepository(repository);
      },
      inject: [getRepositoryToken(SubscriptionEntity)],
    },
  ],
})
class SubscriptionModule {}

export { SubscriptionModule };
