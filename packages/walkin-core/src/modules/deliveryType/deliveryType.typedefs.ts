import gql from "graphql-tag";
import { DB_SOURCE, STATUS } from "../common/constants/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "@walkinserver/walkin-core/src/modules/common/permissions";

const typeDefs = gql`
  scalar JSON
  type Organization
  enum STATUS
  input SortOptions
  type PaginationInfo
  input PageOptions {
    page: Int = 1
    pageSize: Int = 10
  }

  type DeliveryType {
    id: ID
    name: String
    code: String
    organization: Organization
  }

  input DeliveryInput {
    name: String!
    code: String!
  }
  input DeliveryUpdateInput {
    id: ID!
    name: String
    code: String
  }

  input DeliveryRemoveInput {
    id: ID!
  }
  input DeliveryFilterInput {
    id: ID
    code: String
  }

  input DeliverysFilterInput {
    id: [String]
    code: [String]
  }
  type Query {
    getDeliveryType(filter: DeliveryFilterInput): DeliveryType @auth (requires:[ {resource:${POLICY_RESOURCES_ENTITY.DELIVERY},permission:${POLICY_PERMISSION_ENTITY.READ}}])
    getDeliveryTypes(filter: DeliverysFilterInput): [DeliveryType] @auth (requires:[ {resource:${POLICY_RESOURCES_ENTITY.DELIVERY},permission:${POLICY_PERMISSION_ENTITY.READ}}])
  }

  type Mutation {
    addDeliveryType(input: DeliveryInput): DeliveryType @auth (requires:[ {resource:${POLICY_RESOURCES_ENTITY.DELIVERY},permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
    removeDeliveryType(input: DeliveryRemoveInput): DeliveryType @auth (requires:[ {resource:${POLICY_RESOURCES_ENTITY.DELIVERY},permission:${POLICY_PERMISSION_ENTITY.DELETE}}])
    updateDeliveryType(input: DeliveryUpdateInput): DeliveryType @auth (requires:[ {resource:${POLICY_RESOURCES_ENTITY.DELIVERY},permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
  }
`;

export default typeDefs;
