import {
  createUnitTestConnection,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import * as WCoreEntities from "../../../entity";
import { ReportProvider } from "../report.providers";
import { Organizations } from "../../account/organization/organization.providers";
import { getManager } from "typeorm";
import {
  OrganizationTypeEnum,
  Status,
  Organization
} from "../../../graphql/generated-models";

import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";

let reportProvider: ReportProvider;
let organizationProvider: Organizations;
let globalOrganization: any;

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  reportProvider = new ReportProvider();
  organizationProvider = new Organizations();
  const manager = getManager();
  globalOrganization = await organizationProvider.createOrganization(manager, {
    code: "TEST_ORG",
    name: "TEST_ORG",
    organizationType: OrganizationTypeEnum.Organization,
    status: Status.Active
  });
});

xdescribe("Report Provider ", () => {
  test("getReportConfig - Not a valid reportConfig", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    try {
      let reportConfig = await reportProvider.getReportConfig(
        manager,
        "dahjsgdjahs",
        globalOrganization.id
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }

    //Make sure two assertations are called or fail. If there is exception as expected
    //the system will call two assertations else only one
    expect.assertions(2);
  });

  test("addReportConfig - Add a valid reportConfig", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    let reportConfig = await reportProvider.addReportConfig(
      manager,
      globalOrganization,
      "ReportProvider1",
      "ReportProvider1 - description"
    );
    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("ReportProvider1");
    expect(reportConfig.description).toBe("ReportProvider1 - description");
  });

  test("getReportConfigByName - Get a valid reportConfig ", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    let reportConfig = await reportProvider.addReportConfig(
      manager,
      globalOrganization,
      "ReportProvider2",
      "ReportProvider2 - description"
    );
    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("ReportProvider2");
    expect(reportConfig.description).toBe("ReportProvider2 - description");

    let reportConfig2 = await reportProvider.getReportConfigByName(
      manager,
      "ReportProvider2",
      globalOrganization
    );

    expect(reportConfig2).toBeDefined();
    expect(reportConfig2.name).toBe("ReportProvider2");
    expect(reportConfig2.description).toBe("ReportProvider2 - description");
  });

  test("getReportConfigByName - Get a invalid reportConfig ", async () => {
    const manager = getManager();
    expect(globalOrganization).toBeDefined();

    let reportConfig = await reportProvider.addReportConfig(
      manager,
      globalOrganization,
      "ReportProvider3",
      "ReportProvider3 - description"
    );
    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("ReportProvider3");
    expect(reportConfig.description).toBe("ReportProvider3 - description");

    try {
      let reportConfig2 = await reportProvider.getReportConfigByName(
        manager,
        "ReportProviderX",
        globalOrganization
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }

    expect.assertions(5);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
