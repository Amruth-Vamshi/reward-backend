import { Injectable } from "@graphql-modules/di";
import {
  EntityManager,
  getConnection,
  getManager,
  getRepository
} from "typeorm";
import { Organization, Report, ReportConfig, File } from "../../entity";

import { STATUS, PageOptions } from "../common/constants/constants";
import { WCORE_ERRORS } from "../common/constants/errors";
import { logMethod, addPaginateInfo } from "../common/utils/utils";

@Injectable()
export class ReportProvider {
  public async getReportConfig(
    transactionalEntityManager: EntityManager,
    id: any,
    organization: string
  ): Promise<ReportConfig> {
    const entityManager = transactionalEntityManager;
    let status = STATUS.ACTIVE;
    console.log(id);
    console.log(organization);
    const e = await entityManager.findOneOrFail(ReportConfig, {
      where: {
        id,
        organization,
        status
      },
      relations: ["organization"]
    });
    return e;
  }

  public async getReportConfigByName(
    transactionalEntityManager: EntityManager,
    name: any,
    organization: Organization
  ): Promise<ReportConfig> {
    const entityManager = transactionalEntityManager;
    let status = STATUS.ACTIVE;
    const e = await entityManager.findOneOrFail(ReportConfig, {
      where: {
        name,
        organization,
        status
      },
      relations: ["organization"]
    });
    return e;
  }

  @addPaginateInfo
  public async getReportConfigs(
    transactionalEntityManager: EntityManager,
    pageOptions: PageOptions,
    sortOptions,
    organizationId: string
  ) {
    const entityManager = transactionalEntityManager;
    let status = STATUS.ACTIVE;
    let options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = ["organization"];
    options.where = {
      organization: organizationId,
      status: status
    };
    const e = await entityManager.findAndCount(ReportConfig, options);
    return e;
  }

  public async getReport(
    transactionalEntityManager: EntityManager,
    id: string,
    organization: string
  ): Promise<Report> {
    const entityManager = transactionalEntityManager;
    let status = STATUS.ACTIVE;
    const e = await entityManager.findOneOrFail(Report, {
      where: {
        id,
        organization,
        status
      },
      relations: ["organization", "reportConfig", "reportFile"]
    });
    return e;
  }

  @addPaginateInfo
  public async getReports(
    transactionalEntityManager: EntityManager,
    reportConfig: string,
    reportDate: Date,
    pageOptions: PageOptions,
    sortOptions,
    organizationId: string
  ) {
    const entityManager = transactionalEntityManager;
    let status = STATUS.ACTIVE;

    let options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    console.log("---------------------------------------");
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = ["organization", "reportConfig", "reportFile"];
    options.where = {
      organization: organizationId,
      reportDate: reportDate,
      reportConfig: reportConfig,
      status: status
    };

    console.log("options=", options);

    const reports = await entityManager.findAndCount(Report, options);
    return reports;
  }

  public async addReportConfig(
    transactionalEntityManager: EntityManager,
    organization: Organization,
    name: string,
    description: string
  ): Promise<ReportConfig> {
    const entityManager = transactionalEntityManager;
    let status = STATUS.ACTIVE;
    const reportConfigSchema: any = {
      organization,
      name,
      description,
      status
    };
    const e = entityManager.create(ReportConfig, reportConfigSchema);
    return entityManager.save(e);
  }

  public async deactivateReportConfig(
    transactionalEntityManager: EntityManager,
    id: string,
    organization: string
  ): Promise<boolean> {
    const entityManager = transactionalEntityManager;
    const e = await this.getReportConfig(entityManager, id, organization);
    e.status = STATUS.INACTIVE;
    const s = await entityManager.save(e);
    return true;
  }

  public async addReport(
    transactionalEntityManager: EntityManager,
    organization: Organization,
    reportConfig: ReportConfig,
    reportFile: File,
    reportDate: Date
  ): Promise<Report> {
    const entityManager = transactionalEntityManager;
    let status = STATUS.ACTIVE;
    const report: any = {
      organization,
      reportConfig,
      reportFile,
      reportDate,
      status
    };

    const e = entityManager.create(Report, report);
    return entityManager.save(e);
  }

  public async deleteReport(
    transactionalEntityManager: EntityManager,
    id: string,
    organization: string
  ): Promise<boolean> {
    const entityManager = transactionalEntityManager;
    let e = await this.getReport(entityManager, id, organization);
    if (e) {
      const x = await entityManager.delete(Report, { id });
      return true;
    }
    return false;
  }
}
