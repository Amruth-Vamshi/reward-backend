import gql from "graphql-tag";

const typeDefs = gql`
  input LoginInput {
    email: String
    userName: String
    password: String!
  }

  type JWT {
    jwt: String!
  }

  type Mutation {
    login(input: LoginInput!): JWT!
    logout(input: Boolean): Boolean @disabled @auth
    refreshToken(jwt: String!): JWT!
  }
`;

export default typeDefs;
