import path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: "EMAIL_SERVICE",
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            package: "email",
            protoPath: path.join(process.cwd(), "shared/proto/email.proto"),
            url: `email-service:${process.env.GRPC_EMAIL_SERVICE_PORT}`,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
class GrpcClientsModule {}

export { GrpcClientsModule };
