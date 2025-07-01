import { type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";

config();

const testDatabaseConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env.DATABASE_TEST_HOST || "localhost",
  port: parseInt(process.env.DATABASE_TEST_PORT || "5435", 10),
  username: process.env.DATABASE_TEST_USER || "postgres",
  password: process.env.DATABASE_TEST_PASSWORD || "postgres",
  database: process.env.DATABASE_TEST_NAME || "weather_notify_test",
  entities: [],
  synchronize: true,
  dropSchema: false,
  logging: false,
};

export { testDatabaseConfig };
