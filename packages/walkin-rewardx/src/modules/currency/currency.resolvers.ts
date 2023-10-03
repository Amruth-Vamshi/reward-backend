import Mustache from "mustache";
import {
  Resolvers,
  ModuleContext,
  ModuleSessionInfo
} from "@graphql-modules/core";
import { getManager } from "typeorm";
import { CurrencyProvider } from "./currency.provider";

export const resolvers: Resolvers = {
  Query: {
    currencyByCode: (_, { currencyCode }, { injector }: ModuleContext) => {
      return getManager().transaction(manager => {
        return injector
          .get(CurrencyProvider)
          .getCurrencyByCode(manager, currencyCode);
      });
    },
    currencyList: (
      { application, user },
      { pageOptions, sortOptions },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(manager => {
        return injector
          .get(CurrencyProvider)
          .getPageWiseCurrencies(manager, pageOptions, sortOptions, injector);
      });
    }
  },
  Mutation: {
    createCurrency: (_, { input }, { injector }: ModuleContext) => {
      return getManager().transaction(manager => {
        return injector.get(CurrencyProvider).createCurrency(manager, input);
      });
    },
    updateCurrency: (_, { input }, { injector }: ModuleContext) => {
      return getManager().transaction(manager => {
        return injector.get(CurrencyProvider).updateCurrency(manager, input);
      });
    }
  }
};
