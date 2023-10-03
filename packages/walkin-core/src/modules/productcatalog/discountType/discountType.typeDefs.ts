import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "@walkinserver/walkin-core/src/modules/common/permissions";
import { DISCOUNT_VALUE_TYPE } from "../../common/constants";
const typedefs = gql`
  type Organization

  type DiscountType {
    id: ID
    name: String
    organization: Organization
    discountTypeCode: String
    status: String 
    enabled:Boolean
  }
  input DiscountTypeCreateInput {
    name: String!
    discountTypeCode: String!
  }

  input DiscountTypeUpdateInput {
    id: ID!
    name: String
    discountTypeCode: String
   
  }
  input DiscountTypeInput {
    id: ID
    name: String
    discountTypeCode: String
  }
  input DiscountTypesInput {
    discountTypeCode: [String]
  }
  type Query {
    discountTypes(input: DiscountTypesInput): [DiscountType] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.DISCOUNT_TYPE},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
    discountType(input: DiscountTypeInput): DiscountType @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.DISCOUNT_TYPE},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
  }
  type Mutation {
    createDiscountType(input: DiscountTypeCreateInput): DiscountType @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.DISCOUNT_TYPE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    updateDiscountType(input: DiscountTypeUpdateInput): DiscountType @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.DISCOUNT_TYPE},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    deleteDiscountType(id: ID!): Boolean @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.DISCOUNT_TYPE},permission:${POLICY_PERMISSION_ENTITY.DELETE}}
		])
    disableDiscountType(id: ID!): DiscountType @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.DISCOUNT_TYPE},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
  }
`;

export default typedefs;
