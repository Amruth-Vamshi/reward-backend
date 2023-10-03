import { getORMConfig } from "../../../ormconfig";
import {
  createConnection,
  getConnection,
  Connection,
  TransactionManager,
  getConnectionManager,
  getConnectionOptions
} from "typeorm";
import path from "path";
import { User } from "../../../src/entity";
import { setupUserForUnitTesting, loadSeeds } from "./UnitfactorySetup";
import i18n from "i18n";
import { WALKIN_QUEUES } from "../../../src/modules/common/constants";
export { loadTestKeys } from "./loadKeys";
import { createBullConsumer } from "../../../src/jobs/utils/index";

/**
 *
 * @param entities Add only entities you are using not all
 */
export const createUnitTestConnection = async (...entities) => {
  const ormconfig = getORMConfig(...entities);
  try {
    await createConnection(ormconfig);
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param entities Add only entities you are using not all
 */
export const closeUnitTestConnection = async () => {
  let connection: Connection;
  if (!getConnectionManager().has("default")) {
    const connectionOptions = await getConnectionOptions();
    connection = await createConnection(connectionOptions);
  } else {
    connection = getConnection();
  }
  await getConnection().queryResultCache.clear();
  return getConnection().close();
};

export const getAdminUser = async (connection: Connection) =>
  connection.transaction(async transactionManager => {
    await loadSeeds(transactionManager);
    return setupUserForUnitTesting(transactionManager);
  });

export const setupI18n = () => {
  i18n.configure({
    locales: ["en-IN"],
    directory: path.join(__dirname, "..", "locales"),
    defaultLocale: "en-IN",
    syncFiles: true,
    autoReload: true,
    updateFiles: false,
    objectNotation: true
  });
  let request: any = {
    languages: ["en-IN"],
    regions: ["IN"],
    language: "en",
    region: "IN",
    locale: "en-IN"
  };
  let response: any = {};

  i18n.init(request, response);
};

export const emptyQueues = async () => {
  for (const item in WALKIN_QUEUES) {
    if (isNaN(Number(item))) {
      const bull = createBullConsumer(item);
      await bull.clean(0, "delayed");
      await bull.clean(0, "wait");
      await bull.clean(0, "active");
      await bull.clean(0, "completed");
      await bull.clean(0, "failed");
    }
  }
  console.log("Emptied all WALKIN_QUEUES");
};
