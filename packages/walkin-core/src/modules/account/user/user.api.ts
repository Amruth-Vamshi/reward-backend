import express from "express";
const UserRouter = express.Router();
import authMiddleware from "../auth-guard/auth-gaurd.middleware";
import { UserModule } from "./user.module";
import { Users } from "./user.providers";
const UserProvider = UserModule.injector.get(Users);

import { NextFunction } from "express";
import { asyncHandler } from "../../rest/middleware/async";
import { getConnection, getManager } from "typeorm";
import { MutationCreateUserArgs } from "../../../graphql/generated-models";
import {
  isValidOrg,
  isValidUser,
  validateWalkinProducts
} from "../../common/validations/Validations";
import { Organizations as OrganizationProvider } from "../organization/organization.providers";
import Initialize from "../../common/utils/orgUtils";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { getOrganizationIdFromAuthToken } from "../../common/utils/utils";

UserRouter.post(
  "/users",
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let {
        input,
        createOrganization,
        walkinProducts
      }: MutationCreateUserArgs = req.body;

      await validateWalkinProducts(walkinProducts);
      if (!input) {
        throw new WCoreError(WCORE_ERRORS.INVALID_INPUT_PASSED);
      }
      const result = await getManager().transaction(
        async transactionalEntityManager => {
          await isValidUser(transactionalEntityManager, input);
          const savedUser = await UserProvider.createUser(
            transactionalEntityManager,
            input
          );
          await isValidOrg(transactionalEntityManager, createOrganization);
          if (createOrganization) {
            let savedOrganization;
            savedOrganization = await UserModule.injector
              .get(OrganizationProvider)
              .createOrganization(
                transactionalEntityManager,
                createOrganization
              );
            savedOrganization = await UserModule.injector
              .get(OrganizationProvider)
              .addAdmin(
                transactionalEntityManager,
                savedOrganization,
                savedUser
              );
            await Initialize.initOrganization(
              UserModule.injector,
              transactionalEntityManager,
              savedOrganization,
              walkinProducts
            );
            savedUser.organization = savedOrganization;
          }
          const firstResult = await UserModule.injector
            .get(Users)
            .getUserById(transactionalEntityManager, savedUser.id);
          return firstResult;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

UserRouter.post(
  "/add-user-to-organization",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let { userData, organization_id, role_id } = req.body;
      const result = await getConnection().transaction(
        async transactionalEntityManager => {
          const res = await UserProvider.addUserToOrganization(
            transactionalEntityManager,
            userData,
            organization_id,
            role_id
          );
          return res;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

UserRouter.post(
  "/delete-user-by-id/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const result = await getManager().transaction(async entityManager => {
        return UserProvider.deleteUserById(entityManager, userId);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

UserRouter.put(
  "/update-user/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const id = req.params.id;
      input["id"] = id;
      const result = await getManager().transaction(async entityManager => {
        return UserProvider.updateUser(entityManager, input);
      });
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

UserRouter.put(
  "/change-user-type/:id",
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const userId = req.params.id;
      const input = req.body;
      input["userId"] = userId;
      const result = await getManager().transaction(async entityManager => {
        return UserProvider.changeUserType(entityManager, input);
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

UserRouter.get(
  "/users/:id",
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const id = req.params.id;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const result = await getManager().transaction(async entityManager => {
        return UserProvider.getUserByIdWithOrgId(
          entityManager,
          id,
          organizationId
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

UserRouter.get(
  "/users",
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const { pageOptions, sortOptions } = input;
      const result = await getManager().transaction(async entityManager => {
        return UserProvider.getAllUsers(
          entityManager,
          pageOptions,
          sortOptions,
          organizationId
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

UserRouter.post(
  "/update-password",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = req.user;
      const result = await getManager().transaction(async entityManager => {
        return UserProvider.updatePassword(
          entityManager,
          oldPassword,
          newPassword,
          user
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default UserRouter;
