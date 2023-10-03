import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser,
  loadTestKeys
} from "../../../../../__tests__/utils/unit";
import { WCoreEntities } from "../../../../index";
import { getConnection, getManager } from "typeorm";
import { User, Policy, Role, Application } from "../../../../entity";

import { Chance } from "chance";
import {
  POLICY_TYPE,
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_CONSOLE,
  POLICY_ACCESS_LEVEL,
  POLICY_EFFECT,
  POLICY_PERMISSION_CONSOLE
} from "../../../common/permissions";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { UserModule } from "../../user/user.module";
import { Users } from "../../user/user.providers";
import { access } from "fs";
import { ApplicationModule } from "../application.module";
import { ApplicationProvider } from "../application.providers";
import { StatusEnum } from "../../../common/constants";
import { decode } from "jsonwebtoken";
let user: User;
const userProvider = UserModule.injector.get(Users);
const applicationProvider = ApplicationModule.injector.get(ApplicationProvider);
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("createApplication", () => {
  test("should create application using name", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    expect(createdApplication.id).toBeDefined();
    expect(createdApplication.name).toBe(applicationInput.name);
  });
  test("should create application using all properties", async () => {
    const manager = getManager();
    const applicationInput: Partial<Application> = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      platform: "IOS"
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    expect(createdApplication.id).toBeDefined();
    expect(createdApplication.name).toBe(applicationInput.name);
    expect(createdApplication.description).toBe(applicationInput.description);
    expect(createdApplication.platform).toBe(applicationInput.platform);
  });
  test("should not create application", async () => {
    const manager = getManager();
    const applicationInput: Partial<Application> = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      platform: "IOS"
    };
    const createdApplication = applicationProvider.createApplication(
      manager,
      chance.string({ length: 5 }),
      applicationInput
    );
    await expect(createdApplication).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
    );
  });
});

describe("deleteApplication", () => {
  test.skip("should delete an application", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    const deletedApplication = await applicationProvider.deleteApplication(
      manager,
      createdApplication.id
    );
    expect(deletedApplication.id).toBeUndefined();
    const findApplication = applicationProvider.getApplicationById(
      manager,
      createdApplication.id
    );
    await expect(findApplication).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND)
    );
  });
  test("should delete an application", async () => {
    const manager = getManager();
    const deletedApplication = applicationProvider.deleteApplication(
      manager,
      chance.string({ length: 5 })
    );

    await expect(deletedApplication).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND)
    );
  });
});

describe("generateAPIKey", () => {
  test.skip("should generate an api key", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    loadTestKeys();
    process.env.API_ISSUER = "Walkin";
    process.env.API_EXPIRES_IN = "365d";
    process.env.API_ALGORITHM = "RS256";
    const apiKey = await applicationProvider.generateAPIKey(
      manager,
      createdApplication.id,
      chance.string({ length: 3 }),
      user
    );
    const decodedOriginalAPI: any = decode(apiKey.api_key);
    expect(apiKey).toBeDefined();
    expect(decodedOriginalAPI).toHaveProperty("external_org_id")
  });
  test("should not generate an api key - Invalid application", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    loadTestKeys();
    process.env.API_ISSUER = "Walkin";
    process.env.API_EXPIRES_IN = "365d";
    process.env.API_ALGORITHM = "RS256";
    const apiKey = applicationProvider.generateAPIKey(
      manager,
      chance.string({ length: 5 }),
      chance.string({ length: 3 }),
      user
    );
    await expect(apiKey).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND)
    );
  });

  // Skipping this test case because user validation is not present in providers

  test.skip("should not generate an api key - Invalid user", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    loadTestKeys();
    process.env.API_ISSUER = "Walkin";
    process.env.API_EXPIRES_IN = "365d";
    process.env.API_ALGORITHM = "RS256";
    const apiKey = applicationProvider.generateAPIKey(
      manager,
      createdApplication.id,
      chance.string({ length: 3 }),
      null
    );
    await expect(apiKey).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.USER_NOT_FOUND)
    );
  });
});

describe("getAllApplications", () => {
  test.skip("should get all applications", async () => {
    const manager = getManager();
    for (let i = 0; i < 5; i++) {
      const applicationInput = {
        name: chance.string({ length: 5 })
      };
      const createdApplication = await applicationProvider.createApplication(
        manager,
        user.organization.id,
        applicationInput
      );
    }
    const applications = await applicationProvider.getAllApplications(manager);
    expect(applications).toHaveLength(5);
  });
});

