import { QueueProvider } from "../../queueProcessor/queue.provider";
import { WebhookProvider } from "../../webhook/webhook.providers";
import { STATUS, WEBHOOK_TYPE } from "../constants/constants";
import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";
import { WEBHOOK_CALL_TYPE } from "../../../../../walkin-rewardx/src/modules/common/constants/constant";

export const sendToWehbookSubscribers = async (
  entityManager,
  event,
  data,
  organizationId,
  injector: Injector
) => {
  const status = STATUS.ACTIVE;
  const enabled = true;

  // FIXME: WEBHOOK DATA IS SENT TO FIRST TWO HUNDRED ONLY
  const pageOptions = { page: 1, pageSize: 200 };
  const sortOptions = { sortBy: "createdTime", sortOrder: "ASC" };

  console.log("Inside predefinedHook - sendToWehbookSubscribers:", event, enabled, status, organizationId);
  // get the webhook subscriptions for this event and send them data
  const webhooksPage = await injector
    .get(WebhookProvider)
    .getWebhooks(
      entityManager,
      organizationId,
      event,
      enabled,
      status,
      pageOptions,
      sortOptions
    );
  const webhooks = webhooksPage["data"];

  if (webhooks !== undefined && webhooks.length > 0) {
    // if there are many subscriptions, I should push it everyone
    for (const webhook of webhooks) {
      const webhookId = webhook.id;
      console.log(`Creating webhook event data for webhookId: ${webhookId} and orderId: ${data?.order?.id}`);
      try {
        const { queueName, queueData, webhookData } = await injector
          .get(WebhookProvider)
          .createWebhookEventData(entityManager, webhook, data);
        // TODO: TEST THIS
        await injector.get(QueueProvider).addToQueue(queueName, queueData);
      } catch (err) {
        // TODO: silently consume the error as of now
        console.log(`Error while sending data to a webhook: ${webhookId} and orderId: ${data?.order?.id} - Error: ${JSON.stringify(err, null)}`);
      }
    }
    return true;
  } else {
    console.log("No webhooks defined for ", event, organizationId);
  }
};

export const sendToWehbookSubscribersAsync = async (
  event,
  data,
  organizationId,
  injector: Injector,
  token = null
) => {
  const entityManager = await getManager();
  const status = STATUS.ACTIVE;
  const enabled = true;

  // FIXME: WEBHOOK DATA IS SENT TO FIRST TWO HUNDRED ONLY
  const pageOptions = { page: 1, pageSize: 200 };
  const sortOptions = { sortBy: "createdTime", sortOrder: "ASC" };

  console.log(`PredefinedHook details - \nevent: ${event},\nenabled: ${enabled},\nstatus: ${status},\norganizationId: ${organizationId},\norderId: ${data?.order?.id}`);
  // get the webhook subscriptions for this event and send them data
  const webhooksPage = await injector
    .get(WebhookProvider)
    .getWebhooks(
      entityManager,
      organizationId,
      event,
      enabled,
      status,
      pageOptions,
      sortOptions
    );
  const webhooks = webhooksPage["data"];

  if (webhooks !== undefined && webhooks.length > 0) {
    // if there are many subscriptions, I should push it everyone
    for (const webhook of webhooks) {
      const webhookId = webhook.id;
      console.log(`Creating webhook event data for webhookId: ${webhookId} and orderId: ${data?.order?.id}`);
      try {
        const { queueName, queueData, webhookData } = await injector
          .get(WebhookProvider)
          .createWebhookEventData(entityManager, webhook, data);
        // TODO: TEST THIS
        if (token) {
          queueData["token"] = token;
        }
        await injector.get(QueueProvider).addToQueue(queueName, queueData);
      } catch (err) {
        // TODO: silently consume the error as of now
        console.log(`Error while sending data to a webhook: ${webhookId} and orderId: ${data?.order?.id} - Error: ${JSON.stringify(err, null)}`);
      }
    }
    return true;
  } else {
    console.log("No webhooks defined for ", event, organizationId);
  }
};

export const getURLForInternalWebhook = (key, headers) => {
  const mappedURL = process.env[key]
  const mappedHeaders = process.env[headers]
  return {
    mappedURL,
    mappedHeaders
  }
}

  /**
   * Derives URL & Headers for webhook
   * - If webhookType is INTERNAL
   * - Derive mapped URLs and Headers 
   * - * If webhookCallType is an HOOK , return mappedURLs from .env variables
   * - * If webhookCallType is an INSERT, insert whatever has been given by the user
   * - If webhookType is EXTERNAL
   * - Do nothing
   */

export const determineUrlAndHeadersForWebhook = (webhookType, url, headers, webhookCallType) => {

  let derivedURL = url;
  let derivedHeaders = headers;

  if (webhookType === WEBHOOK_TYPE.INTERNAL) {
    let { mappedURL, mappedHeaders } = getURLForInternalWebhook(url, headers)
    if(mappedURL && mappedHeaders){
      switch(webhookCallType){
        case WEBHOOK_CALL_TYPE.HOOK:
          derivedURL = mappedURL
          derivedHeaders = mappedHeaders
          break;
      }
    }
  }
  return {
    derivedURL,
    derivedHeaders
  }
}