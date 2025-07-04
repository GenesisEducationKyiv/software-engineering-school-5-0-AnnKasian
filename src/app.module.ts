import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "../database.config.js";
import { SubscriptionModule } from "./modules/subscription/subscription.module.js";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import path from "path";
import { CONFIG_KEYS } from "./libs/enums/config.enum.js";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisConfig } from "../redis.config.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ServeStaticModule.forRootAsync({
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
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      ...RedisConfig,
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get(CONFIG_KEYS.EMAIL_HOST),
            port: configService.get(CONFIG_KEYS.EMAIL_PORT),
            secure: false,
            auth: {
              user: configService.get(CONFIG_KEYS.EMAIL_USER),
              pass: configService.get(CONFIG_KEYS.EMAIL_PASS),
            },
          },
          defaults: {
            from: configService.get(CONFIG_KEYS.EMAIL_FROM),
          },
          template: {
            dir: process.cwd() + "/email-templates/",
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    SubscriptionModule,
    ScheduleModule.forRoot(),
  ],
})
class AppModule {}

export { AppModule };
