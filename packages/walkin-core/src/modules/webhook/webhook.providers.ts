import { Injectable } from "@graphql-modules/di";
import {
  EntityManager,
  getConnection,
  getManager,
  getRepository
} from "typeorm";
import { WEBHOOK_CALL_TYPE } from "../../../../walkin-rewardx/src/modules/common/constants/constant";
import {
  Organization,
  Webhook,
  WebhookEventData,
  WebhookEventType
} from "../../entity";
import {
  STATUS,
  WALKIN_QUEUES,
  PageOptions
} from "../common/constants/constants";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";
import { logMethod, addPaginateInfo } from "../common/utils/utils";
import { determineUrlAndHeadersForWebhook } from "../common/utils/webhookUtils";

@Injectable()
export class WebhookProvider {
  public async getWebhookEvenType(
    transactionalEntityManager: EntityManager,
    event: any,
    organizationId: string
  ): Promise<WebhookEventType> {
    const entityManager = transactionalEntityManager;
    const e = await entityManager.findOne(WebhookEventType, {
      where: {
        event,
        organization: organizationId
      },
      relations: ["organization"]
    });
    return e;
  }

  @addPaginateInfo
  public async getWebhookEventTypes(
    transactionalEntityManager: EntityManager,
    status: string,
    pageOptions: PageOptions,
    sortOptions,
    organizationId: string
  ) {
    const options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    options.relations = ["organization"];
    options.where = {
      organization: organizationId,
      status
    };
    console.log(options);
    const result = await transactionalEntityManager.findAndCount(
      WebhookEventType,
      options
    );
    return result;
  }

