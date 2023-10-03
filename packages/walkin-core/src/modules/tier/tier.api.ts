import express, { NextFunction } from "express";
import Container from "typedi";
import { getManager } from "typeorm";
const TierRouter = express.Router();
import authMiddleware from "../account/auth-guard/auth-gaurd.middleware";
import { TierModule } from "./tier.module";
import { TierRepository } from "./tier.repository";
import { setOrganizationToInputV2 } from "../common/utils/utils";
import { asyncHandler } from "../rest/middleware/async";

TierRouter.get(
    "/get-tier",
    authMiddleware,
    asyncHandler(async (req:any, res:any, next: NextFunction) => {
        try {
            const user = req.user;
            const application = req.application;
            let input = req.query;
            input = setOrganizationToInputV2(input, user, application);
            const result = await getManager().transaction(async manager => {
                const res = await Container.get(TierRepository).getTier(manager, input);
                return res;
            })
            return res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    })
)

TierRouter.get(
    "/get-tiers",
    authMiddleware,
    asyncHandler(async (req:any, res:any, next: NextFunction) => {
        try {
            const user = req.user;
            const application = req.application;
            let input = {};
            input = setOrganizationToInputV2(input, user, application);
            const result = await getManager().transaction(async manager => {
                const res = await Container.get(TierRepository).getTiers(manager, input);
                return res;
            })
            return res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    })
)

TierRouter.post(
    "/create-tier",
    authMiddleware,
    asyncHandler(async (req:any, res:any, next: NextFunction) => {
        try {
            const user = req.user;
            const application = req.application;
            let input = req.body;
            input = setOrganizationToInputV2(input, user, application);
            const result = await getManager().transaction(async manager => {
                const res = await Container.get(TierRepository).createTier(manager, input);
                return res;
            })
            return res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    })
)

TierRouter.delete(
    "/delete-tier",
    authMiddleware,
    asyncHandler(async (req:any, res:any, next: NextFunction) => {
        try {
            const user = req.user;
            const application = req.application;
            let input = req.query;
            input = setOrganizationToInputV2(input, user, application);
            const result = await getManager().transaction(async manager => {
                const res = await Container.get(TierRepository).deleteTier(manager, input);
                return res;
            })
            return res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    })
)

export default TierRouter;