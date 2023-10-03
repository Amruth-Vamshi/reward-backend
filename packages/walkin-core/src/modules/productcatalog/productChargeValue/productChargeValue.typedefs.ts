import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
  scalar JSON
  enum STATUS
  type Organization
  input PageOptions
  input SortOptions
  type PaginationInfo
  type Charge
  type Product
  type StoreFormat
  type Channel

  input ProductValueFilter {
    storeFormat: ID
    channel: ID
    productId:[ID]
    chargeType: ID
  }

  input ProductChargeValueInput{
      productChargeValueId: ID
      productId: ID
      storeFormat: ID
      channel: ID
      chargeType: ID
  }

  input ProductChargeValueForCatalogInput {
    catalogId: ID!
    storeFormat: ID!
    channel: ID!
    chargeType: ID!
    chargeValue: Float!
  }
  input ProductChargeValueUpdateForCatalogInput {
    catalogId: ID!
    storeFormat: ID!
    channel: ID!
    chargeType: ID!
    chargeValue: Float!
  }

  input ProductValueUpdateInput {
    productChargeValueId: ID!
    storeFormat: ID
    channel: ID
    chargeType: ID
    chargeValue: Float
  }

  input LinkProductChargeValueForProduct{
      productId: ID!
  }

  input RemoveProductChargeValues{
    storeFormat: ID!
    channel: ID!
    chargeType: ID!
  }
  input ProductValueInput {
    productId: ID!
    storeFormat: ID!
    channel: ID!
    chargeType: ID!
    chargeValue: Float!
  }
  type ProductValue {
    id: ID
    product: Product
    storeFormat: StoreFormat
    channel: Channel
    chargeValue: Float
    chargeType: Charge
  }
  type ProductValuePage {
    data: [ProductValue]
    paginationInfo: PaginationInfo
  }
  type Query {
    productChargeValue(filter: ProductChargeValueInput): ProductValue @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
    productChargeValues(
      filter: ProductValueFilter
      pageOptions: PageOptions!
      sortOptions: SortOptions
    ): ProductValuePage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
  }

  type Mutation {
    createChargeValueForProduct(input: ProductValueInput): ProductValue @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    createChargeValueForProducts(input: [ProductValueInput]): [ProductValue] @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
    ])
    createProductChargeValueForCatalog(
      input: ProductChargeValueForCatalogInput
    ): [ProductValue] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    updateProductChargeForCatalog(
      input: ProductChargeValueUpdateForCatalogInput
    ): [ProductValue] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    updateChargeValueForProduct(input: ProductValueUpdateInput): ProductValue
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    linkChargeValuesForProduct(
      input: LinkProductChargeValueForProduct
    ): [ProductValue] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
        removeProductChargeValues(input: RemoveProductChargeValues): [ProductValue]
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    removeProductChargeValue(id:ID!): ProductValue
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    updateChargeValueForProducts(input: [ProductValueUpdateInput]): [ProductValue]
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
  }
`;

export { typeDefs };
