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

    input DeactivateTagInput{
        id: ID!
    }
    input ActivateTagInput{
        id: ID!
    }
    input TagFilter {
        id: ID
        code: String
    }

    input TagsFilter{
        code: [String]
    }

    input TagInput{
        name: String
    }
    input TagUpdateInput{
        id: ID!
        name: String
    }

    type Tag {
        id: ID
        tagName: String
        code: String
        active: Boolean
        organization: Organization
    }

    type TagPage {
        data: [Tag]
        paginationInfo: PaginationInfo
    }

    type Query {
		getTag(filter:TagFilter): Tag @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        getTags(filter:TagsFilter,pageOptions: PageOptions = {}, sortOptions: SortOptions): TagPage @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    type Mutation {
		createTag(input: TagInput): Tag @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        updateTagName(input: TagUpdateInput): Tag @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        deactivateTag(input: DeactivateTagInput): Tag @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
        activateTag(input: ActivateTagInput): Tag @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAG},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    `;

export default typeDefs;
