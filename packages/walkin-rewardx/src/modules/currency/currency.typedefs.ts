import gql from "graphql-tag";

export const typeDefs = gql`
  type PaginationInfo
  input SortOptions
  input PageOptions

  type Currency {
    id: ID!
    """
    Unique code to identify the currency
    """
    code: String
    """
    Conversion Ratio between loyalty points and actual tender
    eg. Conversion ratio of 1 would mean 1 loyalty point
    """
    conversionRatio: Float
    """
    Name of the currency
    """
    name: String
  }

  input CurrencyCreateInput {
    """
    Unique code to identify the currency
    """
    code: String!
    """
    Conversion Ratio between loyalty points and actual tender
    eg. Conversion ratio of 1 would mean 1 loyalty point
    """
    conversionRatio: Float
    """
    Name of the currency
    """
    name: String!
  }

  input CurrencyUpdateInput {
    id: ID
    """
    Unique code to identify the currency
    """
    code: String!
    """
    Conversion Ratio between loyalty points and actual tender
    eg. Conversion ratio of 1 would mean 1 loyalty point
    """
    conversionRatio: Float
    """
    Name of the currency
    """
    name: String
  }

  type CurrencyPage {
    data: [Currency]
    paginationInfo: PaginationInfo
  }

  type Query {
    """
    Get Currency object by currencyCode
    """
    currencyByCode(currencyCode: String!): Currency @auth

    currencyList(
      pageOptions: PageOptions = {}
      sortOptions: SortOptions
    ): CurrencyPage @auth
  }
  type Mutation {
    """
    Create a new Currency. Currency defines the conversion between points and actual tender
    """
    createCurrency(input: CurrencyCreateInput!): Currency @auth

    """
    Updates Currency queriable by code
    """
    updateCurrency(input: CurrencyUpdateInput!): Currency @auth
  }
`;
