import { Organizations } from "../../account/organization/organization.providers";
import {
  BASIC_METRIC_DATA,
  BASIC_RULE_ENTITY_DATA,
  BASIC_WEBHOOK_EVENT_TYPE,
  BASIC_METRIC_FILTERS,
  BASIC_TEMPLATES,
  NOTIFICATION_TEMPLATES
} from "../constants/orgLevelSeedData";
import { MetricProvider } from "../../metrics/metrics.providers";
import {
  RuleEntityProvider,
  RuleAttributeProvider,
  RuleProvider
} from "../../rule/providers";
import { WebhookProvider } from "../../webhook/webhook.providers";
import { WCoreError } from "../exceptions";
import { WCORE_ERRORS } from "../constants/errors";
import { getDynamicImports, getPackageNameForProduct } from "./utils";
import { CommunicationProvider } from "../../communication/communication.providers";
import {
  DEFAULT_RULES,
  RULE_TYPE,
  STATUS,
  EXPRESSION_TYPE,
  ENTITY_TYPE,
  FILE_SYSTEM_TYPES,
  ACCESS_TYPES
} from "../constants/constants";
import { workflowModule } from "../../workflow/workflow.module";
import { WorkflowRouteService } from "../../workflow/workflow.providers";
import { EntityManager } from "typeorm";
import { Injector } from "@graphql-modules/di";
import { TaxTypeProvider } from "../../productcatalog/taxtype/taxtype.providers";
import { StoreFormatProvider } from "../../productcatalog/storeformat/storeFormat.providers";
import { PaymentTypeProvider } from "../../paymentType/paymentType.providers";
// import { DEFAULT_PAYMENT_TYPE } from "@walkinserver/walkin-orderx/src/common/constants/constants";
import { ChargeTypeProvider } from "../../productcatalog/chargeType/chargeType.providers";
import { FileSystemProvider } from "../../filesystem/filesystem.providers";
import { CatalogProvider } from "../../productcatalog/catalog/catalog.providers";
import { ChannelProvider } from "../../productcatalog/channel/channel.providers";

/*
    Version : 0.1
    Purpose : Class to make use of & initialize any basic data setup
*/
export default class Initialize {
  /*
    ******** Details ********
    Contains basic initProduct setup
*/

  public static async initProducts(entityManager, org, walkinProducts) {
    const productNames = walkinProducts.map(walkinProduct => {
      return walkinProduct.name;
    });

    // Load initialize for each product
    for (const product of productNames) {
      await this.fetchAndInitializeProduct(entityManager, org, product);
    }
    return org;
  }

  public static async addBasicMetrics(entityManager, org, injector) {
    console.log("Creating basic metric filters....");

    const filters = [];

    for (const metricFilter of BASIC_METRIC_FILTERS) {
      const metricFilterInput: any = metricFilter;
      metricFilterInput.organizationId = org.id;

      const metricFilterResult = await injector
        .get(MetricProvider)
        .createMetricFilter(entityManager, metricFilterInput);

      filters.push(metricFilterResult);
    }

    console.log("Creating basic metrics....");

    for (const metric of BASIC_METRIC_DATA) {
      const metricInput: any = metric;
      metric.filters = filters;
      metricInput.organizationId = org.id;

      await injector
        .get(MetricProvider)
        .createMetric(entityManager, metricInput);
    }
  }

