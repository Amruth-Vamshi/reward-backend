import gql from "graphql-tag";
import { ENUM_DAY } from "../../common/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
  enum ENUM_DAY{
      ${[...Object.values(ENUM_DAY)]}
  }
  type Category
  type Product

  input Timings {
    openTime: Int!
    closeTime: Int!
  }
    
  input menuTimingInput {
    days: ENUM_DAY!
    data: [Timings!]!
  }

  input menuTimingsInput {
      name: String!
      code: String!
      menuTimings: [menuTimingInput!]!
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

  input removeMenuTimingsInput {
      code: String!
  }

  input addMenuTimingsInput {
    code: String!
    menuTimings: [menuTimingInput!]!
  }

  input updateMenuTimings {
		id: ID!
		days: ENUM_DAY!
		openTime: Int!
		closeTime: Int!
	}

  input updateMenuTimingsInput {
    code: String!
    menuTimings: [updateMenuTimings!]!
  }

  input removeMenuTimingsByIdInput {
    code: String!
    id: [ID!]
  }

  input addMenuTimingsForCategoryInput {
		category: ID!
		code: String!
  }

  input addMenuTimingsToProductInput {
		product: ID!
		code: String!
  }

  type MenuTimingsForCategory {
    id: ID
    code: String
    menuTimings: MenuTimings
    category: Category
  }
  
  type MenuTimingsForProduct {
    id: ID
    code: String
    menuTimings: MenuTimings
    product: Product
  }

  input removeMenuTimingsForCategoryInput {
		category: ID!
		code: String!
  }

  input removeMenuTimingsForProductInput {
		product: ID!
		code: String!
  }

  input updateMenuTimingsForCategoryInput {
		category: ID!
		code: String!
  }
  
  input updateMenuTimingsForProductInput {
		product: ID!
		code: String!
  }

	type Query {
        getMenuTimings: [MenuTimings] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])
    getMenuTimingsForCategory(category: ID!): MenuTimingsForCategory @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])
    getMenuTimingsForProduct(product: ID!): MenuTimingsForProduct @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])
    }
	type Mutation {
    createMenuTimings(input: menuTimingsInput!): MenuTimings @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    removeMenuTimings(input: removeMenuTimingsInput!): MenuTimings @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    removeMenuTimingsById(input: removeMenuTimingsByIdInput!): MenuTimings @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    addMenuTimings(input: addMenuTimingsInput!): MenuTimings @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    updateMenuTimings(input: updateMenuTimingsInput!): MenuTimings @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    addMenuTimingsForCategory(input: addMenuTimingsForCategoryInput!): MenuTimingsForCategory @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    removeMenuTimingsForCategory(input: removeMenuTimingsForCategoryInput!): MenuTimingsForCategory @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    updateMenuTimingsForCategory(input: updateMenuTimingsForCategoryInput!): MenuTimingsForCategory @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    addMenuTimingsToProduct(input: addMenuTimingsToProductInput!): MenuTimingsForProduct @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    removeMenuTimingsForProduct(input: removeMenuTimingsForProductInput!): MenuTimingsForProduct @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    updateMenuTimingsForProduct(input: updateMenuTimingsForProductInput!): MenuTimingsForProduct @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    resetMenuTimings(input: addMenuTimingsInput!): MenuTimings @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.MENU_TIMING},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    }
`;
export default typeDefs;
