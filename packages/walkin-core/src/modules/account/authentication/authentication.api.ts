import express, { NextFunction } from "express";
import { asyncHandler } from "../../../../../walkin-rewardx/src/modules/rest/middleware/async";
const AuthenticationRouter = express.Router();
import { AuthenicationModule } from "./authentication.module";
import { AuthenticationProvider as Authentication } from "./authentication.providers";
const AuthenticationProvider = AuthenicationModule.injector.get(Authentication);

AuthenticationRouter.post("/login",
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const result = await AuthenticationProvider.login(req.body);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default AuthenticationRouter;
