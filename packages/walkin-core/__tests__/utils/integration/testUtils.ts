import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setupUserForIntegrationTesting } from "./IntegrationfactorySetup";
import { createHttpLink } from "apollo-link-http";
import fetch from "unfetch";

export const setupTestBed = async () => {
  // Create a client without Auth
  let client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({ fetch, uri: "http://localhost:4000/graphql" })
  });
  // Create a user and login
  const { jwt, user } = await setupUserForIntegrationTesting(client);

  // Replace the old client with authenticated client
  client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
      fetch,
      headers: {
        authorization: "Bearer " + jwt
      },
      uri: "http://localhost:4000/graphql"
    })
  });

  return { client, user };
};
