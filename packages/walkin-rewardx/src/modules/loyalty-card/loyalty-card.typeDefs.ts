import gql from "graphql-tag";

export const typeDefs = gql`
  type Currency
  type Organization
  type PaginationInfo
  input SortOptions
  input PageOptions

  type LoyaltyCard {
    id: ID!
    """
    Unique code to identify the LoyaltyCard
    """
    code: String
    """
    Description for the LoyaltyCard
    """
    description: String
    """
    Name of the Loyalty card
    """
    name: String
    """
    Currency associated with the LoyaltyCard
    """
    currency: Currency!
    """
    Organization associated with the LoyaltyCard
    """
    organization: Organization
  }

  type LoyaltyCardPage {
    data: [LoyaltyCard]
    paginationInfo: PaginationInfo
  }

  input LoyaltyCardCreateInput {
    """
    Unique code to identify the LoyaltyCard
    """
    code: String!
    """
    Description for the LoyaltyCard
    """
    description: String
    """
    Name of the Loyalty card
    """
    name: String!
    """
    CurrencyCode for the LoyaltyCard
    """
    currencyCode: String!
    """
    UUID of the Organization
    """
    organizationId: String
  }

  input LoyaltyCardUpdateInput {
    id: ID!
    """
    Unique code to identify the LoyaltyCard
    """
    code: String!
    """
    Description for the LoyaltyCard
    """
    description: String
    """
    Name of the Loyalty card
    """
    name: String!
    """
    CurrencyCode for the LoyaltyCard
    """
    currencyCode: String!
    """
    UUID of the Organization
    """
    organizationId: String
  }

  type Query {
    """
    Get LoyaltyCard by ID
    """
    loyaltyCard(id:ID!): LoyaltyCard @auth

    """
    Get LoyaltyCard by Code
    """
    loyaltyCardByCode(loyaltyCardCode: String!): LoyaltyCard @auth

    loyaltyCards(
      organizationId: ID
      pageOptions: PageOptions = {}
      sortOptions: SortOptions
    ): LoyaltyCardPage @auth
  }

  type Mutation {
    """
    Creates a Loyalty Card for an organization
    """
    createLoyaltyCard(input: LoyaltyCardCreateInput!): LoyaltyCard @auth

    """
    Updates LoyaltyCard based on ID
    """
    updateLoyaltyCard(input: LoyaltyCardUpdateInput!): LoyaltyCard @auth
  }
`;
