import {
  createUnitTestConnection,
  closeUnitTestConnection,
  setupI18n
} from "../../../../__tests__/utils/unit";
import * as WCoreEntities from "../../../entity";
import { Organizations } from "../../account/organization/organization.providers";
import { getManager } from "typeorm";
import {
  OrganizationTypeEnum,
  Status,
  Organization
} from "../../../graphql/generated-models";
import { FileSystemProvider, FileProvider } from "../filesystem.providers";
import { DEFAULT_PAGE_OPTIONS } from "../../common/constants";
import { CACHING_KEYS } from "../../common/constants";
import { getValueFromCache } from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";

let filesystemProvider: FileSystemProvider;
let fileProvider: FileProvider;
let organizationProvider: Organizations;
let globalOrganization: any;

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  setupI18n();
  organizationProvider = new Organizations();
  filesystemProvider = new FileSystemProvider();
  fileProvider = new FileProvider();

  const manager = getManager();
  globalOrganization = await organizationProvider.createOrganization(manager, {
    code: "TEST_ORG",
    name: "TEST_ORG",
    organizationType: OrganizationTypeEnum.Organization,
    status: Status.Active
  });
});

describe("FileSystem Provider", () => {
  test("CLOUDINARY - Create FileSystem", async () => {
    const manager = getManager();
    const fileSystemName = "TEST_CLOUDINARY";
    const filesystemInput: any = {
      name: fileSystemName,
      description: "Test org cloudinary",
      accessType: "PUBLIC",
      configuration: {
        cloud_name: "ccdapp",
        api_key: "643872291836123",
        api_secret: "_UHu259sZr2200hJM3w1ml345ig"
      },
      fileSystemType: "CLOUDINARY",
      enabled: true,
      status: "ACTIVE",
      organization: globalOrganization
    };
    const createdFileSystem = await filesystemProvider.createFileSystem(
      manager,
      filesystemInput
    );

    expect(createdFileSystem).toBeDefined();
    expect(createdFileSystem).toHaveProperty("id");
    expect(createdFileSystem).toHaveProperty("name");
    expect(createdFileSystem.name).toEqual(fileSystemName);
    expect(createdFileSystem).toHaveProperty("fileSystemType");
    expect(createdFileSystem.fileSystemType).toEqual("CLOUDINARY");
    expect(createdFileSystem).toHaveProperty("enabled");
    expect(createdFileSystem.enabled).toEqual(true);
    expect(createdFileSystem).toHaveProperty("status");
    expect(createdFileSystem.status).toEqual("ACTIVE");
    expect(createdFileSystem).toHaveProperty("accessType");
    expect(createdFileSystem.accessType).toEqual("PUBLIC");
  });

  test("CLOUDINARY - Update FileSystem", async () => {
    const manager = getManager();
    const fileSystemName = "TEST_CLOUDINARY_2";

    const filesystemInput: any = {
      name: fileSystemName,
      description: "Test org cloudinary",
      accessType: "PUBLIC",
      configuration: {
        cloud_name: "ccdapp",
        api_key: "643872291836123",
        api_secret: "_UHu259sZr2200hJM3w1ml345ig"
      },
      fileSystemType: "CLOUDINARY",
      enabled: true,
      status: "ACTIVE",
      organization: globalOrganization
    };
    const createdFileSystem = await filesystemProvider.createFileSystem(
      manager,
      filesystemInput
    );

    expect(createdFileSystem).toBeDefined();
    expect(createdFileSystem).toHaveProperty("id");
    expect(createdFileSystem.id).toBeGreaterThan(0);
    expect(createdFileSystem).toHaveProperty("name");
    expect(createdFileSystem.name).toEqual(fileSystemName);
    expect(createdFileSystem).toHaveProperty("fileSystemType");
    expect(createdFileSystem.fileSystemType).toEqual("CLOUDINARY");
    expect(createdFileSystem).toHaveProperty("enabled");
    expect(createdFileSystem.enabled).toEqual(true);
    expect(createdFileSystem).toHaveProperty("status");
    expect(createdFileSystem.status).toEqual("ACTIVE");
    expect(createdFileSystem).toHaveProperty("accessType");
    expect(createdFileSystem.accessType).toEqual("PUBLIC");

    createdFileSystem.accessType = "PRIVATE";
    createdFileSystem.enabled = false;
    const updatedFileSystem = await filesystemProvider.updateFileSystem(
      manager,
      createdFileSystem
    );

    expect(updatedFileSystem).toHaveProperty("enabled");
    expect(updatedFileSystem.enabled).toEqual(false);
    expect(updatedFileSystem).toHaveProperty("accessType");
    expect(updatedFileSystem.accessType).toEqual("PRIVATE");
  });

  test("Get All fileSystems", async () => {
    const manager = getManager();

    let fileSystemsPage = await filesystemProvider.getFileSystems(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC"
      },
      "TEST_CLOUDINARY_2",
      "PRIVATE",
      "CLOUDINARY",
      "ACTIVE",
      globalOrganization.id
    );

    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage.data).toBeDefined();
    expect(fileSystemsPage.data).toHaveProperty("length");
    expect(fileSystemsPage.data.length).toEqual(1);
    expect(fileSystemsPage.data[0]).toBeDefined();
    expect(fileSystemsPage.data[0]).toHaveProperty("id");
    expect(fileSystemsPage.data[0].id).toBeDefined();
  });

  test("Delete fileSystem", async () => {
    const manager = getManager();

    const fileSystemName = "TEST_CLOUDINARY_3";

    const filesystemInput: any = {
      name: fileSystemName,
      description: "Test org cloudinary",
      accessType: "PUBLIC",
      configuration: {
        cloud_name: "ccdapp",
        api_key: "643872291836123",
        api_secret: "_UHu259sZr2200hJM3w1ml345ig"
      },
      fileSystemType: "CLOUDINARY",
      enabled: true,
      status: "ACTIVE",
      organization: globalOrganization
    };
    const createdFileSystem = await filesystemProvider.createFileSystem(
      manager,
      filesystemInput
    );

    expect(createdFileSystem).toBeDefined();
    expect(createdFileSystem).toHaveProperty("id");
    expect(createdFileSystem.id).toBeGreaterThan(0);
    const result = await filesystemProvider.deleteFileSystem(
      manager,
      createdFileSystem.id,
      globalOrganization.id
    );

    const key = `${CACHING_KEYS.FILE_SYSTEM}_${createdFileSystem.id}_${globalOrganization.id}`;
    const cacheValue = await getValueFromCache(key);

    expect(result).toBeDefined();
    expect(result).toBeTruthy();
    expect(cacheValue).toBeNull();

    const foundFileSystem = await filesystemProvider.getFileSystem(
      manager,
      createdFileSystem.id,
      globalOrganization.id
    );

    expect(foundFileSystem).toBeDefined();
    expect(foundFileSystem).toHaveProperty("status");
    expect(foundFileSystem.status).toEqual("INACTIVE");
  });

  test("Create File", async () => {
    const manager = getManager();

    let fileSystemsPage = await filesystemProvider.getFileSystems(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC"
      },
      "TEST_CLOUDINARY_2",
      "PRIVATE",
      "CLOUDINARY",
      "ACTIVE",
      globalOrganization.id
    );

    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage.data).toBeDefined();
    expect(fileSystemsPage.data).toHaveProperty("length");
    expect(fileSystemsPage.data.length).toEqual(1);
    expect(fileSystemsPage.data[0]).toBeDefined();
    expect(fileSystemsPage.data[0]).toHaveProperty("id");
    expect(fileSystemsPage.data[0].id).toBeDefined();

    const fileName = "Screenshot from 2019-06-28 19-28-56.png";
    const file: any = {
      name: fileName,
      description: "Sample",
      mimeType: "image/png",
      encoding: "7bit",
      internalUrl:
        "http://res.cloudinary.com/ccdapp/image/upload/v1571656495/f1jip7hgtzdppgo74hqg.png",
      publicUrl:
        "https://res.cloudinary.com/ccdapp/image/upload/v1571656495/f1jip7hgtzdppgo74hqg.png",
      status: "ACTIVE",
      organization: globalOrganization,
      fileSystem: fileSystemsPage.data[0]
    };
    const createdFile = await fileProvider.createFile(manager, file);

    expect(createdFile).toBeDefined();
    expect(createdFile).toHaveProperty("id");
    expect(createdFile).toHaveProperty("name");
    expect(createdFile.name).toEqual(fileName);
    expect(createdFile).toHaveProperty("encoding");
    expect(createdFile.encoding).toEqual("7bit");
    expect(createdFile).toHaveProperty("status");
    expect(createdFile.status).toEqual("ACTIVE");
    expect(createdFile).toHaveProperty("mimeType");
    expect(createdFile.mimeType).toEqual("image/png");
  });

  test("Update File", async () => {
    const manager = getManager();

    let fileSystemsPage = await filesystemProvider.getFileSystems(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC"
      },
      "TEST_CLOUDINARY_2",
      "PRIVATE",
      "CLOUDINARY",
      "ACTIVE",
      globalOrganization.id
    );

    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage.data).toBeDefined();
    expect(fileSystemsPage.data).toHaveProperty("length");
    expect(fileSystemsPage.data.length).toEqual(1);
    expect(fileSystemsPage.data[0]).toBeDefined();
    expect(fileSystemsPage.data[0]).toHaveProperty("id");
    expect(fileSystemsPage.data[0].id).toBeDefined();

    const fileName = "Screenshot from 2019-06-28 19-28-56.png";
    const file: any = {
      name: fileName,
      description: "Sample",
      mimeType: "image/png",
      encoding: "7bit",
      internalUrl:
        "http://res.cloudinary.com/ccdapp/image/upload/v1571656495/f1jip7hgtzdppgo74hqg.png",
      publicUrl:
        "https://res.cloudinary.com/ccdapp/image/upload/v1571656495/f1jip7hgtzdppgo74hqg.png",
      status: "ACTIVE",
      organization: globalOrganization,
      fileSystem: fileSystemsPage.data[0]
    };
    const createdFile = await fileProvider.createFile(manager, file);

    expect(createdFile).toBeDefined();
    expect(createdFile).toHaveProperty("id");
    expect(createdFile).toHaveProperty("name");
    expect(createdFile.name).toEqual(fileName);
    expect(createdFile).toHaveProperty("encoding");
    expect(createdFile.encoding).toEqual("7bit");
    expect(createdFile).toHaveProperty("status");
    expect(createdFile.status).toEqual("ACTIVE");
    expect(createdFile).toHaveProperty("mimeType");
    expect(createdFile.mimeType).toEqual("image/png");

    createdFile.status = "INACTIVE";

    const udpatedFile = await fileProvider.updateFile(manager, createdFile);

    expect(udpatedFile).toBeDefined();
    expect(udpatedFile).toHaveProperty("id");
    expect(udpatedFile).toHaveProperty("name");
    expect(udpatedFile.name).toEqual(fileName);
    expect(udpatedFile).toHaveProperty("status");
    expect(udpatedFile.status).toEqual("INACTIVE");
  });

  test("Delete File", async () => {
    const manager = getManager();

    let fileSystemsPage = await filesystemProvider.getFileSystems(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC"
      },
      "TEST_CLOUDINARY_2",
      "PRIVATE",
      "CLOUDINARY",
      "ACTIVE",
      globalOrganization.id
    );

    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage.data).toBeDefined();
    expect(fileSystemsPage.data).toHaveProperty("length");
    expect(fileSystemsPage.data.length).toEqual(1);
    expect(fileSystemsPage.data[0]).toBeDefined();
    expect(fileSystemsPage.data[0]).toHaveProperty("id");
    expect(fileSystemsPage.data[0].id).toBeDefined();

    const fileName = "Screenshot from 2019-06-28 19-28-56.png";
    const file: any = {
      name: fileName,
      description: "Sample",
      mimeType: "image/png",
      encoding: "7bit",
      internalUrl:
        "http://res.cloudinary.com/ccdapp/image/upload/v1571656495/f1jip7hgtzdppgo74hqg.png",
      publicUrl:
        "https://res.cloudinary.com/ccdapp/image/upload/v1571656495/f1jip7hgtzdppgo74hqg.png",
      status: "ACTIVE",
      organization: globalOrganization,
      fileSystem: fileSystemsPage.data[0]
    };
    const createdFile = await fileProvider.createFile(manager, file);

    expect(createdFile).toBeDefined();
    expect(createdFile).toHaveProperty("id");
    expect(createdFile).toHaveProperty("name");
    expect(createdFile.name).toEqual(fileName);
    expect(createdFile).toHaveProperty("encoding");
    expect(createdFile.encoding).toEqual("7bit");
    expect(createdFile).toHaveProperty("status");
    expect(createdFile.status).toEqual("ACTIVE");
    expect(createdFile).toHaveProperty("mimeType");
    expect(createdFile.mimeType).toEqual("image/png");

    const result = await fileProvider.deleteFile(
      manager,
      createdFile.id,
      globalOrganization
    );

    expect(result).toBeDefined();
    expect(result).toBeTruthy();

    const foundFile = await fileProvider.getFile(
      manager,
      createdFile.id,
      globalOrganization.id
    );

    expect(foundFile).toBeDefined();
    expect(foundFile).toHaveProperty("status");
    expect(foundFile.status).toEqual("INACTIVE");
  });

  test("GenerateSignedUploadURL", async () => {
    const manager = getManager();

    let fileSystemsPage = await filesystemProvider.getFileSystems(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC"
      },
      "TEST_CLOUDINARY_2",
      "PRIVATE",
      "CLOUDINARY",
      "ACTIVE",
      globalOrganization.id
    );

    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage.data).toBeDefined();
    expect(fileSystemsPage.data).toHaveProperty("length");
    expect(fileSystemsPage.data.length).toEqual(1);
    expect(fileSystemsPage.data[0]).toBeDefined();
    expect(fileSystemsPage.data[0]).toHaveProperty("id");
    expect(fileSystemsPage.data[0].id).toBeDefined();

    const fileName =
      "http://www.kikkidu.com/wp-content/uploads/2010/06/CafeCoffeeDay.jpg";
    const file: any = {
      name: fileName,
      description: "Simple ICON",
      status: "ACTIVE",
      organizationId: globalOrganization.id
    };
    const createdFile = await fileProvider.generateSignedUploadURL(
      manager,
      file,
      fileSystemsPage.data[0]
    );

    expect(createdFile).toBeDefined();
    expect(createdFile).toHaveProperty("cloudinaryResponse");
    expect(createdFile.cloudinaryResponse).toBeDefined();
  }, 10000);

  test("Get All files", async () => {
    const manager = getManager();

    let fileSystemsPage = await filesystemProvider.getFileSystems(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC"
      },
      "TEST_CLOUDINARY_2",
      "PRIVATE",
      "CLOUDINARY",
      "ACTIVE",
      globalOrganization.id
    );

    expect(fileSystemsPage).toBeDefined();
    expect(fileSystemsPage.data).toBeDefined();
    expect(fileSystemsPage.data).toHaveProperty("length");
    expect(fileSystemsPage.data.length).toEqual(1);
    expect(fileSystemsPage.data[0]).toBeDefined();
    expect(fileSystemsPage.data[0]).toHaveProperty("id");
    expect(fileSystemsPage.data[0].id).toBeDefined();

    let filesPage = await fileProvider.getFiles(
      manager,
      DEFAULT_PAGE_OPTIONS,
      {
        sortBy: "id",
        sortOrder: "DESC"
      },
      fileSystemsPage.data[0].id,
      "Screenshot from 2019-06-28 19-28-56.png",
      "ACTIVE",
      globalOrganization.id
    );

    expect(filesPage).toBeDefined();
    expect(filesPage.data).toHaveProperty("length");
    expect(filesPage.data.length).toBeGreaterThanOrEqual(1);
    expect(filesPage.data[0]).toBeDefined();
    expect(filesPage.data[0]).toHaveProperty("id");
    expect(filesPage.data[0].id).toBeDefined();
  });

  test("Create S3 FileSystem and GenerateSignedUploadURL S3 ", async () => {
    const manager = getManager();
    const fileSystemName = "TEST_S3";
    const filesystemInput: any = {
      name: fileSystemName,
      description: "Test org S3",
      accessType: "PUBLIC",
      configuration: {
        accessKeyId: "AKIAYFTR3H6S2ZAJM7U6",
        secretAccessKey: "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",
        Bucket: "walkin-folder-for-testing-only",
        region: "ap-south-1",
        apiVersion: "2006-03-01",
        Expires: 6000
      },
      fileSystemType: "S3",
      enabled: true,
      status: "ACTIVE",
      organization: globalOrganization
    };
    const createdFileSystem = await filesystemProvider.createFileSystem(
      manager,
      filesystemInput
    );

    expect(createdFileSystem).toBeDefined();
    expect(createdFileSystem).toHaveProperty("id");
    expect(createdFileSystem).toHaveProperty("name");
    expect(createdFileSystem.name).toEqual(fileSystemName);
    expect(createdFileSystem).toHaveProperty("fileSystemType");
    expect(createdFileSystem.fileSystemType).toEqual("S3");
    expect(createdFileSystem).toHaveProperty("enabled");
    expect(createdFileSystem.enabled).toEqual(true);
    expect(createdFileSystem).toHaveProperty("status");
    expect(createdFileSystem.status).toEqual("ACTIVE");
    expect(createdFileSystem).toHaveProperty("accessType");
    expect(createdFileSystem.accessType).toEqual("PUBLIC");

    const fileName = "CCDDailyData.csv";
    const file: any = {
      name: fileName,
      description: "CCD Daily Transactions",
      status: "ACTIVE",
      organizationId: globalOrganization.id
    };
    const createdFile = await fileProvider.generateSignedUploadURL(
      manager,
      file,
      createdFileSystem
    );

    expect(createdFile).toBeDefined();
    expect(createdFile).toHaveProperty("s3Response");
    expect(createdFile.s3Response).toBeDefined();
    expect(createdFile.s3Response).toHaveProperty("url");
    expect(createdFile.s3Response.url).toBeDefined();
  }, 10000);
});

afterAll(async () => {
  await closeUnitTestConnection();
});
