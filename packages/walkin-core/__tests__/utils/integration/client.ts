import { createTestClient } from "apollo-server-integration-testing";
import { DocumentNode, GraphQLSchema } from "graphql";
import { setupUserForIntegrationTesting } from "./IntegrationfactorySetup";
import { User } from "../../../src/graphql/generated-models";
// tslint:disable-next-line: no-implicit-dependencies
import { createWalkinServer } from "@walkinserver/walkin-platform-server/src/server";
import { Express } from "express";
import ApolloClient from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import SchemaLink from "apollo-link-schema";

export const setupTestBed = async (): Promise<{
  user: User;
  client: ApolloClient<NormalizedCacheObject>;
}> => {
  // Get Express app and schema from Walkin Server
  const { app, schema } = await createWalkinServer();
  const { request, response } = app;
  // Create a client without Auth
  let client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new SchemaLink({
      schema
    })
  });
  // Create a user and login
  const {
    jwt,
    user
  }: { jwt: string; user: User } = await setupUserForIntegrationTesting(client);
  request.headers = {
    authorization: "Bearer " + jwt
  };
  const context = (ctx: any) => {
    ctx.session = {
      req: request,
      res: response
    };
    return ctx;
  };
  // Replace the old client with authenticated client
  client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: new SchemaLink({
      schema,
      context
    })
  });
  console.log("Client created");

  return { client, user };
};

export interface IApolloTestClient {
  query: (operation: string | DocumentNode) => Promise<any>;
  mutate: (operation: string | DocumentNode) => Promise<any>;
}
