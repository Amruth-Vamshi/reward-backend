import gql from "graphql-tag";
import {
  DB_SOURCE,
  WALKIN_PRODUCTS,
  METRIC_TYPE,
  METRIC_FILTER_TYPE,
  STATUS,
  PARTNER_TYPE,
} from "../common/constants/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
} from "@walkinserver/walkin-core/src/modules/common/permissions";

const typeDefs = gql`
  scalar JSON
  enum STATUS
  enum PARTNER_TYPE{
    	${[...Object.values(PARTNER_TYPE)]}
  	}
  input SortOptions
  type PaginationInfo
  input PageOptions {
    page: Int = 1
    pageSize: Int = 10
  }

  type Partner {
    id: ID
    name: String
    partnerType: PARTNER_TYPE
    code: String
    status: STATUS
  }

  input PartnerInput {
    name: String!
    partnerType: PARTNER_TYPE
    code: String
    status: STATUS
  }
  input PartnerUpdateInput {
    id: ID!
    name: String
    partnerType: PARTNER_TYPE
    code: String
    status: STATUS
  }

  input PartnerRemoveInput {
    id: ID!
  }
  input PartnerFilterInput {
    id: ID
    name: String
  }

  input PartnersFilterInput {
    name: String
    partnerType: PARTNER_TYPE
  }
  type Query {
    getPartner(filter: PartnerFilterInput): Partner @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.DELIVERY
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    getPartners(filter: PartnersFilterInput): [Partner] @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.DELIVERY
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
  }

  type Mutation {
    addPartner(input: PartnerInput): Partner @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.DELIVERY
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    removePartner(input: PartnerRemoveInput): Partner @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.DELIVERY
    },permission:${POLICY_PERMISSION_ENTITY.DELETE}}])
    updatePartner(input: PartnerUpdateInput): Partner @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.DELIVERY
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
  }
`;

export default typeDefs;