  public static async addBasicRules(entityManager, org, injector) {
    console.log("Creating basic rule entities....");
    for (const ruleEntityObj of BASIC_RULE_ENTITY_DATA) {
      const ruleEntityDetails = {
        organizationId: org.id,
        entityName: ruleEntityObj.entityName,
        entityCode: ruleEntityObj.entityCode,
        status: ruleEntityObj.status
      };
      const newRuleEntityObj = await injector
        .get(RuleEntityProvider)
        .createRuleEntity(entityManager, ruleEntityDetails);

      console.log("Creating basic rule attributes....");
      if (newRuleEntityObj) {
        for (const attribute of ruleEntityObj.attributes) {
          const ruleAttributeDetails = attribute;
          ruleAttributeDetails["ruleEntityId"] = newRuleEntityObj.id;
          ruleAttributeDetails["organizationId"] = org.id;
          await injector
            .get(RuleAttributeProvider)
            .createRuleAttribute(entityManager, ruleAttributeDetails);
        }
      }
    }

    const ruleInput = {
      name: DEFAULT_RULES.CUSTOMER_IS_VALID,
      description: DEFAULT_RULES.CUSTOMER_IS_VALID,
      status: STATUS.ACTIVE,
      type: RULE_TYPE.SIMPLE,
      organizationId: org.id,
      ruleConfiguration: {
        rules: [
          {
            attributeName: "customerIdentifier",
            attributeValue: "null",
            expressionType: EXPRESSION_TYPE.NOT_EQUALS
          }
        ],
        combinator: "and"
      }
    };
    const rule = await injector
      .get(RuleProvider)
      .createRule(entityManager, injector, ruleInput);
    return { rule };
  }

  public static async addBasicWebhookEventTypes(entityManager, org, injector) {
    console.log("Creating basic WebhookEvent Types...");
    for (const webhookEventType of BASIC_WEBHOOK_EVENT_TYPE) {
      const webhookEventTypeObj = await injector
        .get(WebhookProvider)
        .createWebhookEvent(
          entityManager,
          webhookEventType.event,
          webhookEventType.description,
          org.id
        );
      if (webhookEventTypeObj === undefined) {
        throw new WCoreError(WCORE_ERRORS.FAILED_TO_CREATE_DEFAULT_WEBHOOKS);
      }
    }
  }

  public static async addBasicTemplates(entityManager, org, injector) {
    console.log("Creating basic message templates....");

    const templates = Object.values(BASIC_TEMPLATES);

    for (const template of templates) {
      await injector
        .get(CommunicationProvider)
        .createMessageTemplate(
          entityManager,
          template.name,
          template.description,
          template.messageFormat,
          template.templateBodyText,
          template.templateSubjectText,
          template.templateStyle,
          org,
          template.url,
          template.imageUrl,
          template.status
        );
    }
  }

  public static async addTaxType(
    entityManager: EntityManager,
    organizationId: string,
    injector: Injector
  ) {
    console.log("~~~~~~~~~~~~creating tax type~~~~~~~~~");
    return injector.get(TaxTypeProvider).createTaxType(entityManager, {
      name: "GST",
      description: "GST tax type",
      organizationId,
      status: STATUS.ACTIVE,
      taxTypeCode: "GST"
    });
  }

