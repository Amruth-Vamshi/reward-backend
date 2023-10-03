import express, { NextFunction } from "express";
import { getManager } from "typeorm";
import authMiddleware from "../../account/auth-guard/auth-gaurd.middleware";
import { getOrganizationIdFromAuthToken } from "../../common/utils/utils";
import { asyncHandler } from "../../rest/middleware/async";
import { eventRouterModule } from "./eventRouter.module";
import { EventRouterService } from "./eventRouter.service";
const EventRouterProvider = eventRouterModule.injector.get(EventRouterService);
const EventRouter = express.Router();

EventRouter.get(
  "/events",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(transactionManager => {
        return EventRouterProvider.eventsByFilters(transactionManager, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

EventRouter.get(
  "/events/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const eventId = req.params.id;
      const input = {
        id: eventId
      };
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(transactionManager => {
        return EventRouterProvider.eventById(transactionManager, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

EventRouter.post(
  "/events",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const args = {
        application: req.application
      };
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;
      const result = await getManager().transaction(transactionManager => {
        return EventRouterProvider.createEvent(transactionManager, args, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

EventRouter.put(
  "/update-event/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const id = req.params.id;
      input["id"] = id;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
        );
      input["organizationId"] = organizationId;
      
      input["application"] = req.application;
      
      const result = await getManager().transaction(transactionManager => {
        return EventRouterProvider.updateEvent(transactionManager, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

EventRouter.post(
  "/record-event",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const args = {
        application: req.application
      };
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;
      const result = await getManager().transaction(transactionManager => {
        return EventRouterProvider.recordEvent(
          eventRouterModule.injector,
          transactionManager,
          args,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default EventRouter;
