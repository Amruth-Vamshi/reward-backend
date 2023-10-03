import gql from "graphql-tag";

export const typeDefs = gql`
  type CustomerLoyalty
  enum STATUS
  scalar JSON

  type customerLoyaltyProgram {
    id: String
    loyaltyProgramCode: String
    loyaltyExperimentCode: String
    customerLoyaltyId: Int
    redeemedTransactions: Int
    issuedTransactions: Int
    status: STATUS
  }
  type customerLoyaltyProgramOutput {
    id: String
    loyaltyProgramCode: String
    loyaltyExperimentCode: String
    customerLoyalty: CustomerLoyalty
    redeemedTransactions: Int
    issuedTransactions: Int
    status: STATUS
  }

  input createCustomerLoyaltyProgramInput {
    loyaltyProgramCode: String!
    loyaltyExperimentCode: String!
    customerLoyaltyId: Int!
  }

  input customerLoyaltyProgramFilters {
    loyaltyProgramCode: String
    loyaltyExperimentCode: String
    customerLoyaltyId: Int
    status: STATUS
  }

  input updateCustomerloyaltyProgramStatus {
    externalCustomerId: String!
    status: STATUS!
    experimentCode: String!
  }

  type Query {
    getCustomerLoyaltyProgramById(
      customerLoyaltyProgramId: String!
    ): customerLoyaltyProgram @auth

    getCustomerLoyaltyProgramsByFilters(
      input: customerLoyaltyProgramFilters!
    ): [customerLoyaltyProgram] @auth
  }
  type Mutation {
    createCustomerLoyaltyProgram(
      input: createCustomerLoyaltyProgramInput!
    ): customerLoyaltyProgram @auth

    updateCustomerloyaltyProgramStatus(
      input: updateCustomerloyaltyProgramStatus!
    ): JSON @auth
  }
`;
