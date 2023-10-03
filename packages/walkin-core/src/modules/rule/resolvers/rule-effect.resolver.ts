import { Injector } from "@graphql-modules/di";
import { getConnection, getManager } from "typeorm";
import { WCoreError } from "../../common/exceptions/index";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { RuleEffectProvider } from "../providers/rule-effect.provider";
import { setOrganizationToInput } from "../../common/utils/utils";

export const ruleEffectResolvers = {
  Query: {
    getRuleEffects: async (
      { user, application },
      { input={} },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user, application);

        const result = await injector
          .get(RuleEffectProvider)
          .getRuleEffects(transactionalEntityManager, input);
        return result;
      });
    },
    deleteRuleEffect: async (
      { user, application },
      { ruleEffectId },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        const { organizationId } = setOrganizationToInput({}, user, application);

        const result = await injector
          .get(RuleEffectProvider)
          .deleteRuleEffect(transactionalEntityManager, { ruleEffectId, organizationId });
        return result;
      });
    }
  },
  Mutation: {
    createRuleEffect: async (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user, application);

        const result = await injector
          .get(RuleEffectProvider)
          .createRuleEffect(transactionalEntityManager, input);
        return result;
      });
    },
    updateRuleEffect: async (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user, application);

        const result = await injector
          .get(RuleEffectProvider)
          .updateRuleEffect(transactionalEntityManager,injector, input);
        return result;
      });
    }
  }
};
