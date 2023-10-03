import { fileSystemModule } from "../filesystem.module";
import * as CoreEntities from "../../../entity";
import { Readable } from "stream";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser,
  setupI18n
} from "../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import { FileProvider, FileSystemProvider } from "../filesystem.providers";
import resolvers from "../filesystem.resolvers";

import { Chance } from "chance";
import {
  ACTION_DEFINITION_TYPE,
  STATUS,
  ACCESS_TYPES,
  FILE_SYSTEM_TYPES,
  DEFAULT_PAGE_OPTIONS
} from "../../common/constants";
import { WalkinPlatformError } from "../../common/exceptions/walkin-platform-error";
import filesystemResolvers from "../filesystem.resolvers";
import { WCoreError } from "../../common/exceptions";
import { ApplicationProvider } from "../../account/application/application.providers";
import { ApplicationModule } from "../../account/application/application.module";

let user: CoreEntities.User;
let organizationId;

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);

const chance = new Chance();
let application = null;

beforeAll(async () => {
  setupI18n();
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("FileSystem Resolver - API Key", () => {
  test("Dummy create application", async () => {
    organizationId = user.organization.id;
    const manager = getManager();
    application = await applicationService.createApplication(
      manager,
      organizationId,
      { name: "TEST_APPLICATION" }
    );
  });

  test("CLOUDINARY - createFileSystem", async () => {
    const organizationId = user.organization.id;

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
      organizationId: organizationId,
      enabled: STATUS.ACTIVE,
      status: "ACTIVE"
    };
    const fileSystem = await resolvers.Mutation.createFileSystem(
      { user: null, application },
      { input: newFileSystem },
      { injector: fileSystemModule.injector }
    );

    expect(fileSystem).toBeDefined();
    expect(fileSystem).toHaveProperty("id");
    expect(fileSystem.id).toBeGreaterThanOrEqual(1);

    let foundFileSystem = await resolvers.Query.fileSystem(
      { user: null, application },
      { id: fileSystem.id, organizationId: organizationId },
      { injector: fileSystemModule.injector }
    );

    expect(foundFileSystem).toBeDefined();
    expect(foundFileSystem).toHaveProperty("id");
    expect(foundFileSystem.id).toEqual(fileSystem.id);
  });

  test("S3 - createFileSystem and updateFileSystem ", async () => {
    const organizationId = user.organization.id;

    const newFileSystem = {
      name: chance.string({ length: 8 }),
      description: chance.string({ length: 15 }),
      accessType: ACCESS_TYPES.PUBLIC,
      configuration: {},
      fileSystemType: FILE_SYSTEM_TYPES.S3,
      organizationId,
      enabled: STATUS.ACTIVE,
      status: "ACTIVE"
    };
    const fileSystem = await resolvers.Mutation.createFileSystem(
      { user: null, application },
      { input: newFileSystem },
      { injector: fileSystemModule.injector }
    );

    expect(fileSystem).toBeDefined();
    expect(fileSystem).toHaveProperty("id");
    expect(fileSystem.id).toBeGreaterThanOrEqual(1);

    let foundFileSystem = await resolvers.Query.fileSystem(
      { user: null, application },
      { id: fileSystem.id },
      { injector: fileSystemModule.injector }
    );

    expect(foundFileSystem).toBeDefined();
    expect(foundFileSystem).toHaveProperty("id");
    expect(foundFileSystem.id).toEqual(fileSystem.id);

    let updatedFileSystem = await resolvers.Mutation.updateFileSystem(
      { user: null, application },
      {
        input: {
          id: fileSystem.id,
          fileSystemType: FILE_SYSTEM_TYPES.S3,
          configuration: {
            accessKeyId: "AKIAYFTR3H6S2ZAJM7U6",
            secretAccessKey: "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",
            Bucket: "walkin-folder-for-testing-only",
            region: "ap-south-1",
            apiVersion: "2006-03-01",
            Expires: 6000
          },
          organizationId: user.organization.id
        }
      },
      { injector: fileSystemModule.injector }
    );

    expect(updatedFileSystem).toBeDefined();
    expect(updatedFileSystem).toHaveProperty("id");
    expect(updatedFileSystem.id).toEqual(foundFileSystem.id);
    expect(updatedFileSystem).toHaveProperty("fileSystemType");
    expect(updatedFileSystem.fileSystemType).toEqual(FILE_SYSTEM_TYPES.S3);
  });

  test("generateSignedUploadURL", async () => {
    let fileSystemsPage = await resolvers.Query.fileSystems(
      { user: null, application },
      {
        sortOptions: { sortBy: "id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS,
        organizationId: user.organization.id
      },
      { injector: fileSystemModule.injector }
    );
    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage).toHaveProperty("data");
    expect(fileSystemsPage.data.length).toBeGreaterThanOrEqual(1);

    for (let index in fileSystemsPage.data) {
      let fileSystem = fileSystemsPage.data[index];
      let input = {
        organizationId: user.organization.id,
        fileSystemId: fileSystem.id,
        status: STATUS.ACTIVE,
        description: chance.string({ length: 10 }),
        name:
          "http://www.kikkidu.com/wp-content/uploads/2010/06/CafeCoffeeDay.jpg"
      };
      let result = await resolvers.Mutation.generateSignedUploadURL(
        { user: null, application },
        { input },
        { injector: fileSystemModule.injector }
      );
      expect(result).toBeDefined();
      if (fileSystem.fileSystemType == FILE_SYSTEM_TYPES.S3) {
        expect(result.s3Response).toBeDefined();
      } else if (fileSystem.fileSystemType == FILE_SYSTEM_TYPES.CLOUDINARY) {
        expect(result.cloudinaryResponse);
      }
    }

    let filesPage = await resolvers.Query.files(
      { user: null, application },
      {
        sortOptions: { sortBy: "id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS,
        organizationId: user.organization.id
      },
      { injector: fileSystemModule.injector }
    );

    expect(filesPage).toBeDefined();
    expect(filesPage.data).toBeDefined();
    expect(filesPage.data.length).toBeDefined();
    expect(filesPage.data.length).toBeGreaterThanOrEqual(1);

    let foundFile = await resolvers.Query.file(
      { user: null, application },
      { id: filesPage.data[0].id },
      { injector: fileSystemModule.injector }
    );
    expect(foundFile).toBeDefined();
    expect(foundFile).toEqual(filesPage.data[0]);

    let updatedFile = await resolvers.Mutation.updateFile(
      { user: null, application },
      { input: { ...filesPage.data[0], status: "INACTIVE" } },
      { injector: fileSystemModule.injector }
    );
    expect(updatedFile).toBeDefined();
    expect(updatedFile.status).toEqual("INACTIVE");

    let updatedFileTwice = await resolvers.Mutation.updateFile(
      { user: null, application },
      { input: { ...filesPage.data[0] } },
      { injector: fileSystemModule.injector }
    );
    expect(updatedFileTwice).toBeDefined();
    expect(updatedFileTwice.status).toEqual("ACTIVE");

    let deletedFileStatus = await resolvers.Mutation.deleteFile(
      { user: null, application },
      { id: filesPage.data[0].id },
      { injector: fileSystemModule.injector }
    );
    expect(deletedFileStatus).toBeTruthy();
  }, 20000);

  test("S3 - Upload file", async () => {
    let fileSystemsPage = await resolvers.Query.fileSystems(
      { user: null, application },
      {
        sortOptions: { sortBy: "id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS,
        organizationId: user.organization.id,
        fileSystemType: FILE_SYSTEM_TYPES.S3
      },
      { injector: fileSystemModule.injector }
    );
    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage).toHaveProperty("data");
    expect(fileSystemsPage.data.length).toBeGreaterThanOrEqual(1);

    for (let index in fileSystemsPage.data) {
      let fileSystem = fileSystemsPage.data[index];
      const createReadStream = () => {
        const readableStream = new Readable();
        readableStream._read = () => {};
        readableStream.push(chance.string({ length: 50 }));
        readableStream.push(null);
        return readableStream;
      };

      const file = {
        createReadStream: createReadStream,
        filename: "Simple.txt",
        mimetype: "text/text",
        encoding: "utf-8"
      };
      const uploadInput = {
        file,
        description: chance.string({ length: 20 }),
        fileSystemId: fileSystem.id,
        organizationId: user.organization.id
      };
      let result = await resolvers.Mutation.uploadFile(
        { user: null, application },
        { input: uploadInput },
        { injector: fileSystemModule.injector }
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();

      let foundFile = await resolvers.Query.file(
        { user: null, application },
        { id: result.id },
        { injector: fileSystemModule.injector }
      );
      expect(foundFile).toBeDefined();
      expect(foundFile).toEqual(result);
    }
  }, 20000);

  test("CLOUDINARY - Upload file", async () => {
    let fileSystemsPage = await resolvers.Query.fileSystems(
      { user: null, application },
      {
        sortOptions: { sortBy: "id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS,
        organizationId: user.organization.id,
        fileSystemType: FILE_SYSTEM_TYPES.CLOUDINARY
      },
      { injector: fileSystemModule.injector }
    );
    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage).toHaveProperty("data");
    expect(fileSystemsPage.data.length).toBeGreaterThanOrEqual(1);

    for (let index in fileSystemsPage.data) {
      let fileSystem = fileSystemsPage.data[index];
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
      let result = await resolvers.Mutation.uploadFile(
        { user: null, application },
        { input: uploadInput },
        { injector: fileSystemModule.injector }
      );

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();

      let foundFile = await resolvers.Query.file(
        { user: null, application },
        { id: result.id },
        { injector: fileSystemModule.injector }
      );
      expect(foundFile).toBeDefined();
      expect(foundFile).toEqual(result);
    }
  }, 20000);

  test("deleteFileSystem ", async () => {
    let fileSystemsPage = await resolvers.Query.fileSystems(
      { user: null, application },
      {
        sortOptions: { sortBy: "id", sortOrder: "ASC" },
        pageOptions: DEFAULT_PAGE_OPTIONS,
        status: STATUS.ACTIVE,
        organizationId: user.organization.id
      },
      { injector: fileSystemModule.injector }
    );
    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage).toHaveProperty("data");
    expect(fileSystemsPage.data.length).toBeGreaterThanOrEqual(1);

    for (let index in fileSystemsPage.data) {
      let fileSystem = fileSystemsPage.data[index];
      await resolvers.Mutation.deleteFileSystem(
        { user: null, application },
        { id: fileSystem.id },
        { injector: fileSystemModule.injector }
      );

      let deletedfileSystem = await resolvers.Query.fileSystem(
        { user: null, application },
        { id: fileSystem.id },
        { injector: fileSystemModule.injector }
      );

      expect(deletedfileSystem).toBeDefined();
      expect(deletedfileSystem).toHaveProperty("id");
      expect(deletedfileSystem.id).toEqual(fileSystem.id);
      expect(deletedfileSystem).toHaveProperty("status");
      expect(deletedfileSystem.status).toEqual(STATUS.INACTIVE);
    }
  });

  test("deleteFileSystem - non existing file system", async () => {
    try {
      await resolvers.Mutation.deleteFileSystem(
        { user: null, application },
        { id: chance.string() },
        { injector: fileSystemModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(WCoreError);
      expect(error.message).toBe("FileSystem Not Found");
    }
    expect.assertions(3);
  });

  test("deleteFile - non existing file ", async () => {
    try {
      let x = await resolvers.Mutation.deleteFile(
        { user: null, application },
        { id: "x52436152" },
        { injector: fileSystemModule.injector }
      );
    } catch (error) {
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(WCoreError);
      console.log(error);
      expect(error.message).toBe("File Not Found");
    }
    expect.assertions(3);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
