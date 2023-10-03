import { config } from "dotenv";
import { join } from "path";

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
  migrations: ["./migrations/*.ts"],
  migrationsTableName: "migrations"
};

module.exports = ormConfigWithMigrations;
