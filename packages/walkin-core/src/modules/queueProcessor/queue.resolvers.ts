import { getManager } from "typeorm";
import { WALKIN_QUEUES } from "../common/constants";
import { setOrganizationToInput } from "../common/utils/utils";
import { QueueProvider } from "./queue.provider";

export const resolvers = {
  Query: {
    job: async (_, { input }, { injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const { queueName = "", id = "" } = input;
        const job = await injector.get(QueueProvider).getJobById(queueName, id);
        return job;
      });
    }
  },
  Mutation: {
    failJob: async (_, args, { injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const response = await injector
          .get(QueueProvider)
          .failJob(args.queueName, args.id, args.reason);
        return response;
      });
    },
    createJob: async ({ user, application }, { input }, { injector }) => {
      return getManager().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        const job = await injector
          .get(QueueProvider)
          .createJob(transactionManager, injector, input);
        return job;
      });
    },
    removeJob: async (_, args, { injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const response = await injector
          .get(QueueProvider)
          .removeJob(args.queueName, args.id);
        return response;
      });
    }
  }
};
