import express, { NextFunction } from "express";
import { getManager } from "typeorm";
import authMiddleware from "../../../../walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { getOrganizationIdFromAuthToken } from "../../../../walkin-core/src/modules/common/utils/utils";
import { asyncHandler } from "../rest/middleware/async";
import { CampaignModule } from "./campaign.module";
import { CampaignProvider as Campaign } from "./campaign.providers";
const CampaignProvider = CampaignModule.injector.get(Campaign);
const CampaignRouter = express.Router();

CampaignRouter.get(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await getManager().transaction(transactionManager => {
        return CampaignProvider.getCampaign(transactionManager, id);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CampaignRouter.get(
  "/",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.query;
      const {
        applicationId = null,
        campaignType = [],
        campaignStatus = null,
        campaignTriggerType = null,
        name = null
      } = input;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const pageOptions = {page: req.query.page, pageSize: req.query.pageSize}
      const apiInput = {
        organizationId,
        applicationId,
        campaignType,
        campaignStatus,
        campaignTriggerType,
        name
      };
      const result = await getManager().transaction(transactionManager => {
        return CampaignProvider.getCampaigns(transactionManager, apiInput, pageOptions);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CampaignRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const user = req.user;
      const result = await getManager().transaction(transactionManager => {
        return CampaignProvider.createCampaign(
          transactionManager,
          input,
          user,
          CampaignModule.injector
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CampaignRouter.put(
  "/:campaignId/update-campaign",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const campaignId = req.params.campaignId;
      const input = req.body;

      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(transactionManager => {
        return CampaignProvider.updateCampaign(
          transactionManager,
          campaignId,
          input,
          CampaignModule.injector
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CampaignRouter.put(
  "/:campaignId/update-status",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const campaignId = req.params.campaignId;
      const campaignStatus = req.body.campaignStatus;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const apiInput = {
        campaignStatus,
        organizationId
      };

      const result = await getManager().transaction(transactionManager => {
        return CampaignProvider.updateCampaignStatus(
          transactionManager,
          campaignId,
          apiInput,
          CampaignModule.injector
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CampaignRouter.put(
  "/:campaignScheduleId/update-schedule",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const campaignScheduleId = req.params.campaignScheduleId;
      const { status, cronExpression } = req.body;
      let apiInput = {
        id: campaignScheduleId,
        organizationId: getOrganizationIdFromAuthToken(
          req.headers.authorization
        )
      };

      if (status) {
        apiInput["status"] = status;
      }

      if (cronExpression) {
        apiInput["cronExpression"] = cronExpression;
      }

      const result = await getManager().transaction(transactionManager => {
        return CampaignProvider.updateCampaignSchedule(
          transactionManager,
          apiInput,
          CampaignModule.injector
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);
export default CampaignRouter;
