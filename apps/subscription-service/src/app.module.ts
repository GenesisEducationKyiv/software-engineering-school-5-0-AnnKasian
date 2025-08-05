import path from "path";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";
import { LoggerModule } from "../../../shared/observability/logs/logger.module.js";
import { MetricsModule } from "../../../shared/observability/metrics/metrics.module.js";
import { CustomMetricsService } from "../../../shared/observability/metrics/metrics.service.js";
import { databaseConfig } from "../database.config.js";
import { SubscriptionModule } from "./modules/subscription/subscription.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    MetricsModule,
    TypeOrmModule.forRootAsync({
      useFactory: (metricsService: CustomMetricsService) => ({
        ...databaseConfig,
        logging: true,
        logger: {
          logQuery: (query: string) => {
            const operation = query.trim().split(" ")[0].toUpperCase();
            metricsService.incrementDbQueries(operation, "database");
          },
          logQueryError: () => {
            metricsService.incrementErrors("db_error", "typeorm");
          },
          logQuerySlow: () => {},
          logSchemaBuild: () => {},
          logMigration: () => {},
          log: () => {},
        },
      }),
      inject: [CustomMetricsService],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: path.join(process.cwd(), "shared/public"),
          serveRoot: configService.get<string>(CONFIG_KEYS.SERVE_ROOT),
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
