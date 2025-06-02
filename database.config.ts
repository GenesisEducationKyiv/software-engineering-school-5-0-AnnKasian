import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type DataSourceOptions } from "typeorm";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number.parseInt(process.env.DATABASE_PORT ?? "5432", 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [path.join(__dirname, "src/modules/**/*.entity{.ts,.js}")],
  migrations: [path.join(__dirname, "src/db/migrations/*.ts")],
  migrationsRun: true,
  logging: true,
};

export { databaseConfig };
