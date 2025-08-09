import path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CONFIG_KEYS } from "../../../../shared/libs/enums/enums.js";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: "EMAIL_SERVICE",
        useFactory: () => {
          return {
            transport: Transport.GRPC,
            options: {
              package: "email",
              protoPath: path.join(process.cwd(), "shared/proto/email.proto"),
              url: `${process.env[CONFIG_KEYS.EMAIL_SERVICE_HOST]}:${
                process.env[CONFIG_KEYS.GRPC_EMAIL_SERVICE_PORT]
              }`,
            },
          };
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
class GrpcClientsModule {}

export { GrpcClientsModule };
