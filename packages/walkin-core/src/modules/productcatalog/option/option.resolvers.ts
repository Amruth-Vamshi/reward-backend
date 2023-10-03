import { getConnection } from "typeorm";
import { OptionProvider, OptionValueProvider } from "./option.providers";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization
} from "../../common/utils/utils";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";

const resolvers = {
  Query: {
    optionById: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        return injector
          .get(OptionProvider)
          .getOptionById(transactionManager, input);
      });
    },

    options: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(OptionProvider)
          .getAllOptions(transactionManager, input);
      });
    },
    optionValuesByOptionId: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args;
        input = setOrganizationToInput(input, user, application);

        // Check if optionId belong to users organization
        const optionId = await injector
          .get(OptionProvider)
          .getOptionById(transactionManager, input);

        if (!optionId) {
          throw new WCoreError(WCORE_ERRORS.OPTION_NOT_FOUND);
        }

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        return injector
          .get(OptionValueProvider)
          .getOptionValuesByOptionId(transactionManager, args.optionId);
      });
    }
  },
  Mutation: {
    createOption: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        if (!input.name) {
          throw new WCoreError(WCORE_ERRORS.NAME_INVALID);
        }
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(OptionProvider)
          .createOption(transactionManager, input);
      });
    },
    updateOption: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(OptionProvider)
          .updateOption(transactionManager, input);
      });
    },
    updateOptionSortSeq: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        return injector
          .get(OptionProvider)
          .updateOptionSortSeq(transactionManager, input);
      });
    },
    createOptionValue: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        const input = args.input;
        if (!input.optionId) {
          throw new WCoreError(WCORE_ERRORS.OPTION_INVALID);
        }

        // Check if optionId belong to users organization
        const optionId = await injector
          .get(OptionProvider)
          .getOptionByOptionId(transactionManager, input);

        if (!optionId) {
          throw new WCoreError(WCORE_ERRORS.OPTION_NOT_FOUND);
        }

        return injector
          .get(OptionValueProvider)
          .createOptionValue(transactionManager, input);
      });
    },
    updateOptionValue: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        const input = args.input;

        // Check if optionId belong to users organization
        const optionId = await injector
          .get(OptionProvider)
          .getOptionByOptionId(transactionManager, input);

        if (!optionId) {
          throw new WCoreError(WCORE_ERRORS.OPTION_NOT_FOUND);
        }

        return injector
          .get(OptionValueProvider)
          .updateOptionValue(transactionManager, args.input);
      });
    },
    updateOptionValueSortSeq: ({ user, application }, args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        let input = args.input;
        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        // Check if optionId belong to users organization
        const optionDetails = await injector
          .get(OptionProvider)
          .getOptionByOptionId(transactionManager, input);

        if (!optionDetails) {
          throw new WCoreError(WCORE_ERRORS.OPTION_NOT_FOUND);
        }

        return injector
          .get(OptionValueProvider)
          .updateOptionValueSortSeq(transactionManager, input);
      });
    }
  },
  OptionValue: {
    option: (optionValue, _, context) => {
      // if option is already present in optionValue return option else query from database.
      if (optionValue.option) {
        return optionValue.option;
      }
      optionValue["organizationId"] = context.organizationId;
      return context.optionsLoader.load(optionValue);
    }
  },
  Option: {
    optionValues: (option, _, context) => {
      return context.optionValuesLoader.load(option);
    }
  }
};

export default resolvers;
