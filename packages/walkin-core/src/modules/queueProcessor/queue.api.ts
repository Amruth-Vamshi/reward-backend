import express, { NextFunction } from "express";
import { getManager } from "typeorm";
import { asyncHandler } from "../../../../walkin-rewardx/src/modules/rest/middleware/async";
import authMiddleware from "../account/auth-guard/auth-gaurd.middleware";
import { getOrganizationIdFromAuthToken } from "../common/utils/utils";
import { QueueProvider as Queue } from "./queue.provider";
import { queueProcessorModule } from "./queueProcessor.module";
const QueueProvider = queueProcessorModule.injector.get(Queue);
const JobRouter = express.Router();

JobRouter.get(
  "/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { queueName = "" } = req.body;
      const result = await getManager().transaction(transactionManager => {
        return QueueProvider.getJobById(queueName, id);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

JobRouter.post(
  "/fail-job/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { queueName = "", reason = "" } = req.body;
      const response = await getManager().transaction(transactionManager => {
        return QueueProvider.failJob(queueName, id, reason);
      });
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  })
);

JobRouter.post(
  "/",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(transactionManager => {
        return QueueProvider.createJob(
          transactionManager,
          queueProcessorModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

JobRouter.delete(
  "/remove-job/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { queueName = "" } = req.body;
      const result = await getManager().transaction(transactionManager => {
        return QueueProvider.removeJob(
          queueName,
          id
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default JobRouter;
