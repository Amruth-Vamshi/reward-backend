import express from "express";
const FyndIntegrationRouter = express.Router();
import { getManager } from "typeorm";
import { NextFunction } from "express";
import { asyncHandler } from "@walkinserver/walkin-core/src/modules/rest/middleware/async";
import { generateOrganizationToken } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { ExternalIntegrationModule } from "@walkinserver/walkin-rewardx/src/modules/external-integration/external-integration.module";
import { ExternalIntegrationProvider } from "@walkinserver/walkin-rewardx/src/modules/external-integration/external-integration.provider";
import { customerModule } from "@walkinserver/walkin-core/src/modules/customer/customer.module";
import { CustomerProvider } from "@walkinserver/walkin-core/src/modules/customer/customer.providers";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants";
import moment from "moment";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import {
  VALID_STATUS_FOR_FYND,
  CUSTOMER_QUERY_PARAMS
} from "../../common/constants/constant";
import Container from "typedi";

const customerProvider = customerModule.injector.get(CustomerProvider);

FyndIntegrationRouter.post(
  "/:orgId/:loyaltyType/",
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;

      let { orgId, loyaltyType } = req.params;
      let identifierForCustomer = req.headers["x-customer-id"];
      if (
        !VALID_STATUS_FOR_FYND.includes(
          input.payload.shipment.shipment_status.status
        )
      ) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }

      input = setOrganizationToInput(input, req.user, req.application);
      const authToken = await generateOrganizationToken(orgId);
      const currentTime = moment().utcOffset(330);
      const customDate = [
        currentTime.format("YYYY"),
        currentTime.format("MM"),
        currentTime.format("DD"),
        currentTime.format("HH"),
        currentTime.format("mm"),
        currentTime.format("ss")
      ];
      if (!input.payload.shipment.order_id) {
        throw new WCoreError(WCORE_ERRORS.ORDER_ID_NOT_PROVIDED);
      }
      const loyaltyReferenceId = "fynd:" + input.payload.shipment.order_id;

      let query: any = {};
      if (identifierForCustomer == CUSTOMER_QUERY_PARAMS.EMAIL) {
        if (!input.payload.shipment.user.email) {
          throw new WCoreError(WCORE_ERRORS.EMAIL_NOT_PROVIDED);
        }
        query = {
          email: input.payload.shipment.user.email
        };
      } else if (identifierForCustomer == CUSTOMER_QUERY_PARAMS.MOBILE) {
        if (!input.payload.shipment.user.mobile) {
          throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_REQUIRED);
        }
        query = {
          phoneNumber: input.payload.shipment.user.mobile
        };
      } else {
        throw new WCoreError(WCORE_ERRORS.INVALID_HEADER_VALUE);
      }

      let result = await getManager().transaction(async manager => {
        const customer = await customerProvider.getCustomer(
          manager,
          query,
          orgId
        );
        if (!customer || customer.status == STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
        }

        input["date"] = customDate;
        let inputParams = {
          authToken,
          orgId,
          loyaltyType,
          loyaltyReferenceId,
          customer,
          payload: input
        };
        const issuePoints = await Container.get(
          ExternalIntegrationProvider
        ).issuePoints(manager, inputParams);
        return issuePoints;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default FyndIntegrationRouter;
