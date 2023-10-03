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


    input TaxTypeSearchInput {
        status: STATUS
        organizationId: ID
    }

    input TaxTypeInput{
        name: String
        taxTypeCode: String!
        description: String
        status: STATUS
        organization: ID
    }

    type TaxType {
        id: ID
        name: String
        taxTypeCode: String
        description: String
        status: STATUS
        organization: Organization
    }

    type TaxTypePage {
        data: [TaxType]
        paginationInfo: PaginationInfo
    }

    type Query {
		taxType(id: ID!, status: STATUS, organizationId: ID): TaxType @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAXTYPE},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        taxTypes(status: STATUS, organizationId: ID,pageOptions: PageOptions = {}, sortOptions: SortOptions): TaxTypePage @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAXTYPE},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    type Mutation {
		createTaxType(input: TaxTypeInput): TaxType @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAXTYPE},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])

        updateTaxType(id:ID!,input: TaxTypeInput): TaxType @auth(requires:[
            {resource:${POLICY_RESOURCES_ENTITY.TAXTYPE},
            permission:${POLICY_PERMISSION_ENTITY.READ}}
        ])
    }

    `;

export default typeDefs;
