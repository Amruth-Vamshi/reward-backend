import { Injector } from "@graphql-modules/di";
import { getConnection, getManager } from "typeorm";
import { WCoreError } from "../../common/exceptions/index";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { RuleConditionProvider } from "../providers/rule-condition.provider";
import { setOrganizationToInput } from "../../common/utils/utils";

export const ruleConditionResolvers = {
  Query: {
    getRuleConditions: async (
      { user , application},
      { input={}},
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user , application);

        const result = await injector
          .get(RuleConditionProvider)
          .getRuleConditions(transactionalEntityManager, input);
        return result;
      });
    },
    deleteRuleCondition: async (
      { user , application},
      { ruleConditionId },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        const { organizationId } = setOrganizationToInput({}, user , application);

        const result = await injector
          .get(RuleConditionProvider)
          .deleteRuleCondition(transactionalEntityManager, { ruleConditionId, organizationId });
        return result;
      });
    }
  },
  Mutation: {
    createRuleCondition: async (
      { user , application},
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user , application);

        const result = await injector
          .get(RuleConditionProvider)
          .createRuleCondition(transactionalEntityManager, input);
        return result;
      });
    },
    updateRuleCondition: async (
      { user , application},
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user , application);

        const result = await injector
          .get(RuleConditionProvider)
          .updateRuleCondition(transactionalEntityManager, injector,  input);
        return result;
      });
    }
  }
};
