import gql from "graphql-tag";

export const typeDefs = gql`
  scalar JSON
  scalar Date
  type LoyaltyCard
  type LoyaltyProgram
  type Communication
  input CampaignAddInput
  input CreateCommunicationWithoutMessageTemplateIdInput
  input CreateMessageTemplateInput
  input UpdateCommunicationInput
  input UpdateMessageTemplateInput
  type Organization
  type PaginationInfo
  input SortOptions
  input PageOptions

  enum ExpiryCommunicationEventType {
    EXPIRY
    EXPIRY_REMINDER
  }

  input expiryCommunicationInput {
    loyaltyCardCode: String!
    loyaltyProgramCode: String!
    eventType: ExpiryCommunicationEventType!
    numberOfDays: Int
    communication: CreateCommunicationWithoutMessageTemplateIdInput!
    messageTemplate: CreateMessageTemplateInput!
  }

  input updateExpiryCommunicationInput {
    id: ID!
    loyaltyCardCode: String!
    loyaltyProgramCode: String!
    eventType: ExpiryCommunicationEventType!
    numberOfDays: Int
    communication: UpdateCommunicationInput!
    messageTemplate: UpdateMessageTemplateInput!
  }

  type ExpiryCommunicationStatus {
    status: Boolean
  }

  type ExpiryCommunication {
    id: ID
    loyaltyCard: LoyaltyCard
    loyaltyProgram: LoyaltyProgram
    communication: Communication
    eventType: ExpiryCommunicationEventType
    numberOfDays: Int
  }

  type ExpiryCommunicationPage {
    data: [ExpiryCommunication]
    paginationInfo: PaginationInfo
  }

  type Query {
    expiryCommunications(
      organizationId: String
      loyaltyCardCode: String!
      loyaltyProgramCode: String!
      pageOptions: PageOptions = {}
      sortOptions: SortOptions
    ): ExpiryCommunicationPage @auth

    expiryCommunicationByLoyaltyCardCodeAndEventType(
      organizationId: String
      eventType: ExpiryCommunicationEventType!
      loyaltyCardCode: String!
      loyaltyProgramCode: String!
    ): [ExpiryCommunication] @auth
  }

  type Mutation {
    createExpiryCommunication(
      input: expiryCommunicationInput!
    ): ExpiryCommunication @auth

    updateExpiryCommunication(
      input: updateExpiryCommunicationInput!
    ): ExpiryCommunication @auth

    expiryReminderCommunication: ExpiryCommunicationStatus @auth
  }
`;
export default typeDefs;
