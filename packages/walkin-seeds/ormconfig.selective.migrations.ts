import { config } from "dotenv";
import { join } from "path";
import { selectiveMigrations } from "./selective.migrations";

if (selectiveMigrations.length == 0) {
  console.log("No migrations to run/revert.\nExiting...");
  process.exit(0);
}

if (process.env.TYPEORM_CONNECTION !== "mysql") {
  config({
    path: join(__dirname, "migrations.env")
  });
}
import ormConfig from "../walkin-platform-server/ormconfig";
import { ConnectionOptions } from "typeorm";

const ormConfigWithMigrations: ConnectionOptions = {
  ...ormConfig,
  cli: {
    migrationsDir: "./migrations"
  },
  migrations: selectiveMigrations,
  migrationsTableName: "migrations"
};

module.exports = ormConfigWithMigrations;
