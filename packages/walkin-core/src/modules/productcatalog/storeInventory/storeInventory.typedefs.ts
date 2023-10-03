import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
	scalar JSON
	enum STATUS
    type Store
    type Product
    
    type StoreInventory{
        store: Store
        product: Product
        inventoryAvailable: Boolean
    }

    input productAvailablityInput{
        productId: ID!
        available: Boolean!
        storeId: ID!
    }

    input addStoreInventory{
        storeId: ID!
    }

    input storeInventoryFilter{
        productId: [ID]
        storeId: ID!
    }
    input storeInventory{
        productId: ID!
        available: Boolean!
    }
    input storeProductsInput {
        storeId: ID!
        storeInventory:[storeInventory]!
    }

    type Query {
        storeInventory(input:storeInventoryFilter!): [StoreInventory] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }
    type Mutation {
		storeProductAvailablity(input: productAvailablityInput!): StoreInventory @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])

        storeProductsAvailablity(input: storeProductsInput!): [StoreInventory] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])

        addStoreInventoryForAllProducts(input: addStoreInventory!): [StoreInventory] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
        ])

    }

    `;

export default typeDefs;
