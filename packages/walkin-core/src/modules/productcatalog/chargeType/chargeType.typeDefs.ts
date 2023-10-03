import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "@walkinserver/walkin-core/src/modules/common/permissions";
const typedefs = gql`
  type Organization
  type Charge {
    id: ID
    name: String
    organization: Organization
    chargeTypeCode: String
  }
  input ChargeTypeCreateInput {
    name: String!
    chargeTypeCode: String!
  }

  input ChargeTypeUpdateInput {
    id: ID!
    name: String
    chargeTypeCode: String
  }
  input ChargeTypeInput {
    id: ID
    name: String
    chargeTypeCode: String
  }
  input ChargeTypesInput {
    chargeTypeCode: [String]
  }
  type Query {
    chargeTypes(input: ChargeTypesInput): [Charge] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHARGETYPE},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
    chargeType(input: ChargeTypeInput): Charge @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHARGETYPE},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
  }
  type Mutation {
    createChargeType(input: ChargeTypeCreateInput): Charge @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHARGETYPE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    updateChargeType(input: ChargeTypeUpdateInput): Charge @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHARGETYPE},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    deleteChargeType(id: ID!): Boolean @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHARGETYPE},permission:${POLICY_PERMISSION_ENTITY.DELETE}}
		])
  }
`;

export default typedefs;
