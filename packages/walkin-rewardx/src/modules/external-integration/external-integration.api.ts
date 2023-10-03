import express from "express";
const ExternalIntegrationRouter = express.Router();

import FyndIntegrationRouter from "@walkinserver/walkin-rewardx/src/modules/external-integration/fynd/external-integration-fynd.api";

ExternalIntegrationRouter.use("/fynd", FyndIntegrationRouter);

export default ExternalIntegrationRouter;
