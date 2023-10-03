import express, { NextFunction } from "express";
import Container from "typedi";
import { getManager } from "typeorm";
import { asyncHandler } from "../../../../../walkin-rewardx/src/modules/rest/middleware/async";
import authMiddleware from "../../account/auth-guard/auth-gaurd.middleware";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { getOrganizationIdFromAuthToken } from "../../common/utils/utils";

import { eventTypeModule } from "./eventType.module";
import { EventTypeRepository } from "./eventType.repository";
import { EventTypeService } from "./eventType.service";
const EventTypeProvider = eventTypeModule.injector.get(EventTypeService);
const EventTypeRouter = express.Router();

EventTypeRouter.get(
  "/event-types",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      const application = req.application;
      if (!application) {
        throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
      }
      const relations = [];
      let result = await getManager().transaction(async transactionManager => {
        const eventType = await Container.get(EventTypeRepository).getEventTypeForOrganization(
          transactionManager,
          organizationId,
          relations
        );
        return eventType;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
)

EventTypeRouter.get(
  "/event-types/:code",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const code = req.params.code;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      const application = req.application;
      if (!application) {
        throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
      }
      const relations = ["application"];
      let result = await getManager().transaction(async transactionManager => {
        let eventType;
        eventType = await Container.get(EventTypeRepository).getEventTypeByCode(
          transactionManager,
          code,
          organizationId,
          relations
        );
        eventType = eventType ? eventType : {};
        return eventType;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
)

EventTypeRouter.post(
  "/event-types",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const requestBody = req.body;
      const { code, description } = requestBody;
      const application = req.application;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const input = {
        code,
        application,
        description,
        organizationId
      };

      const result = await getManager().transaction(transactionManager => {
        return EventTypeProvider.createEventType(transactionManager, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

EventTypeRouter.put(
  "/update-event-type/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { code, description, status } = req.body;
      const application = req.application;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const apiInput = {
        id,
        code,
        description,
        status,
        organizationId,
        application
      }

      const result = await getManager().transaction(transactionManager => {
        return EventTypeProvider.updateEventType(transactionManager, apiInput);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

EventTypeRouter.get(
  "/event-types/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const eventTypeId = req.params.id;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      const result = await getManager().transaction(transactionManager => {
        return EventTypeProvider.eventTypeById(
          transactionManager,
          eventTypeId,
          organizationId
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default EventTypeRouter;
