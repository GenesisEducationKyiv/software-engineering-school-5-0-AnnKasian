import { Repository } from "typeorm";
import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionEntity } from "./entities/entities.js";
import { SubscriptionRepository } from "./subscription.repository.js";
import { SubscriptionService } from "./subscription.service.js";
import { SUBSCRIPTION_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import { IEmailService } from "../../libs/interfaces/interfaces.js";
import { ClientGrpc } from "@nestjs/microservices";
import { GrpcClientsModule } from "../grpc-client.module.js";
import { SubscriptionController } from "./subscription.controller.js";

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
      provide: SUBSCRIPTION_INJECTION_TOKENS.SUBSCRIPTION_REPOSITORY,
      useFactory: (repository: Repository<SubscriptionEntity>) => {
        return new SubscriptionRepository(repository);
      },
      inject: [getRepositoryToken(SubscriptionEntity)],
    },
  ],
})
export class SubscriptionModule {}
