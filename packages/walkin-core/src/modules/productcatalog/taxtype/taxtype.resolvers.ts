import { getConnection } from "typeorm";
import { TaxTypeProvider } from "./taxtype.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { isValidTaxType } from "../../common/validations/Validations";

const resolvers = {
  Query: {
    taxType: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionalEntityManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(TaxTypeProvider)
          .getTaxType(transactionalEntityManager, input);
      });
    },

    taxTypes: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionalEntityManager => {
        let input = args;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(TaxTypeProvider)
          .getTaxTypes(
            transactionalEntityManager,
            input.pageOptions,
            input.sortOptions,
            input
          );
      });
    }
  },

  Mutation: {
    createTaxType: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        await isValidTaxType(transactionManager, input);

        return injector
          .get(TaxTypeProvider)
          .createTaxType(transactionManager, input);
      });
    },
    updateTaxType: async ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        input.id = args.id;

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(TaxTypeProvider)
          .updateTaxType(transactionManager, input);
      });
    }
  }
};

export default resolvers;
