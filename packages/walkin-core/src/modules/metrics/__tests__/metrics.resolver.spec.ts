import { metricsModule } from "../metrics.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import * as CoreEntities from "../../../entity";
import { Chance } from "chance";
import { resolvers } from "../metrics.resolvers";
import { MetricProvider } from "../metrics.providers";
import {
  STATUS,
  METRIC_FILTER_TYPE,
  METRIC_TYPE,
  DB_SOURCE
} from "../../common/constants";

let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const metricsService: MetricProvider = metricsModule.injector.get(
  MetricProvider
);

const chance = new Chance();

xdescribe("Metrics suite for postive scenarios", () => {
  const generateMetricFilterInput = () => {
    const metricFilterInput: any = {
      name: chance.string({ length: 3 }),
      key: chance
        .street()
        .toLowerCase()
        .replace(/\s/g, ""),
      type: METRIC_FILTER_TYPE.STRING,
      status: STATUS.ACTIVE,
      organizationId: user.organization.id
    };
    return metricFilterInput;
  };

  const generateMetricInput = filters => {
    const metricInput: any = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      query: chance.string({ length: 5 }),
      type: METRIC_TYPE.SEQUENCE,
      filters: filters.length > 0 ? filters : [filters],
      organizationId: user.organization.id,
      status: STATUS.ACTIVE,
      source: DB_SOURCE.WAREHOUSE
    };
    return metricInput;
  };

  const application = null;

  test("should check metric resolver", async () => {
    /* Steps to test metric resolver
      1. Create dummy metric with new metricFilter
      2. Query Resolver with the newly created metric to check if exists
    */

    const entityManager = getManager();

    const metricFilterInput = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const metricInput: any = generateMetricInput(metricFilter);

    const metric = await metricsService.createMetric(
      entityManager,
      metricInput
    );
    const metricFoundById = await resolvers.Query.metric(
      { user, application },
      { id: metric.id },
      { injector: metricsModule.injector }
    );

    expect(metricFoundById.id).toBe(metric.id);
  });

  test("should check metrics resolver", async () => {
    /* Steps to test metrics resolver
      1. Create dummy metric with new metricFilter
      2. Query Resolver with the newly created metric to check if exists
    */

    const pageOptions = {
      page: 1,
      pageSize: 10
    };

    const metricsFound: any = await resolvers.Query.metrics(
      { user, application },
      {
        pageOptions,
        organizationId: user.organization.id,
        status: STATUS.ACTIVE
      },
      { injector: metricsModule.injector }
    );

    expect(metricsFound).toBeDefined();
    expect(metricsFound.data).toHaveLength(3);
  });

  test("should check createMetric resolver", async () => {
    /* Steps to test createMetric resolver
      1. Create dummy metricFilter
      2. Query Resolver with the newly created metricFilter
    */

    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const metricInput: any = generateMetricInput(metricFilter);

    const metric = await resolvers.Mutation.createMetric(
      { user, application },
      { input: metricInput },
      { injector: metricsModule.injector }
    );

    expect(metric.name).toBe(metricInput.name);
    expect(metric.description).toBe(metricInput.description);
    expect(metric.query).toBe(metricInput.query);
    expect(metric.type).toBe(metricInput.type);
    expect(metric.status).toBe(metricInput.status);
    expect(metric.source).toBe(metricInput.source);
    expect(metric.organization.id).toBe(user.organization.id);
    expect(metric.filters).toStrictEqual(metricInput.filters);
  });

  test("should check createMetricFilter resolver", async () => {
    /* Steps to test createMetricFilter resolver
      1. Query Resolver with the newly created metricFilter
    */

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await resolvers.Mutation.createMetricFilter(
      { user, application },
      { input: metricFilterInput },
      { injector: metricsModule.injector }
    );

    expect(metricFilter.name).toBe(metricFilterInput.name);
    expect(metricFilter.key).toBe(metricFilterInput.key);
    expect(metricFilter.type).toBe(metricFilterInput.type);
    expect(metricFilter.status).toBe(metricFilterInput.status);
  });

  test("should check updateMetricFilter resolver", async () => {
    /* Steps to test createMetricFilter resolver
      1. Query Resolver with the newly created metricFilter
    */

    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const updateMetricFilterInput: any = {
      id: metricFilter.id,
      name: chance.string({ length: 4 }),
      key: chance
        .name()
        .toLowerCase()
        .replace(/\s/g, "")
    };

    const updateMetricFilter = await resolvers.Mutation.updateMetricFilter(
      { user, application },
      { input: updateMetricFilterInput },
      { injector: metricsModule.injector }
    );

    expect(updateMetricFilter.name).toBe(updateMetricFilterInput.name);
    expect(updateMetricFilter.key).toBe(updateMetricFilterInput.key);
    expect(updateMetricFilter.type).toBe(metricFilter.type);
    expect(updateMetricFilter.status).toBe(metricFilter.status);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
