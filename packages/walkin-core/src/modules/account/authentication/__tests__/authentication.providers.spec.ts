import {
  createUnitTestConnection,
  getAdminUser,
  loadTestKeys,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";
import { WCoreEntities } from "../../../../index";
import { getConnection } from "typeorm";
import { User } from "../../../../entity";
import { Chance } from "chance";
import { UserModule } from "../../user/user.module";
import { Users } from "../../user/user.providers";
import { AuthenicationModule } from "../authentication.module";
import { AuthenticationProvider } from "../authentication.providers";
import { IUserInput } from "../../../../../__tests__/utils/unit/UnitfactorySetup";
import { unloadTestKeys } from "../../../../../__tests__/utils/unit/loadKeys";
import { WCoreError } from "../../../common/exceptions";
import { WCORE_ERRORS } from "../../../common/constants/errors";
import { decode } from "jsonwebtoken";
import moment from "moment";
let user: User;
let userInput: IUserInput;
const userProvider = UserModule.injector.get(Users);
const authenticationProvider = AuthenicationModule.injector.get(
  AuthenticationProvider
);

const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user, userInput } = await getAdminUser(getConnection()));
  loadTestKeys();
});

describe("login", () => {
  test("should login", async () => {
    const { jwt } = await authenticationProvider.login({
      email: userInput.email,
      password: userInput.password
    });
    expect(jwt).toBeDefined();
  });
  test.skip("should not login", async () => {
    try {
      const login = await authenticationProvider.login({
        email: chance.email({ length: 5 }),
        password: chance.string({ length: 5 })
      });
    } catch (err) {
      expect(err).toBeInstanceOf(WCoreError);
      expect(err).toMatchObject(new WCoreError(WCORE_ERRORS.USER_NOT_FOUND));
    }
  });
  test.skip("should not login", async () => {
    try {
      const login = await authenticationProvider.login({
        email: userInput.email,
        password: chance.string({ length: 5 })
      });
    } catch (err) {
      expect(err).toBeInstanceOf(WCoreError);
      expect(err).toMatchObject(new WCoreError(WCORE_ERRORS.WRONG_PASSWORD));
    }
  });
});

describe("logout", () => {
  test.skip("should logout", async () => {
    try {
      const logout = await authenticationProvider.logout(null, null);
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
  });
  test.skip("Implement logout and write tests for it", async () => {});
});

describe("refreshToken", () => {
  test("should refresh the token", async () => {
    process.env.API_ISSUER = "Walkin";
    process.env.API_EXPIRES_IN = "12h";
    process.env.API_ALGORITHM = "RS256";
    const { jwt } = await authenticationProvider.login({
      email: userInput.email,
      password: userInput.password
    });
    const decodedOriginalJWT: any = decode(jwt);
    const originalJWTExp = moment.unix(decodedOriginalJWT.exp);
    const refreshToken = await authenticationProvider.refreshToken(jwt);
    const decodedRefreshedJWT: any = decode(refreshToken.jwt);
    const refreshedJWTExp = moment.unix(decodedRefreshedJWT.exp);
    const expectedExpiryString = moment
      .utc()
      .add(12, "h")
      .format("MMMM Do YYYY, hh:mm");
    const refreshTokenExpiryString = refreshedJWTExp
      .utc()
      .format("MMMM Do YYYY, hh:mm");
    expect(expectedExpiryString).toBe(refreshTokenExpiryString);
    expect(decodedOriginalJWT).toHaveProperty("external_org_id");
  });
});

describe("jwt token payload variables", () => {
  test("should have orgId, externalOrgId", async () => {
    try {
      process.env.API_ISSUER = "Walkin";
      process.env.API_EXPIRES_IN = "12h";
      process.env.API_ALGORITHM = "RS256";
      const { jwt } = await authenticationProvider.login({
        email: userInput.email,
        password: userInput.password
      });
      const decodedOriginalJWT: any = decode(jwt);
      expect(decodedOriginalJWT).toHaveProperty("external_org_id")
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
    }
  });
});

afterAll(async () => {
  unloadTestKeys();
  await closeUnitTestConnection();
});
