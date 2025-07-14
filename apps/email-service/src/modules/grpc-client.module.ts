import path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

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
            url: `weather-service:${process.env.GRPC_WEATHER_SERVICE_PORT}`,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
class GrpcClientsModule {}

export { GrpcClientsModule };
