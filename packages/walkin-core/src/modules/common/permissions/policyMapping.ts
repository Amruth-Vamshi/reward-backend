import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_CONSOLE,
  POLICY_PERMISSION_CONSOLE,
  POLICY_EFFECT,
  POLICY_TYPE,
  POLICY_ACCESS_LEVEL,
} from ".";

const entityResources = Object.keys(POLICY_RESOURCES_ENTITY);
const entityPolicyPermissions = Object.keys(POLICY_PERMISSION_ENTITY);
const uiResources = Object.keys(POLICY_RESOURCES_CONSOLE);
const uiPolicyPermissions = Object.keys(POLICY_PERMISSION_CONSOLE);
const StoreManagerEntityResources = ["ORDER", "STAFF"];
const mapPolicies = (resources, policyPermissions, policyType) => {
  const policies = [];
  for (const resource of resources) {
    for (const permission of policyPermissions) {
      const policy: any = {};
      policy.effect = POLICY_EFFECT.ALLOW;
      policy.type = policyType;
      policy.resource = resource;
      policy.accessLevel = POLICY_ACCESS_LEVEL.ALL;
      policy.permission = permission;
      policies.push(policy);
    }
  }
  return policies;
};

export const mapEntityPolicies = mapPolicies(
  entityResources,
  entityPolicyPermissions,
  POLICY_TYPE.ENTITY
);
export const mapUiPolicies = mapPolicies(
  uiResources,
  uiPolicyPermissions,
  POLICY_TYPE.UI
);

export const ManagerEntityPolicyMapper = mapPolicies(
  StoreManagerEntityResources,
  entityPolicyPermissions,
  POLICY_TYPE.ENTITY
);
