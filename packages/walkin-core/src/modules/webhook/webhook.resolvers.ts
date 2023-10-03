import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";
import { Organizations } from "../account/organization/organization.providers";
import {
  STATUS,
  DEFAULT_PAGE_OPTIONS,
  DEFAULT_SORT_OPTIONS,
  WEBHOOK_TYPE
} from "../common/constants/constants";
import { WalkinPlatformError } from "../common/exceptions/walkin-platform-error";
import { QueueProvider } from "../queueProcessor/queue.provider";
import { WebhookProvider } from "./webhook.providers";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";
import {
  isUserOrAppAuthorizedToWorkOnOrganization,
  getLoggedInOrganizationId
} from "../common/utils/utils";
import { isValidWebhook } from "../common/validations/Validations";

const resolvers = {
  Query: {
    webhookEventType: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        const organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        const webhookEventType = await injector
          .get(WebhookProvider)
          .getWebhookEvenType(
            transactionalEntityManager,
            args.event,
            organizationId
          );
        return webhookEventType;
      });
    },
    webhookEventTypes: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        console.log(args.pageOptions);

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        const organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        return injector
          .get(WebhookProvider)
          .getWebhookEventTypes(
            transactionalEntityManager,
            args.status,
            args.pageOptions,
            args.sortOptions,
            organizationId
          );
      });
    },

    webhook: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        const webhook = await injector
          .get(WebhookProvider)
          .getWebhookByID(transactionalEntityManager, args.id, organizationId);

        if (webhook) {
          return webhook;
        } else {
          throw new WCoreError(WCORE_ERRORS.WEBHOOK_NOT_FOUND);
        }
      });
    },

    webhooks: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId =
          args.organizationId !== undefined ? args.organizationId : null;
        const event = args.event !== undefined ? args.event : null;
        const status = args.status !== undefined ? args.status : null;
        const enabled = args.enabled !== undefined ? args.enabled : null;
        let pageOptions =
          args.pageOptions !== undefined ? args.pageOptions : null;
        let sortOptions =
          args.sortOptions !== undefined ? args.sortOptions : null;

        console.log("enabled=", enabled);

        organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        if (pageOptions) {
          //do nothing
        } else {
          pageOptions = DEFAULT_PAGE_OPTIONS;
        }

        if (sortOptions) {
          //do nothing
        } else {
          sortOptions = DEFAULT_SORT_OPTIONS;
        }

        return injector
          .get(WebhookProvider)
          .getWebhooks(
            transactionalEntityManager,
            organizationId,
            event,
            enabled,
            status,
            pageOptions,
            sortOptions
          );
      });
    },

    webhookEventData: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId =
          args.organizationId !== undefined ? args.organizationId : null;
        const webhookId = args.webhookId !== undefined ? args.webhookId : null;
        const httpStatus =
          args.httpStatus !== undefined ? args.httpStatus : null;
        const status = args.status !== undefined ? args.status : null;
        let pageOptions =
          args.pageOptions !== undefined ? args.pageOptions : null;
        let sortOptions =
          args.sortOptions !== undefined ? args.sortOptions : null;

        organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          args.organizationId
        );

        if (pageOptions) {
          //do nothing
        } else {
          pageOptions = DEFAULT_PAGE_OPTIONS;
        }

        if (sortOptions) {
          //do nothing
        } else {
          sortOptions = DEFAULT_SORT_OPTIONS;
        }

        return injector
          .get(WebhookProvider)
          .getWebhookEventDataByWebhook(
            transactionalEntityManager,
            organizationId,
            webhookId,
            httpStatus,
            status,
            pageOptions,
            sortOptions
          );
      });
    }
  },
  Mutation: {
    createWebhookEventType: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      const input = args.input;
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        let eventTypeExists;
        try {
          eventTypeExists = await injector
            .get(WebhookProvider)
            .getWebhookEvenType(
              transactionalEntityManager,
              input.event,
              input.organizationId
            );
        } catch (error) {
          console.log(
            "No duplicates. So dont have to do anything. and contine to insert."
          );
        }

        if (eventTypeExists) {
          throw new WCoreError(WCORE_ERRORS.DUPLICATE_WEBHOOK_EVENT_TYPE);
        }

        return injector
          .get(WebhookProvider)
          .createWebhookEvent(
            transactionalEntityManager,
            input.event,
            input.description,
            org
          );
      });
    },
    updateWebhookEventType: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      const input = args.input;
      const status = input.status;
      return getManager().transaction(async transactionalEntityManager => {
        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, organizationId);

        if (org === undefined || org.status === STATUS.INACTIVE) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        return injector
          .get(WebhookProvider)
          .updateWebhookEvent(
            transactionalEntityManager,
            input.id,
            input.description,
            status,
            org
          );
      });
    },
    createWebhook: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const status = STATUS.ACTIVE;

        /**
         * TODO: This line to be removed after webhook_security changes go live
         */
        input.webhookType = input.webhookType
          ? input.webhookType
          : WEBHOOK_TYPE.EXTERNAL;

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        if (!isValidWebhook(input.webhookType, input.url)) {
          throw new WCoreError(WCORE_ERRORS.INVALID_WEBHOOK_TYPE);
        }

        let result = await injector
          .get(WebhookProvider)
          .getWebhookEvenType(
            transactionalEntityManager,
            input.event,
            input.organizationId
          );
        if (result !== undefined && result.status === STATUS.ACTIVE) {
          const organization = await injector
            .get(Organizations)
            .getOrganization(transactionalEntityManager, input.organizationId);
          if (
            organization !== undefined &&
            organization.status === STATUS.ACTIVE
          ) {
            let headers = {};
            try {
              if (input.headers) {
                if (typeof input.headers == "string")
                  headers = JSON.parse(input.headers);
                else headers = input.headers;
              }
            } catch (err) {
              throw new WalkinPlatformError(
                "INVALID_JSON",
                "Not a valid JSON for headers",
                input.headers,
                400,
                "Invalid JSON for headers"
              );
            }
            const enabled = true;
            const webhookResponse = await injector
              .get(WebhookProvider)
              .createWebhook(
                transactionalEntityManager,
                organization,
                input.event,
                input.name,
                input.url,
                headers,
                input.method,
                enabled,
                status,
                input.webhookType
              );
            console.log(`Returning data for webhook id: ${webhookResponse.id}`);
            return webhookResponse;
          } else {
            console.log("Sorry organization is wrong");
            throw new WalkinPlatformError(
              "ORGANIZATION_INVALID",
              "Not a valid Organziation",
              input.organizationId,
              400,
              "Invalid organizationId or organization is inactive."
            );
          }
        } else {
          console.log("Sorry webhook event type is wrong");
          throw new WalkinPlatformError(
            "WEBHOOK_EVENT_TYPE_INVALID",
            "Not a valid webhook event",
            input.event,
            400,
            "Invalid event or event is inactive."
          );
        }
      });
    },
    updateWebhook: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const url = input.url !== undefined ? input.url : null;

        let headers = input.headers !== undefined ? input.headers : null;

        if (url) {
          /**
           * TODO: This line to be removed after webhook_security changes go live
           */
          input.webhookType = input.webhookType
            ? input.webhookType
            : WEBHOOK_TYPE.EXTERNAL;
          if (!isValidWebhook(input.webhookType, input.url)) {
            throw new WCoreError(WCORE_ERRORS.INVALID_WEBHOOK_TYPE);
          }
        }

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const webhook = await injector
          .get(WebhookProvider)
          .getWebhookByID(transactionalEntityManager, input.id, organizationId);

        console.log(webhook);

        if (webhook) {
          //works
        } else {
          throw new WCoreError(WCORE_ERRORS.WEBHOOK_NOT_FOUND);
        }

        try {
          if (headers) {
            if (typeof input.headers == "string")
              headers = JSON.parse(input.headers);
            else headers = input.headers;
          }
        } catch (err) {
          throw new WalkinPlatformError(
            "INVALID_JSON",
            "Not a valid JSON for headers",
            input.headers,
            400,
            "Invalid JSON for headers"
          );
        }

        const method = input.method !== undefined ? input.method : null;
        const status = input.status !== undefined ? input.status : null;
        const enabled = input.enabled !== undefined ? input.enabled : null;
        const name = input.name !== undefined ? input.name : null;
        const webhookType =
          input.webhookType !== undefined ? input.webhookType : null;

        // Start a new session only if there is not active session for this customer, org and app combo
        const updatedWebhook = await injector
          .get(WebhookProvider)
          .updateWebhook(
            transactionalEntityManager,
            input.id,
            organizationId,
            url,
            name,
            headers,
            method,
            enabled,
            status,
            webhookType
          );
        console.log(updatedWebhook);
        return updatedWebhook;
      });
    },
    createWebhookEventData: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const webhookId = input.webhookId;
        const data = input.data;

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        console.log(organizationId);

        const webhook = await injector
          .get(WebhookProvider)
          .getWebhookByID(
            transactionalEntityManager,
            webhookId,
            organizationId
          );

        if (webhook !== undefined && webhook.status === STATUS.ACTIVE) {
          console.log("Valid webhook present, adding data to DB");
          /**
           * TODO: This line to be removed after webhook security changes go live
           */
          webhook.webhookType = webhook.webhookType
            ? webhook.webhookType
            : WEBHOOK_TYPE.EXTERNAL;
          const { queueName, queueData, webhookData } = await injector
            .get(WebhookProvider)
            .createWebhookEventData(transactionalEntityManager, webhook, data);
          await injector.get(QueueProvider).addToQueue(queueName, queueData);
          return webhookData;
        } else {
          console.log(" invalid webhook_id error ");
          throw new WCoreError(WCORE_ERRORS.INVALID_WEBHOOK_ID);
        }
      });
    },
    updateWebhookEventData: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const id = input.id;
        const status = input.status !== undefined ? input.status : null;
        const httpStatus =
          input.httpStatus !== undefined ? input.httpStatus : null;
        const { webhookResponse } = input;

        let organizationId = await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );

        const webhookEventData = await injector
          .get(WebhookProvider)
          .getWebhookEventDataByID(
            transactionalEntityManager,
            organizationId,
            id
          );
        if (webhookEventData === undefined) {
          throw new WCoreError(WCORE_ERRORS.INVALID_WEBHOOK_ID);
        }

        const webhook = await injector
          .get(WebhookProvider)
          .getWebhookByID(transactionalEntityManager, input.id, organizationId);

        return injector
          .get(WebhookProvider)
          .updateWebhookEventData(
            transactionalEntityManager,
            id,
            httpStatus,
            status,
            webhookResponse
          );
      });
    }
  },
  Organization: {
    webhooks: async (
      organization,
      { event, enabled, status },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const webhookStatus = status ? status : STATUS.ACTIVE;
        const webhookEnabled = enabled ? enabled : true;
        const pageOptions = DEFAULT_PAGE_OPTIONS;
        const sortOptions = DEFAULT_SORT_OPTIONS;
        return injector
          .get(WebhookProvider)
          .getWebhooks(
            transactionalEntityManager,
            organization.id,
            event,
            enabled,
            webhookStatus,
            pageOptions,
            sortOptions
          );
      });
    }
  }
};

export default resolvers;
