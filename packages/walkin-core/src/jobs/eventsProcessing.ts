import { Job, DoneCallback } from "bull";
import request from "request";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { gql } from "apollo-server";
import { Event } from "../graphql/generated-models";
import { client, createBullConsumer } from "./utils";

export const EVENT_PROCESSING = {
  name: "EVENT_PROCESSING",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  }
};

const concurrency: number = process.env.BULL_CONCURRENCY
  ? parseInt(process.env.BULL_CONCURRENCY, 10)
  : 10;

const eventProcessingQueue = createBullConsumer(EVENT_PROCESSING.name);

const processEvent = async (eventId: string, jwt: string): Promise<any> =>
  client.mutate({
    mutation: gql`
      mutation($eventID: ID!) {
        processEventById(id: $eventID)
      }
    `,
    variables: {
      eventID: eventId
    },
    context: {
      headers: {
        Authorization: "Bearer " + jwt
      }
    }
  });

eventProcessingQueue.process(
  concurrency,
  async (job: Job, done: DoneCallback) => {
    // console.log(job);
    const { eventId, jwt }: IPushedEventData = job.data;
    try {
      const eventProcessed = await processEvent(eventId, jwt);
      console.log("Processed", eventProcessed);
      done(null, eventProcessed);
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
);

console.log(EVENT_PROCESSING.name + " Initialised");

interface IPushedEventData {
  eventId: string;
  jwt: string;
}
