import express from "express";
const LoyaltyProgramRouter = express.Router();
import authMiddleware from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { LoyaltyProgramModule } from "./loyalty-program.module";
import { LoyaltyProgramProvider as LoyaltyProgram } from "./loyalty-program.provider";
const LoyaltyProgramProvider = LoyaltyProgramModule.injector.get(
    LoyaltyProgram
);
import { getManager } from "typeorm";
import { asyncHandler } from "../rest/middleware/async";
import { NextFunction } from "express";

LoyaltyProgramRouter.get(
    "/get-loyalty-programs-by-code",
    authMiddleware,
    asyncHandler(async (req: any, res: any, next: NextFunction) => {
        try {
            const input = req.query;
            let result = await getManager().transaction(manager => {
                let result1 = LoyaltyProgramProvider.getLoyaltyProgramsByCode(manager, LoyaltyProgramModule.injector, input);
                return result1;
            });
            return res.status(200).send(result);
        } catch (error) {
           next(error);
        }
    })
);

export default LoyaltyProgramRouter;