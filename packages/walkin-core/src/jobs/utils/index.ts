import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import fetch from "node-fetch";
import Bull, { Queue } from "bull";
import Redis from "ioredis";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    fetch: fetch as any,
    uri: process.env.GRAPHQL_URL
  }),
  version: Math.random()
    .toString()
    .slice(1, 4)
});

export const createBullConsumer = (queueName: string): Queue<any> => {
  const bull = new Bull(queueName, {
    createClient: () => {
      return new Redis({
        host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
        port: process.env.REDIS_PORT
          ? parseInt(process.env.REDIS_PORT, 10)
          : 6379,
        maxRetriesPerRequest: null,
        enableReadyCheck: false
      });
    }
  });
  return bull;
};
