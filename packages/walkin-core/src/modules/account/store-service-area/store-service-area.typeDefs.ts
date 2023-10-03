import gql from "graphql-tag";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY,
} from "../../common/permissions";

import {
  COMBINATOR,
  EXPRESSION_TYPE,
  ORDER,
  ENUM_DAY,
  AREA_TYPE,
  STORE_SERVICE_AREA_TYPE,
  STAFF_ROLE,
} from "../../common/constants/constants";

const typeDefs = gql`
	scalar JSON
	scalar DateTime

	type Store
	enum ENUM_STORE_SERVICE_AREA_TYPE{
		${[...Object.values(STORE_SERVICE_AREA_TYPE)]}
	}

    input UpdateStoreServiceAreaInput{
        id:ID!
        organizationId: ID!
        serviceAreaValue: String
        serviceAreaType: ENUM_STORE_SERVICE_AREA_TYPE
    }
  
      input RemoveStoreServiceArea{
        serviceAreaId: ID!
          storeId: ID!
          organizationId: ID!
      }
      input AddStoreServiceAreaInput{
        storeId: ID!
        organizationId: ID!
        serviceAreaValue: String!
        serviceAreaType: ENUM_STORE_SERVICE_AREA_TYPE!
      }
    type StoreServiceArea{
        store:Store
        id:ID
        areaType: ENUM_STORE_SERVICE_AREA_TYPE
        status: String
        area: String
    }

	type Query {
		getStoreServiceArea(id: ID!,organizationId: ID!): StoreServiceArea @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		getStoreServiceAreas(storeId:ID!,organizationId: ID!): [StoreServiceArea] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

	}

	type Mutation {
		addStoreServiceArea(input: AddStoreServiceAreaInput!): StoreServiceArea @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])


		updateStoreServiceArea(input: UpdateStoreServiceAreaInput!) : StoreServiceArea @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

		enableStoreServiceArea(id: ID!, organizationId: ID!): StoreServiceArea @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
		disableStoreServiceArea(id: ID!, organizationId: ID!): StoreServiceArea @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.STORE},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])

	
}



`;

export default typeDefs;
