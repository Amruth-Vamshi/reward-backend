import gql from "graphql-tag";
import { APPLICATION_METHOD } from "../../../../walkin-rewardx/src/modules/common/constants/constant";
import {
  CAMPAIGN_SCHEDULE_NAME,
  CAMPAIGN_STATUS,
  CAMPAIGN_TRIGGER_TYPE,
  CAMPAIGN_TYPE
} from "../../../../walkin-core/src/modules/common/constants/constants";

const typeDefs = gql`
  input CampaignAddInput {
    name: String!
    description: String
    campaignType: CAMPAIGN_TYPE!
    priority: Int
    campaignTriggerType: CAMPAIGN_TRIGGER_TYPE!
    campaignStatus: CAMPAIGN_STATUS!
    isCampaignControlEnabled: Boolean
    campaignControlPercent: Int
    isGlobalControlEnabled: Boolean
    startTime: DateTime!
    endTime: DateTime!
    organization_id: ID!
    application_id: ID
    applicationMethod: APPLICATION_METHOD!
    loyaltyTotals: JSON
    couponTotals: JSON
    referralTotals: JSON
    discountTotals: JSON
    group: String
    extend: JSON
    loyaltyProgramDetailId: String
    metaData: String
    eventTypeId: String
    cronExpression: String
    campaignScheduleName: CAMPAIGN_SCHEDULE_NAME
  }

  input evaluateCampaignsForEventInput {
    data: JSON!
    eventTypeCode: String!
  }

  input updateCampaignScheduleInput{
    id: ID!
    status: STATUS
    cronExpression: String
  }

  type CampaignSchedule {
    id: String
    campaign: Campaign
    cronExpression: String
    status: String
  }

  type CampaignEventTrigger {
    id: String
    status: String
    campaign: Campaign
    metaData: String
    eventType: EventType
  }

  input PageOptions
  type PaginationInfo

  input campaignsInput {
    application_id: ID 
    campaignType: [CAMPAIGN_TYPE]
    campaignStatus: CAMPAIGN_STATUS! 
    campaignTriggerType:CAMPAIGN_TRIGGER_TYPE
    name: String
    pageOptions: PageOptions = {}
  }

  type Campaigns {
    data: [Campaign]
    paginationInfo: PaginationInfo
  }

  type Query {
    campaign(id: ID!): Campaign @auth
    campaigns(input:campaignsInput): Campaigns @auth
  }

  type Mutation {
    createCampaign(input: CampaignAddInput): Campaign @auth
    updateCampaign(id: ID!, input: CampaignUpdateInput): Campaign @auth
    updateCampaignStatus(id: ID!, campaignStatus: CAMPAIGN_STATUS!): Campaign @auth
    updateCampaignSchedule(input: updateCampaignScheduleInput): CampaignSchedule @auth
    evaluateCampaignsForEvent(input: evaluateCampaignsForEventInput): JSON @auth
    launchCampaign(id: ID!): Campaign @disabled @auth
    preprocessLaunchCampaign(id: ID!): Campaign @disabled @auth
    pauseCampaign(id: ID!): Campaign @disabled @auth
    unpauseCampaign(id: ID!): Campaign @disabled @auth
    completeCampaign(id: ID!): Campaign @disabled @auth
    abandonCampaign(id: ID!): Campaign @disabled @auth
    disableCampaign(id: ID!): Campaign @disabled @auth
    linkCampaignToApplication(campaignId:ID!,applicationId:ID!):Campaign @disabled @auth
    unlinkCampaignFromApplication(campaignId:ID!,applicationId:ID!):Campaign @disabled @auth
    jobManageEndedCampaigns: Boolean @disabled
    expireCampaigns: String @auth
  }

  input CampaignUpdateInput {
    name: String
    description: String
    group: String
    campaignStatus: CAMPAIGN_STATUS
    priority: Int
    startTime: DateTime
    endTime: DateTime
    applicationMethod: APPLICATION_METHOD
    loyaltyProgramDetailId: String
    eventTypeId: String
    metaData: String
  }

  type Campaign {
    createdBy: String
    lastModifiedBy: String
    createdTime: DateTime
    lastModifiedTime: DateTime
    id: ID!
    name: String
    description: String
    startTime: DateTime
    endTime: DateTime    
    organization: Organization
    application: Application
    campaignType: String
    campaignTriggerType: String
    priority: Int
    campaignStatus: String
    applicationMethod: APPLICATION_METHOD
    loyaltyTotals: JSON
    couponTotals: JSON
    referralTotals: JSON
    discountTotals: JSON
    group: String
    extend: JSON
    loyaltyProgramDetailId: String
    campaignSchedule: CampaignSchedule
    campaignEventTrigger: CampaignEventTrigger
  }

  type Organization {
    id: ID!
  }
  
  type Application {
    id: ID!
  }

  type Rule{
    id: ID!
  }

  type Communication

  type EventType

  scalar JSON

  scalar DateTime

  enum STATUS

  enum CAMPAIGN_TRIGGER_TYPE{
    ${[...Object.values(CAMPAIGN_TRIGGER_TYPE)]}
  }

  enum CAMPAIGN_TYPE{
    ${[...Object.values(CAMPAIGN_TYPE)]}
  }

  enum CAMPAIGN_STATUS{
    ${[...Object.values(CAMPAIGN_STATUS)]}
  }

  enum APPLICATION_METHOD{
    ${[...Object.values(APPLICATION_METHOD)]}
  }
  
  enum CAMPAIGN_SCHEDULE_NAME{
    ${[...Object.values(CAMPAIGN_SCHEDULE_NAME)]}
  }
`;

export default typeDefs;
