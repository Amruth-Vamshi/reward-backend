import express from "express";
const AuthRouter = express.Router();

import { asyncHandler } from "../../../../../walkin-rewardx/src/modules/rest/middleware/async";
import { NextFunction } from "express";
import authMiddleware from "../auth-guard/auth-gaurd.middleware";
import { getManager } from "typeorm";
import { ApplicationModule } from "./application.module";
import { ApplicationProvider as Application } from "./application.providers";
import { getOrganizationIdFromAuthToken } from "../../common/utils/utils";
const ApplicationProvider = ApplicationModule.injector.get(Application);

AuthRouter.post(
  "/generateApiKey",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;
      const result = await getManager().transaction(async entityManager => {
        return ApplicationProvider.generateAPIKey(entityManager, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

AuthRouter.post(
  "/updateAPIKey",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;
      const result = await getManager().transaction(async entityManager => {
        const result1 = await ApplicationProvider.updateAPIKey(
          entityManager,
          input
        );
        return result1;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

AuthRouter.delete(
  "/deleteAPIKey/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = {
        id: req.params.id
      };
      const result = await getManager().transaction(async entityManager => {
        return ApplicationProvider.deleteAPIKey(entityManager, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default AuthRouter;
