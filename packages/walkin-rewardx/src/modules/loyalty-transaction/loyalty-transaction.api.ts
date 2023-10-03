import express from "express";
const LoyaltyTransactionRouter = express.Router();
import authMiddleware from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { LoyaltyTransactionModule } from "./loyalty-transaction.module";
import { LoyaltyTransactionProvider as LoyaltyTransaction } from "./loyalty-transaction.provider";
const LoyaltyTransactionProvider = LoyaltyTransactionModule.injector.get(
  LoyaltyTransaction
);
import { getManager } from "typeorm";
import { ActionUtils } from "../common/utils/ActionUtils";
import { JSON_SCHEMA, LOYALTY_ACTION_TYPE } from "../common/constants/constant";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { startLoyaltyTransactionJob } from "@walkinserver/walkin-core/src/modules/common/utils/digdagJobsUtil";
import { asyncHandler } from "../rest/middleware/async";
import { NextFunction } from "express";
import Ajv from "ajv";
import { REWARDX_SCHEMA } from "../common/schema/loyalty-transaction-apis.schema";

const ajv = new Ajv();

LoyaltyTransactionRouter.post(
  "/earnable-burnable-points",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const earnableBurnableInputArgs = req.body;
      const user = req.user;
      const application = req.application;
      let organizationId = null;
      if (!earnableBurnableInputArgs.organizationId) {
        if (user) {
          organizationId = user.organization.id;
        } else if (application) {
          organizationId = application.organization.id;
        }
        earnableBurnableInputArgs["organizationId"] = organizationId;
      }
      const validate = ajv.compile(
        REWARDX_SCHEMA[JSON_SCHEMA.EARNABLE_BURNABLE_POINTS]
      );
      const valid = validate(earnableBurnableInputArgs);
      if (!valid) {
        throw new Error(validate.errors.map(e => e.message).join(","));
      }
      let result = await getManager().transaction(async manager => {
        let result = await LoyaltyTransactionProvider.earnableBurnablePoints(
          manager,
          LoyaltyTransactionModule.injector,
          earnableBurnableInputArgs
        );
        return result;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyTransactionRouter.post(
  "/process-loyalty-redemption",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const processLoyaltyRedemptionInput = req.body;
      const user = req.user;
      const application = req.application;
      let organizationId = null;
      if (user) {
        organizationId = user.organization.id;
      } else if (application) {
        organizationId = application.organization.id;
      }
      processLoyaltyRedemptionInput["organizationId"] = organizationId;
      const validate = ajv.compile(
        REWARDX_SCHEMA[JSON_SCHEMA.PROCESS_LOYALTY_ISSUANCE]
      );
      const valid = validate(processLoyaltyRedemptionInput);
      if (!valid) {
        throw new WCoreError({
          HTTP_CODE: 400,
          MESSAGE: validate.errors.map(e => e.message).join(","),
          CODE: "VE"
        });
      }
      let result = await getManager().transaction(
        async transactionalEntityManager => {
          processLoyaltyRedemptionInput["statusCode"] = 101;
          let result = await LoyaltyTransactionProvider.burnPoints(
            transactionalEntityManager,
            LoyaltyTransactionModule.injector,
            processLoyaltyRedemptionInput
          );
          return result;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyTransactionRouter.post(
  "/process-loyalty-issuance",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const processLoyaltyIssuranceInput = req.body;
      const user = req.user;
      const application = req.application;
      let organizationId = null;
      if (user) {
        organizationId = user.organization.id;
      } else if (application) {
        organizationId = application.organization.id;
      }
      processLoyaltyIssuranceInput["organizationId"] = organizationId;
      const validate = ajv.compile(
        REWARDX_SCHEMA[JSON_SCHEMA.PROCESS_LOYALTY_ISSUANCE]
      );
      const valid = validate(processLoyaltyIssuranceInput);
      if (!valid) {
        throw new WCoreError({
          HTTP_CODE: 400,
          MESSAGE: validate.errors.map(e => e.message).join(","),
          CODE: "VE"
        });
      }
      let result = await getManager().transaction(
        async transactionalEntityManager => {
          processLoyaltyIssuranceInput["createCustomerIfNotExist"] = true;
          processLoyaltyIssuranceInput["statusCode"] = 102;
          let result = await LoyaltyTransactionProvider.issuePoints(
            transactionalEntityManager,
            LoyaltyTransactionModule.injector,
            processLoyaltyIssuranceInput
          );
          return result;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyTransactionRouter.post(
  "/issue-points-with-order-id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { loyaltyReferenceId } = req.body;
      let organizationId: string;
      if (req.user) {
        organizationId = req.user.organization.id;
      } else if (req.application) {
        organizationId = req.application.organization.id;
      }
      let result = await getManager().transaction(
        async transactionalEntityManager => {
          let result1 = await LoyaltyTransactionProvider.issuePointsWithOrderId(
            transactionalEntityManager,
            LoyaltyTransactionModule.injector,
            loyaltyReferenceId,
            organizationId
          );
          return result1;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyTransactionRouter.post(
  "/create-or-update-loyalty-transaction",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const user = req.user;
      const application = req.application;
      const processLoyaltyInput = req.body;
      let organizationId = null;
      if (!(processLoyaltyInput && processLoyaltyInput.organizationId)) {
        if (user) {
          organizationId = user.organization.id;
        } else if (application) {
          organizationId = application.organization.id;
        }
        processLoyaltyInput["organizationId"] = organizationId;
      }
      const validate = ajv.compile(
        REWARDX_SCHEMA[JSON_SCHEMA.CREATE_OR_UPDATE_LOYALTY_TRANSACTION]
      );
      const valid = validate(processLoyaltyInput);
      if (!valid) {
        throw new WCoreError({
          HTTP_CODE: 400,
          MESSAGE: validate.errors.map(e => e.message).join(","),
          CODE: "VE"
        });
      }
      let result = await getManager().transaction(
        async transactionalEntityManager => {
          let result = await LoyaltyTransactionProvider.createOrUpdateLoyaltyTransaction(
            transactionalEntityManager,
            LoyaltyTransactionModule.injector,
            processLoyaltyInput
          );
          return result;
        }
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyTransactionRouter.post(
  "/cancel-loyalty-transaction",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
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
      let result = await getManager().transaction(manager => {
        let result1 = LoyaltyTransactionProvider.cancelLoyaltyTransaction(
          manager,
          LoyaltyTransactionModule.injector,
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

LoyaltyTransactionRouter.post(
  "initiate-loyalty-transaction",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const loyaltyTransactionInput = req.body;
      let result = await getManager().transaction(
        async transactionalEntityManager => {
          let result1 = LoyaltyTransactionProvider.initiateLoyaltyTransaction(
            transactionalEntityManager,
            LoyaltyTransactionModule.injector,
            loyaltyTransactionInput
          );
          return result1;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyTransactionRouter.post(
  "/process-loyalty-transaction",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const loyaltyTransactionInput = req.body.loyaltyTransactionInput;
      const jwt = req.jwt;
      const user = req.user;
      const application = req.application;
      let organizationId = null;
      if (user) {
        organizationId = user.organization.id;
      } else if (application) {
        organizationId = application.organization.id;
      }
      let result = await getManager().transaction(async manager => {
        try {
          let result = await startLoyaltyTransactionJob(
            organizationId,
            jwt,
            loyaltyTransactionInput
          );
          let result1 = await LoyaltyTransactionProvider.statusReducer(result);
          return result1;
        } catch (error) {
          console.log("Error while calling digdag startLoyaltyTransactionJob");
          console.log(error);
        }
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyTransactionRouter.get(
  "/loyalty-transaction-status",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { loyaltyReferenceId } = req.body;
      let organizationId: string;
      if (req.user) {
        organizationId = req.user.organization.id;
      } else if (req.application) {
        organizationId = req.application.organization.id;
      }
      let result = await getManager().transaction(
        async transactionalEntityManager => {
          let result1 = LoyaltyTransactionProvider.getLoyaltyTransactionStatus(
            transactionalEntityManager,
            LoyaltyTransactionModule.injector,
            loyaltyReferenceId,
            organizationId
          );
          return result1;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default LoyaltyTransactionRouter;
