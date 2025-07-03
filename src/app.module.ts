import path from "path";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "../database.config.js";
import { ConfigKeys } from "./libs/enums/config.enum.js";
import { SubscriptionModule } from "./modules/subscription/subscription.module.js";

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
          serveRoot: configService.get(ConfigKeys.SERVE_ROOT),
          serveStaticOptions: {
            index: "index.html",
            extensions: ["html"],
          },
        },
      ],
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get(ConfigKeys.EMAIL_HOST),
            port: configService.get(ConfigKeys.EMAIL_PORT),
            secure: false,
            auth: {
              user: configService.get(ConfigKeys.EMAIL_USER),
              pass: configService.get(ConfigKeys.EMAIL_PASS),
            },
          },
          defaults: {
            from: configService.get(ConfigKeys.EMAIL_FROM),
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
