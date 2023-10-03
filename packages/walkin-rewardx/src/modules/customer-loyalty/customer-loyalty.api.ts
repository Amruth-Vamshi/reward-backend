import express from "express";
const CustomerLoyaltyRouter = express.Router();
import authMiddleware from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";

import { CustomerLoyaltyModule } from "./customer-loyalty.module";
import { CustomerLoyaltyProvider as CustomerLoyalty } from "./customer-loyalty.provider";
const CustomerLoyaltyProvider = CustomerLoyaltyModule.injector.get(
  CustomerLoyalty
);

import { CustomerLoyaltyRepository as CLP } from "./customer-loyalty.repository";
const CustomerLoyaltyRepository = CustomerLoyaltyModule.injector.get(CLP);
import { getManager } from "typeorm";
import { NextFunction } from "express";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { asyncHandler } from "../rest/middleware/async";

CustomerLoyaltyRouter.get(
  "/get-customer-loyalty",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const queryParams = req.query;
      const externalCustomerId =
        input.externalCustomerId || queryParams.externalCustomerId;
      const loyaltyCardCode =
        input.loyaltyCardCode || queryParams.loyaltyCardCode;
      const storeId = input.storeId || queryParams.storeId;

      input["externalCustomerId"] = externalCustomerId;
      input["loyaltyCardCode"] = loyaltyCardCode;
      input["storeId"] = storeId;

      const user = req.user;
      const application = req.application;
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (user) {
          organizationId = user.organization.id;
        } else if (application) {
          organizationId = application.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      input["createCustomerIfNotExist"] = true;
      let result = await getManager().transaction(async manager => {
        let result1 = await CustomerLoyaltyProvider.getCustomerLoyalty(
          manager,
          CustomerLoyaltyModule.injector,
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

CustomerLoyaltyRouter.post(
  "/update-customer-loyalty-status",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body.input;
      input = setOrganizationToInput(input, req.user, req.application);
      let result = await getManager().transaction(async manager => {
        return CustomerLoyaltyRepository.updateCustomerLoyaltyStatus_rawQuery(
          manager,
          CustomerLoyaltyModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default CustomerLoyaltyRouter;
