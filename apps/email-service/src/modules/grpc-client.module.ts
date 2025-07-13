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
        name: "WEATHER_SERVICE",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: "weather",
            protoPath: path.join(process.cwd(), "shared/proto/weather.proto"),
            url: `weather-service:${configService.get<number>(
              CONFIG_KEYS.GRPC_WEATHER_SERVICE_PORT
            )}`,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientsModule {}
