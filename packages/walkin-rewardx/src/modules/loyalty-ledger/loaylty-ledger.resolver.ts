import Mustache from "mustache";
import {
    Resolvers,
    ModuleContext,
    ModuleSessionInfo
} from "@graphql-modules/core";
import { getManager } from "typeorm";
import { LoyaltyLedgerProvider } from "./loyalty-ledger.providers";

export const resolvers: Resolvers = {
    Query: {
        loyaltyLedgerHistory: ({ application, user }, { externalCustomerId, cardCode }, { injector }: ModuleContext) => {
            let organizationId = null;
            if (application) {
                organizationId = application.organization.id;
            } else if (user) {
                organizationId = user.organization.id;
            }
            return getManager().transaction(manager => {
                return injector
                    .get(LoyaltyLedgerProvider)
                    .getLoyaltyLedgerHistory(manager, injector, externalCustomerId, cardCode, organizationId);
            });
        },
        getCustomerLedger: (
            { application, user },
            {
                externalCustomerId,
                dateStart,
                dateEnd,
                page,
                itemsPerPage,
                orderBy,
                loyaltyCardCode
            },
            { injector }
        ) => {
            let organizationId = null;
            if (application) {
                organizationId = application.organization.id;
            } else if (user) {
                organizationId = user.organization.id;
            }
            return getManager().transaction(transactionEntityManager => {
                return injector
                    .get(LoyaltyLedgerProvider)
                    .getLoyaltyLedgerByExternalCustomerId(
                        transactionEntityManager,
                        injector,
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
            });
        }
    }
}
