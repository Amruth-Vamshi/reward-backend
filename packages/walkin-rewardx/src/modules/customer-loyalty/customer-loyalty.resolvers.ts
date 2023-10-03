import Mustache from "mustache";
import {
  Resolvers,
  ModuleContext,
  ModuleSessionInfo
} from "@graphql-modules/core";
import { getManager } from "typeorm";
import { CustomerLoyaltyProvider } from "./customer-loyalty.provider";
import { CustomerLoyaltyRepository } from "./customer-loyalty.repository";

export const resolvers: Resolvers = {
  Query: {
    getCustomerLoyaltyByExternalCustomerId: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(CustomerLoyaltyProvider)
          .getCustomerLoyalty(manager, injector, input);
      });
    },
    getCustomerLoyalty: (
      { application, user },
      input,
      { injector }: ModuleContext
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      input["createCustomerIfNotExist"] = true;
      return getManager().transaction(manager => {
        return injector
          .get(CustomerLoyaltyProvider)
          .getCustomerLoyalty(manager, injector, input);
      });
    }
  },
  Mutation: {
    createCustomerLoyalty: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      if (!(input && input.organizationId)) {
        let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      }
      return getManager().transaction(manager => {
        return injector
          .get(CustomerLoyaltyProvider)
          .createCustomerLoyalty(manager, injector, input);
      });
    },
    updateCustomerLoyaltyStatus: (
      { application, user },
      { input },
      { injector }: ModuleContext
    ) => {
      let organizationId = null;
        if (application) {
          organizationId = application.organization.id;
        } else if (user) {
          organizationId = user.organization.id;
        }
        input["organizationId"] = organizationId;
      return getManager().transaction(manager =>{
        return injector
          .get(CustomerLoyaltyRepository)
          .updateCustomerLoyaltyStatus_rawQuery(manager, injector, input);
      })
    }
  }
};
