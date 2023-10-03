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

  input ProductPriceValueFilter {
    productId: [ID]
    storeFormat: ID
    channel: ID
  }

  input ProductPriceValue{
    productPriceValueId: ID
    productId: ID
    storeFormat: ID
    channel: ID
  }

  input ProductPriceValueUpdateInput {
    productPriceValueId: ID!
    storeFormat: ID
    channel: ID
    productPrice: Float
  }

  input ProductPriceValueInput {

    productId: ID!
    storeFormat: ID!
    channel: ID!
    productPrice: Float!
  }
  type ProductPrice {
    id: ID
    product: Product
    storeFormat: StoreFormat
    channel: Channel
    priceValue: Float
    basePrice:Float
  }

  type ProductPriceValueRes {
    id: ID
    priceValue: Float
  }

  type ProductPriceValuePage {
    data: [ProductPrice]
    paginationInfo: PaginationInfo
  }

  input RemoveProductPriceValuesFilter {
    storeFormat: ID!
    channel: ID!
  }

  type Query {
    productPriceValue(filter: ProductPriceValue): ProductPrice @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
    productPriceValues(
      filter: ProductPriceValueFilter
      pageOptions: PageOptions
      sortOptions: SortOptions
    ): ProductPriceValuePage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
  }

  type Mutation {
    createPriceValueForProduct(input: ProductPriceValueInput): ProductPrice
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    createPriceValueForProducts(input: [ProductPriceValueInput]) : [ProductPrice]
    @auth(requires: [
      {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
    ])
    updatePriceValueForProduct(
      input: ProductPriceValueUpdateInput
    ): ProductPrice @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    updatePriceValueForProducts(
      input: [ProductPriceValueUpdateInput]
    ): [ProductPrice] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    removeProductPriceValuesByFilter(input: RemoveProductPriceValuesFilter): [ProductPriceValueRes]
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    removeProductPriceValues(ids: [ID!]): [ProductPriceValueRes]
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
  }
`;

export { typeDefs };
