import gql from "graphql-tag";
import { PRODUCT_TYPE } from "../../common/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
	scalar JSON
	enum STATUS
	enum ProductTypeEnum{
		${[...Object.values(PRODUCT_TYPE)]}
	}

	type Organization
	type ProductRelationship
	type Category
	type Channel
	type StoreFormat
	type Tag
	type ProductPrice
	type Option
	type CustomOption
	type ProductValues

	type ProductTag {
		product: Product
		tag: Tag
	}

	type TimingDetail {
		id: ID
		openTime: Int
		closeTime: Int
	}
	  
	type DaysTiming {
		days: String
		data: [TimingDetail]
	}
	
	type MenuTimings {
		name: String
		code: String
		timings: [DaysTiming]
	}

	type Product {
		id: ID
		code: String
		name: String
		description: String
		productType: String
		sku: String
		extend: JSON
		status: STATUS
		organization: Organization
		externalProductId: String
		categoryCode: JSON
	}

	type ProductRelationshipCustom{
		id: String
		parent: Product
		child: Product
		parentType: ProductTypeEnum
		childType : ProductTypeEnum
		relationship: ProductRelationshipTypeEnum
		config: JSON
		product:Product
	  }

	input CreateProductInput {
		code: String!
		name: String
		description: String
		productType: ProductTypeEnum
		sku: String
		status: STATUS!
		extend: JSON
		externalProductId: String!
		isProductUnique: Boolean
		categoryCode: JSON
	}

	input UpdateProductInput {
		id: ID!
		name: String
		description: String
		productType: ProductTypeEnum
		sku: String
		status: STATUS
		extend: JSON
		externalProductId: String
		isProductUnique: Boolean
		categoryCode: JSON
	}

	input CreateProductVariantInput {
		sku: String!
		optionValueIds: [ID!]!
	}

	input ProductSearchInput {
		externalProductId: String
		name: String
	}

	type CategoryProductOption {
		id: ID
		option: Option
		product: Product
	}

	input CategoryProductOptionInput {
		optionId: ID!
		productId: ID!
		productOptionLevelId: ID!
		productOptionLevel: ProductTypeEnum!
	}

	input UpdateCategoryProductOptionInput {
		id: ID!
		optionId: ID
		productId: ID
		productOptionLevelId: ID
		productOptionLevel: ProductTypeEnum
	}

	type ProductVariant {
		id: ID
		sku: String
		product: Product
		optionValues: [OptionValue]
	}

	input ProductVariantInput {
		sku: String!
		productId: ID!
	}

	input UpdateProductVariantInput {
		id: ID!
		sku: String
		productId: ID!
	}

	type ProductVariantValue {
		id: ID
		productVariant: ProductVariant
		optionValue: OptionValue
	}

	input ProductVariantValueInput {
		productVariantId: ID!
		optionValueId: ID!
	}

	input UpdateProductVariantValueInput {
		id: ID!
		productVariantId: ID!
		optionValueId: ID!
	}

	type ProductCategory {
		id: ID
		category: Category
		product: Product
        sortSeq: Int
	}

	input ProductCategoryInput {
		productId: ID!
		categoryId: ID!
        sortSeq: Int
	}

	input UpdateProductCategoryInput {
		id: ID!
		productId: ID
		categoryId: ID
        sortSeq: Int
	}

	input RemoveProductCategoryInput {
		id: ID!
		organizationId:ID!
	}

    input UpdateProductCategorySortSeqInput{
        id: ID!
        sortSeq: Int!
    }
    input UpdateProductCategorySortInput{
        organizationId:ID!
        productCategory:[UpdateProductCategorySortSeqInput]
    }

	type ProductItems {
		addons: [Product]
		variants: [Product]
		tags: [ProductTag]
		price: ProductPrice
	}

	input ProductByExternalProductIdInput {
		externalProductId: String!
		organizationId: ID!
	}

	type Query {

		productByProductCode(code: String): Product @auth

		products(input: ProductSearchInput): [Product] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

		productOptionsByProductId(productId: ID!): [CategoryProductOption] @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		productVariantsByProductId(productId: ID!): [ProductVariant] @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		productVariantValuesByProductVariantId(productVariantId: ID!): [ProductVariantValue] @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

		productCategoriesByCategoryId(categoryId: ID!): [ProductCategory] @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		productCategoriesByCategoryCode(categoryCode: String!): [ProductCategory] @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		
		productByExternalProductId(input: ProductByExternalProductIdInput!): Product @auth
	}
	type Mutation {
		createProduct(input: CreateProductInput!): Product @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		updateProduct(input: UpdateProductInput!): Product @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		disableProduct(productName: String!): Product @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

		createCategoryProductOption(input: CategoryProductOptionInput): CategoryProductOption @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		updateCategoryProductOption(input: UpdateCategoryProductOptionInput): CategoryProductOption @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

		createProductVariant(input: ProductVariantInput): ProductVariant @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		updateProductVariant(input: UpdateProductVariantInput): ProductVariant @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		createProductVariantValue(input: ProductVariantValueInput): ProductVariantValue @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		updateProductVariantValue(input: UpdateProductVariantValueInput): ProductVariantValue @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

		createProductCategory(input: ProductCategoryInput): ProductCategory @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		updateProductCategory(input: UpdateProductCategoryInput): ProductCategory @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

        updateProductCategorySortSeq(input: UpdateProductCategorySortInput): [ProductCategory] @disabled  @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
		])
		removeProductCategory(input: RemoveProductCategoryInput): ProductCategory @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
		])
	}
`;

export default typeDefs;
