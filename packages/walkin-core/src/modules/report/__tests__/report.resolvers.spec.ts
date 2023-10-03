import { reportModule } from "../report.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import * as CoreEntities from "../../../entity";
import { Chance } from "chance";
import resolvers from "../report.resolvers";
import { ApplicationProvider } from "../../account/application/application.providers";
import { ReportProvider } from "../report.providers";
import { ApplicationModule } from "../../account/application/application.module";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import {
  STATUS,
  ACCESS_TYPES,
  FILE_SYSTEM_TYPES
} from "../../common/constants";
import filesystemResolvers from "../../filesystem/filesystem.resolvers";
import { fileSystemModule } from "../../filesystem/filesystem.module";
import { Readable } from "stream";

jest.setTimeout(120000);

let user: CoreEntities.User;
let jwt;
let reportFile;

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  let organizationId = user.organization.id;
  const newFileSystem = {
    name: chance.string({ length: 8 }),
    description: chance.string({ length: 15 }),
    accessType: ACCESS_TYPES.PUBLIC,
    configuration: {
      cloud_name: "ccdapp",
      api_key: "643872291836123",
      api_secret: "_UHu259sZr2200hJM3w1ml345ig"
    },
    fileSystemType: FILE_SYSTEM_TYPES.CLOUDINARY,
    organizationId,
    enabled: STATUS.ACTIVE,
    status: "ACTIVE"
  };
  const fileSystem = await filesystemResolvers.Mutation.createFileSystem(
    { user, application: null },
    { input: newFileSystem },
    { injector: fileSystemModule.injector }
  );

  const imgData: string =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0" +
    "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO" +
    "3gAAAABJRU5ErkJggg==";
  const createReadStream = () => {
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(imgData);
    readableStream.push(null);
    return readableStream;
  };

  const file = {
    createReadStream: createReadStream,
    filename: "Simple.png",
    mimetype: "text/text",
    encoding: "utf-8"
  };

  const uploadInput = {
    file,
    description: chance.string({ length: 20 }),
    fileSystemId: fileSystem.id,
    organizationId: user.organization.id
  };

  reportFile = await filesystemResolvers.Mutation.uploadFile(
    { user, application: null },
    { input: uploadInput },
    { injector: fileSystemModule.injector }
  );
});

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const reportProvider: ReportProvider = reportModule.injector.get(
  ReportProvider
);

const chance = new Chance();

