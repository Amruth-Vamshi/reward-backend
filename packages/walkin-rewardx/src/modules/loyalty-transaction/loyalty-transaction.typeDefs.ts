import gql from "graphql-tag";

export const typeDefs = gql`
  type Customer
  scalar JSON
  scalar Date
  scalar DateTime
  type LoyaltyLedger
  type CustomerLoyaltyOutput
  type LoyaltyProgram
  type Communication
  type PaginationInfo
  input SortOptions
  input PageOptions
  enum statusCodes {
    INITIATED
    PROCESSED
    COMPLETED
    CANCELLED
  }

  input Transaction {
    transactionType: String
    transactionDate: Date
    transactionChannel: String
    totalAmount: Float
    externalStoreId: String
  }

  type EarnableLoyaltyTransactionOutput {
    loyaltyCardCode: String
    earnablePoints: Float
    burnablePoints: Float
    earnableAmount: Float
    burnableAmount: Float
    loyaltyReferenceId: String
    blockedPoints: Float
  }

  type EarnableBurnableLoyaltyTransactionOutput {
    earnablePoints: Float
    burnablePoints: Float
    earnableAmount: String
    burnableAmount: String
    overallPoints: Float
    overallAmount: String
    loyaltyEnabled: Boolean
    earnedPointsExpiryValue: String
    earnedPointsExpiryUnit: String
    message: JSON
  }

  input EarnableLoyaltyTransactionInput {
    statusCode: String!
    organizationId: String
    externalCustomerId: String!
    loyaltyCode: String!
    loyaltyCardCode: String!
    burnFromLoyaltyCard: Boolean!
    loyaltyReferenceId: String!
    externalTransationId: String!
    createCustomerIfNotExist: Boolean
    orderData: JSON
    transactionData: Transaction
  }

  input BurnLoyaltyTransactionInput {
    statusCode: String!
    organizationId: String
    externalCustomerId: String!
    loyaltyCardCode: String!
    burnFromLoyaltyCard: Boolean!
    loyaltyReferenceId: String!
    externalTransationId: String!
    createCustomerIfNotExist: Boolean
    orderData: JSON
    transactionData: Transaction
  }

  input cancelLoyaltyInput {
    externalCustomerId: ID!
    loyaltyReferenceId: ID!
    organizationId: String
  }

  type LoyaltyStatus {
    statusId: Int
    statusCode: String
    statusType: String
    description: String
  }

  type LoyaltyTransaction {
    id: String
    statusCode: LoyaltyStatus
    code: String
    pointsBlocked: Float
    pointsIssued: Float
    pointsRedeemed: Float
    loyaltyReferenceId: String
    type: String
    name: String
    loyaltyLedgers: [LoyaltyLedger]
    customerLoyalty: CustomerLoyaltyOutput
    loyaltyProgram: LoyaltyProgram
  }

  type CustomerLoyaltyTransactionData {
    id: String
    statusCode: LoyaltyStatus
    code: String
    pointsBlocked: Float
    pointsIssued: Float
    pointsRedeemed: Float
    loyaltyReferenceId: String
    type: String
    name: String
    loyaltyLedgers: [LoyaltyLedger]
    customerLoyalty: CustomerLoyaltyOutput
    loyaltyProgram: LoyaltyProgram
    data: JSON
  }

  type TransactionStatusOutput {
    loyaltyReferenceId: String
    statusCode: String
  }

  input LoyaltyStatusInput {
    # 101: INITIATED ,201:PROCESSED, 301:COMPLETED, 401:CANCELLED
    statusId: String!
    statusCode: statusCodes!
    statusType: String
    description: String
  }
  type LoyaltyStatusOutput {
    statusId: Int
    statusCode: String
    statusType: String
    description: String
  }

  type LoyaltyTransactionPage {
    data: [CustomerLoyaltyTransactionData]
    paginationInfo: PaginationInfo
  }

  type ProcessLoyaltyOutput {
    id: String
    status: String
    externalCustomerId: String
    loyaltyReferenceId: String
    earnedPoints: Float
    earnedAmount: String
    burnedPoints: Float
    burnedAmount: String
    loyaltyCardCode: String
    earnedPointsExpiryValue: String
    earnedPointsExpiryUnit: String
    blockedPoints: Float
    message: JSON
  }

  type CancelLoyaltyTransactionOutput {
    id: String
    status: String
    externalCustomerId: String!
    loyaltyReferenceId: String
    totalPoints: Float
    totalAmount: String
  }

  type TransactionStatus {
    status: String
    message: String
  }

  type Query {
    earnBurnPoints(
      input: EarnableLoyaltyTransactionInput
    ): EarnableBurnableLoyaltyTransactionOutput @auth

    loyaltyTransaction(
      externalCustomerId: ID!
      cardCode: String
      organizationId: ID
      pageOptions: PageOptions = {}
      sortOptions: SortOptions
    ): LoyaltyTransactionPage @auth

    getCommunicationQuery(
      loyaltyProgramId: ID
      campaignID: ID
      transactionType: String
      customerData: JSON
    ): Communication @auth

    earnableBurnablePoints(
      externalCustomerId: String!
      loyaltyType: String
      data: JSON!
    ): EarnableBurnableLoyaltyTransactionOutput @auth

    loyaltyTransactionStatus(loyaltyReferenceId: String): TransactionStatus
      @auth
  }
  type Mutation {
    issuePoints(input: EarnableLoyaltyTransactionInput): ProcessLoyaltyOutput
      @auth

    burnPoints(input: BurnLoyaltyTransactionInput): ProcessLoyaltyOutput @auth

    expireCustomerLoyaltyPoints: Boolean @auth

    blockPoints(
      input: BurnLoyaltyTransactionInput
    ): EarnableLoyaltyTransactionOutput @auth

    applyBlock(loyaltyReferenceId: String): Boolean

    loyaltyTransactionCompleted(
      loyaltyReferenceId: ID!
    ): TransactionStatusOutput @auth

    cancelLoyaltyTransaction(
      externalCustomerId: String!
      loyaltyReferenceId: String
      loyaltyType: String
      completeBurn: Boolean
      completeEarn: Boolean
      organizationId: String
    ): CancelLoyaltyTransactionOutput @auth

    createLoyaltyTransactionStatusCodes(
      StatusInput: LoyaltyStatusInput
    ): LoyaltyStatusOutput @auth

    processLoyaltyIssuance(
      externalCustomerId: String
      loyaltyReferenceId: String
      loyaltyType: String
      data: JSON!
    ): ProcessLoyaltyOutput @auth

    processLoyaltyRedemption(
      externalCustomerId: String
      loyaltyReferenceId: String
      loyaltyType: String
      pointsToRedeem: Float
      data: JSON!
    ): ProcessLoyaltyOutput @auth

    createOrUpdateLoyaltyTransaction(
      externalCustomerId: String
      loyaltyReferenceId: String
      loyaltyType: String
      statusCode: String
      data: JSON
    ): LoyaltyTransaction @auth

    processLoyaltyTransaction(
      eventType: String
      loyaltyDate: String
      recordCount: Int
    ): TransactionStatus @auth

    issuePointsWithOrderId(loyaltyReferenceId: String): ProcessLoyaltyOutput
      @auth

    initiateLoyaltyTransaction(
      eventType: String
      loyaltyDate: String
    ): TransactionStatus @auth
  }
`;
