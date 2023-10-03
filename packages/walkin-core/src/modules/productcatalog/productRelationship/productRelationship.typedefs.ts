import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";
import { PRODUCT_RELATIONSHIP } from "../../common/constants/constants";

const typeDefs = gql`

enum ProductTypeEnum
enum ProductRelationshipTypeEnum{
  ${[...Object.values(PRODUCT_RELATIONSHIP)]}
}

 scalar JSON
 type Product
 type ProductCustom

  input ProductRelationshipInput{
    parentId: String
    childId: String
    parentType: ProductTypeEnum
    childType : ProductTypeEnum
    relationship: ProductRelationshipTypeEnum
    config: JSON
  }

  input ProductRelationshipUpdateInput{
      id:ID!
      config: JSON
      relationship: ProductRelationshipTypeEnum
  }

  input RemoveRelationShipInput{
      id:ID!
  }

  type ProductRelationship{
    id: String
    parent: ProductCustom
    child: ProductCustom
    parentType: ProductTypeEnum
    childType : ProductTypeEnum
    relationship: ProductRelationshipTypeEnum
    config: JSON
    product:ProductCustom
  }

  type Query {
    productRelationship(id:ID!): ProductRelationship @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
  }

  type Mutation {
    createProductRelationship(input: ProductRelationshipInput): ProductRelationship @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    createProductRelationships(input: [ProductRelationshipInput]): [ProductRelationship] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    updateProductRelationShip(input: ProductRelationshipUpdateInput): ProductRelationship @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    updateProductRelationShips(input: [ProductRelationshipUpdateInput]): [ProductRelationship] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    removeProductRelationShip(input:[RemoveRelationShipInput]): [ProductRelationship] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${
  POLICY_PERMISSION_ENTITY.DELETE
}}
		])
  }

`;

export { typeDefs };
