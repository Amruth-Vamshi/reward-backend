import { Injector } from "@graphql-modules/di";
import { getConnection, getManager } from "typeorm";
import { BusinessRuleProvider } from "../providers";

export const businessRuleResolvers = {
  Query: {
    businessRules: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .getRules(transactionalEntityManager, input);
      });
    },
    businessRule: async (_, { id }, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .getRule(transactionalEntityManager, id);
      });
    },
    businessRuleDetails: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .getRuleDetails(transactionalEntityManager, input);
      });
    },
    businessRuleDetail: async (
      _,
      { id },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .getRuleDetail(transactionalEntityManager, id);
      });
    },
    businessRuleConfiguration: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .businessRuleConfiguration(transactionalEntityManager, input);
      });
    }
  },
  Mutation: {
    createBusinessRule: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .createBusinessRule(transactionalEntityManager, input);
      });
    },
    updateBusinessRuleByRuleType: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .updateBusinessRuleByRuleType(transactionalEntityManager, input);
      });
    },
    updateBusinessRule: async (
      _,
      { id, input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .updateBusinessRule(transactionalEntityManager, id, input);
      });
    },
    deleteBusinessRule: async (
      _,
      { id },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .deleteBusinessRule(transactionalEntityManager, id);
      });
    },
    createBusinessRuleDetail: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .createBusinessRuleDetail(transactionalEntityManager, input);
      });
    },
    updateBusinessRuleDetail: async (
      _,
      { id, input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .updateBusinessRuleDetail(transactionalEntityManager, id, input);
      });
    },
    deleteBusinessRuleDetail: async (
      _,
      { id },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(BusinessRuleProvider)
          .deleteBusinessRuleDetail(transactionalEntityManager, id);
      });
    }
  }
};
