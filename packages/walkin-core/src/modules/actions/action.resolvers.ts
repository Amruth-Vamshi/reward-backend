import { Injector } from "@graphql-modules/di";
import { EntityManager, getManager } from "typeorm";
import { ApplicationProvider } from "../account/application/application.providers";
import { Organizations } from "../account/organization/organization.providers";
import { STATUS } from "../common/constants/constants";
import { WalkinPlatformError } from "./../common/exceptions/walkin-platform-error";
import {
  validateJSONDataUsingSchema,
  validateJSONSchema
} from "./../common/validations/SchemaValidations";
import { Action } from "./action.providers";
import { isUserOrAppAuthorizedToWorkOnOrganization } from "../common/utils/utils";

export const resolvers = {
  Query: {
    actionDefinition: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );

      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Action)
          .getActionDefinitionById(
            transactionalEntityManager,
            args.id,
            organizationId
          );
      });
    },
    actionDefinitions: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Action)
          .getAllActionDefinitions(
            transactionalEntityManager,
            args.pageOptions,
            args.sortOptions,
            organizationId,
            args.name,
            args.type,
            args.status
          );
      });
    },
    action: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );

      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Action)
          .getAction(transactionalEntityManager, args.id, organizationId);
      });
    },
    actions: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      // validation for organization id
      let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        args.organizationId
      );
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Action)
          .getAllActions(
            transactionalEntityManager,
            args.pageOptions,
            args.sortOptions,
            organizationId,
            args.actionDefinitionName,
            args.status
          );
      });
    }
  },
  Mutation: {
    createActionDefinition: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status =
          input.status !== undefined ? input.status : STATUS.ACTIVE;
        let foundOrganization;
        // validation for organization id
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        if (organizationId) {
          foundOrganization = await injector
            .get(Organizations)
            .getOrganizationById(transactionalEntityManager, organizationId);
          if (!foundOrganization) {
            throw new WalkinPlatformError(
              "ORGANIZATION_NOT_FOUND",
              "Organization not found"
            );
          }
        }
        let validate;
        if (typeof input.inputSchema === "object") {
          validate = validateJSONSchema(input.inputSchema);
        } else {
          validate = validateJSONSchema(JSON.parse(input.inputSchema));
        }

        let outputValidate;
        if (typeof input.outputSchema === "object") {
          outputValidate = validateJSONSchema(input.outputSchema);
        } else {
          outputValidate = validateJSONSchema(JSON.parse(input.outputSchema));
        }
        if (validate.valid && outputValidate.valid) {
          return injector
            .get(Action)
            .createActionDefinition(
              transactionalEntityManager,
              input.name,
              input.type,
              foundOrganization,
              input.configuration,
              input.code,
              input.inputSchema,
              input.outputSchema,
              status
            );
        } else {
          throw new WalkinPlatformError(
            "INVALID_JSON_SCHEMA",
            "Invalid json schemas",
            input,
            400,
            ""
          );
        }
      });
    },
    updateActionDefinition: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        // validation for organization id
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        let foundOrganization;
        if (organizationId) {
          foundOrganization = await injector
            .get(Organizations)
            .getOrganizationById(transactionalEntityManager, organizationId);
          if (!foundOrganization) {
            throw new WalkinPlatformError(
              "ORGANIZATION_NOT_FOUND",
              "Organization not found"
            );
          }
        }
        if (input.schema !== undefined) {
          let validate;
          if (typeof input.schema === "object") {
            validate = validateJSONSchema(input.schema);
          } else {
            validate = validateJSONSchema(JSON.parse(input.schema));
          }
          if (validate.valid) {
            return injector
              .get(Action)
              .updateActionDefinition(
                transactionalEntityManager,
                input,
                foundOrganization
              )
              .then(result => {
                return result;
              });
          } else {
            throw new WalkinPlatformError(
              "INVALID_JSON_SCHEMA",
              "Invalid json schemas",
              input,
              400,
              ""
            );
          }
        } else {
          return injector
            .get(Action)
            .updateActionDefinition(
              transactionalEntityManager,
              input,
              foundOrganization
            )
            .then(result => {
              return result;
            })
            .catch(err => {
              throw new WalkinPlatformError(
                "ACTION_DEFINITION_UPDATE_ERROR",
                "Action definition update error",
                input,
                400,
                ""
              );
            });
        }
      });
    },
    disableActionDefinition: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        try {
          await injector
            .get(Action)
            .disableActionDefinition(
              transactionalEntityManager,
              args.id,
              organizationId
            );
        } catch (err) {
          console.log(err);
          return false;
        }
        return true;
      });
    },
    executeAction: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        //console.log("in executeAction", user, application);
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        try {
          return await injector
            .get(Action)
            .executeAction(
              transactionalEntityManager,
              args.actionDefinitionName,
              args.request,
              organizationId
            );
        } catch (err) {
          console.log(err);
          return err;
        }
      });
    }
  }
};

export default resolvers;
