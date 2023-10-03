import { createBullConsumer } from "./utils";
import { getManager } from "typeorm";
import { LoyaltyTransactionProvider as LoyaltyTransaction } from "../../../walkin-rewardx/src/modules/loyalty-transaction/loyalty-transaction.provider";
import { LoyaltyTransactionModule } from "../../../walkin-rewardx/src/modules/loyalty-transaction/loyalty-transaction.module";
import { updateSavedJob } from "./utils/commonUtils";

const injector = LoyaltyTransactionModule.injector;
const LoyaltyTransactionProvider = injector.get(LoyaltyTransaction);

export const EXPIRE_CUSTOMER_LOYALTY_POINTS_PROCESSING = {
  name: "EXPIRE_CUSTOMER_LOYALTY_POINTS",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  }
};

const expireCustomerLoyaltyPointsProcessingQueue = createBullConsumer(
  EXPIRE_CUSTOMER_LOYALTY_POINTS_PROCESSING.name
);

expireCustomerLoyaltyPointsProcessingQueue.process(async (job, done) => {
  const data = job.data;
  const transactionManager = getManager();
  const { organizationId, savedJobId } = data;

  try {
    await LoyaltyTransactionProvider.expirePointsUpdated(
      transactionManager,
      injector,
      organizationId
    );
    await updateSavedJob(transactionManager, savedJobId, organizationId);
    done(null);
  } catch (error) {
    done(error);
  }
});

console.log(EXPIRE_CUSTOMER_LOYALTY_POINTS_PROCESSING.name + " initialised");
