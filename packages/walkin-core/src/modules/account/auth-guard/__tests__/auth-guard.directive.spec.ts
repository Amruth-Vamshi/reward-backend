import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
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

import { StatusEnum } from "../../../common/constants";
import {
  graphql,
  Source,
  GraphQLArgs,
  DocumentNode,
  ObjectTypeDefinitionNode
} from "graphql";
import gql from "graphql-tag";
import { AuthDirective } from "../auth-guard.directive";
import { AuthGuardModule } from "../auth-guard.module";
let user: User;
const userProvider = UserModule.injector.get(Users);

const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe.skip("Name of the AuthDirective", () => {
  test.todo("should ", async () => {
    // const document: DocumentNode = gql`
    // type Query{
    //   organizationHierarchies:[JSON] @auth(requires:[
    //     {resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${POLICY_PERMISSION_ENTITY.READ}}
    //   ])
    // }
    // `;
    // const authGuardDirective: AuthDirective =
    //   AuthGuardModule.schemaDirectives.auth;
    // document.definitions.forEach((definition: ObjectTypeDefinitionNode) => {
    //   definition.fields.forEach(field => {});
    // });
    // authGuardDirective.visitFieldDefinition();
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
