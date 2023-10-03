import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typedefs = gql`
  type Organization
  type PaginationInfo
  type Charge
  input SortOptions
  input PageOptions {
    page: Int = 1
    pageSize: Int = 10
  }
  input ChannelTypeInput {
    name: String!
    channelCode: String!
    chargeTypeCode: [String]
  }
  input ChannelTypeUpdateInput {
    id: ID!
    name: String
    channelCode: String
    chargeTypeCode: [String]
  }

  input ChannelFilterInput {
    id: ID
    name: String
    channelCode: String
  }
  type ChannelPage {
    data: [Channel]
    paginationInfo: PaginationInfo
  }
  input ChannelsFilterInput {
    id: [ID]
    name: [String]
    channelCode: [String]
  }
  type Channel {
    id: ID
    name: String
    organization: Organization
    channelCode: String
    chargeTypes: [Charge]
  }
  type Query {
    channels: ChannelPage @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHANNEL},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
    channel(input: ChannelFilterInput): Channel @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHANNEL},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
  }

  type Mutation {
    createChannel(input: ChannelTypeInput): Channel @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHANNEL},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
    updateChannel(input: ChannelTypeUpdateInput): Channel @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHANNEL},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}
		])
    deleteChannel(id: ID!): Boolean @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.CHANNEL},permission:${POLICY_PERMISSION_ENTITY.DELETE}}
		])
  }
`;

export default typedefs;
