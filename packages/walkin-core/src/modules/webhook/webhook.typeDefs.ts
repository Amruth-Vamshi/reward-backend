import gql from "graphql-tag";
import {
  REQUEST_METHOD,
  STATUS,
  WEBHOOK_TYPE
} from "../common/constants/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../common/permissions";

const typeDefs = gql`

  input PageOptions

  input SortOptions

  type PaginationInfo

  type WebhookEventPage {
    data: [WebhookEvent!],
    paginationInfo: PaginationInfo
  }

  type WebhookPage {
    data: [Webhook!],
    paginationInfo: PaginationInfo
  }

  type WebhookEventDataPage {
    data: [WebhookEventData!],
    paginationInfo: PaginationInfo
  }

  enum WEBHOOK_TYPE{
		${[...Object.values(WEBHOOK_TYPE)]}
	}
  

  type Query {
    webhookEventType(organizationId:ID!,event: String!): WebhookEvent @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])

    webhookEventTypes(organizationId:ID!, status: STATUS!, pageOptions: PageOptions ={} , sortOptions:SortOptions): WebhookEventPage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])

    webhook(organizationId: ID!, id: ID!): Webhook @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])

    webhooks(organizationId: ID!, event: String, status: STATUS!, enabled: Boolean, pageOptions: PageOptions ={}, sortOptions:SortOptions): WebhookPage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])

    webhookEventData(organizationId: ID!, webhookId: ID!, httpStatus: String,  pageOptions: PageOptions ={}, sortOptions:SortOptions): WebhookEventDataPage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.READ
  }}
		])
  }

  type Mutation {
    createWebhookEventType(input: WebhookEventTypeAddInput): WebhookEvent @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    updateWebhookEventType(input: WebhookEventTypeUpdateInput): WebhookEvent @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.UPDATE
  }}
		])

    createWebhook(input: WebhookAddInput): Webhook @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    updateWebhook(input: WebhookUpdateInput): Webhook @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.UPDATE
  }}
		])

    createWebhookEventData(input: WebhookEventDataAddInput): WebhookEventData @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.CREATE
  }}
		])
    updateWebhookEventData(input: WebhookEventDataUpdateInput): WebhookEventData @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.WEBHOOKS},permission:${POLICY_PERMISSION_ENTITY.UPDATE
  }}
		])

  }

  input WebhookEventTypeAddInput {
    event: String!
    description: String!
    organizationId: ID!
  }

  input WebhookEventTypeUpdateInput {
    id: ID!
    organizationId: ID!
    description: String
    status: STATUS
  }

  input WebhookEventTypeDeleteInput {
    id: ID!
    organizationId: ID!
  }


  input WebhookAddInput {
    organizationId: ID!
    event: String!
    name: String!
    url: String!
    headers: JSON!
    method: REQUEST_METHOD!
    webhookType: WEBHOOK_TYPE
  }

  input WebhookDeleteInput {
    id: ID!
    organizationId: ID!
  }

  input WebhookUpdateInput {
    id: ID!
    organizationId: ID!
    url: String
    name: String
    headers: JSON
    method: String  
    status: STATUS 
    enabled: Boolean
    webhookType: WEBHOOK_TYPE
  }


  input WebhookEventDataAddInput {
    webhookId: ID!
    organizationId: ID!
    data: String!
  }

  input WebhookEventDataUpdateInput {
    id: ID!
    organizationId: ID!
    httpStatus: String
    status: STATUS
    webhookId: ID!
    webhookResponse: String
  }

  input WebhookEventDataDeleteInput {
    id: ID!
    organizationId: ID!
  }


  type Webhook {
    id: ID!
    name: String!
    organization: Organization!
    event: String!
    url: String!
    headers: JSON!
    method: String!
    enabled: Boolean!    
    status: STATUS
    webhookType: WEBHOOK_TYPE
  }

  type WebhookEvent {
    id: ID!
    event: String!
    description: String!
    status: STATUS
  }

  type WebhookEventData {
    id: ID!
    webhook: Webhook
    data: JSON!
    httpStatus: String!
    status: STATUS
    webhookResponse: String
  }

  type Organization {
    id: ID!
  }

  type WebhookTypePage {
    data: [WebhookEvent!],
    paginationInfo: PaginationInfo
  }


  scalar JSON

  enum STATUS
  enum REQUEST_METHOD{
    ${[...Object.values(REQUEST_METHOD)]}
  }

  extend type Organization{
    webhooks(event: String, status: STATUS):[Webhook]
  }

`;

export default typeDefs;
