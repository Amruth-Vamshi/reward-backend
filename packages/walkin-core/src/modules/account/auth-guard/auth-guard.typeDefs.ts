import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_RESOURCES_CONSOLE,
  POLICY_PERMISSION_CONSOLE,
  POLICY_PERMISSION_ENTITY,
  POLICY_EFFECT,
  POLICY_TYPE,
  POLICY_ACCESS_LEVEL
} from "../../common/permissions";

const typeDefs = gql`

directive @auth(requires: [PermissionMap]) on  FIELD_DEFINITION

directive @disabled on FIELD_DEFINITION

directive @accessControl(requires: [PermissionMap]) on FIELD_DEFINITION

enum POLICY_RESOURCES {
		${[
      ...Object.keys(POLICY_RESOURCES_ENTITY),
      ...Object.keys(POLICY_RESOURCES_CONSOLE)
    ]}
  }

enum POLICY_PERMISSIONS {
  ${[
    ...Object.values(POLICY_PERMISSION_CONSOLE),
    ...Object.values(POLICY_PERMISSION_ENTITY)
  ]}
}

enum POLICY_EFFECTS{
		${[...Object.values(POLICY_EFFECT)]}
}

enum POLICY_TYPES{
  ${[...Object.values(POLICY_TYPE)]}
}

enum POLICY_LEVELS {
  ${[...Object.values(POLICY_ACCESS_LEVEL)]}
}

input PermissionMap{
  resource:POLICY_RESOURCES
  permission:POLICY_PERMISSIONS
} 
`;

export default typeDefs;
