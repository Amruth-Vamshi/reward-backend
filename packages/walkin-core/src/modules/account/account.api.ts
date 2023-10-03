import express from "express";
import AccessControlRouter from "./access-control/access-control.api";
import AuthRouter from "./application/application.api";
import AuthenticationRouter from "./authentication/authentication.api";
import StoreRouter from "./store/store.api";
import UserRouter from "./user/user.api";
import organizationRouter from "./organization/organization.api";
const AccountRouter = express.Router();

AccountRouter.use("/", AuthenticationRouter);
AccountRouter.use("/", StoreRouter);
AccountRouter.use("/", UserRouter);
AccountRouter.use("/", AccessControlRouter);
AccountRouter.use("/", AuthRouter);
AccountRouter.use("/",  organizationRouter);

export default AccountRouter;
