import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
	scalar JSON
	enum STATUS
    type Organization
    type Product
    type Collection
    input PageOptions
    input SortOptions
    type PaginationInfo

    input ProductCollectionInput{
        productId: [ID!], 
        collectionCode:String
    }
    
    input ProductCollectionUpdateInput{
        productId: [ID!], 
        collectionCode:String
    }

    type ProductCollection {
        product: Product
        collection: Collection
        id:ID
    }
    type Mutation {
		addProductsToCollection(input: ProductCollectionInput): [ProductCollection] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}},
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        removeProductsFromCollection(input: ProductCollectionUpdateInput): [ProductCollection] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}},
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    `;

export default typeDefs;
