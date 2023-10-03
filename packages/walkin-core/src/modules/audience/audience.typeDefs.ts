import gql from "graphql-tag";
import { STATUS } from "../common/constants/constants";

const typeDefs = gql`
  type Query {
    audience(id: ID!): Audience @disabled @auth
    audiences(
      organization_id: ID!
      application_id: ID
      campaign_id: ID
      segment_id: ID
      status: STATUS
    ): [Audience] @disabled @auth

    campaignControls(
      organization_id: ID!
      campaign_id: ID!
      customer_id: ID
    ): [CampaignControl] @disabled @auth
    globalControls(organization_id: ID!, customer_id: ID): [GlobalControl]
      @disabled
      @auth
    audienceCount(segments: [ID], organizationId: ID!): AudienceCountOutput
      @disabled
      @auth
    audienceMembers(audience_id: ID!, customer_id: ID): [AudienceMember]
      @disabled
      @auth

    """
    Outputs totalAudienceCount for a campaign. Executes rule associated to campaign & audiences
    """
    totalAudienceCountForCampaign(campaignId: ID!): AudienceCountOutput
      @disabled
      @auth
  }

  type Mutation {
    createAudience(input: createAudienceInput): [Audience] @disabled @auth
    updateAudience(input: updateAudienceInput): Audience @disabled @auth

    createAudienceForCampaign(campaignId: ID, segments: [ID]!): [Audience]
      @disabled
      @auth

    createCampaignControl(input: addCampaignControl): CampaignControl
      @disabled
      @auth
    updateCampaignControl(input: updateCampaignControl): CampaignControl
      @disabled
      @auth

    createGlobalControl(input: addGlobalControl): GlobalControl @disabled @auth
    deactivateGlobalControl(id: ID!): GlobalControl @disabled @auth

    createAudienceMember(input: addAudienceMemberInput): AudienceMember
      @disabled
      @auth
    updateAudienceMember(input: updateAudienceMemberInput): AudienceMember @auth
  }

  input createAudienceInput {
    campaign_id: ID!
    segment_id: [ID]!
    organization_id: ID!
    application_id: ID
    status: STATUS!
  }

  input updateAudienceInput {
    id: ID!
    status: STATUS
  }

  type AudienceCountOutput {
    count: Int
  }

  type Audience {
    id: ID
    campaign: Campaign
    segment: Segment
    organization: Organization
    application: Application
    status: STATUS
  }

  input addCampaignControl {
    organization_id: ID!
    customer_id: ID!
    campaign_id: ID!
    startTime: DateTime!
    endTime: DateTime!
    status: STATUS!
  }

  input updateCampaignControl {
    id: ID!
    endTime: DateTime
    status: STATUS
  }

  type CampaignControl {
    id: ID!
    organization: Organization
    customer: Customer
    campaign: Campaign
    startTime: DateTime
    endTime: DateTime
    status: STATUS
  }

  input addGlobalControl {
    organization_id: ID!
    customer_id: ID!
    startTime: DateTime!
    endTime: DateTime!
  }

  type GlobalControl {
    id: ID!
    organization: Organization
    customer: Customer
    startTime: DateTime
    endTime: DateTime
    status: STATUS
  }

  input addAudienceMemberInput {
    audience_id: ID!
    customer_id: ID!
    status: STATUS!
  }

  input updateAudienceMemberInput {
    id: ID!
    status: STATUS
  }

  type AudienceMember {
    id: ID!
    audience: Audience!
    customer: Customer!
    status: STATUS!
  }

  type Organization {
    id: ID!
  }

  type Application {
    id: ID!
  }

  type Campaign {
    id: ID!
  }

  type Segment {
    id: ID!
  }

  type Customer {
    id: ID!
  }

  scalar DateTime

  scalar JSON

  enum STATUS
`;

export default typeDefs;
