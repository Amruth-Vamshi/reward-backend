import express from "express";
const Router = express.Router();
import CoreRouter from "@walkinserver/walkin-core/src/modules/rest/api";
import RewardxRouter from "@walkinserver/walkin-rewardx/src/modules/rest/api";

Router.use("/", CoreRouter);
Router.use("/", RewardxRouter);

export default Router;
