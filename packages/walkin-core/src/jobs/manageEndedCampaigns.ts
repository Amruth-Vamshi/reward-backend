import Bull from "bull";
import { HttpLink } from "apollo-link-http";
import gql from "graphql-tag";
import fetch from "node-fetch";
const uri = process.env.GRAPHQL_URL;
import { execute, makePromise } from "apollo-link";
import { createBullConsumer } from "./utils";

export const JOB_MANAGE_ENDED_CAMPAIGNS = {
  name: "JOB_MANAGE_ENDED_CAMPAIGNS",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    // tslint:disable-next-line:radix
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  }
};

const jobManageEndedCampaigns = createBullConsumer(
  JOB_MANAGE_ENDED_CAMPAIGNS.name
);

jobManageEndedCampaigns.process(async (job, done) => {
  console.log("RewardX Job running at", Date.now());
  const customFetch: any = (_, options) => {
    return fetch(uri, options);
  };
  const link = new HttpLink({ fetch: customFetch });
  const jobManageEndedCampaignsGQL = {
    query: gql`
      mutation {
        jobManageEndedCampaigns
      }
    `
  };
  try {
    let s = await makePromise(execute(link, jobManageEndedCampaignsGQL));
    done(null, s);
  } catch (err) {
    done(err);
  }
});

//Run every five minutes
//jobManageEndedCampaigns.add({}, { repeat: { cron: "5 * * * *" } });

console.log(JOB_MANAGE_ENDED_CAMPAIGNS.name + " initialised");
