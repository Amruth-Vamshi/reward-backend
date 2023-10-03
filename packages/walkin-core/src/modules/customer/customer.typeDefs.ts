import {
  GENDER,
  COMBINATOR,
  EXPRESSION_TYPE,
  ORDER,
  ADDRESS_TYPE
} from "../common/constants/constants";
import gql from "graphql-tag";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY
} from "../common/permissions";
const typeDefs = gql`

  enum STATUS
  enum ADDRESS_TYPE{
    ${[...Object.values(ADDRESS_TYPE)]}
  }
  scalar JSON
  scalar Upload

  type Segment
  type Tier

  input PageOptions

  type PaginationInfo

  type Address {
    id:ID
    name:String
    addressLine1:String
    addressLine2:String
    city:String
    state:String
    country:String
    zip:String
    contactNumber:String
    addressTitle:String
    addressType:ADDRESS_TYPE
    geoLocation: String
    person: Person
  }

  type PersonWithCustomer {
    person: Person
    customerId: ID
    organizationId: ID
  }

  input CustomerAddressInput{
    customerId: ID!
    name:String
    addressLine1:String!
    addressLine2:String
    city:String!
    state:String!
    country:String
    zip:String
    contactNumber:String
    addressTitle:String
    addressType:ADDRESS_TYPE
    latitude: String
    longitude: String
}

  input CustomerAddressRemoveInput{
    customerId: ID!
    addressId:ID
 }

  input AddressUpdateInput{
    addressId:ID!
    customerId:ID
    name:String
    addressLine1:String
    addressLine2:String
    city:String
    state:String
    country:String
    zip:String
    contactNumber:String
    addressTitle:String
    addressType:ADDRESS_TYPE
    latitude: String
    longitude: String
  }

  input customerSearchInput {
    email: String
    pageOptions: PageOptions = {}
  }

  type Customers {
    data: [Customer]
    paginationInfo: PaginationInfo
  }
  
  type Query {
    customer(input:SearchCustomerInput): Customer @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    person(input:SearchPersonInput): Person @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
   personWithCustomerId(input:SearchPersonInput): PersonWithCustomer @disabled @auth(requires:[ {resource:${
     POLICY_RESOURCES_ENTITY.CUSTOMER
   },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    getAddresses(customerId:ID, personId: ID):[Address] @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    customers(input: customerSearchInput): Customers @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])

  # Below APIs will be disabled in future
    customerDevice(input:SearchCustomerDeviceInput): CustomerDevice @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}]) 
    customerDefnition(organization_id: ID!): CustomerDefnition @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}]) 
    customerDevicesByCustomerId(customerId:String!): [CustomerDevice] @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}]) 
    customerDevices: [CustomerDevice] @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}]) 
    customerCount: JSON @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.DELIVERY
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    customerSearch(organizationId: ID!, filterValues:CustomerSearchFilters, pageNumber: Int! sort: Sort): CustomerSearchOutput @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])
    getSegmentRuleAsText(ruleId:ID): JSON @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.READ}}])

  }

  type Mutation {
    # createPerson can have org_id as part of the input as optional
    createPerson(person:CreatePersonInput!): PersonWithCustomer @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])

    createCustomer(customer:CreateCustomerInput!): Customer @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])

    disableCustomer(customerId:ID!): Customer @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])

    disablePerson(personId:ID!): Person @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])

    addAddressToCustomer(input:CustomerAddressInput):Address @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])

    removeAddressFromCustomer(input:CustomerAddressRemoveInput):Address @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.DELETE}}])

    updateAddress(input:AddressUpdateInput):Address @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])

    updatePerson(person:UpdatePersonInput!): Person @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])

  linkPersonWithOrganization(personId:ID!): Customer @disabled @auth(requires:[ {resource:${
    POLICY_RESOURCES_ENTITY.CUSTOMER
  },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])


  # Below APIs will be disabled in future
  """
   @deprecated Type might not be used
  """
    updateCustomer(customer:UpdateCustomerInput!): Customer @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
    createBulkCustomer(customers:[CreateCustomerInput]!): CreateBulkCustomerResponse @disabled @auth(requires:[ {resource:${
      POLICY_RESOURCES_ENTITY.CUSTOMER
    },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
      createCustomerDevice(customerDevice: CustomerDeviceInput!): CustomerDevice @disabled @auth(requires:[ {resource:${
        POLICY_RESOURCES_ENTITY.CUSTOMER
      },permission:${POLICY_PERMISSION_ENTITY.CREATE}}])
      updateCustomerDevice(customerDevice: UpdateCustomerDeviceInput!): CustomerDevice @disabled @auth(requires:[ {resource:${
        POLICY_RESOURCES_ENTITY.CUSTOMER
      },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])
      disableCustomerDevice(customerDevice: CustomerDeviceInput!) : CustomerDevice @disabled @auth(requires:[ {resource:${
        POLICY_RESOURCES_ENTITY.CUSTOMER
      },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])
      uploadFileForCreateBulkCustomer(input: CustomerFileUploadInput): UploadFileForCreateBulkCustomerResponse @disabled @auth(requires:[ {resource:${
        POLICY_RESOURCES_ENTITY.CUSTOMER
      },permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])
  }

  input Sort{
    attributeName:String
    order:ORDER
  }

  type CustomerSearchOutput{
    data:[JSON]
    total:Int
    page:Int
  }

  type Person {
    id: ID
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    gender: String
    dateOfBirth: String
    externalCustomerId: String
    personIdentifier: String
    extend: JSON
  }

  type PersonWithCustomer {
    person: Person
    customerId: ID
    organizationId: ID
  }

  type Customer {
    id: ID
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    gender: String
    dateOfBirth: String
    externalCustomerId: String
    customerIdentifier: String
    organization: Organization
    extend: JSON
    tier: Tier
    externalMembershipId: String
    # nearxUser : Boolean
    # userName: String
    # application: ID
  }

  type UpdateCustomer {
    id: ID
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    gender: String
    dateOfBirth: String
    externalCustomerId: String
    customerIdentifier: String
    organization: Organization
    extend: JSON
    tier: String
    onboard_source : String
    # nearxUser : Boolean
    # userName: String
    # application: ID
    customerDevices : [CustomerDevice]
  }

  input CustomerDeviceInput{
    id: String
    fcmToken : String
    customer_id : String
    osVersion : String
    deviceId : String
    extend: JSON
    modelNumber : String
  }

  type CustomerDevice{
    id : ID
    fcmToken : String
    deviceId : String
    modelNumber : String
    osVersion : String
    status : String
    extend: JSON
    organization: Organization
    customer: Customer
  }

  type Organization {
    id: ID!
  }

  type EntityExtend {
    id: ID!
  }

  input SearchCustomerInput {
    id: ID
    externalCustomerId: String
    organization_id: ID
    customerIdentifier: String
    phoneNumber: String
    tier: String
  }

  input SearchPersonInput {
    personId: ID
    personIdentifier: String
    phoneNumber: String
  }

  input SearchCustomerDeviceInput{
    id: ID
    fcmToken: String
    deviceId : String
    modelNumber : String
    customerId : String
  }

  input UpdateCustomerInput {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    gender: GENDER
    dateOfBirth: String
    externalCustomerId: String
    customerIdentifier: String
    extend: JSON
    tier: String
    organization: ID!
    externalMembershipId: String
  }

  input CreatePersonInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String!
    gender: GENDER
    dateOfBirth: String
    externalCustomerId: String
    personIdentifier: String
    extend: JSON
    organizationId: ID
  }

  input UpdatePersonInput {
    id: ID!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    gender: GENDER
    dateOfBirth: String
    externalCustomerId: String
    personIdentifier: String
    extend: JSON
    status: STATUS
  }

  input UpdateCustomerDeviceInput{
    id : ID!
    fcmToken : String
    modelNumber : String
    extend: JSON
    deviceId: String
    customerId : String
  }

  input CreateCustomerInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    gender: GENDER
    dateOfBirth: String
    externalCustomerId: String!
    customerIdentifier: String
    extend: JSON
    tier: String
    address: CustomerAddressInput
    externalMembershipId: String
  }

  type CreateBulkCustomerResponse {
    savedCustomers: [Customer]
    validationErrors: [ValidationError]
  }

  type ValidationError{
    phoneNumber: String
    errors: [String]
  }

  type CustomerDefnition{
    entityName: String
    searchEntityName: String
    columns :[CustomerColumn]
  }

  type CustomerColumn{
    column_slug : String
    column_search_key: String
    column_label : String
    column_type : String
    searchable: Boolean
    extended_column: Boolean
  }

  input CustomerSearchFilters{
      rules: [CustomerFieldSearch]
      combinator: COMBINATOR
  }

  enum COMBINATOR{
    ${[...Object.values(COMBINATOR)]}
  }

  input CustomerFieldSearch{
    id: ID,
    attributeName:String
    attributeValue:String
    expressionType:EXPRESSION_TYPE
  }

  enum ORDER{
    ${[...Object.values(ORDER)]}
  }

  enum EXPRESSION_TYPE{
    ${[...Object.values(EXPRESSION_TYPE)]}
  }

  input CustomerFields{
    id:ID
    firstName:String
    lastName:String
    email:String
    phoneNumer:String
    gender:String
    dateOfBirth:String
    organization_id:String
    status:STATUS
  }

  input CustomerFileUploadInput {
    file: Upload!
    segmentName: String
    organizationId: String
  }

  type UploadFileForCreateBulkCustomerResponse{
    rowCount: Int
    createdCount: Int
    failedCount: Int
    createBulkCustomerResponse: CreateBulkCustomerResponse
    segmentResponse: Segment
    
  }

  enum GENDER{
    ${[...Object.values(GENDER)]}
  }
`;

export default typeDefs;
