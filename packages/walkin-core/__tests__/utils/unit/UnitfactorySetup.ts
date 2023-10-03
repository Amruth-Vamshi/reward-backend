import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { Connection, EntityManager } from "typeorm";
import { UserModule } from "../../../src/modules/account/user/user.module";
import { Users } from "../../../src/modules/account/user/user.providers";
import {
  BUSINESS_TYPE,
  ORGANIZATION_TYPES,
  STATUS,
  WALKIN_PRODUCTS
} from "../../../src/modules/common/constants";
import { AuthenicationModule } from "../../../src/modules/account/authentication/authentication.module";
import { AuthenticationProvider } from "../../../src/modules/account/authentication/authentication.providers";
import { User, WalkinProduct } from "../../../src/entity";
import { updateEntity } from "../../../src/modules/common/utils/utils";
import { loadWalkInProductsSeed } from "./functions";
import Initialize from "../../../src/modules/common/utils/orgUtils";
import { Chance } from "chance";
const chance = new Chance();
export const loadSeeds = async (entityManager: EntityManager) => {
  await loadWalkInProductsSeed(entityManager);
};

const createUser = async (entityManager: EntityManager) => {
  const { injector } = UserModule;
  const users = injector.get(Users);
  const userInput: IUserInput = {
    email: chance.email(),
    password: "password",
    firstName: "testUserFirstName",
    lastName: "testUserLastName"
  };
  const createOrganization = {
    code: "TEST_ORG",
    name: "TestOrg",
    organizationType: ORGANIZATION_TYPES.ORGANIZATION,
    status: STATUS.ACTIVE,
    phoneNumber: new Chance().phone({ formatted: false }),
    businessType: BUSINESS_TYPE.PARTNERSHIP
  };
  // const { HYPERX, NEARX, REFINEX, REWARDX } = WALKIN_PRODUCTS;
  // const walkinProducts = [REFINEX];
  const walkinProducts = [];
  let user = await users.registerUserForUnitTest(
    entityManager,
    userInput,
    createOrganization,
    walkinProducts
  );
  await Initialize.initOrganization(
    injector,
    entityManager,
    createOrganization,
    walkinProducts
  );

  user = await users.getUserById(entityManager, user.id);

  return { userInput, user };
};

const loginUser = async (entityManager: EntityManager, user: IUserInput) => {
  const { injector } = AuthenicationModule;
  const authenticationProvider = injector.get(AuthenticationProvider);
  const { jwt } = await authenticationProvider.login({
    email: user.email,
    password: user.password
  });
  return jwt;
};

export const setupUserForUnitTesting = async (
  transactionManager: EntityManager
) => {
  const {
    user,
    userInput
  }: { user: User; userInput: IUserInput } = await createUser(
    transactionManager
  );
  return { user, userInput };
};
export interface IUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
