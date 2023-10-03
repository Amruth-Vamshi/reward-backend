import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";
import { RuleSetProvider } from "../providers/rule-set.provider";
import { setOrganizationToInput } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { use } from "passport";

export const ruleSetResolvers = {
  Query: {
    getRuleSets: async ({ user, application }, { input = {}}, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
     
        setOrganizationToInput(input, user, application)

        const result = await injector
          .get(RuleSetProvider)
          .getRuleSetsForOrganization(transactionalEntityManager, input);
        return result;
      });
    },
   
    deleteRuleSet: async (
      { user, application },
      { ruleSetId },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        const { organizationId } = setOrganizationToInput({}, user, application);

        const result = await injector
          .get(RuleSetProvider)
          .deleteRuleSet(transactionalEntityManager, {ruleSetId, organizationId});
        return result;
      });
    }
  },
  Mutation: {
    createRuleSet: async (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        setOrganizationToInput(input, user, application);  
      
        const result = await injector
          .get(RuleSetProvider)
          .createRuleSet(transactionalEntityManager, injector,  input);
        return result;
      });
    },
    updateRuleSet: async (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        setOrganizationToInput(input, user, application);  

        const result = await injector
          .get(RuleSetProvider)
          .updateRuleSet(transactionalEntityManager, injector,  input);
        return result;
      });
    }
  }
};
