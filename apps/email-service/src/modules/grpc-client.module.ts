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
        name: "WEATHER_SERVICE",
        useFactory: () => ({
          transport: Transport.GRPC,
          options: {
            package: "weather",
            protoPath: path.join(process.cwd(), "shared/proto/weather.proto"),
            url: `${process.env[CONFIG_KEYS.WEATHER_SERVICE_HOST]}:${
              process.env[CONFIG_KEYS.GRPC_WEATHER_SERVICE_PORT]
            }`,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
class GrpcClientsModule {}

export { GrpcClientsModule };
