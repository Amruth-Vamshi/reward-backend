import express from "express";
const LoyaltyProgramDetailRouter = express.Router();
import { getManager } from "typeorm";
import authMiddleware from "../../../../walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { LoyaltyProgramDetailModule } from "./loyalty-program-detail.module";
import { LoyaltyProgramDetailProvider as LoyaltyProgramDetail } from "./loyalty-program-detail.provider";
const LoyaltyProgramDetailProvider = LoyaltyProgramDetailModule.injector.get(
  LoyaltyProgramDetail
);
import { NextFunction } from "express";
import { asyncHandler } from "../rest/middleware/async";
import {
  getOrganizationIdFromAuthToken,
  setOrganizationToInput
} from "../../../../walkin-core/src/modules/common/utils/utils";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { LoyaltyProgramDetailRepository } from "./loyalty-program-detail.repository";
import { Container } from "typedi";

LoyaltyProgramDetailRouter.get(
  "/get-loyalty-program-details",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let { organizationId } = req.query;
      let input = {};
      input = setOrganizationToInput(input, req.application, req.user);
      // @ts-ignore
      if (organizationId != input.organizationId) {
        throw new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH);
      }
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramDetailProvider.getLoyaltyProgramDetails(
          manager,
          LoyaltyProgramDetailModule.injector,
          organizationId
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramDetailRouter.get(
  "/get-loyalty-program-detail-by-id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let { detailId } = req.query;
      let input = { detailId };
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return Container.get(
          LoyaltyProgramDetailRepository
        ).getLoyaltyProgramDetailById(
          manager,
          LoyaltyProgramDetailModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramDetailRouter.get(
  "/get-loyalty-program-detail-by-code",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let { detailCode } = req.query;
      let input = { detailCode };
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramDetailProvider.getLoyaltyProgramDetailByCode(
          manager,
          LoyaltyProgramDetailModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramDetailRouter.get(
  "/get-loyalty-program-detail-by-config-id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { configId } = req.query;
      const pageOptions = {page: req.query.page, pageSize: req.query.pageSize}
      let input = { configId };
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramDetailProvider.getLoyaltyProgramDetailByConfigId(
          manager,
          input,
          pageOptions
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramDetailRouter.post(
  "/create-loyalty-program-detail",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramDetailProvider.createLoyaltyProgramDetail(
          manager,
          LoyaltyProgramDetailModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramDetailRouter.post(
  "/update-loyalty-program-detail",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramDetailProvider.updateLoyaltyProgramDetail(
          manager,
          LoyaltyProgramDetailModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

LoyaltyProgramDetailRouter.delete(
  "/delete-loyalty-program-detail",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let { detailCode } = req.query;
      let input = { detailCode };
      input = setOrganizationToInput(input, req.application, req.user);
      const result = await getManager().transaction(manager => {
        return LoyaltyProgramDetailProvider.deleteLoyaltyProgramDetail(
          manager,
          LoyaltyProgramDetailModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default LoyaltyProgramDetailRouter;
