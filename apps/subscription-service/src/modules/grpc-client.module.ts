import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CONFIG_KEYS } from "../../../../shared/libs/enums/enums.js";
import path from "path";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: "EMAIL_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: "email",
            protoPath: path.join(process.cwd(), "shared/proto/email.proto"),
            url: `email-service:${configService.get<number>(
              CONFIG_KEYS.GRPC_EMAIL_SERVICE_PORT
            )}`,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientsModule {}
