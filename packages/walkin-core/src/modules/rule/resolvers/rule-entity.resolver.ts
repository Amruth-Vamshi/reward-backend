import { Injector } from "@graphql-modules/di";
import { getConnection, getManager } from "typeorm";
import { RuleEntityProvider } from "../providers";
import {
    setOrganizationToInput
  } from "../../common/utils/utils";

export const ruleEntityResolvers = {
    Query: {
        ruleEntities: async (
            {user,application},
            { input={} },
            { injector }: { injector: Injector }
        ) => {
            return getManager().transaction(async transactionalEntityManager => {
                
                input = setOrganizationToInput(input, user, application);

                const ruleEntities = await injector
                    .get(RuleEntityProvider)
                    .ruleEntities(transactionalEntityManager, input);
                return ruleEntities;
            });
        },
        ruleEntity: async ({user,application}, { id }, { injector }: { injector: Injector }) => {
            return getManager().transaction(async transactionalEntityManager => {

                const { organizationId } = setOrganizationToInput({}, user, application);

                const ruleEntity = await injector
                    .get(RuleEntityProvider)
                    .ruleEntity(transactionalEntityManager, { id, organizationId });
                return ruleEntity;
            });
        }
    },
    Mutation: {
        createRuleEntity: async (
            { user,application },
            { input },
            { injector }: { injector: Injector }
        ) => {
            return getManager().transaction(async transactionalEntityManager => {

                const { organizationId } = setOrganizationToInput({}, user, application);

                input.organizationId = organizationId;

                const ruleEntity = await injector
                    .get(RuleEntityProvider)
                    .createRuleEntity(transactionalEntityManager, input);
                return ruleEntity;
            });
        },
        disableRuleEntity: async (
            { user, application },
            { id },
            { injector }: { injector: Injector }
        ) => {
            return getManager().transaction(async transactionalEntityManager => {

                const { organizationId } = setOrganizationToInput({}, user, application);

                const ruleEntity = await injector
                    .get(RuleEntityProvider)
                    .disableRuleEntity(transactionalEntityManager, {id, organizationId});
                return ruleEntity;
            });
        }
    }
};
