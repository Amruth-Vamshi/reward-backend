import { Injector } from "@graphql-modules/di";
import { getConnection } from "typeorm";
import {
  isValidMetric,
  isValidMetricFilter,
} from "./../common/validations/Validations";
import { MetricProvider } from "./metrics.providers";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import {
  authorizedToWorkOnOrganization,
  resetValues,
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
} from "../common/utils/utils";

export const resolvers = {
  Query: {
    metric: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetric(transactionManager, input);

        console.log("Input for metric is..", input);

        return injector
          .get(MetricProvider)
          .getMetric(transactionManager, input);
      }),

    metrics: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetric(transactionManager, input);

        return injector
          .get(MetricProvider)
          .getMetrics(transactionManager, input);
      }),

    metricFilter: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetricFilter(transactionManager, input);

        return injector
          .get(MetricProvider)
          .getMetricFilter(transactionManager, input);
      }),

    metricFilters: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetricFilter(transactionManager, input);

        return injector
          .get(MetricProvider)
          .getMetricFilters(transactionManager, input);
      }),

    executeMetric: async ({ user, application }, args, { injector }) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        let result: any = await injector
          .get(MetricProvider)
          .executeMetric(transactionManager, input, injector);

        result = resetValues(result, undefined, 0);

        if (!result) {
          throw new WCoreError(WCORE_ERRORS.QUERY_EXECUTION_FAILED);
        }

        return result;
      }),

    executeMetrics: async ({ user, application }, args, { injector }, info) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const responses = [];
        const names = input.names;

        const metricCollection = await injector
          .get(MetricProvider)
          .getMetricsByNames(transactionManager, {
            names,
            organizationId: input.organizationId,
          });
        return Promise.all(metricCollection).then(
          async (metricCollectionResult) => {
            let metrics: any = metricCollectionResult;

            metrics = metrics.map((metric) => {
              metric.filterValues = args.filterValues;
              return metric;
            });

            for (const metric of metrics) {
              const res = await injector
                .get(MetricProvider)
                .executeMetric(transactionManager, metric, injector);
              responses.push(res);
            }

            return Promise.all(responses).then((result) => {
              return result;
            });
          }
        );
      }),
  },

  Mutation: {
    createMetric: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetric(transactionManager, input);

        return injector
          .get(MetricProvider)
          .createMetric(transactionManager, input);
      }),

    updateMetric: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetric(transactionManager, input);

        return injector
          .get(MetricProvider)
          .updateMetric(transactionManager, input);
      }),

    createMetricFilter: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetricFilter(transactionManager, input);

        return injector
          .get(MetricProvider)
          .createMetricFilter(transactionManager, input);
      }),

    updateMetricFilter: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) =>
      getConnection().transaction(async (transactionManager) => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);

        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        await isValidMetricFilter(transactionManager, input);

        return injector
          .get(MetricProvider)
          .updateMetricFilter(transactionManager, input);
      }),
  },
};