xdescribe("Report Resolvers", () => {
  test("Query - reportConfig by ID - Invalid Id", async () => {
    let application = null;

    try {
      const reportConfig = await resolvers.Query.reportConfig(
        { user, application },
        {
          organizationId: user.organization.id,
          id: 123
        },
        { injector: reportModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }

    //Should throw an error
    expect.assertions(1);
  });

  test("Query - reportConfig by ID - Invalid organizationId", async () => {
    let application = null;
    try {
      const reportConfig = await resolvers.Query.reportConfig(
        { user, application },
        {
          organizationId: "221312",
          id: 123
        },
        { injector: reportModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }
    //Should throw an error
    expect.assertions(1);
  });

  test("Mutation - Add reportConfig", async () => {
    let application = null;
    const reportConfig = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 1",
        name: "Report1"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("Report1");
    expect(reportConfig.description).toBe("This is our report 1");
  });

  test("Query - reportConfig", async () => {
    let application = null;
    const reportConfig = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 2",
        name: "Report2"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig).toBeDefined();
    expect(reportConfig.id).toBeDefined();
    expect(reportConfig.name).toBe("Report2");
    expect(reportConfig.description).toBe("This is our report 2");

    const reportConfig2 = await resolvers.Query.reportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        id: reportConfig.id
      },
      { injector: reportModule.injector }
    );
    expect(reportConfig2).toBeDefined();
    expect(reportConfig2.id).toBe(reportConfig.id);
    expect(reportConfig2.name).toBe("Report2");
    expect(reportConfig2.description).toBe("This is our report 2");
  });

  test("Query - reportConfigs", async () => {
    let application = null;
    const reportConfigs = await resolvers.Query.reportConfigs(
      { user, application },
      {
        organizationId: user.organization.id,
        pageOptions: { page: 1, pageSize: 10 }
      },
      { injector: reportModule.injector }
    );
    expect(reportConfigs).toBeDefined();
    expect(reportConfigs["data"]).toBeDefined();
    expect(reportConfigs["data"].length).toBeGreaterThan(0);
    for (let x of reportConfigs["data"]) {
      expect(x.organization.id).toBe(user.organization.id);
    }
  });

  test("Mutation - Add Duplicate - should throw error", async () => {
    let application = null;
    const reportConfig3 = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 3",
        name: "Report3"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig3).toBeDefined();
    expect(reportConfig3.name).toBe("Report3");
    expect(reportConfig3.description).toBe("This is our report 3");

    try {
      const reportConfig4 = await resolvers.Mutation.addReportConfig(
        { user, application },
        {
          organizationId: user.organization.id,
          description: "This is our report 3",
          name: "Report3"
        },
        { injector: reportModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
    //Should throw an error
    expect.assertions(4);
  });

  test("Mutation - deactivateReportConfig", async () => {
    let application = null;
    //Add a report config
    //Get it
    //Deactivate it
    //Get it - fails

    const reportConfig = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 4",
        name: "Report4"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig).toBeDefined();
    expect(reportConfig.id).toBeDefined();

    const reportConfig2 = await resolvers.Query.reportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        id: reportConfig.id
      },
      { injector: reportModule.injector }
    );
    expect(reportConfig2).toBeDefined();
    expect(reportConfig2.id).toBe(reportConfig.id);

    const reportConfig3Dectivate = await resolvers.Mutation.deactivateReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        id: reportConfig.id
      },
      { injector: reportModule.injector }
    );
    expect(reportConfig3Dectivate).toBe(true);

    try {
      const reportConfig4 = await resolvers.Query.reportConfig(
        { user, application },
        {
          organizationId: user.organization.id,
          id: reportConfig.id
        },
        { injector: reportModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error.message).toBe(WCORE_ERRORS.REPORT_CONFIG_NOT_FOUND.MESSAGE);
      expect(error.httpCode).toBe(404);
    }
    expect.assertions(8);
  });

  test("Mutation - Add report", async () => {
    //1. Add report config
    //2. Add a file
    //3. Add report

    let application = null;
    const reportConfig = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 5",
        name: "Report5"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("Report5");
    expect(reportConfig.description).toBe("This is our report 5");

    const report = await resolvers.Mutation.addReport(
      { user, application },
      {
        organizationId: user.organization.id,
        reportConfigId: reportConfig.id,
        reportFileId: reportFile.id,
        reportDate: "2019-12-23"
      },
      { injector: reportModule.injector }
    );

    expect(report).toBeDefined();
    expect(report.id).toBeDefined();
    expect(report.reportDate).toBe("2019-12-23");
  });

  test("Mutation - Add report - Wrong file id", async () => {
    //1. Add report config
    //2. Add a wrong file file
    //3. Add report

    let application = null;
    const reportConfig = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 6",
        name: "Report6"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("Report6");
    expect(reportConfig.description).toBe("This is our report 6");

    try {
      const report = await resolvers.Mutation.addReport(
        { user, application },
        {
          organizationId: user.organization.id,
          reportConfigId: reportConfig.id,
          reportFileId: "2t827t427487",
          reportDate: "2019-12-23"
        },
        { injector: reportModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error.httpCode).toBe(404);
      expect(error.message).toBe(WCORE_ERRORS.FILE_NOT_FOUND.MESSAGE);
    }

    expect.assertions(6);
  });

  test("Mutation - Add report - Wrong report config id", async () => {
    //1. Add wrong report config
    //2. Add a file
    //3. Add report

    let application = null;
    try {
      const report = await resolvers.Mutation.addReport(
        { user, application },
        {
          organizationId: user.organization.id,
          reportConfigId: "ew87r9qw8er9",
          reportFileId: reportFile.id,
          reportDate: "2019-12-23"
        },
        { injector: reportModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error.httpCode).toBe(404);
      expect(error.message).toBe(WCORE_ERRORS.REPORT_CONFIG_NOT_FOUND.MESSAGE);
    }

    expect.assertions(3);
  });

  test("Mutation - get report", async () => {
    //1. Add report config
    //2. Add a file
    //3. Add report
    //3. get a report

    let application = null;
    const reportConfig = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 7",
        name: "Report7"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("Report7");
    expect(reportConfig.description).toBe("This is our report 7");

    const report = await resolvers.Mutation.addReport(
      { user, application },
      {
        organizationId: user.organization.id,
        reportConfigId: reportConfig.id,
        reportFileId: reportFile.id,
        reportDate: "2019-12-23"
      },
      { injector: reportModule.injector }
    );

    expect(report).toBeDefined();
    expect(report.id).toBeDefined();

    const getReport = await resolvers.Query.report(
      { user, application },
      {
        id: report.id,
        organizationId: user.organization.id
      },
      { injector: reportModule.injector }
    );

    expect(getReport).toBeDefined();
    expect(getReport.id).toBeDefined();
    expect(report.id).toBe(getReport.id);
    expect(report.reportFile.id).toBe(report.reportFile.id);
    expect(report.reportDate).toBe("2019-12-23");
  });

  test("Query - get a non existent report", async () => {
    let application = null;
    try {
      const getReport = await resolvers.Query.report(
        { user, application },
        {
          id: "387928379jskfksgf",
          organizationId: user.organization.id
        },
        { injector: reportModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error.httpCode).toBe(404);
      expect(error.message).toBe(WCORE_ERRORS.REPORT_NOT_FOUND.MESSAGE);
    }
  });

  test("Query - get Reports", async () => {
    let application = null;
    const reportConfig = await resolvers.Mutation.addReportConfig(
      { user, application },
      {
        organizationId: user.organization.id,
        description: "This is our report 8",
        name: "Report8"
      },
      { injector: reportModule.injector }
    );

    expect(reportConfig).toBeDefined();
    expect(reportConfig.name).toBe("Report8");
    expect(reportConfig.description).toBe("This is our report 8");

    const report = await resolvers.Mutation.addReport(
      { user, application },
      {
        organizationId: user.organization.id,
        reportConfigId: reportConfig.id,
        reportFileId: reportFile.id,
        reportDate: "2019-12-23"
      },
      { injector: reportModule.injector }
    );

    expect(report).toBeDefined();
    expect(report.id).toBeDefined();
    expect(report.reportDate).toBe("2019-12-23");
    console.log(report.reportDate);
    const getReport = await resolvers.Query.report(
      { user, application },
      {
        id: report.id,
        organizationId: user.organization.id
      },
      { injector: reportModule.injector }
    );

    expect(getReport).toBeDefined();
    expect(getReport.id).toBe(report.id);
    expect(getReport.organization.id).toBe(user.organization.id);

    const reports = await resolvers.Query.reports(
      { user, application },
      {
        reportConfigId: reportConfig.id,
        reportDate: "2019-12-23 00:00:00.000",
        organizationId: user.organization.id,
        pageOptions: { page: 0, perPage: 0 },
        sortOptions: { sortBy: "createdBy", sort: "ASC" }
      },
      { injector: reportModule.injector }
    );

    expect(reports).toBeDefined();
    expect(reports["data"]).toBeDefined();
    expect(reports["data"].length).toBeGreaterThan(0);
    for (let x of reports["data"]) {
      expect(x.reportDate).toStrictEqual(
        new Date(Date.UTC(2019, 11, 23, 0, 0, 0, 0))
      ); //month 11 means december
      expect(x.status).toBe(STATUS.ACTIVE);
    }
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
