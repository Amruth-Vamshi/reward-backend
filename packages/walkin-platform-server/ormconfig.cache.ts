import { config } from "dotenv";
import { join } from "path";

if (process.env.TYPEORM_CONNECTION === undefined) {
  config({
    path: join(__dirname, "development.env"),
  });
}

import ormConfig from "./ormconfig";
import { ConnectionOptions } from "typeorm";

const ormConfigs: ConnectionOptions = {
  ...ormConfig,
};

module.exports = ormConfigs;
