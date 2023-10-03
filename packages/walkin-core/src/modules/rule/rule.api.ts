import express, { NextFunction } from "express";
import authMiddleware from "../account/auth-guard/auth-gaurd.middleware";
const RuleRouter = express.Router();

import { ruleModule } from "./rule.module";
import { BusinessRuleProvider as BusinessRule } from "../rule/providers/business_rule.provider";

import { RuleSetProvider as RuleSets} from "../rule/providers/rule-set.provider";
const RuleSetInjectProvider = ruleModule.injector.get(RuleSets)

import { RuleProvider as RuleProviders } from "../rule/providers/rule.provider";

import { getManager } from "typeorm";
import { asyncHandler } from "../../../../walkin-rewardx/src/modules/rest/middleware/async";
import { getOrganizationIdFromAuthToken } from "../common/utils/utils";

import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";

const BusinessRuleProvider = ruleModule.injector.get(BusinessRule);
const RuleProvider = ruleModule.injector.get(RuleProviders);

RuleRouter.post(
    "/update-business-rule-by-rule-type",
    authMiddleware,
    asyncHandler(async (req: any, res: any, next: NextFunction) => {
        try {
            const { input } = req.body;
            let result = await getManager().transaction(async transactionalEntityManager => {
                let result = BusinessRuleProvider.updateBusinessRuleByRuleType(transactionalEntityManager, input);
                return result;
            });
            return res.status(200).send(result);
        } catch (error) {
            next(error);
        }
    })
);

RuleRouter.get(
    "/get-rule-sets",
    authMiddleware,
    asyncHandler(async (req: any, res: any, next: NextFunction) => {
        try {
            const organizationId = getOrganizationIdFromAuthToken(
                req.headers.authorization
            );

            const input = req.query;
            input["organizationId"] = organizationId;

            const result = await getManager().transaction(async transactionalEntityManager => {
                const ruleSets = RuleSetInjectProvider.getRuleSetsForOrganization(transactionalEntityManager, input);
                return ruleSets;
            });
            return res.status(200).send(result);

        }   
        catch (error) {
            next(error);
        }
      

    })
);

RuleRouter.get(
    "/get-rule-by-id",
    authMiddleware,
    asyncHandler(async (req: any, res: any, next: NextFunction) => {
        try {
            const { id } = req.query;
            
           
            const organizationId = getOrganizationIdFromAuthToken(
                req.headers.authorization
            );
            
            const result = await getManager().transaction(async transactionalEntityManager => {
                const rule = RuleProvider.rule(transactionalEntityManager, id , organizationId);
                return rule;
            });
            
            return res.status(200).send(result);
        } catch (error) {
           
            next(error);
        }
    })
);

export default RuleRouter;