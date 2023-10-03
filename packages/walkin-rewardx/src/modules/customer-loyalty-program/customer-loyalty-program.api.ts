import express from "express";
const CustomerLoyaltyProgramRouter = express.Router();
import authMiddleware from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { getManager } from "typeorm";
import { NextFunction } from "express";
import { asyncHandler } from "@walkinserver/walkin-core/src/modules/rest/middleware/async";

import { CustomerLoyaltyProgramModule } from "./customer-loyalty-program.module";
import { CustomerLoyaltyProgramProvider as CLPP } from "./customer-loyalty-program.provider";
import { CustomerLoyaltyProgramRepository as CLPR } from "./customer-loyalty-program.repository";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

const CustomerLoyaltyProgramProvider = CustomerLoyaltyProgramModule.injector.get(
  CLPP
);
const CustomerLoyaltyProgramRepository = CustomerLoyaltyProgramModule.injector.get(
  CLPR
);

CustomerLoyaltyProgramRouter.post(
  "/update-customer-loyalty-program-status",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body.input;
      input = setOrganizationToInput(input, req.user, req.application);
      let result = await getManager().transaction(async manager => {
        return CustomerLoyaltyProgramRepository.updateCustomerLoyaltyProgramStatus_rawQuery(
          manager,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default CustomerLoyaltyProgramRouter;
