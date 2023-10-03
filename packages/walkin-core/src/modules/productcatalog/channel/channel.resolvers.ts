import { Injector } from "@graphql-modules/di";
import { IAuthResolverArgs } from "../../account/auth-guard/auth-guard.interface";
import { setOrganizationToInput } from "../../common/utils/utils";
import { ChannelProvider } from "./channel.providers";
import { getConnection, EntityManager } from "typeorm";
import { isValidChannel } from "../../common/validations/Validations";
export const resolvers = {
  Query: {
    channels: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(ChannelProvider)
            .getChannelsForOrganization(
              transactinEntityManager,
              args.filter,
              organizationId
            );
        }
      );
    },
    channel: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(ChannelProvider)
            .getChannel(transactinEntityManager, args.input, organizationId);
        }
      );
    }
  },
  Mutation: {
    createChannel: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async (transactionEntityManager: EntityManager) => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);
        await isValidChannel(transactionEntityManager, input)

        return injector
          .get(ChannelProvider)
          .createChannel(transactionEntityManager, args.input, input.organizationId);
      }
      );
    },
    updateChannel: (
      { user, application }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(ChannelProvider)
            .updateChannel(transactinEntityManager, args.input, organizationId);
        }
      );
    },
    deleteChannel: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { organizationId } = setOrganizationToInput({}, user, application);
      return getConnection().transaction(
        (transactinEntityManager: EntityManager) => {
          return injector
            .get(ChannelProvider)
            .deleteChannel(transactinEntityManager, args.id, organizationId);
        }
      );
    }
  }
  // channel: {
  //   chargeTypes: async (channels, args, { injector }) => {
  //     return channels;
  //   }
  // }
};
