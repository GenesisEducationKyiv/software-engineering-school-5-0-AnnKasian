import { DataSource } from "typeorm";

import { databaseConfig } from "./database.config.js";

const AppDataSource = new DataSource({
  ...databaseConfig,
});

export { AppDataSource };
