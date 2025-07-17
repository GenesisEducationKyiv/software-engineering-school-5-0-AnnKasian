import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter.js";

const testMailerConfig = () => {
  return {
    transport: {
      host: "localhost",
      port: 7071,
      secure: false,
    },
    defaults: {
      from: "test@example.com",
    },
    template: {
      dir: process.cwd() + "/apps/email-service/src/libs/email-templates/",
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};

export { testMailerConfig };
