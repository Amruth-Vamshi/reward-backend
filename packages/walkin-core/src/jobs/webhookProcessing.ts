import { execute, makePromise } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import fetch from "node-fetch";
import { WCoreError } from "../modules/common/exceptions";
import { WCORE_ERRORS } from "../modules/common/constants/errors";
import request from "request";
import { createBullConsumer } from "./utils";
import { determineUrlAndHeadersForWebhook } from "../modules/common/utils/webhookUtils";
import { WEBHOOK_CALL_TYPE } from "../../../walkin-rewardx/src/modules/common/constants/constant";
import { updateWebhookEventData } from "./webhookClientCalls";
import { captureException } from "@sentry/node";

export const WEBHOOK_QUEUE = {
  name: "WEBHOOK",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  }
};

const walkinWebhookQueue = createBullConsumer(WEBHOOK_QUEUE.name);

walkinWebhookQueue.process((job, done) => {
  const data = job.data;
  console.log("Webhook process", data);

  let { webhook_type, url, headers, method } = data;

  const { derivedURL, derivedHeaders } = determineUrlAndHeadersForWebhook(
    webhook_type,
    url,
    headers,
    WEBHOOK_CALL_TYPE.HOOK
  );

  url = derivedURL;
  headers = derivedHeaders;
  const webhookData = data?.data?.data || {};

  // We will also add some default data
  console.log("Parsing headers");

  let finalHeaders: any = {};
  if (typeof headers == "string") {
    try {
      finalHeaders = JSON.parse(headers);
    } catch (err) {
      console.log(err);
      console.log("Error while parsing headers");
    }
  }

  if (typeof headers === "object") {
    finalHeaders = headers;
  }

  finalHeaders["Content-Type"] = "application/json";
  finalHeaders.Origin = "https://developer.getwalk.in";
  console.log(finalHeaders);

  // TODO: Can add GET method if required later
  if (method === "POST") {
    const options = {
      method: "POST",
      url,
      headers: finalHeaders,
      body: JSON.stringify(data.data)
    };

    request(options, async (error, response, body) => {
      try {
        const { webhook_event_data_id, token, webhook_id } = data;
        const { organization } = webhookData;
        console.log("Organization: ", organization);
        console.log("Status code: ");
        console.log(response.statusCode);
        if (error) {
          console.error("POST failed :", error);
          if (organization) {
            await updateWebhookEventData(
              webhook_event_data_id,
              organization.id,
              token,
              webhook_id,
              JSON.stringify(error.reason),
              400
            );
          }
          done(error);
          return;
        }

        if (organization) {
          await updateWebhookEventData(
            webhook_event_data_id,
            organization.id,
            token,
            webhook_id,
            JSON.stringify(body),
            response.statusCode
          );
        }
        console.log("POST sucessful:", body);
        done(null, body);
      } catch (error) {
        console.log(
          "Error occured during webhook event processing :\n",
          JSON.stringify(error)
        );
        captureException(error);
        done(error);
      }
    });
  } else {
    console.log("Only post is supported as of now");
    done(new WCoreError(WCORE_ERRORS.WEBHOOK_ONLY_POST_SUPPORTED));
  }
});

console.log(WEBHOOK_QUEUE.name + " initialised");
