import gql from "graphql-tag";
import { SORTING_DIRECTIONS } from "@walkinserver/walkin-core/src/modules/common/constants/constants";

export const typeDefs = gql`
  scalar JSON
  scalar Date
  scalar DateTime
  enum SORTING_DIRECTIONS{
    ${[...Object.values(SORTING_DIRECTIONS)]}
  }
  type CustomerLoyalty
  type PaginationInfo

  type CustomerLoyaltyTransaction {
    id: ID!
    """
    Auto-generated transaction description
    """
    name:String
    """
    Unique loyalty reference Id. This is generated externally when a transaction is created
    """
		loyaltyReferenceId: String
    """
    Loyalty Type 
    """
		loyaltyType: String
    """
    StatusCode of the transaction 
    """
		status: String
    """
    Additional data stored as part of transaction
    """
		data: JSON
    """
    Points Blocked as part of the transaction. This is temporary field and will be updated 
    if points are unblocked 
    """
		pointsBlocked: Float
    """
    Points issued as part of the transaction
    """
		pointsIssued: Float
    """
    Points redeemed as part of the transaction
    """
		pointsRedeemed: Float
		customerLoyalty: CustomerLoyalty
  }
  
  type LoyaltyLedger {
    id: ID
    """
    Loyalty ledger points
    """
    points: Float
    """
    Description of ledger entry
    """
    remarks: String
    """
    Snapshot of the balance when ledger entry was created
    This is never updated. 
    """
    balanceSnapshot: Float
    """
    Type of ledger entry. 
    1. EXPIRED
    2. ISSUE
    3. REDUCE
    """
    type: String
    """
    @deprecated Not using it
    """
    totalAmount: Float
    """
    StoreId of the external system
    """
    externalStoreId: String
    """
    Expiry Date of loyalty points, if type is ISSUE
    """
    expiryDate: DateTime
    """
    Internal calculated field that tells how many points from this ledger is used or expired
    """
    pointsRemaining:Float
    """
    Internal calculated field useful for loyalty burn and expiry. 
    """
    details:JSON
  }

  type LoyaltyLedgerOutputType {
    id: ID
    """
    Loyalty ledger points
    """
    points: Float
    """
    Snapshot of the balance when ledger entry was created
    This is never updated. 
    """
    balanceSnapshot: Float
    """
    Internal calculated field that tells how many points from this ledger is used or expired
    """
    pointsRemaining: Float
    """
    Type of ledger entry. 
    1. EXPIRED
    2. ISSUE
    3. REDUCE
    """
    type: String
    """
    Expiry Date of loyalty points, if type is ISSUE
    """
    expiryDate: String
    """
    Internal calculated field useful for loyalty burn and expiry. 
    """
    details: JSON
    """
    Description of ledger entry
    """
    remarks: String
  }

  type CustomerLedgerOutput {
		createdTime: DateTime
		lastModifiedTime: DateTime
		id: ID
		loyaltyTransaction: CustomerLoyaltyTransaction
		loyaltyLedger: LoyaltyLedger
	}
	type LedgerOutput{
		data:[CustomerLedgerOutput]
		ledgerCount:Int
		externalCustomerId:String
		dateStart:DateTime
		dateEnd:DateTime
		page:Int
		itemsPerPage:Int
    orderBy:SORTING_DIRECTIONS
    loyaltyCardCode:String
    paginationInfo: PaginationInfo
	}

  type Query {
    """
    Gets LoyaltyLedgerHistory based on externalCustomerId & loyaltyCardCode 
    """
    loyaltyLedgerHistory(
      externalCustomerId: ID!
      cardCode: String!
    ): [LoyaltyLedgerOutputType] @auth

    """
    Gets CustomerLedgerHistory 
    Built for JFL Implementation
    """
    getCustomerLedger(
      externalCustomerId: String!
      loyaltyCardCode: String
			dateStart: DateTime
			dateEnd: DateTime
			page: Int
			itemsPerPage: Int
			orderBy: SORTING_DIRECTIONS
		): LedgerOutput @auth
  }
`;
