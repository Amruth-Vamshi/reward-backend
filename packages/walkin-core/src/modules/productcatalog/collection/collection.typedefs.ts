import gql from "graphql-tag";
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

    input CollectionStatusInput{
        id:ID!
    }

    input CollectionFilter {
        id: ID
        code: String
    }

    input CollectionsFilter{
        code: String
    }

    input CollectionInput{
        name: String
    }

    input CollectionUpdateInput{
        id:ID!
        name: String
    }

    type Collection {
        id: ID
        name: String
        code: String
        active: Boolean
        organization: Organization
    }

    type CollectionPage {
        data: [Collection]
        paginationInfo: PaginationInfo
    }

    type Query {
		getCollection(filter:CollectionFilter): Collection @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        getCollections(filter:CollectionsFilter,pageOptions: PageOptions = {}, sortOptions: SortOptions): CollectionPage @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    type Mutation {
		createCollection(input: CollectionInput): Collection @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        updateCollection(input: CollectionUpdateInput): Collection @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        deactivateCollection(input: CollectionStatusInput): Collection @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        activateCollection(input: CollectionStatusInput): Collection @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.COLLECTION},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    `;

export default typeDefs;
