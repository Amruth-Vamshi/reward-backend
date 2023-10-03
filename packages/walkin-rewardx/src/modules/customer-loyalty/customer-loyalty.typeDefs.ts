import gql from "graphql-tag";

export const typeDefs = gql`
  type Customer
  scalar JSON
  scalar Date
  enum STATUS

  """
  @deprecated Type might not be used
  """
  type CustomerLoyalty {
    id: ID
    points: Float
    pointsBlocked: Float
    customer: Customer
  }

  input CustomerLoyaltyInput {
    """
    CustomerId maintained by external systems
    """
    externalCustomerId: String
    """
    Extra data that can be used for implementation
    """
    extraData: JSON
    """
    Code for the loyalty card
    """
    loyaltyCardCode: String
    """
    UUID for the organization
    """
    organizationId: ID
    """
    If True, the API creates Customer & Customer Loyalty if customer doesn't exist
    """
    createCustomerIfNotExist: Boolean

    customerIdentifier: String
    phoneNumber: String
  }

  type CustomerLoyaltyOutput {
    createdTime: Date
    lastModifiedTime: Date
    """
    CustomerId maintained by external systems
    """
    externalCustomerId: String
    """
    Overall Loyalty Points belonging to the customer
    """
    overallPoints: Float
    """
    Loyalty Points that are immediately burnable. It can be different
    from overallPoints if some points are blocked and is signified by blockedPoints.
    """
    burnablePoints: Float
    """
    Overall Tender amount belonging to the customer. It is calculated by applying conversionRatio
    on the loyalty points
    """
    overallAmount: Float
    """
    BurnableAmount = BurnablePoints * conversionRatio
    """
    burnableAmount: Float
    """
    Loyalty Points blocked as part of a transaction
    """
    pointsBlocked: Float
    """
    BlockedAmount = BlockedPoints * conversionRatio
    """
    blockedAmount: Float
    """
    Code for the loyalty card
    """
    loyaltyCardCode: String
    """
    JFL Implementation Identifies if customer loyalty account is enabled or not
    """
    loyaltyEnabled: Boolean
    negativePoints: Float
    loyaltyTotals: JSON
    status: STATUS
    customerLoyaltyPrograms: JSON
  }

  input updateCustomerLoyaltyStatusInput{
    externalCustomerId: String!
    status : STATUS!
    loyaltyCardCode: String
  }

  type Query {
    """
    Gets CustomerLoyalty object queried by externalCustomerId
    """
    getCustomerLoyaltyByExternalCustomerId(
      input: CustomerLoyaltyInput!
    ): CustomerLoyaltyOutput @auth

    """
    Gets CustomerLoyalty object queried by externalCustomerId
    This API has been built for JFL Implementation
    """
    getCustomerLoyalty(
      storeId: String
      externalCustomerId: String!
    ): CustomerLoyaltyOutput @auth
  }
  type Mutation {
    """
    Creates Customer Loyalty for a customer
    """
    createCustomerLoyalty(input: CustomerLoyaltyInput!): CustomerLoyaltyOutput
      @auth

    updateCustomerLoyaltyStatus(input: updateCustomerLoyaltyStatusInput!): JSON @auth
  }
`;
