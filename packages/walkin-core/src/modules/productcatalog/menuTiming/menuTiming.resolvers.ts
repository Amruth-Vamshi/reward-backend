import { getConnection } from "typeorm";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { MenuTimingProvider } from "./menuTiming.providers";

export const resolvers = {
  Query: {
    getMenuTimings: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .getMenuTimings(transactionManager, input);
      });
    },
    getMenuTimingsForCategory: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .getMenuTimingsForCategory(transactionManager, input);
      });
    },
    getMenuTimingsForProduct: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .getMenuTimingsForProduct(transactionManager, input);
      });
    }
  },
  Mutation: {
    createMenuTimings: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .createMenuTimings(transactionManager, input);
      });
    },
    removeMenuTimings: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .removeMenuTimings(transactionManager, input);
      });
    },
    addMenuTimings: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .addMenuTimings(transactionManager, input);
      });
    },
    resetMenuTimings: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .resetMenuTimings(transactionManager, input);
      });
    },
    updateMenuTimings: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .updateMenuTimings(transactionManager, input);
      });
    },
    removeMenuTimingsById: ({ user, application }, { input }, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .removeMenuTimingsById(transactionManager, input);
      });
    },
    addMenuTimingsForCategory: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .addMenuTimingsForCategory(transactionManager, input);
      });
    },
    removeMenuTimingsForCategory: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .removeMenuTimingsForCategory(transactionManager, input);
      });
    },
    updateMenuTimingsForCategory: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .updateMenuTimingsForCategory(transactionManager, input);
      });
    },
    addMenuTimingsToProduct: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .addMenuTimingsToProduct(transactionManager, input);
      });
    },
    removeMenuTimingsForProduct: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .removeMenuTimingsForProduct(transactionManager, input);
      });
    },
    updateMenuTimingsForProduct: (
      { user, application },
      { input },
      { injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(MenuTimingProvider)
          .updateMenuTimingsForProduct(transactionManager, input);
      });
    }
  }
};
