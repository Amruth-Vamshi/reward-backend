import { Injectable } from "@graphql-modules/di";
import { EntityManager, getConnection, getManager, In } from "typeorm";
import { Metric, MetricFilter } from "../../entity";
import {
  frameDynamicQuery,
  addPaginateInfo,
  updateEntity
} from "../common/utils/utils";
import { clickHouseQuery } from "../common/utils/clickHouseUtils";
import { WCoreError } from "../common/exceptions";
import { DB_SOURCE, STATUS, PageOptions } from "../common/constants/constants";
import { WCORE_ERRORS } from "../common/constants/errors";

@Injectable()
export class MetricProvider {
  public async getMetric(
    entityManager: EntityManager,
    {
      id,
      organizationId
    }: {
      id: string;
      organizationId: string;
    }
  ): Promise<Metric> {
    const ee = await entityManager.findOne(Metric, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization", "filters"]
    });
    return ee;
  }

  public async getMetricByName(
    entityManager: EntityManager,
    {
      name,
      organizationId
    }: {
      name: string;
      organizationId: string;
    }
  ): Promise<Metric> {
    return entityManager.findOne(Metric, {
      where: {
        name,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization", "filters"]
    });
  }

  public async getMetricsByNames(
    entityManager: EntityManager,
    {
      names,
      organizationId
    }: {
      names: [string];
      organizationId: string;
    }
  ): Promise<Metric[]> {
    const query: any = {};

    query.names = In(names);
    query.organization = {
      id: organizationId
    };
    const options: any = {};
    options.where = query;
    options.relations = ["organization", "filters"];

    return entityManager.find(Metric, options);
  }

  @addPaginateInfo
  public async getMetrics(
    entityManager: EntityManager,
    {
      organizationId,
      name,
      status,
      pageOptions,
      sortOptions
    }: {
      organizationId: string;
      name?: string;
      status?: string;
      pageOptions: PageOptions;
      sortOptions?;
    }
  ): Promise<[Metric[], number]> {
    const query: any = {};
    if (organizationId) {
      query.organization = organizationId;
    }
    if (status) {
      query.status = status;
    }
    if (name) {
      query.name = name;
    }

    const options: any = {};
    options.where = query;
    options.relations = ["organization", "filters"];

    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;

    return entityManager.findAndCount(Metric, options);
  }

  public async createMetric(
    entityManager: EntityManager,
    {
      name,
      description,
      query,
      type,
      filters,
      organizationId,
      status,
      source
    }: {
      name: string;
      description: string;
      query: string;
      type: string;
      filters: any[];
      organizationId: string;
      status: string;
      source: string;
    }
  ): Promise<Metric> {
    if (!status) {
      status = STATUS.ACTIVE;
    }
    const metricSchema: any = {
      name,
      description,
      query,
      type,
      filters,
      status,
      source
    };
    const filterList = [];

    for (const filter of filters) {
      let filterObj;
      if (typeof filter === "object") {
        filterObj = await this.getMetricFilterByKey(
          entityManager,
          filter.key,
          organizationId
        );
      } else if (typeof filter === "string") {
        filterObj = await this.getMetricFilterByKey(
          entityManager,
          filter,
          organizationId
        );
      }

      if (filterObj !== undefined && filterObj.status === STATUS.ACTIVE) {
        filterList.push(filterObj);
      } else {
        throw new WCoreError(WCORE_ERRORS.METRIC_FILTER_NOT_FOUND);
      }
    }

    metricSchema.filters = filterList;
    metricSchema.organization = organizationId;

    let e = entityManager.create(Metric, metricSchema);
    e = await entityManager.save(e);
    const x = await entityManager.findOne(
      Metric,
      { id: e.id },
      { relations: ["organization", "filters"] }
    );
    return x;
  }

  public async updateMetric(
    entityManager: EntityManager,
    {
      id,
      organizationId,
      name,
      description,
      query,
      type,
      filters,
      status
    }: {
      id: string;
      organizationId: string;
      name?: string;
      description?: string;
      query?: string;
      type?: string;
      filters?: any[];
      status?: string;
    }
  ) {
    let metric = await this.getMetric(entityManager, { id, organizationId });

    if (!metric || metric.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.METRIC_NOT_FOUND);
    }

    if (metric != null) {
      metric.name = name;
    }

    if (description != null) {
      metric.description = description;
    }

    if (query != null) {
      metric.query = query;
    }

    if (type != null) {
      metric.type = type;
    }

    if (filters != null) {
      const filterList = [];
      for (const filter of filters) {
        const filterObj = await this.getMetricFilterByKey(
          entityManager,
          filter,
          organizationId
        );
        if (filterObj !== undefined && filterObj.status === STATUS.ACTIVE) {
          filterList.push(filterObj);
        } else {
          throw new WCoreError(WCORE_ERRORS.METRIC_FILTER_NOT_FOUND);
        }
      }

      metric.filters = filterList;
    }

    if (status != null) {
      metric.status = status;
    }
    metric = await entityManager.save(metric);
    const x = await entityManager.findOne(Metric, id, {
      relations: ["organization", "filters"]
    });
    return x;
  }

  public async getMetricFilter(
    entityManager: EntityManager,
    {
      id,
      organizationId
    }: {
      id: string;
      organizationId: string;
    }
  ) {
    const x = await entityManager.findOne(MetricFilter, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    return x;
  }

  @addPaginateInfo
  public async getMetricFilters(
    entityManager: EntityManager,
    {
      status,
      organizationId,
      pageOptions,
      sortOptions
    }: {
      status: string;
      organizationId: string;
      pageOptions: PageOptions;
      sortOptions?;
    }
  ): Promise<[MetricFilter[], number]> {
    const query: any = {};
    if (status) {
      query.status = status;
    }

    if (organizationId) {
      query.organization = {
        id: organizationId
      };
    }

    const options: any = {};
    options.where = query;
    options.relations = ["organization"];

    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;

    const ee = await entityManager.findAndCount(MetricFilter, options);
    console.log(ee);
    return ee;
  }

  public async getMetricFilterByKey(
    entityManager: EntityManager,
    key: string,
    organizationId: string
  ): Promise<any> {
    const query: any = {};
    query.key = key;

    if (organizationId != null) {
      query.organization = organizationId;
    }

    const options: any = {};
    options.where = query;
    return entityManager.findOne(MetricFilter, options);
  }

  public async createMetricFilter(
    entityManager: EntityManager,
    {
      name,
      key,
      type,
      organizationId,
      status
    }: {
      name: string;
      key: string;
      type: string;
      organizationId: string;
      status: string;
    }
  ): Promise<MetricFilter> {
    if (!status || status === null) {
      status = STATUS.ACTIVE;
    }
    const metricFilterSchema: any = {
      name,
      key,
      type,
      status
    };
    metricFilterSchema.organization = organizationId;
    let e = entityManager.create(MetricFilter, metricFilterSchema);
    e = await entityManager.save(e);
    return entityManager.findOne(MetricFilter, { id: e.id });
  }

  public async updateMetricFilter(
    entityManager: EntityManager,
    {
      id,
      key,
      type,
      name,
      status
    }: {
      id: string;
      key: string;
      type: string;
      name: string;
      status: string;
    }
  ): Promise<MetricFilter> {
    const e = await entityManager.findOne(MetricFilter, id);
    if (name != null) {
      e.name = name;
    }

    if (key != null) {
      e.key = key;
    }

    if (type != null) {
      e.type = type;
    }
    if (status != null) {
      e.status = status;
    }
    await entityManager.save(e);
    return entityManager.findOne(MetricFilter, id, {
      relations: ["organization"]
    });
  }

  public async executeMetricInCore(entityManager, filterValues, metric) {
    const metricFiltersKey = metric.filters.map(metricFilter => {
      return metricFilter.key;
    });
    const checkForValues = Object.keys(filterValues).filter(ele => {
      if (!metricFiltersKey.includes(ele)) {
        return false;
      }
      return true;
    });

    if (checkForValues.length !== Object.keys(filterValues).length) {
      throw new WCoreError(WCORE_ERRORS.METRIC_FILTER_NOT_FOUND);
    }

    const dynamicQuery = await frameDynamicQuery(
      metric.query,
      filterValues,
      metric.source
    );
    const queryResults = await entityManager.query(dynamicQuery);
    const total = queryResults.reduce((t, res) => {
      return t + res.count;
    }, 0);

    if (!queryResults || queryResults == null || queryResults === undefined) {
      throw new WCoreError(WCORE_ERRORS.QUERY_EXECUTION_FAILED);
    }
    const result: any = {
      name: metric.name,
      type: metric.type,
      rows: queryResults.length,
      response: queryResults,
      // tslint:disable-next-line:radix
      total: total ? parseInt(total) : queryResults.length
    };
    return result;
  }

  public async executeMetricInWarehouse(filterValues, metric) {
    let dynamicQuery = await frameDynamicQuery(
      metric.query,
      filterValues,
      metric.source
    );
    dynamicQuery = dynamicQuery.replace(/"/g, "'");
    console.log(dynamicQuery);
    const queryResults: any = await clickHouseQuery(dynamicQuery);

    if (!queryResults || queryResults == null || queryResults === undefined) {
      throw new WCoreError(WCORE_ERRORS.QUERY_EXECUTION_FAILED);
    }

    const total = queryResults.reduce((t, res) => {
      return t + res.count;
    }, 0);

    const result = {
      name: metric.name,
      type: metric.type,
      rows: queryResults.length,
      data: queryResults,
      total: total || total === 0 ? total : queryResults.length
    };
    return result;
  }

  public async executeMetric(entityManager, input) {
    const metric = await this.getMetricByName(entityManager, input);
    if (metric === undefined) {
      throw new WCoreError(WCORE_ERRORS.METRIC_NOT_FOUND);
    }

    input.filterValues.organization_id = input.organizationId;

    if (metric.source === DB_SOURCE.CORE) {
      return this.executeMetricInCore(
        entityManager,
        input.filterValues,
        metric
      );
    } else if (metric.source === DB_SOURCE.WAREHOUSE) {
      return this.executeMetricInWarehouse(input.filterValues, metric);
    } else {
      throw new WCoreError(WCORE_ERRORS.METRIC_SOURCE_NOT_FOUND);
    }
  }
}
