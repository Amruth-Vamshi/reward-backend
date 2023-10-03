import gql from "graphql-tag";
import { PRODUCT_TYPE } from "../../common/constants";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
	scalar JSON
	enum STATUS

	type Product

	type Catalog

	enum ProductTypeEnum{
		${[...Object.values(PRODUCT_TYPE)]}
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

	type Category {
		id: ID
		name: String
		description: String
		code: String
		extend: JSON
		status: STATUS
		products: [Product]
		parent: Category
		children: [Category]
		catalog: Catalog
        sortSeq: Int
        imageUrl: String
        listable: Boolean,
		productType: ProductTypeEnum
		menuTimings: MenuTimings
	}

	input CreateCategoryInput {
		name: String!
		description: String!
		status: STATUS!
		code: String!
		extend: JSON
		catalogId: ID!
        imageUrl: String
		parentId: ID
        sortSeq: Int
		organizationId:String!
        listable: Boolean
		productType: ProductTypeEnum
	}

	input CategoryInput {
		id: ID
		name: String
		description: String
		code: String
		extend: JSON
		status: STATUS
	}

	input UpdateCategoryInput {
		id: ID!
		name: String
		description: String
		catalogId: ID
		status: STATUS
		extend: JSON
		code: String
		parentId: ID
        imageUrl: String
        sortSeq: Int
		organizationId:String!
        listable: Boolean
		productType: ProductTypeEnum
	}

	input CategorySearchInput {
		name: String
		description: String
		code: String
		status: STATUS
	}

	type CategorySearchOutput {
		categories: [Category]
	}

    input UpdateCategorySeq{
        id:ID!
        sortSeq: Int!
    }
    input UpdateCategorySortSeqInput{
        organizationId:String!
        categorySeq:[UpdateCategorySeq]
    }

	type Query {
	    category(id: ID!): Category @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
	    categoryByCode(catalogId: ID!,categoryCode: String!): Category @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
	    categoriesWithChildren(catalogId: ID!,categoryCode: String): Category @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		categories(catalogId: ID,parentCategoryId: ID, code: String): [Category] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
    }

	type Mutation{
		createCategory(input:CreateCategoryInput!):Category! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		updateCategory(input:UpdateCategoryInput!):Category! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		disableCategory(id:ID!):Category! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
        updateCategorySortSeq(input:UpdateCategorySortSeqInput!):[Category] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATEGORY},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
		])
	}

`;

export default typeDefs;
