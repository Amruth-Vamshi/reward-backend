import { Role } from "@walkinserver/walkin-core/src/entity/Role";
import {
  ManagerEntityPolicyMapper,
  mapUiPolicies,
  mapEntityPolicies,
} from "@walkinserver/walkin-core/src/modules/common/permissions/policyMapping";

export const RoleSeed: Array<Partial<Role>> = [
  // TODO: FIX these or remove
  {
    name: "DEVELOPER",
    description: "Owns up certain entities,UI & limited data",
  },
  {
    name: "OPERATION_MANAGER",
    description: "Operations Manager Role",
  },
  {
    name: "GUEST",
    description: "Gues role",
  },
  {
    name: "MANAGER",
    description: "Manager role",
    policies: [...ManagerEntityPolicyMapper],
  },
];
