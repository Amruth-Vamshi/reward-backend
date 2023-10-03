import gql from "graphql-tag";
import { DISCOUNT_VALUE_TYPE } from "../../common/constants";
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
  type DiscountType

  enum DiscountValueTypeEnum{
		${[...Object.values(DISCOUNT_VALUE_TYPE)]}
	}
  input ProductDiscountValueFilter {
    productId: [ID]
    storeFormat: ID
    channel: ID
    discountTypeId: ID
  }

  input ProductDiscountValue{
    productDiscountValueId: ID
    productId: ID
    storeFormat: ID
    channel: ID
    discountType: ID
    discountValueType: DiscountValueTypeEnum
  }

  input ProductDiscountValueUpdateInput {
    productDiscountValueId: ID!
    discountValue: Float
  }

  input ProductDiscountValueInput {
    productId: ID!
    storeFormat: ID!
    channel: ID!
    discountValue: Float!
    discountType: ID!
    discountValueType: DiscountValueTypeEnum
  }
  type ProductDiscountValuesPage{
    data: [ProductDiscount]
    errors:[JSON]
  }
  type ProductDiscount {
    id: ID
    product: Product
    storeFormat: StoreFormat
    channel: Channel
    discountValue: Float
    discountType: DiscountType
    discountValueType: DiscountValueTypeEnum
  }
  type ProductDiscountValuePage {
    data: [ProductDiscount]
    paginationInfo: PaginationInfo
  }
  type Query {
    productDiscountValue(filter: ProductDiscountValue): ProductDiscount @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
    productDiscountValues(
      filter: ProductDiscountValueFilter
      pageOptions: PageOptions
      sortOptions: SortOptions
    ): ProductDiscountValuePage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
  }

  type Mutation {
    createDiscountValueForProduct(input: ProductDiscountValueInput): ProductDiscount
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

    createDiscountValueForProducts(input: [ProductDiscountValueInput]): ProductDiscountValuesPage
      @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    updateDiscountValueForProduct(
      input: ProductDiscountValueUpdateInput
    ): ProductDiscount @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
		])

        removeDiscountValueForProduct(
      id:ID!
    ): ProductDiscount @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.DELETE
}}
		])

        updateDiscountValueForProducts(
      input: [ProductDiscountValueUpdateInput]
    ): [ProductDiscount] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
		])
  }
`;

export { typeDefs };
