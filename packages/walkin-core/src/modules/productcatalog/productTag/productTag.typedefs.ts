import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY,
} from "../../common/permissions";

const typeDefs = gql`
	scalar JSON
	enum STATUS
    type Organization
    type Product
    type Tag
    input PageOptions
    input SortOptions
    type PaginationInfo

    input ProductTagInput{
        productId: ID!, 
        tagCodes:[String]
    }
    
    input ProductTagUpdateInput{
        productId: ID!, 
        tagCodes: [String]
    }

    input ProductTagFilter{
        productId: ID!
    }
    type ProductTag {
        product: Product
        tag: Tag
        id:ID
    }

    type Query {
        getProductTags(input: ProductTagFilter):[ProductTag] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}},
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }
    type Mutation {
		addTagsToProduct(input: ProductTagInput): [ProductTag] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}},
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        removeTagsFromProduct(input: ProductTagUpdateInput): [ProductTag] @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}},
            {resource:${POLICY_RESOURCES_ENTITY.PRODUCT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    `;

export default typeDefs;
