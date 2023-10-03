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

  type Payment {
    id: ID
    name: String
    code: String
    organization: Organization
  }

  input PaymentInput {
    name: String!
    code: String!
  }
  input PaymentUpdateInput {
    id: ID!
    name: String
    code: String
  }

  input PaymentRemoveInput {
    id: ID!
  }
  input PaymentFilterInput {
    id: ID
    code: String
  }

  input PaymentsFilterInput {
    id: [String]
    code: [String]
  }
  type Query {
    getPaymentType(filter: PaymentFilterInput): Payment @auth(requires:[ {resource:${POLICY_RESOURCES_ENTITY.PAYMENT},permission:${POLICY_PERMISSION_ENTITY.READ}}])
    getPaymentTypes(filter: PaymentsFilterInput): [Payment] @auth(requires:[ {resource:${POLICY_RESOURCES_ENTITY.PAYMENT},permission:${POLICY_PERMISSION_ENTITY.READ}}])
  }

  type Mutation {
    addPaymentType(input: PaymentInput): Payment @auth(requires:[ {resource:${POLICY_RESOURCES_ENTITY.PAYMENT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
    removePaymentType(input: PaymentRemoveInput): Payment @auth(requires:[ {resource:${POLICY_RESOURCES_ENTITY.PAYMENT},permission:${POLICY_PERMISSION_ENTITY.DELETE}}])
    updatePaymentType(input: PaymentUpdateInput): Payment @auth(requires:[ {resource:${POLICY_RESOURCES_ENTITY.PAYMENT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
  }
`;

export default typeDefs;
