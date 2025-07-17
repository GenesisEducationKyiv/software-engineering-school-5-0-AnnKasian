import path from "path";
import { fileURLToPath } from "url";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";
import { EmailModule } from "./modules/email/email.module.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const emailUser = configService.get<string>(CONFIG_KEYS.EMAIL_USER);
        const emailPass = configService.get<string>(CONFIG_KEYS.EMAIL_PASS);

        return {
          transport: {
            host: configService.get<string>(CONFIG_KEYS.EMAIL_HOST),
            port: configService.get<number>(CONFIG_KEYS.EMAIL_PORT),
            secure: false,
            auth:
              emailUser && emailPass
                ? {
                    user: emailUser,
                    pass: emailPass,
                  }
                : undefined,
          },
          tls: {
            rejectUnauthorized: configService.get<boolean>(
              CONFIG_KEYS.EMAIL_TLS
            ),
          },
          defaults: {
            from: configService.get<string>(CONFIG_KEYS.EMAIL_FROM),
          },
          template: {
            dir: path.join(__dirname, "..", "email-templates"),
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
