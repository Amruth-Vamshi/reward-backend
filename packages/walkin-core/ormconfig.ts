import { ConnectionOptions } from "typeorm";
import { stitchEntities } from "./src/modules/common/utils";

export const getORMConfig = (...entities): ConnectionOptions => {
  const stitchedEntities = stitchEntities(entities);
  let type: ConnectionOptions["type"];
  switch (process.env.TYPEORM_CONNECTION) {
    case "cockroachdb":
      type = "cockroachdb";
      break;

    case "expo":
      type = "expo";
      break;
    case "mariadb":
      type = "mariadb";
      break;
    case "mssql":
      type = "mssql";
      break;
    case "mysql":
      type = "mysql";
      break;

    case "oracle":
      type = "oracle";
      break;
    case "postgres":
      type = "postgres";
      break;

    case "sqlite":
      type = "sqlite";
      break;

    default:
      type = "mysql";
  }
  /**
   * Base ORM Config to be used for all deployments
   */
  const ormConfig: any = {
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    type,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    logging: process.env.TYPEORM_LOGGING
      ? process.env.TYPEORM_LOGGING === "true"
      : false,
    cache: {
      type: "ioredis",
      options: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        maxRetriesPerRequest: null,
        enableReadyCheck: false
      }
    },
    maxQueryExecutionTime: process.env.MAX_QUERY_EXECUTION_TIME, // in milliseconds
    extra: {
      connectionLimit: process.env.CONNECTION_LIMIT
    },
    entities: stitchedEntities,
    synchronize: process.env.TYPEORM_SYNCHRONIZE
      ? process.env.TYPEORM_SYNCHRONIZE === "true"
      : false,
    dropSchema: process.env.TYPEORM_DROP_SCHEMA ? true : false,
    legacySpatialSupport: false,
    charset: "UTF8MB4"
  };
  return ormConfig;
};
