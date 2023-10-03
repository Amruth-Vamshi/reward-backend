import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
	type Organization
    enum STATUS
    type Category
	type Product
    type ProductVariant
	type ProductCategory
    enum ProductTypeEnum
	scalar JSON

    type CategoryProduct{
        id: ID
		code: String
		name: String
		description: String
		productType: String
		imageUrl: String
		sku: String
		type: ProductTypeEnum
		extend: JSON
		status: STATUS
		variants: [ProductVariant]
        listable: Boolean
		productCategory: ProductCategory
		menuTimings: MenuTimings
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

    type Categories{
        id: ID
		name: String
		description: String
		code: String
		extend: JSON
		status: STATUS
		products: [CategoryProduct]
		parent: Category
		children: [Categories]
		catalog: Catalog
        sortSeq: Int
        imageUrl: String
        listable: Boolean
		productType: ProductTypeEnum
		menuTimings: MenuTimings
    }
   
    type Catalog {
		id: ID
		name: String
		catalogCode: String
		description: String
		organization: Organization
		usage: CatalogUsage
		categories: [Categories]
        status: String
        listable: Boolean
		externalCatalogId: String
	}
    
	type CatalogUsage {
		id: ID
		purpose: String
	}

	input CatalogInput {
		name: String!
        listable: Boolean
		catalogCode: String!
		description: String
		organizationId: ID!
		usage: CatalogUsageInput
		externalCatalogId: String
	}

	input CatalogUsageInput {
		purpose: String
	}

	input UpdateCatalogInput {
		id: ID!
		name: String
        listable: Boolean
		usage: UpdateCatalogUsageInput
		externalCatalogId: String
	}

	input UpdateCatalogUsageInput {
		id: ID!
		purpose: String
	}

	type Query {
	    catalog(id: ID!): Catalog @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATALOG},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
		catalogs(organizationId: ID, code: String, externalCatalogId: String):[Catalog] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATALOG},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])

    }

	type Mutation{
		createCatalog(input:CatalogInput!):Catalog! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATALOG},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		updateCatalog(input:UpdateCatalogInput!):Catalog! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATALOG},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])

		deleteCatalog(id: ID!, organizationId: ID!): Catalog @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CATALOG},permission:${POLICY_PERMISSION_ENTITY.DELETE}}
		])
	}

`;

export default typeDefs;