  public static async addStoreFormat(
    entityManager: EntityManager,
    organizationId: string,
    taxTypeCode: string,
    injector: Injector
  ) {
    console.log("~~~~~~~~~~~~creating StoreFormat~~~~~~~~~");
    try {
      await injector.get(StoreFormatProvider).createStoreFormat(entityManager, {
        description: "Online Order Store Type",
        name: "Online",
        organizationId,
        status: STATUS.ACTIVE,
        storeFormatCode: "BOT",
        taxTypeCodes: [taxTypeCode]
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static async createFileSystem(
    entityManager: EntityManager,
    organization: any,
    injector: Injector
  ) {
    console.log("~~~~~~~~~~~~creating FileSystem~~~~~~~~~");
    return injector.get(FileSystemProvider).createFileSystem(entityManager, {
      name: `Cloudinary File Upload ${organization.id}`,
      description: "Cloudinary File Upload",
      accessType: ACCESS_TYPES.PUBLIC,
      configuration: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      },
      fileSystemType: FILE_SYSTEM_TYPES.CLOUDINARY,
      enabled: true,
      status: STATUS.ACTIVE,
      organization
    });
  }

  public static async createCatalog(
    entityManager: EntityManager,
    organizationId: string,
    injector: Injector
  ) {
    console.log("~~~~~~~~~~~~creating Catalog~~~~~~~~~");
    try {
      await injector.get(CatalogProvider).createCatalog(entityManager, {
        organizationId,
        name: "Default",
        catalogCode: "Default",
        usage: {
          purpose: "Default"
        },
        description: "Default catalog for an organization"
      });
    } catch (error) {
      console.log(error);
    }
  }

  public static async createChargeType(
    entityManager: EntityManager,
    organizationId: string,
    injector: Injector
  ) {
    console.log("~~~~~~~~~~~~creating ChargeType~~~~~~~~~");
    return injector.get(ChargeTypeProvider).createChargeType(
      entityManager,
      {
        name: "DELIVERY",
        chargeTypeCode: "DELIVERY"
      },
      organizationId
    );
  }

  public static async createChannel(
    entityManager: EntityManager,
    organizationId: string,
    injector: Injector
  ) {
    console.log("~~~~~~~~~~~~creating Channel~~~~~~~~~");
    try {
      await injector.get(ChannelProvider).createChannel(
        entityManager,
        {
          name: "WhatsApp BOT",
          channelCode: "BOT",
          chargeTypeCode: ["DELIVERY"]
        },
        organizationId
      );
    } catch (error) {
      console.log(error);
    }
  }

  public static async addNotificationTemplates(entityManager, org, injector) {
    console.log("Creating Push Notification templates....");

    const templates = Object.values(NOTIFICATION_TEMPLATES);

    for (const template of templates) {
      await injector
        .get(CommunicationProvider)
        .createMessageTemplate(
          entityManager,
          template.name,
          template.description,
          template.messageFormat,
          template.templateBodyText,
          template.templateSubjectText,
          template.templateStyle,
          org,
          template.url,
          template.imageUrl,
          template.status
        );
    }
  }

  /*
      ******** Details ********
      1. Contains basic org setup
          1.1: Links organization to WalkIn products
          1.2: Metrics
          1.3: Rule Entities
          1.4: Rule Attributes
          1.5: Webhook Event Types
          1.6: Message Templates
  */
  public static async initOrganization(
    injector,
    transactionalEntityManager,
    newOrganization,
    walkinProducts
  ) {
    const organizationId = newOrganization.id;

    if (organizationId) {
      console.log(
        "-------------------Setting up basic entries for organization---------------"
      );
      if (walkinProducts) {
        console.log("Creating product specific workflows....");
        await injector
          .get(Organizations)
          .linkOrganizationToWalkinProducts(
            transactionalEntityManager,
            newOrganization.id,
            walkinProducts,
            injector
          );
      }

      // Creates basic Rules
      await this.addBasicRules(
        transactionalEntityManager,
        newOrganization,
        injector
      );

      // Creates basic WebhookEventTypes
      await this.addBasicWebhookEventTypes(
        transactionalEntityManager,
        newOrganization,
        injector
      );

      // Creates the basic Metrics
      await this.addBasicMetrics(
        transactionalEntityManager,
        newOrganization,
        injector
      );
      // Creates basic MessageTemplates
      await this.addBasicTemplates(
        transactionalEntityManager,
        newOrganization,
        injector
      );

      await this.createFileSystem(
        transactionalEntityManager,
        newOrganization,
        injector
      );

      await this.addNotificationTemplates(
        transactionalEntityManager,
        newOrganization,
        injector
      );

      console.log(
        "-------------------Successfully set up basic entries for organization---------------"
      );
    }
  }

  public static async fetchAndInitializeProduct(entityManager, org, product) {
    const packageName = getPackageNameForProduct(product);
    try {
      const { BasicModule, BasicProvider } = await getDynamicImports(
        packageName
      );

      const basicProvider = await BasicModule.injector.get(BasicProvider);
      await basicProvider.initialise(entityManager, org, BasicModule.injector);
    } catch (e) {
      console.log(e);
      await this.fetchAndInitializeProduct(entityManager, org, "CORE");
    }
  }
}
