import gql from "graphql-tag";
import { STATUS } from "../../common/constants";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY
} from "../../common/permissions";

const typeDefs = gql`

  scalar JSON 
  enum walkinProducts
  type Organization
  type Application
  type User
  input CreateOrganizationInput
  type Campaign
  type Role
  type Store
  input SortOptions

  type User{
    id: ID
    email:String
    userName: String
    firstName:String
    lastName:String
    extend: JSON
    status:String
    organization:Organization
    createdCampaigns:[Campaign]@accessControl(requires:[{resource:${POLICY_RESOURCES_ENTITY.CAMPAIGN},
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    roles:[Role]@accessControl(requires:[{resource:${POLICY_RESOURCES_ENTITY.ROLE},
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    store:[Store]@accessControl(requires:[{resource:${POLICY_RESOURCES_ENTITY.STORE},
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    resetPassword:Boolean
  }

  input UserCreateInput{
    email:String
    userName: String
    firstName:String
    lastName:String
    password:String!
  }

  input UserUpdateInput{
    id:ID!
    email:String
    userName: String
    firstName:String
    lastName:String
    extend: JSON
    status:STATUS
  }
  type PaginationInfo {
    # Total number of pages
    totalPages: Int

    # Total number of items
    totalItems: Int

    # Current page number
    page: Int

    # Number of items per page
    perPage: Int

    # When paginating forwards, are there more items?
    hasNextPage: Boolean

    # When paginating backwards, are there more items?
    hasPreviousPage: Boolean
  }
  input PageOptions{
    page: Int = 1
    pageSize: Int = 10
  }

  type UserPage {
    data: [User!] @accessControl(requires:[{resource:${POLICY_RESOURCES_ENTITY.USER},
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    paginationInfo: PaginationInfo
  }

  type ConfirmEmailResponse{
    userId: String
    email: String
    verified: Boolean
  }
  type UpdatePasswordResponse{
    updated: Boolean
  }

  type ResetPasswordResponse{
    userId: String
    email: String
    sentLink: Boolean
  }

  type ResetPassword{
      token: String
      updated: Boolean
  }

  input LinkUserStoreInput{
      userId: ID!
      storeId: ID!
  }

  input RemoveUserStoreInput {
    userId: ID!
    storeId: ID!
  }
  
  type UserDeviceInformation {
    id:ID
    fcmToken:String
    deviceId: String
    os: String
    osVersion: String
    user: User @accessControl(requires:[{resource:${POLICY_RESOURCES_ENTITY.USER},
      permission:${POLICY_PERMISSION_ENTITY.READ}}])
    extend: JSON
    status: Boolean
  }

  input UserDeviceInput{
    fcmToken:String
    deviceId: String
    os: String
    osVersion: String
    userId: String
    extend: JSON
    status: Boolean
  }

  input changeUserTypeInput{
    userId: String
    existingRoleId: String
    newRoleId: String
  }

  type Mutation {
    createUser(input: UserCreateInput!,createOrganization:CreateOrganizationInput,walkinProducts:[walkinProducts]):User
    updateUser(input:UserUpdateInput):User @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.USER},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    changeUserType(input: changeUserTypeInput!): User @auth
    deleteUserById(id:String):JSON @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.USER},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    linkApplicationToUser(userId:String,applicationID:String):User @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.USER},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])

    addUserToOrganization(userData:UserCreateInput!,organization_id:ID!,role_id:ID):User @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.USER},
        permission:${POLICY_PERMISSION_ENTITY.CREATE}},{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${POLICY_PERMISSION_ENTITY.READ}}])

    linkUserToStore(input:LinkUserStoreInput):User @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.USER},
        permission:${POLICY_PERMISSION_ENTITY.CREATE}},{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${POLICY_PERMISSION_ENTITY.READ}}])
    
    removeUserFromStore(input:RemoveUserStoreInput):User @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.USER},
        permission:${POLICY_PERMISSION_ENTITY.CREATE}},{resource:${POLICY_RESOURCES_ENTITY.ORGANIZATION},permission:${POLICY_PERMISSION_ENTITY.READ}}])

    updatePassword(oldPassword: String, newPassword: String): UpdatePasswordResponse @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.USER},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
    ])

    updateUserPassword(userId: String, password: String): UpdatePasswordResponse @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.USER_PASSWORD_UPDATE},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
    ])
    
    confirmEmail(email: String, emailToken: String): ConfirmEmailResponse

    sendPasswordResetLink(email: String): ResetPasswordResponse
    resetPassword(token: String!,password:String!): ResetPassword
    createUpdateDeviceInfo(input: UserDeviceInput): UserDeviceInformation @auth
  }

  type Query {
    users(pageOptions: PageOptions ={}, sortOptions:SortOptions, organizationId: String!):UserPage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.USER},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
    user(id:ID!, organizationId: String!): User @auth(requires:[
        {resource:${POLICY_RESOURCES_ENTITY.USER},permission:${POLICY_PERMISSION_ENTITY.READ}}
      ])
    checkUserNameAvailability(userName:String!): Boolean 
  }

  enum STATUS

`;

export default typeDefs;
