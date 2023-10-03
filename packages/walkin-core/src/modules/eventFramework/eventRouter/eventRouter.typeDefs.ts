import gql from "graphql-tag";

export const typeDefs = gql`
  type EventType
  type Event
  type Campaign
  scalar JSON
  scalar Date
  enum STATUS
  type EventType

  type Event {
    id: ID
    sourceEventId: String
    sourceEventTime: Date
    sourceName: String
    data: JSON
    metadata: JSON
    eventType: EventType
    processedStatus: JSON
  }

  input EventInput {
    sourceEventId: String
    sourceEventTime: Date
    sourceName: String
    data: JSON
    metadata: JSON
    eventTypeCode: String!
  }

  input ProcessEventInput {
    id: ID!
    sourceEventId: String
    sourceEventTime: Date
    sourceName: String
    data: JSON
    metadata: JSON
    eventTypeCode: String!
  }

  input RecordEventInput {
    eventTypeCode: String!
    description: String
    data: JSON!
    status: STATUS!
  }

  input UpdateEventInput {
    id: String!
    data: JSON
  }

  type RecordEventOutput {
   eventType: EventType
   campaigns: [Campaign]
   errors: JSON
  }

  type Mutation {
    pushEvents(events: [EventInput]!): [Event] @auth
    processEventById(id: ID!): JSON @auth
    createEvent(input:RecordEventInput!) : Event @auth
    updateEvent(input:UpdateEventInput!) : Event @auth
    recordEvent(input:RecordEventInput!) : RecordEventOutput @auth
  }

  type Query {
    eventById(id: ID!): Event @auth
    eventBySourceEventId(sourceEventId: String!, eventTypeId: ID): Event @auth
    eventsByFilters(sourceName: String, eventTypeCode: String): [Event] @auth
  }
`;
