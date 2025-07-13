import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "../database.config.js";
import { SubscriptionModule } from "./modules/subscription/subscription.module.js";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import path from "path";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: path.join(import.meta.dirname, "..", "..", "public"),
          serveRoot: configService.get(CONFIG_KEYS.SERVE_ROOT),
          serveStaticOptions: {
            index: "index.html",
            extensions: ["html"],
          },
        },
      ],
    }),
    SubscriptionModule,
    ScheduleModule.forRoot(),
  ],
})
class AppModule {}

export { AppModule };
