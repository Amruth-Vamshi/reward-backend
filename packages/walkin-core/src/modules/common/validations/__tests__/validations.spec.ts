import * as CoreEntities from "../../../../entity";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection,
} from "../../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { WCoreError } from "../../exceptions";
import { WCORE_ERRORS } from "../../constants/errors";
import Chance from "chance";
import { isValidOrg, isValidUser } from "../Validations";

let user: CoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("Test Validations", () => {
  test("test isValidOrg for valid inputs", async () => {
    const entityManager = getManager();
    const orgInput = {
      name: chance.name(),
      code: chance.word(),
    };
    const isOrg = await isValidOrg(entityManager, orgInput);
    expect(isOrg).toBe(true);
  });
  // spaces are not allowed in codes
  test("test isValidOrg for invalid orgCode", async () => {
    const entityManager = getManager();
    const orgInput = {
      name: chance.name(),
      code: `${chance.company()} ${chance.company()}`,
    };
    const isOrg = isValidOrg(entityManager, orgInput);
    await expect(isOrg).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.INVALID_ORG_CODE)
    );
  });

  test("test isValidUser for valid inputs", async () => {
    const entityManager = getManager();

    const userInput = {
      email: `admin_${chance.name()}@getwalk.in`,
    };
    const isUser = await isValidUser(entityManager, userInput);
    expect(isUser).toBe(true);
  });

  test("test isValidUser for invalid email", async () => {
    const entityManager = getManager();
    const userInput = {
      email: chance.name(),
    };
    const isUser = isValidUser(entityManager, userInput);
    await expect(isUser).rejects.toThrowError(
      new WCoreError(WCORE_ERRORS.INVALID_EMAIL)
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
