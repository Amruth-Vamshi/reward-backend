import express from "express";
const AccessControlRouter = express.Router();
import authMiddleware from "../auth-guard/auth-gaurd.middleware";
import { NextFunction } from "express";
import { asyncHandler } from "../../rest/middleware/async";
import { AccessControlModule } from "./access-control.module";
import { AccessControls } from "./access-control.providers";
import { getConnection } from "typeorm";
import {
  POLICY_PERMISSION_CONSOLE,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
const AccessControl = AccessControlModule.injector.get(AccessControls);

AccessControlRouter.post(
  "/add-role",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const result = await getConnection().transaction(async entityManager => {
        const res = await AccessControl.addRole(entityManager, input);
        return res;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

AccessControlRouter.put(
  "/edit-role/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const id = req.params.id;
      input["id"] = id;
      const result = await getConnection().transaction(async entityManager => {
        const res = await AccessControl.editRole(entityManager, { input });
        return res;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

AccessControlRouter.post(
  "/add-policies-to-role",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { roleId, policies = [] } = req.body;
      const result = await getConnection().transaction(async entityManager => {
        for (const policy of policies) {
          const allowedPolicies = [
            ...Object.values(POLICY_PERMISSION_CONSOLE),
            ...Object.values(POLICY_PERMISSION_ENTITY)
          ];
          const validPolicy = allowedPolicies.includes(policy.permission);
          if (!validPolicy) {
            throw new WCoreError(WCORE_ERRORS.INVALID_PERMISSION);
          }
        }
        const response = await AccessControl.addPoliciesToRole(
          entityManager,
          roleId,
          policies
        );
        return response;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

AccessControlRouter.post(
  "/remove-policies-from-role",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { roleId, policyIds = [] } = req.body;
      const result = await getConnection().transaction(async entityManager => {
        const response = await AccessControl.removePoliciesFromRole(
          entityManager,
          roleId,
          policyIds
        );
        return response;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

AccessControlRouter.get(
  "/get-role/:roleId",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { roleId } = req.params;
      const result = await getConnection().transaction(async entityManager => {
        const response = await AccessControl.getRole(entityManager, roleId);
        return response;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

AccessControlRouter.get(
  "/get-roles",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const result = await getConnection().transaction(async entityManager => {
        const response = await AccessControl.getAllRoles(entityManager);
        return response;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default AccessControlRouter;
