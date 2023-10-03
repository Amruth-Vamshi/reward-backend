import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";

export const addRole = async (client: ApolloClient<NormalizedCacheObject>) => {
  const mutation = gql`
    mutation addRole {
      addRole(
        input: {
          description: "Some test Role"
          name: "TestRole"
          tags: ["asdasd"]
        }
      ) {
        id
        name
      }
    }
  `;
  return client.mutate({
    mutation
  });
};
