import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";
import { STATUS } from "../common/constants/constants";
import { WalkinPlatformError } from "../common/exceptions/walkin-platform-error";
import { CustomerProvider } from "../customer/customer.providers";
import { SessionProvider } from "./session.providers";

const resolvers = {
  Query: {
    session: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(SessionProvider)
          .getSession(transactionalEntityManager, args.id);
      });
    },
    activeSession: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const organization_id = args.organization_id;
        const customerIdentifier = args.customer_identifier;
        const customer_id = await injector.get(CustomerProvider).getCustomer(
          transactionalEntityManager,
          {
            customerIdentifier
          },
          organization_id
        );
        return injector
          .get(SessionProvider)
          .getActiveSessionForCustomer(
            transactionalEntityManager,
            customer_id,
            organization_id
          );
      });
    }
  },
  Mutation: {
    startSession: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status = STATUS.ACTIVE;
        const organization_id = input.organization_id;
        const customer_id = await injector.get(CustomerProvider).getCustomer(
          transactionalEntityManager,
          {
            customerIdentifier: input.customer_identifier
          },
          organization_id
        );
        const activeSession = await injector
          .get(SessionProvider)
          .getActiveSessionForCustomer(
            transactionalEntityManager,
            customer_id,
            organization_id
          );
        if (activeSession) {
          throw new WalkinPlatformError(
            "ACTIVE_SESSION_EXISTS",
            "Active session exists for the customer and organization combination.",
            activeSession.id,
            400,
            "Active session exists for the customer and organization combination."
          );
        } else {
          return injector
            .get(SessionProvider)
            .createSession(
              transactionalEntityManager,
              customer_id,
              organization_id,
              status,
              input.extend
            );
        }
      });
    },
    endSession: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status = STATUS.INACTIVE;
        return injector
          .get(SessionProvider)
          .updateSession(transactionalEntityManager, input.id, status);
      });
    }
  }
};

export default resolvers;
