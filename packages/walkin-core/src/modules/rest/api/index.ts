import express from "express";
import AccountRouter from "../../account/account.api";
import ProductCatalogRouter from "../../productcatalog/productCatalog.api";
import RuleRouter from "../../rule/rule.api";
import TierRouter from "../../tier/tier.api";
const CoreRouter = express.Router();

CoreRouter.use("/", AccountRouter);
CoreRouter.use("/", RuleRouter);
CoreRouter.use("/", ProductCatalogRouter);
CoreRouter.use("/", TierRouter);
export default CoreRouter;