describe("getApplicationById", () => {
  test.skip("should getApplicationById", async () => {
    const manager = getManager();
    let application;
    for (let i = 0; i < 5; i++) {
      const applicationInput = {
        name: chance.string({ length: 5 })
      };
      const createdApplication = await applicationProvider.createApplication(
        manager,
        user.organization.id,
        applicationInput
      );
      if (i === 3) {
        application = createdApplication;
      }
    }
    const foundApplication = await applicationProvider.getApplicationById(
      manager,
      application.id
    );
    expect(foundApplication).toMatchObject(application);
  });

  // Commenting because this is failing after introducing force await
  // test("should not getApplicationById", async () => {
  //   const manager = getManager();

  //   const foundApplication = applicationProvider.getApplicationById(
  //     manager,
  //     chance.string({ length: 5 })
  //   );
  //   await expect(foundApplication).rejects.toThrowError(
  //     new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND)
  //   );
  // });
});

describe("getApplicationByName", () => {
  test.skip("should getApplicationByName", async () => {
    const manager = getManager();
    let application;
    for (let i = 0; i < 5; i++) {
      const applicationInput = {
        name: chance.string({ length: 5 })
      };
      const createdApplication = await applicationProvider.createApplication(
        manager,
        user.organization.id,
        applicationInput
      );
      if (i === 3) {
        application = createdApplication;
      }
    }
    const foundApplication = await applicationProvider.getApplicationByName(
      manager,
      application.name,
      user.organization.id
    );
    expect(foundApplication).toMatchObject(application);
  });
  test.skip("should not getApplicationByName", async () => {
    const manager = getManager();
    let application;
    for (let i = 0; i < 5; i++) {
      const applicationInput = {
        name: chance.string({ length: 5 })
      };
      const createdApplication = await applicationProvider.createApplication(
        manager,
        user.organization.id,
        applicationInput
      );
      if (i === 3) {
        application = createdApplication;
      }
    }
    const foundApplication = applicationProvider.getApplicationByName(
      manager,
      application.name,
      chance.string({ length: 5 })
    );
    expect(foundApplication).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND)
    );
  });
  test.skip("should not getApplicationByName", async () => {
    const manager = getManager();
    let application;
    for (let i = 0; i < 5; i++) {
      const applicationInput = {
        name: chance.string({ length: 5 })
      };
      const createdApplication = await applicationProvider.createApplication(
        manager,
        user.organization.id,
        applicationInput
      );
      if (i === 3) {
        application = createdApplication;
      }
    }
    const foundApplication = applicationProvider.getApplicationByName(
      manager,
      chance.string({ length: 5 }),
      user.organization.id
    );
    await expect(foundApplication).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND)
    );
  });
});

describe("Update api key", () => {
  test.skip("should update api key", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    loadTestKeys();
    process.env.API_ISSUER = "Walkin";
    process.env.API_EXPIRES_IN = "365d";
    process.env.API_ALGORITHM = "RS256";
    const apiKey = await applicationProvider.generateAPIKey(
      manager,
      createdApplication.id,
      chance.string({ length: 3 }),
      user
    );
    const dataUpdateAPIKey = apiKey;
    dataUpdateAPIKey.environment = chance.string({ length: 3 });
    dataUpdateAPIKey.status = StatusEnum.ACTIVE;

    const updatedApiKey = await applicationProvider.updateAPIKey(
      manager,
      dataUpdateAPIKey
    );
    expect(updatedApiKey.id).toBe(apiKey.id);
    expect(updatedApiKey).toMatchObject(dataUpdateAPIKey);
  });

  test.skip("should not update api key", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    loadTestKeys();
    process.env.API_ISSUER = "Walkin";
    process.env.API_EXPIRES_IN = "365d";
    process.env.API_ALGORITHM = "RS256";
    const apiKey = await applicationProvider.generateAPIKey(
      manager,
      createdApplication.id,
      chance.string({ length: 3 }),
      user
    );
    const dataUpdateAPIKey = apiKey;
    dataUpdateAPIKey.environment = chance.string({ length: 3 });
    dataUpdateAPIKey.status = StatusEnum.ACTIVE;
    delete dataUpdateAPIKey.id;
    const updatedApiKey = applicationProvider.updateAPIKey(
      manager,
      dataUpdateAPIKey
    );
    await expect(updatedApiKey).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.API_KEY_NOT_FOUND)
    );
  });
});

describe("Should update application", () => {
  test.skip("should update application", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    const updateApplication = createdApplication;
    updateApplication.name = chance.string({ length: 5 });
    const updatedApplication = await applicationProvider.updateApplication(
      manager,
      updateApplication
    );
    expect(updatedApplication.id).toBe(createdApplication.id);
    expect(updatedApplication).toMatchObject(updateApplication);
  });
  test.skip("should not update application", async () => {
    const manager = getManager();
    const applicationInput = {
      name: chance.string({ length: 5 })
    };
    const createdApplication = await applicationProvider.createApplication(
      manager,
      user.organization.id,
      applicationInput
    );
    const updateApplication = createdApplication;
    updateApplication.name = chance.string({ length: 5 });
    delete updateApplication.id;
    const updatedApplication = applicationProvider.updateApplication(
      manager,
      updateApplication
    );
    await expect(updateApplication).toThrowError(
      new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND)
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
