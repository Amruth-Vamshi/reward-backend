import gql from "graphql-tag";
import {
  ADDRESS_TYPE,
  GENDER,
  PRODUCT_TYPE
} from "../../../../walkin-core/src/modules/common/constants";

export const typeDefs = gql`
  enum STATUS
  scalar JSON


  enum ProductTypeEnum{
    ${[...Object.values(PRODUCT_TYPE)]}
  }
  enum GENDER{
    ${[...Object.values(GENDER)]}
  }
  enum ADDRESS_TYPE{
    ${[...Object.values(ADDRESS_TYPE)]}
  }

  type Collections
  
  input CustomerAddress {
    id:ID
    name:String
    addressLine1:String
    addressLine2:String
    city:String
    state:String
    country:String
    zip:String
    contactNumber:String
    addressTitle:String
    addressType:ADDRESS_TYPE
    geoLocation: String
    status: STATUS
  }

  type CollectionsItem {
    id: String
    itemId: String
    collections: Collections
  }

  input ItemDetails {
    code: String
		name: String
		description: String
		productType: ProductTypeEnum
		organizationId: ID
		sku: String
		status: STATUS
		extend: JSON
		externalProductId: String
		isProductUnique: Boolean
    STATUS: STATUS
		addressLine1: String
		addressLine2: String
		city: String
		state: String
		pinCode: String
		country: String
		externalStoreId: String
		email: String
		latitude: String
		longitude: String
    organization: ID
    firstName: String
    lastName: String
    phoneNumber: String
    gender: GENDER
    dateOfBirth: String
    externalCustomerId: String
    customerIdentifier: String
    address: CustomerAddress
  }

  input createCollectionItemsInput {
    collectionsId: String!
    itemId: String
    itemDetails: ItemDetails
  }

  input removeCollectionItemsInput {
    collectionItemsId: String!
  }

  input CollectionItemsFilter {
    itemId: String
    collectionsId: String
  }
  type CreateCollectionItemOutput{
    collectionItem: CollectionsItem
    createdCustomerLoyaltyAndCustomerLoyaltyPrograms: JSON
  }

  type Query {
    collectionItem(collectionItemId: String): CollectionsItem @auth
    collectionItems(filter: CollectionItemsFilter): [CollectionsItem] @auth
  }
  type Mutation {
    createCollectionItems(input: createCollectionItemsInput): CreateCollectionItemOutput
      @auth
    removeCollectionItems(input: removeCollectionItemsInput): CollectionsItem
      @auth
  }
`;
