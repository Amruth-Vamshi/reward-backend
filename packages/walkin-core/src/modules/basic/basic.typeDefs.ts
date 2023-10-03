import gql from "graphql-tag";

const typeDefs = gql`

    type Mutation {
      initializeWorkflowForOrg(organizationId: ID!): Boolean @auth
    }

  `;

export default typeDefs;
