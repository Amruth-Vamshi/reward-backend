import { getConnection } from "typeorm";
import { ApplicationProvider } from "./application.providers";
import { ModuleContext } from "@graphql-modules/core";
import { Resolvers } from "@graphql-modules/core";
import { CreateApplicationInput } from "aws-sdk/clients/codedeploy";
import {
  MutationCreateApplicationArgs,
  QueryApplicationArgs
} from "../../../graphql/generated-models";
import { Application } from "../../../entity";
import { setOrganizationToInput } from "../../common/utils/utils";

const resolvers = {
  Query: {
    applications: (obj, args, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector.get(ApplicationProvider).getAllApplications(transactionManager)
      ),
    application: (
      obj,
      args: QueryApplicationArgs,
      { injector }
    ): Promise<Application> =>
      getConnection().transaction(transactionManager =>
        injector
          .get(ApplicationProvider)
          .getApplicationById(transactionManager, args.id)
      )
  },
  Mutation: {
    deleteApplication: (obj, { id }, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(ApplicationProvider)
          .deleteApplication(transactionManager, id)
      ),
    updateApplication: (obj, { input }, { injector }) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(ApplicationProvider)
          .updateApplication(transactionManager, input)
      ),
    generateAPIKey: ({ user, application }, input, { injector }) =>
      getConnection().transaction(transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(ApplicationProvider)
          .generateAPIKey(transactionManager, input, user);
      }),
    updateAPIKey: ({ user, application }, { input }, { injector }) =>
      getConnection().transaction(transactionManager => {
        input = setOrganizationToInput(input, user, application);
        return injector
          .get(ApplicationProvider)
          .updateAPIKey(transactionManager, input);
      }),
    deleteAPIKey: async ({ user, application }, input, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        return injector
          .get(ApplicationProvider)
          .deleteAPIKey(transactionManager, input);
      });
    },
    createApplication: (
      _,
      { organizationId, input }: MutationCreateApplicationArgs,
      { injector }: ModuleContext
    ) =>
      getConnection().transaction(transactionManager =>
        injector
          .get(ApplicationProvider)
          .createApplication(transactionManager, organizationId, input)
      )
  }
};

export default resolvers;
