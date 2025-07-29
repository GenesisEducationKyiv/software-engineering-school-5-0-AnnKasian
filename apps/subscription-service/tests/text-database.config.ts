import { config } from "dotenv";
import { type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CONFIG_KEYS } from "../../../shared/libs/enums/enums.js";

config();

const testDatabaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env[CONFIG_KEYS.TEST_DATABASE_HOST] ?? "localhost",
  port: parseInt(process.env[CONFIG_KEYS.TEST_DATABASE_PORT] ?? "5435", 10),
  username: process.env[CONFIG_KEYS.TEST_DATABASE_USER] ?? "postgres",
  password: process.env[CONFIG_KEYS.TEST_DATABASE_PASSWORD] ?? "postgres",
  database:
    process.env[CONFIG_KEYS.TEST_DATABASE_NAME] ?? "weather_notify_test",
  entities: [],
  synchronize: true,
  dropSchema: false,
  logging: false,
};

export { testDatabaseConfig };
