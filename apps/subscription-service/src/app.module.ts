import path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";
import { databaseConfig } from "../database.config.js";
import { SubscriptionModule } from "./modules/subscription/subscription.module.js";

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
          rootPath: path.join(process.cwd(), "shared/public"),
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
