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
  LEGAL_DOCUMENT_TYPE,
  STAFF_ROLE,
} from "../../common/constants/constants";

const typeDefs = gql`
	scalar JSON
	scalar DateTime
    type Organization
	type Store
	enum ENUM_LEGAL_DOCUMENT_TYPE{
		${[...Object.values(LEGAL_DOCUMENT_TYPE)]}
	}

    input UpdateLegalDocumentInput{
        id:ID!
        organizationId: ID!
        legalDocumentValue: String
        legalDocumentInfo: JSON
        legalDocumentUrl: String
        legalDocumentType: ENUM_LEGAL_DOCUMENT_TYPE
    }
  
    
      input AddLegalDocumentInput{
        organizationId: ID!
        legalDocumentValue: String!
        legalDocumentInfo: JSON
        legalDocumentUrl: String
        legalDocumentType: ENUM_LEGAL_DOCUMENT_TYPE!
      }
    type LegalDocument{
        id:ID
        organization: Organization
        legalDocumentValue: String
        legalDocumentInfo: JSON
        legalDocumentUrl: String
        legalDocumentType: String
    }


	type Query {
		getLegalOrganizationDocument(id: ID!,organizationId: ID!): LegalDocument @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.LEGAL_INFO},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		getLegalOrganizationDocuments(organizationId: ID!): [LegalDocument] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.LEGAL_INFO},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

	}

	type Mutation {
		addLegalOrganizationDocument(input: AddLegalDocumentInput!): LegalDocument @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.LEGAL_INFO},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])


		updateLegalOrganizationDocument(input: UpdateLegalDocumentInput!) : LegalDocument @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.LEGAL_INFO},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
		])

	
}



`;

export default typeDefs;
