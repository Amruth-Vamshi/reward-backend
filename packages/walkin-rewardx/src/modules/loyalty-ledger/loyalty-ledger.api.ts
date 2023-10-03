import express from "express";
const LoyaltyLedgerRouter = express.Router();
import authMiddleware from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";

import { LoyaltyLedgerModule } from "./loaylty-ledger.module";
import { LoyaltyLedgerProvider as LoyaltyLedger } from "./loyalty-ledger.providers";
const LoyaltyLedgerProvider = LoyaltyLedgerModule.injector.get(LoyaltyLedger);
import { getManager } from "typeorm";
import { asyncHandler } from "../rest/middleware/async";
import { NextFunction } from "express";
import { getOrganizationIdFromAuthToken } from "@walkinserver/walkin-core/src/modules/common/utils/utils";

LoyaltyLedgerRouter.get(
    "/get-customer-ledger",
    authMiddleware,
    asyncHandler(async (req: any, res: any, next: NextFunction) => {
        try {
            const requestBody = req.body;
            const queryParams = req.query;
            const externalCustomerId = requestBody.externalCustomerId || queryParams.externalCustomerId;
            const loyaltyCardCode = requestBody.loyaltyCardCode || queryParams.loyaltyCardCode;
            const dateStart = requestBody.dateStart || queryParams.dateStart;
            const dateEnd = requestBody.dateEnd || queryParams.dateEnd;
            const page = requestBody.page || queryParams.page;
            const itemsPerPage = requestBody.itemsPerPage || queryParams.itemsPerPage;
            const orderBy = requestBody.orderBy || queryParams.orderBy;

            const organizationId = getOrganizationIdFromAuthToken(
                req.headers.authorization
            );
            let result = await getManager().transaction(async transactionEntityManager => {
                let result1 = await LoyaltyLedgerProvider.getLoyaltyLedgerByExternalCustomerId(
                    transactionEntityManager,
                    LoyaltyLedgerModule.injector,
                    externalCustomerId,
                    dateStart,
                    dateEnd,
                    page,
                    itemsPerPage,
                    orderBy,
                    loyaltyCardCode,
                    {
                        id: organizationId
                    }
                );
                return result1;
            });
            //to resolvce circular JSON error
            for (let i = 0; i < result.data.length; i++) {
                delete result.data[i].loyaltyLedger?.loyaltyLedger;
            }
            return res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    })
);

export default LoyaltyLedgerRouter;