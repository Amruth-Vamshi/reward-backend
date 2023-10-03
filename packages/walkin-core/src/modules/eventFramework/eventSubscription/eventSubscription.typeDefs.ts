import gql from "graphql-tag";
import { EXPOSED_WALKIN_ACTIONS } from "../../common/constants";

export const typeDefs = gql`
  type Action
  type EventType
  scalar JSON
  scalar Date

  enum TriggerActionEnum{
    ${[...Object.keys(EXPOSED_WALKIN_ACTIONS)]}
  }

  type EventSubscription {
    id:ID!
    triggerAction: TriggerActionEnum
    customAction: Action
    eventType: EventType
    sync: Boolean
    status: String
  }

  type TypeDeleteEventSubscription {
    triggerAction: TriggerActionEnum
    customAction: Action
    eventType: EventType
    sync: Boolean
    status: String
  }

  type Query {
    eventSubscriptionsForEventType(eventTypeId: ID!): [EventSubscription] @auth
    eventSubscriptionById(id: ID!): EventSubscription @auth
  }

  type Mutation {
    createEventSubscription(
      eventTypeId: ID!
      triggerAction: TriggerActionEnum!
      customActionId:ID
    ): EventSubscription @auth
    deleteEventSubscription(id: ID!): TypeDeleteEventSubscription @auth
  }
`;
