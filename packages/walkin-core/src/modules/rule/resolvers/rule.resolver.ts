import { ModuleContext } from "@graphql-modules/core";
import { Injector } from "@graphql-modules/di";
import { IResolvers } from "graphql-tools";
import { getConnection, getManager } from "typeorm";
import { RuleProvider } from "../providers";
import { Application } from "../../../entity";
import { WCoreError } from "../../common/exceptions/index";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { STATUS } from "../../common/constants/constants";
import { MutationCreateRuleArgs } from "../../../graphql/generated-models";
import { setOrganizationToInput } from "../../common/utils/utils";

export const ruleResolvers = {
  Query: {
    rule: async ({user,application}, { id }, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {

        const { organizationId } = setOrganizationToInput({},user, application);

        const rule = await injector
          .get(RuleProvider)
          .rule(transactionalEntityManager, id, organizationId);
        return rule;
      });
    },
    rules: async ({user,application}, { input={}}:any, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {

        const {organizationId} = setOrganizationToInput({}, user, application);
        input.organizationId = organizationId;

        const rules = await injector
          .get(RuleProvider)
          .rules(
            transactionalEntityManager,
            input.status,
            input.organizationId
          );
        return rules;
      });
    },

    getSQLFromRule: async (
      _,
      { ruleId },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionEntityManager => {
        const rule = await injector
          .get(RuleProvider)
          .rule(transactionEntityManager, ruleId);
        if (rule === undefined || rule.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.RULE_NOT_FOUND);
        }
        return injector.get(RuleProvider).getSQLFromRule(rule);
      });
    },

    evaluateRule: async (
      { application }: { application: Application },
      { ruleName, data, ruleId },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const rule = await injector
          .get(RuleProvider)
          .evaluateRule(transactionalEntityManager, {
            ruleName,
            data,
            organizationId: application.organization.id,
            ruleId
          });
        return rule;
      });
    }
  },
  Mutation: {
    createRule: async (
      {user,application},
      { input }: MutationCreateRuleArgs,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user, application);

        const rule = await injector
          .get(RuleProvider)
          .createRule(transactionalEntityManager, injector, input);
        return rule;
      });
    },
    updateRule: async (
      {user,application},
      { id, input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {

        input = setOrganizationToInput(input, user, application);

        const rule = await injector
          .get(RuleProvider)
          .updateRule(transactionalEntityManager, injector, id, input);
        return rule;
      });
    },
    disableRule: async (_, { id }, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const rule = await injector
          .get(RuleProvider)
          .disableRule(transactionalEntityManager, id);
        return rule;
      });
    }
  }
};
