import gql from "graphql-tag";
import {
  ORGANIZATION_TYPES,
  WALKIN_PRODUCTS,
  RELEASED_WALKIN_PRODUCTS,
  BUSINESS_TYPE
} from "../../common/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
  
  type Application
  type User
  type Store
  scalar JSON
  input UserCreateInput
  type Metric
  type Webhook
  type BankAccount
  type LegalDocument
  enum STATUS

  enum BuisnessTypeEnum{
    ${[...Object.values(BUSINESS_TYPE)]}
  }
  enum OrganizationTypeEnum{
    ${[...Object.values(ORGANIZATION_TYPES)]}
  }

  enum walkinProducts {
    ${[...Object.values(RELEASED_WALKIN_PRODUCTS)]}
  }

  type WalkinProduct{
    id:ID
    name:String
    description:String
    latest_version:String
    status:STATUS
  }

  type Organization {
    id: ID
    name: String
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    pinCode: String
    country: String
    externalOrganizationId: String
    code: String
    status:STATUS!
    phoneNumber:String
    email:String
    website:String
    extend: JSON
    organizationType:OrganizationTypeEnum
    applications:[Application] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.APPLICATION
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    parent:Organization @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.ORGANIZATION
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    children:[Organization] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.ORGANIZATION
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    store:[Store] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.STORE
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    users:[User] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.USER
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    webhooks: [Webhook] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.WEBHOOKS
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    walkinProducts:[WalkinProduct] 
    webhooks:[Webhook] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.WEBHOOKS
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    bankAccount:[BankAccount] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.BANK_ACCOUNT
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    legalDocuments:[LegalDocument] @accessControl(requires:[{resource:${
      POLICY_RESOURCES_ENTITY.LEGAL_INFO
    },
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    businessType: String
    legalName: String
    brandLogo: String
  }

  input CreateOrganizationInput {
    name: String!
    legalName: String
    brandLogo: String
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    pinCode: String
    country: String
    externalOrganizationId: String
    code: String!
    status:STATUS!
    phoneNumber:String
    email:String
    website:String
    extend: JSON
    organizationType:OrganizationTypeEnum!
    businessType: BuisnessTypeEnum!
  }

  input UpdateOrganizationInput {
    id:ID!
    name: String
    legalName: String
    brandLogo: String
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    pinCode: String
    country: String
    externalOrganizationId: String
    status:STATUS
    phoneNumber:String
    email:String
    website:String
    extend: JSON
    organizationType:OrganizationTypeEnum
    businessType:BuisnessTypeEnum
    code:String
  }


  type DeleteOrganization{
    name: String!
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    pinCode: String
    country: String
    externalOrganizationId: String
    code: String
    status:STATUS!
    phoneNumber:String
    website:String
    extend: JSON
    organizationType:OrganizationTypeEnum
  }



  type Query {
    # Get all organization Hierarchies in the database
    organizationHierarchies:[JSON] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
    ])
    # Get a particular Hierarchy in the database by providing the rootId
    organizationHierarchy(rootId:ID!):JSON @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
    organization(id: ID!): Organization @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
  
    organizationRoots:[Organization] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

    subOrganizations(parentId:ID!,type:OrganizationTypeEnum,status:STATUS):[Organization] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
  }

  type Mutation{
    createOrganization(organizationInput:CreateOrganizationInput!,parentId:ID,walkinProducts:[walkinProducts],adminUserInput:UserCreateInput):Organization @auth
    deleteOrganization(id:ID!):DeleteOrganization! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    updateOrganization(organization:UpdateOrganizationInput!):Organization! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    deleteOrganizationHierarchy(id:ID!):[DeleteOrganization] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    linkUserToOrganization(organizationId:ID!,userId:ID!):Organization @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
    ])
    linkOrganizationToparent(organizationId:ID!,parentId:ID!):Organization @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
    ])
    linkOrganizationToWalkinProducts(organizationId:ID!,walkinProducts:[walkinProducts]):Organization @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
    ])
    linkOrganizationToMetrics(organizationId:ID!, walkinProducts:[walkinProducts]): [Metric] @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
    ])
  }
`;

export default typeDefs;
