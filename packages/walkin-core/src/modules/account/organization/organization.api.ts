import express from "express";
const organizationRouter = express.Router();
import authMiddleware from "../auth-guard/auth-gaurd.middleware";
import { OrganizationModule } from "./organization.module";
import { Organizations } from "./organization.providers";

const OrganizationProvider = OrganizationModule.injector.get(Organizations);

import { NextFunction } from "express";
import { asyncHandler } from "../../rest/middleware/async";
import { getManager } from "typeorm";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { getOrganizationIdFromAuthToken } from "../../common/utils/utils";

organizationRouter.get(
    "/organizations/:id",
    authMiddleware,
    asyncHandler(async (req: any, res: any, next: NextFunction) => {
        try {
            // Get the organization ID from the request parameters
            const requestedId = req.params.id;
          
            // Get the organization ID from the authorization token
            const authToken = req.headers.authorization;
            const organizationId = getOrganizationIdFromAuthToken(authToken);
          
            // Check if the requested ID matches the organization ID in the token
            if (requestedId !== organizationId) {
              throw new WCoreError(WCORE_ERRORS.CANT_ACCESS_OTHER_ORGANIZATION);
            }
          
            const result = await getManager().transaction(async (entityManager) => {
              return OrganizationProvider.getOrganization(entityManager, organizationId);
            });

            return res.status(200).send(result);
          } catch (error) {
              next(error);
            
          }        
    })
);



export default organizationRouter;
