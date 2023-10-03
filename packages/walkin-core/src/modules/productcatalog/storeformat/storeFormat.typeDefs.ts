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
    type TaxType

    input StoreFormatPageOptions{
		page: Int = 1
		pageSize: Int = 100
	  }

    input StoreFormatSearchInput {
        status: STATUS
        organizationId: ID
    }

    input StoreFormatInput{
        name: String
        description: String
        storeFormatCode: String!
        status: STATUS
        organization: ID
        taxTypeCodes: [String]
    }


    input UpdateStoreFormat{
        name: String
        description: String
        storeFormatCode: String
        status: STATUS
        organization: ID
        taxTypeCodes: [String]
    }

    type StoreFormat {
        id: ID
        name: String
        description: String
        storeFormatCode: String
        status: STATUS
        organization: Organization
        taxTypes: [TaxType]
    }

    type StoreFormatPage {
        data: [StoreFormat]
        paginationInfo: PaginationInfo
    }

    type Query {
		storeFormat(id: ID!, status: STATUS, organizationId: ID): StoreFormat @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.STOREFORMAT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        storeFormats(status: STATUS, organizationId: ID, pageOptions: StoreFormatPageOptions = {}, sortOptions: SortOptions): StoreFormatPage @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.STOREFORMAT},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    type Mutation {
		createStoreFormat(input: StoreFormatInput): StoreFormat @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.STOREFORMAT},
            permission:${POLICY_PERMISSION_ENTITY.CREATE}}
        ])

        updateStoreFormat(id:ID!, input: UpdateStoreFormat): StoreFormat @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.STOREFORMAT},
            permission:${POLICY_PERMISSION_ENTITY.CREATE}}
        ])
    }

    `;

export default typeDefs;
