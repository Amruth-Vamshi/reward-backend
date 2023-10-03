import express from "express";
const LoyaltyProgramConfigRouter = express.Router();
import { getManager } from "typeorm";
import authMiddleware from "../../../../walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { LoyaltyProgramConfigModule } from "./loyalty-program-config.module";
import { LoyaltyProgramConfigProvider as LoyaltyProgramConfig } from "./loyalty-program-config.provider";
const LoyaltyProgramConfigProvider = LoyaltyProgramConfigModule.injector.get(
  LoyaltyProgramConfig
);
import { NextFunction } from "express";
import { asyncHandler } from "../rest/middleware/async";
import {
  getOrganizationIdFromAuthToken,
  setOrganizationToInput
} from "../../../../walkin-core/src/modules/common/utils/utils";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";

LoyaltyProgramConfigRouter.get(
  "/get-loyalty-program-configs",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      // retrieve the loyaltyCardCode from the query parameters of the url
      // If the loyaltyCardCode is not passed then it will be undefined
      const { loyaltyCardCode} = req.query;
      
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const input = {organizationId , loyaltyCardCode}

      const result = await getManager().transaction(manager => {
        return LoyaltyProgramConfigProvider.getLoyaltyProgramConfigs(
          manager,
          LoyaltyProgramConfigModule.injector,
          input
        );
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramConfigRouter.get(
  "/get-loyalty-program-config-by-id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { configId } = req.query;
      let input = { configId };
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramConfigProvider.getLoyaltyProgramConfigsById(
          manager,
          LoyaltyProgramConfigModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramConfigRouter.post(
  "/create-loyalty-program-config",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramConfigProvider.createLoyaltyProgramConfig(
          manager,
          LoyaltyProgramConfigModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramConfigRouter.post(
  "/update-loyalty-program-config",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramConfigProvider.updateLoyaltyProgramConfig(
          manager,
          LoyaltyProgramConfigModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramConfigRouter.delete(
  "/delete-loyalty-program-config",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let { configId } = req.query;
      let input = { configId };
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramConfigProvider.deleteLoyaltyProgramConfig(
          manager,
          LoyaltyProgramConfigModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default LoyaltyProgramConfigRouter;
