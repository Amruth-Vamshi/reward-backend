import { Policy } from "@walkinserver/walkin-core/src/entity/Policy";
import {
  mapEntityPolicies,
  mapUiPolicies,
} from "@walkinserver/walkin-core/src/modules/common/permissions/policyMapping";

export const PolicySeed: Array<Partial<Policy>> = [
  ...mapEntityPolicies,
  ...mapUiPolicies,
];
