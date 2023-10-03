import gql from "graphql-tag";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

export const typeDefs = gql`
  type Application
  type Event
  scalar JSON
  scalar Date
  type EventSubscription
  enum STATUS

  type EventType {
    id: ID!
    code: String
    description: String
    status: STATUS
    application: Application
    eventSubscriptions: [EventSubscription]
    events: [Event]
  }

  type TypeDeleteEvent {
    id: ID!
    code: String
    description: String
    status: STATUS
    application: Application
    eventSubscriptions: [EventSubscription]
    events: [Event]
  }

  type Query {
    eventTypeById(id: ID!): EventType @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.EVENT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
    ])
    eventTypeByCode(code: String!): EventType @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.EVENT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
    ])
    eventTypesForApplication(appId: ID!): [EventType] @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.EVENT},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
    ])
  }

  type Mutation {
    createEventType(
      code: String!
      description: String
    ): EventType @auth

    updateEventType(
      id: ID!
      code: String
      description: String
      status: STATUS
    ): EventType @auth

    deleteEventType(id: ID!): TypeDeleteEvent @auth
  }
`;
