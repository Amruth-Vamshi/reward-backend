import express from "express";
import CustomerLoyaltyRouter from "../../customer-loyalty/customer-loyalty.api";
import LoyaltyLedgerRouter from "../../loyalty-ledger/loyalty-ledger.api";
import LoyaltyProgramRouter from "../../loyalty-program/loyalty-program.api";
import LoyaltyTransactionRouter from "../../loyalty-transaction/loyalty-transaction.api";
import CollectionsRouter from "../../collections/collections.api";
import CollectionsItemsRouter from "../../collection-items/collection-items.api";
import LoyaltyProgramConfigRouter from "../../loyalty-program-config/loyalty-program-config.api";
import LoyaltyProgramDetailRouter from "../../loyalty-program-detail/loyalty-program-detail.api";
import AuthRouter from "../../../../../walkin-core/src/modules/account/application/application.api";
import CampaignRouter from "../../campaigns/campaign.api";
import EventRouter from "../../../../../walkin-core/src/modules/eventFramework/eventRouter/eventRouter.api";
import EventTypeRouter from "../../../../../walkin-core/src/modules/eventFramework/eventType/eventType.api";
import CustomerLoyaltyProgramRouter from "../../customer-loyalty-program/customer-loyalty-program.api";
import ExternalIntegrationRouter from "../../external-integration/external-integration.api";
import JobRouter from "../../../../../walkin-core/src/modules/queueProcessor/queue.api";
import CommunicationRouter from "../../../../../walkin-core/src/modules/communication/communication.api";

const RewardxRouter = express.Router();

RewardxRouter.use("/", LoyaltyTransactionRouter);
RewardxRouter.use("/", CustomerLoyaltyRouter);
RewardxRouter.use("/", LoyaltyLedgerRouter);
RewardxRouter.use("/", LoyaltyProgramRouter);
RewardxRouter.use("/collections", CollectionsRouter);
RewardxRouter.use("/collection-items", CollectionsItemsRouter);
RewardxRouter.use("/", LoyaltyProgramConfigRouter);
RewardxRouter.use("/", LoyaltyProgramDetailRouter);
RewardxRouter.use("/campaigns", CampaignRouter);
RewardxRouter.use("/auth", AuthRouter);
RewardxRouter.use("/", EventRouter);
RewardxRouter.use("/", EventTypeRouter);
RewardxRouter.use("/", CustomerLoyaltyProgramRouter);
RewardxRouter.use("/jobs", JobRouter);
RewardxRouter.use("/integrations", ExternalIntegrationRouter);
RewardxRouter.use("/communication", CommunicationRouter);

export default RewardxRouter;
