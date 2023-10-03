import { config } from "dotenv";
import { join } from "path";
if (process.env.TYPEORM_CONNECTION !== "mysql") {
  config({
    path: join(__dirname, "migrations.env")
  });
}
import ormConfig from "@walkinserver/walkin-platform-server/ormconfig";
import { ConnectionOptions } from "typeorm";

const ormConfigWithMigrations: ConnectionOptions = {
  ...ormConfig,
  cli: {
    migrationsDir: "./seeds"
  },
  migrations: ["./seeds/*.ts"],
  migrationsTableName: "seeds"
};

module.exports = ormConfigWithMigrations;
