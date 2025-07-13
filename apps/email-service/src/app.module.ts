import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";
import { EmailModule } from "./modules/email/email.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
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
    EmailModule,
  ],
})
class AppModule {}

export { AppModule };
