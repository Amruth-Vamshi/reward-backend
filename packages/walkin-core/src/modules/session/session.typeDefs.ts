import gql from "graphql-tag";
import { STATUS } from "../common/constants/constants";

const typeDefs = gql`
  scalar JSON
  type Query {
    session(id: ID!): Session @disabled @auth
    activeSession(customer_identifier: String!, organization_id: ID!): Session
      @disabled
      @auth
  }

  type Session {
    id: ID!
    customer_id: ID!
    organization_id: ID!
    extend: JSON
    status: STATUS
  }

  type Mutation {
    startSession(input: StartSessionInput): Session @disabled @auth
    endSession(input: EndSessionInput): Session @disabled @auth
  }

  input EndSessionInput {
    id: ID!
  }

  input StartSessionInput {
    customer_identifier: String!
    organization_id: ID!
    extend: JSON
  }

  enum STATUS
`;

export default typeDefs;