  public async getWebhookByID(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<Webhook> {
    const entityManager = transactionalEntityManager;
    const query: any = { id };
    const options: any = {};
    options.where = query;
    options.relations = ["organization"];
    options.where = {
      id,
      organization: organizationId
    };
    return entityManager.findOne(Webhook, options);
  }

  @addPaginateInfo
  public async getWebhooks(
    transactionalEntityManager: EntityManager,
    organizationId: string,
    event: any,
    enabled: any,
    status: any,
    pageOptions: PageOptions,
    sortOptions
  ) {
    console.log("Inside getWebhooks", event, enabled, status, organizationId);

    const options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    // options.relations = ["organization"];
    const whereClause = {};
    whereClause["status"] = status;
    whereClause["organization"] = organizationId;

    if (event) {
      whereClause["event"] = event;
    }

    if (enabled != null) {
      whereClause["enabled"] = enabled;
    }
    options.where = whereClause;

    return transactionalEntityManager.findAndCount(Webhook, options);
  }

  public async getWebhookEventDataByID(
    transactionalEntityManager: EntityManager,
    organizationId,
    id
  ): Promise<WebhookEventData> {
    const entityManager = transactionalEntityManager;
    const query: any = {
      id: id,
      organization_id: organizationId
    };
    const options: any = {};
    options.where = query;
    options.relations = ["webhook"];
    return entityManager.findOneOrFail(WebhookEventData, options);
  }

  @addPaginateInfo
  public async getWebhookEventDataByWebhook(
    transactionalEntityManager: EntityManager,
    organizationId: string,
    webhookId: string,
    httpStatus: string,
    status: string,
    pageOptions: PageOptions,
    sortOptions
  ) {
    const entityManager = transactionalEntityManager;
    const options: any = {};
    if (sortOptions) {
      options.order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;
    const whereClause = {};
    whereClause["status"] = status;

    if (webhookId) {
      whereClause["webhook"] = webhookId;
    }

    if (httpStatus) {
      whereClause["http_status"] = httpStatus;
    }
    options["where"] = whereClause;
    options["relations"] = ["webhook"];
    const e = await entityManager.findAndCount(WebhookEventData, options);
    return e;
  }

  public async validateDuplicateWebhook(
    transactionalEntityManager: EntityManager,
    organization: Organization,
    event: string,
    url: string
  ) {
    // Check duplicate entries for same url and same event for the organization
    const webhookDetails = await transactionalEntityManager.findOne(Webhook, {
      where: {
        organization,
        event,
        url
      }
    });
    if (webhookDetails) {
      throw new WCoreError(WCORE_ERRORS.WEBHOOK_DETAILS_ALREADY_PRESENT);
    }
    return;
  }

  public async createWebhook(
    transactionalEntityManager: EntityManager,
    organization: Organization,
    event: string,
    name: string,
    url: string,
    headers: any,
    method: string,
    enabled: boolean,
    status: string,
    webhookType: string
  ): Promise<Webhook> {
    const entityManager = transactionalEntityManager;
    let { derivedURL, derivedHeaders } = determineUrlAndHeadersForWebhook(
      webhookType,
      url,
      headers,
      WEBHOOK_CALL_TYPE.INSERT
    );

    await this.validateDuplicateWebhook(
      transactionalEntityManager,
      organization,
      event,
      url
    );

    const webhookData: any = {
      organization,
      event,
      name,
      url: derivedURL,
      headers: derivedHeaders,
      method,
      enabled,
      status,
      webhookType
    };
    const webhookSchema = transactionalEntityManager.create(
      Webhook,
      webhookData
    );
    return transactionalEntityManager.save(webhookSchema);
  }

  public async updateWebhook(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string,
    url: string,
    name: string,
    headers: string,
    method: string,
    enabled: boolean,
    status: string,
    webhookType: string
  ): Promise<Webhook> {
    const entityManager = transactionalEntityManager;
    const e = await this.getWebhookByID(entityManager, id, organizationId);

    let derivedURL = url;
    let derivedHeaders = headers;

    if (url) {
      let derivedURLAndHeaders = determineUrlAndHeadersForWebhook(
        webhookType,
        url,
        headers,
        WEBHOOK_CALL_TYPE.INSERT
      );
      derivedURL = derivedURLAndHeaders.derivedURL;
      derivedHeaders = derivedURLAndHeaders.derivedHeaders;
    }

    console.log("updateWebhook", e);
    if (e) {
      // contine
    } else {
      throw new WCoreError(WCORE_ERRORS.WEBHOOK_NOT_FOUND);
    }
    if (derivedURL != null) {
      e.url = derivedURL;
    }
    if (derivedHeaders != null) {
      e.headers = derivedHeaders;
    }
    if (name != null) {
      e.name = name;
    }
    if (method != null) {
      e.method = method;
    }
    if (enabled != null) {
      e.enabled = enabled;
    }

    if (status != null) {
      e.status = status;
    }
    const s = await entityManager.save(e);
    return this.getWebhookByID(entityManager, id, organizationId);
  }

  public async deleteWebhook(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<boolean> {
    const entityManager = transactionalEntityManager;
    const options: any = {};
    options.where = {
      organization: organizationId,
      id
    };
    const e = await entityManager.delete(Webhook, options);
    return true;
  }

  public async createWebhookEvent(
    transactionalEntityManager: EntityManager,
    event: string,
    description: string,
    organization: any
  ): Promise<WebhookEventType> {
    const status = STATUS.ACTIVE;
    const entityManager = transactionalEntityManager;
    const e = entityManager.create(WebhookEventType, {
      event,
      description,
      status,
      organization
    });
    return entityManager.save(e);
  }

  public async updateWebhookEvent(
    transactionalEntityManager: EntityManager,
    id: string,
    description: string,
    status: string,
    organization: any
  ): Promise<WebhookEventType> {
    const entityManager = transactionalEntityManager;
    const e = await entityManager.findOne(WebhookEventType, {
      id,
      organization
    });
    if (e) {
      // contine
    } else {
      throw new WCoreError(WCORE_ERRORS.WEBHOOK_NOT_FOUND);
    }
    if (status != null) {
      e.status = status;
    }
    if (description != null) {
      e.description = description;
    }
    await entityManager.save(e);
    return entityManager.findOneOrFail(WebhookEventType, {
      where: {
        id,
        organization
      },
      relations: ["organization"]
    });
  }

  public async deleteWebhookEvent(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<boolean> {
    const entityManager = transactionalEntityManager;
    const e = await entityManager.delete(WebhookEventType, {
      where: {
        id,
        organizationId
      }
    });
    return true;
  }

  public async createWebhookEventData(
    transactionalEntityManager: EntityManager,
    webhook: Webhook,
    data: any
  ): Promise<IWebhookEventDataInterface> {
    const status = STATUS.ACTIVE;
    const httpStatus = "0";
    // check if webhook is active else throw error
    // Add to queue for processing

    if (
      webhook !== undefined &&
      webhook.status === STATUS.ACTIVE &&
      webhook.enabled
    ) {
      const entityManager = transactionalEntityManager;
      const webhookEventDataSchema: any = {
        webhook,
        data,
        httpStatus,
        status: STATUS.ACTIVE
      };
      const e = entityManager.create(WebhookEventData, webhookEventDataSchema);
      const w = await entityManager.save(e);

      const webhookData = await entityManager.findOne(
        WebhookEventData,
        { id: e.id },
        { relations: ["webhook"] }
      );
      const webhookParsedData: any = {};
      try {
        webhookParsedData.data = JSON.parse(data);
      } catch (err) {
        // console.log(err);
        // console.log(data);
        // console.log("------------- Error while parsing ------------");
        webhookParsedData.data = data;
      }
      webhookParsedData.contenttype = "text/json";
      webhookParsedData.specversion = "0.2";
      webhookParsedData.type = webhook.event;
      webhookParsedData.id = webhookData.id;
      webhookParsedData.time = webhookData.createdTime;
      webhookParsedData.source = "WalkinPlatform";

      const messageQueueData: any = {};
      messageQueueData.webhook_id = webhook.id;
      messageQueueData.webhook_event_data_id = webhookData.id;
      messageQueueData.url = webhook.url;
      messageQueueData.method = webhook.method;
      messageQueueData.headers = webhook.headers;
      messageQueueData.data = webhookParsedData;
      messageQueueData.webhook_type = webhook.webhookType;

      return {
        queueName: WALKIN_QUEUES.WEBHOOK,
        queueData: messageQueueData,
        webhookData
      };
    } else {
      // FIXME: Throw an errors
      throw new WCoreError(WCORE_ERRORS.INVALID_WEBHOOK_ID);
    }
  }

  public async updateWebhookEventData(
    transactionalEntityManager: EntityManager,
    id: string,
    httpStatus: string,
    status: string,
    webhookResponse: string
  ): Promise<WebhookEventData> {
    const entityManager = transactionalEntityManager;
    const e = await entityManager.findOne(WebhookEventData, id);
    // if (status != null) {
    //   e.status = status;
    // }
    if (httpStatus != null) {
      e.httpStatus = httpStatus;
    }
    if (webhookResponse) {
      e.webhookResponse = webhookResponse;
    }
    return entityManager.save(e);
  }

  public async deleteWebhookEventData(
    transactionalEntityManager: EntityManager,
    id: string
  ): Promise<boolean> {
    const entityManager = transactionalEntityManager;
    const e = await entityManager.delete(WebhookEventData, { id });
    return true;
  }
}

interface IWebhookEventDataInterface {
  queueName: WALKIN_QUEUES;
  queueData: any;
  webhookData: WebhookEventData;
}
