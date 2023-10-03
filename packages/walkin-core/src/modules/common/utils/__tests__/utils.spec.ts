import * as CoreEntities from "../../../../entity";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import {
  authorizedToWorkOnOrganization,
  isUserOrAppAuthorizedToWorkOnOrganization,
  removeDuplicates,
  combineExpressions
} from "../utils";
import { WCoreError } from "../../exceptions";
import { WCORE_ERRORS } from "../../constants/errors";
import { ApplicationProvider } from "../../../account/application/application.providers";
import { ApplicationModule } from "../../../account/application/application.module";
import Chance from "chance";
let user: CoreEntities.User;
let application: CoreEntities.Application;
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const chance = new Chance();
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Common - Utils - Utils", () => {
  test("authorizedToWorkOnOrganization - Allowd", async () => {
    const entityManager = getManager();
    const organizationId = user.organization.id;
    authorizedToWorkOnOrganization(user, organizationId);
  });

  test("authorizedToWorkOnOrganization - Not Allowd", async () => {
    const entityManager = getManager();
    const organizationId = "random_org_id";
    try {
      authorizedToWorkOnOrganization(user, organizationId);
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error).toMatchObject(
        new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH)
      );
    }

    // Make sure two assertations are called or fail. If there is exception as expected
    // the system will call two assertations else only one
    expect.assertions(2);
  });

  test("isUserOrAppAuthorizedToWorkOnOrganization - Allowd - defined user and undefined application", async () => {
    const entityManager = getManager();
    const organizationId = user.organization.id;
    const input: Partial<CoreEntities.Application> = {
      name: chance.string({ length: 4 }),
      description: chance.string({ length: 4 }),
      platform: "Android"
    };
    application = await applicationService.createApplication(
      entityManager,
      organizationId,
      input
    );
    await isUserOrAppAuthorizedToWorkOnOrganization(
      user,
      application,
      organizationId
    );
  });

  test("isUserOrAppAuthorizedToWorkOnOrganization - Allwd - undefined user and defined application", async () => {
    const entityManager = getManager();
    const userObj = null;
    const organizationId = user.organization.id;
    const input: Partial<CoreEntities.Application> = {
      name: chance.string({ length: 4 }),
      description: chance.string({ length: 4 }),
      platform: "Android"
    };
    application = await applicationService.createApplication(
      entityManager,
      organizationId,
      input
    );
    application.organization = user.organization;
    await isUserOrAppAuthorizedToWorkOnOrganization(
      userObj,
      application,
      organizationId
    );
  });

  test("isUserOrAppAuthorizedToWorkOnOrganization - Not Allowd - undefined user and application", async () => {
    const organizationId = user.organization.id;
    const userObj = null;
    const applicationObj = null;
    try {
      await isUserOrAppAuthorizedToWorkOnOrganization(
        userObj,
        applicationObj,
        organizationId
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error).toMatchObject(
        new WCoreError(WCORE_ERRORS.USER_ORGANIZATION_DOESNOT_MATCH)
      );
    }
    expect.assertions(2);
  });

  test("removeDuplicates should remove duplicates given in an array", async () => {
    let ruleIds = [11, 12, 11];
    ruleIds = removeDuplicates(ruleIds);
    expect(ruleIds).toHaveLength(2);
    expect(ruleIds).toContain(11);
    expect(ruleIds).toContain(12);
  });

  test("combineExpressions should paranthethis", async () => {
    const ruleConfiguration = [
      {
        id: "1",
        combinator: "or",
        rules: [
          {
            id: "r-5b964d86-e827-4e3a-9863-bdfa6066b3b4",
            attributeName: "firstName",
            attributeValue: "Sai",
            expressionType: "EQUALS",
            attributeEntityName: "Customer"
          },
          {
            id: "r-30b6ba61-3a53-4846-9350-095e93c185a7",
            attributeName: "firstName",
            attributeValue: "Thej",
            expressionType: "EQUALS",
            attributeEntityName: "Customer"
          }
        ]
      }
    ];
    const finalExpression = await combineExpressions(ruleConfiguration);
    console.log(finalExpression);
    expect(finalExpression).toContain("(");
    expect(finalExpression).toContain(")");
    expect(finalExpression).toBe(
      ` ( lower(firstName)=lower('Sai') or lower(firstName)=lower('Thej'))`
    );
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
