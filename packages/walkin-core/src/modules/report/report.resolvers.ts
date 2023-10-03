import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";
import { Organizations } from "../account/organization/organization.providers";
import { STATUS } from "../common/constants/constants";
import { ReportProvider } from "./report.providers";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";
import { isUserOrAppAuthorizedToWorkOnOrganization } from "../common/utils/utils";
import { FileProvider } from "../filesystem/filesystem.providers";

const resolvers = {
  Query: {
    reportConfig: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }
        console.log(args.organizationId);

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        try {
          let reportConfig = await injector
            .get(ReportProvider)
            .getReportConfig(
              transactionalEntityManager,
              args.id,
              organizationId
            );
          return reportConfig;
        } catch (error) {
          throw new WCoreError(WCORE_ERRORS.REPORT_CONFIG_NOT_FOUND);
        }
      });
    },
    reportConfigs: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        return injector
          .get(ReportProvider)
          .getReportConfigs(
            transactionalEntityManager,
            args.pageOptions,
            args.sortOptions,
            organizationId
          );
      });
    },
    report: async (
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

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        try {
          let report = await injector
            .get(ReportProvider)
            .getReport(transactionalEntityManager, args.id, organizationId);

          return report;
        } catch (error) {
          throw new WCoreError(WCORE_ERRORS.REPORT_NOT_FOUND);
        }
      });
    },
    reports: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        console.log(args);

        //console.log(args.reportDate);

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        return injector
          .get(ReportProvider)
          .getReports(
            transactionalEntityManager,
            args.reportConfigId,
            args.reportDate,
            args.pageOptions,
            args.sortOptions,
            organizationId
          );
      });
    }
  },
  Mutation: {
    addReportConfig: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      const input = args.input;
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        let duplicateReportConfig = null;
        try {
          duplicateReportConfig = await injector
            .get(ReportProvider)
            .getReportConfigByName(transactionalEntityManager, args.name, org);
        } catch (error) {
          //dont have to do anything. No duplicates are found.
        }

        if (duplicateReportConfig && duplicateReportConfig.id) {
          throw new WCoreError(WCORE_ERRORS.REPORT_CONFIG_DUPLICATE);
        }

        return injector
          .get(ReportProvider)
          .addReportConfig(
            transactionalEntityManager,
            org,
            args.name,
            args.description
          );
      });
    },
    deactivateReportConfig: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      const input = args.input;
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        let reportConfig = null;
        try {
          reportConfig = await injector
            .get(ReportProvider)
            .getReportConfig(
              transactionalEntityManager,
              args.id,
              organizationId
            );
        } catch (error) {
          throw new WCoreError(WCORE_ERRORS.REPORT_CONFIG_NOT_FOUND);
        }

        return injector
          .get(ReportProvider)
          .deactivateReportConfig(
            transactionalEntityManager,
            reportConfig.id,
            organizationId
          );
      });
    },
    addReport: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      const input = args.input;
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        let reportConfig = null;
        try {
          reportConfig = await injector
            .get(ReportProvider)
            .getReportConfig(
              transactionalEntityManager,
              args.reportConfigId,
              organizationId
            );
        } catch (error) {
          throw new WCoreError(WCORE_ERRORS.REPORT_CONFIG_NOT_FOUND);
        }

        let reportFile = await injector
          .get(FileProvider)
          .getFile(
            transactionalEntityManager,
            args.reportFileId,
            organizationId
          );
        if (reportFile && reportFile.id) {
          //pass
        } else {
          throw new WCoreError(WCORE_ERRORS.FILE_NOT_FOUND);
        }

        return injector
          .get(ReportProvider)
          .addReport(
            transactionalEntityManager,
            org,
            reportConfig,
            reportFile,
            args.reportDate
          );
      });
    },
    deleteReport: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      const input = args.input;
      return getManager().transaction(async transactionalEntityManager => {
        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, input.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        let report = await injector
          .get(ReportProvider)
          .getReport(transactionalEntityManager, args.id, organizationId);

        if (report && report.id) {
          //pass
        } else {
          throw new WCoreError(WCORE_ERRORS.REPORT_NOT_FOUND);
        }

        return injector
          .get(ReportProvider)
          .deleteReport(transactionalEntityManager, args.id, organizationId);
      });
    }
  }
};

export default resolvers;
