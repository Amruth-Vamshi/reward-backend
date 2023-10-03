// import { getConnection } from "typeorm";
import * as CoreEntities from "../../../entity";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { ApplicationModule } from "../../account/application/application.module";
import { getManager, getConnection, EntityManager } from "typeorm";
import { ApplicationProvider } from "../../account/application/application.providers";
import { Chance } from "chance";
import { metricsModule } from "../metrics.module";
import { MetricProvider } from "../metrics.providers";
import {
  STATUS,
  METRIC_TYPE,
  METRIC_FILTER_TYPE,
  DB_SOURCE,
  PageOptions
} from "../../common/constants/constants";
let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const metricsService: MetricProvider = metricsModule.injector.get(
  MetricProvider
);

const chance = new Chance();

xdescribe("Test suite for postive scenarios", () => {
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

  test("should get getMetricFilters ", async () => {
    /* Test getMetricFilter by creating a metricFilters
       1. CREATE TWO METRIC FILTERS
       2. GET METRIC FILTERS
    */
    const entityManager = getManager();

    const pageOptions = {
      page: 1,
      pageSize: 10
    };

    const metricFiltersFound: any = await metricsService.getMetricFilters(
      entityManager,
      {
        status: STATUS.ACTIVE,
        organizationId: user.organization.id,
        pageOptions
      }
    );

    expect(metricFiltersFound.data).toHaveLength(4);
  });

  test("should get getMetricFilter ", async () => {
    /* Test getMetricFilter by creating a metricFilter
       1. CREATE METRIC FILTER
       2. GET METRIC FILTER
    */
    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const metricFilterFoundById = await metricsService.getMetricFilter(
      entityManager,
      {
        id: metricFilter.id,
        organizationId: user.organization.id
      }
    );

    expect(metricFilterFoundById.id).toBe(metricFilter.id);
  });

  test("should get getMetric ", async () => {
    /* Test getMetric by creating a metricFilter & metric
       1. CREATE METRIC FILTERS
       2. CREATE METRIC
       3. GET METRIC
    */
    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const metricInput: any = generateMetricInput(metricFilter);

    const metric = await metricsService.createMetric(
      entityManager,
      metricInput
    );

    const metricFoundById = await metricsService.getMetric(entityManager, {
      id: metric.id,
      organizationId: user.organization.id
    });

    expect(metricFoundById.id).toBe(metric.id);
  });

  test("should get getMetrics ", async () => {
    /* Test getMetrics for existing basic metrics loaded
       1. GET METRICS
    */
    const entityManager = getManager();

    const pageOptions: PageOptions = {
      page: 1,
      pageSize: 10
    };

    const metricsFound: any = await metricsService.getMetrics(entityManager, {
      organizationId: user.organization.id,
      pageOptions
    });
    expect(metricsFound.data).toHaveLength(3);
  });

  test("should get createMetric ", async () => {
    /* Test createMetric by creating a metricFilter
       1. CREATE METRIC FILTER
       2. CREATE METRIC
    */
    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const metricInput: any = generateMetricInput(metricFilter);

    const metric = await metricsService.createMetric(
      entityManager,
      metricInput
    );

    expect(metric.description).toBe(metricInput.description);
    expect(metric.query).toBe(metricInput.query);
    expect(metric.status).toBe(metricInput.status);
    expect(metric.source).toBe(metricInput.source);
    expect(metric.type).toBe(metricInput.type);
    expect(metric.filters).toStrictEqual(metricInput.filters);
  });

  test("should get updateMetric ", async () => {
    /* Test updateMetric by creating a metricFilter & metric
       1. CREATE METRIC FILTER
       2. CREATE METRIC
       3. UPDATE METRIC
    */
    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const metricInput: any = generateMetricInput(metricFilter);

    const metric = await metricsService.createMetric(
      entityManager,
      metricInput
    );

    const updateMetricInput = {
      id: metric.id,
      name: chance.string({ length: 5 }),
      organizationId: user.organization.id
    };

    const updateMetric = await metricsService.updateMetric(
      entityManager,
      updateMetricInput
    );

    expect(updateMetric.description).toBe(metric.description);
    expect(updateMetric.query).toBe(metric.query);
    expect(metric.status).toBe(metric.status);
    expect(updateMetric.source).toBe(metric.source);
    expect(updateMetric.type).toBe(metric.type);
    expect(updateMetric.name).toBe(updateMetricInput.name);
    expect(metric.filters).toStrictEqual(metricInput.filters);
  });

  test("should get createMetricFilter ", async () => {
    /* Test createMetricFilter by creating a metricFilter
       1. CREATE METRIC FILTER
    */
    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();
    metricFilterInput.name = chance.string({ length: 5 });

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    expect(metricFilter.name).toBe(metricFilterInput.name);
    expect(metricFilter.key).toBe(metricFilterInput.key);
    expect(metricFilter.type).toBe(metricFilterInput.type);
    expect(metricFilter.status).toBe(metricFilterInput.status);
  });

  test("should get updateMetricFilter ", async () => {
    /* Test updateMetricFilter by creating a metricFilter
       1. CREATE METRIC FILTER
       2. UPDATE METRIC FILTER
    */
    const entityManager = getManager();

    const metricFilterInput: any = generateMetricFilterInput();

    const metricFilter = await metricsService.createMetricFilter(
      entityManager,
      metricFilterInput
    );

    const updateMetricFilterInput: any = {
      id: metricFilter.id,
      name: chance.string({ length: 2 }),
      status: STATUS.INACTIVE
    };

    const updateMetricFilter = await metricsService.updateMetricFilter(
      entityManager,
      updateMetricFilterInput
    );

    expect(updateMetricFilter.name).toBe(updateMetricFilterInput.name);
    expect(updateMetricFilter.status).toBe(updateMetricFilterInput.status);
    expect(updateMetricFilter.key).toBe(metricFilterInput.key);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
