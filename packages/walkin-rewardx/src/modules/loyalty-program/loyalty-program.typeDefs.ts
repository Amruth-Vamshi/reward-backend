import gql from "graphql-tag";
import { ExpiryUnit } from "../common/constants/constant";

export const typeDefs = gql`
  type Customer
  type Rule
  type Campaign
  type LoyaltyCard
  type PaginationInfo
  input SortOptions
  input PageOptions

  scalar JSON
  scalar Date
  input CampaignAddInput

  enum ExpiryUnit{
		${[...Object.values(ExpiryUnit)]}
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
    LoyaltyCardCode that uniquely identifies the LoyaltyCard
    """
    loyaltyCardCode: String
  }

  type CustomerLoyaltyOutput {
    createdTime: Date
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
  }

  input LoyaltyProgramInput {
    
    loyaltyCode: String!
    """
    Code for the loyalty card 
    """
    loyaltyCardCode: String
    """
    UUID for the organization
    """
    organizationId: String
  }

  type LoyaltyProgram {
    id:ID
    loyaltyBurnRule: Rule
    loyaltyEarnRule: Rule
    loyaltyExpiryRule: Rule
    expiryUnit: ExpiryUnit
    expiryValue: Int
    campaign: Campaign
    code: String
    loyaltyCode: String
    """
    Code for the loyalty card 
    """
    loyaltyCardCode: String
    """
    UUID for the organization
    """
    organizationId: String

    loyaltyCard: LoyaltyCard
    earnRuleValidation:JSON
    earnRuleData:JSON
    burnRuleValidation:JSON
    burnRuleData:JSON
    cancelTransactionRules:JSON
  }

  input CancelTransactionRulesInput{
    allowCancellation: Boolean!
    allowCancelForCompleted: Boolean!
    trackNegativePoints: Boolean!
  }

  input CreateLoyaltyProgramInput {
    name: String
    loyaltyCode: String!
    loyaltyCardCode: String!
    organizationId: String
    expiryUnit: ExpiryUnit
    expiryValue: Int
    expiryRuleConfiguration: JSON
    campaign: CampaignAddInput!
    earnRuleValidation:JSON
    earnRuleData:JSON
    burnRuleValidation:JSON
    burnRuleData:JSON
    cancelTransactionRules: CancelTransactionRulesInput
  }

  input UpdateLoyaltyProgramInput {
    id:String!
    name: String
    loyaltyCode: String!
    loyaltyCardCode: String!
    organizationId: String
    expiryUnit: ExpiryUnit
    expiryValue: Int
    expiryRuleConfiguration: JSON
    campaign: CampaignAddInput
    earnRuleValidation:JSON
    earnRuleData:JSON
    burnRuleValidation:JSON
    burnRuleData:JSON
  }

  type LoyaltyProgramPage {
    data: [LoyaltyProgram]
    paginationInfo: PaginationInfo
  }

  type Query {
    """
    Returns loyalty Program accessed by loyaltyCode
    """
    getLoyaltyProgramsByCode(input: LoyaltyProgramInput!): LoyaltyProgram @auth

    loyaltyPrograms(
      loyaltyCardCode:String !
      loyaltyCode:String 
      organizationId: ID
      pageOptions: PageOptions = {}
      sortOptions: SortOptions
    ): LoyaltyProgramPage @auth
  }
  type Mutation {
    """
    Creates a new loyalty program
    """
    createLoyaltyProgram(input: CreateLoyaltyProgramInput!): LoyaltyProgram
      @auth
    updateLoyaltyProgram(input: UpdateLoyaltyProgramInput): LoyaltyProgram @auth
  }
`;
