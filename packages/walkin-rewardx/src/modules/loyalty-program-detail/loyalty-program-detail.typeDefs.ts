import gql from "graphql-tag";

export const typeDefs = gql`
  scalar JSON
  type Organization
  type LoyaltyProgramConfig
  type RuleSet
  enum STATUS

  type LoyaltyProgramDetail {
    id: Int
    experimentName: String
    experimentCode: String
    description: String
    organization: Organization
    loyaltyProgramConfig: LoyaltyProgramConfig
    extended: JSON
    loyaltyEarnRuleSet: RuleSet
    collectionIds: JSON
  }

  input CreateLoyaltyProgramDetailInput {
    experimentName: String!
    experimentCode: String!
    description: String
    loyaltyProgramConfigId: Int!
    extended: JSON
    loyaltyEarnRuleSetId: Int!
    collectionIds: JSON
  }

  input UpdateLoyaltyProgramDetailInput {
    detailId: Int!
    description: String
    extended: JSON
    loyaltyEarnRuleSetId: Int
    addCollectionIds: JSON
    removeCollectionIds: JSON
    status: STATUS
  }

  type createdLoyaltyProgramDetailOutput {
    createdDetail: LoyaltyProgramDetail
    createdCustomerLoyaltyPrograms: JSON
  }

  type updatedLoyaltyProgramDetailOutput {
    updatedDetail: LoyaltyProgramDetail
    createdCustomerLoyaltyPrograms: JSON
    disabledCustomerLoyaltyPrograms: JSON
  }

  input PageOptions
  type PaginationInfo

  type LoyaltyProgramDetailByConfigResponse {
    data: [LoyaltyProgramDetail]
    paginationInfo: PaginationInfo
  }

  type Query {
    getLoyaltyProgramDetails(organizationId: ID): [LoyaltyProgramDetail] @auth

    getLoyaltyProgramDetailById(detailId: Int!): LoyaltyProgramDetail @auth

    getLoyaltyProgramDetailByCode(detailCode: String!): LoyaltyProgramDetail
      @auth

    getLoyaltyProgramDetailByConfigId(configId: Int!, pageOptions: PageOptions): LoyaltyProgramDetailByConfigResponse @auth
  }
  type Mutation {
    createLoyaltyProgramDetail(
      input: CreateLoyaltyProgramDetailInput
    ): createdLoyaltyProgramDetailOutput @auth

    updateLoyaltyProgramDetail(
      input: UpdateLoyaltyProgramDetailInput
    ): updatedLoyaltyProgramDetailOutput @auth

    deleteLoyaltyProgramDetail(detailCode: String): LoyaltyProgramDetail @auth
  }
`;
