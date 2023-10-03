import { GraphQLModule } from "@graphql-modules/core";
import { accountModule } from "./account/account.module";
import { actionsModule } from "./actions/action.module";
import { audienceModule } from "./audience/audience.module";
import { communicationModule } from "./communication/communication.module";
import { customerModule } from "./customer/customer.module";
import { entityExtendModule } from "./entityExtend/entityExtend.module";
import { eventFrameworkModule } from "./eventFramework/eventFramework.module";
import { metricsModule } from "./metrics/metrics.module";
import { productCatalogModule } from "./productcatalog/productcatalog.module";
import { queueProcessorModule } from "./queueProcessor/queueProcessor.module";
import { ruleModule } from "./rule/rule.module";
import { scalarsModule } from "./scalars/scalars.module";
import { segmentModule } from "./segment/segment.module";
import { sessionModule } from "./session/session.module";
import { webhookModule } from "./webhook/webhook.module";
import { workflowModule } from "./workflow/workflow.module";
import { fileSystemModule } from "./filesystem/filesystem.module";
import { enumsModule } from "./enums/enums.module";
import { reportModule } from "./report/report.module";
import { PartnerModule } from "./partner/partner.module";
import { PaymentTypeModule } from "./paymentType/paymentType.module";
import { DeliveryTypeModule } from "./deliveryType/deliveryType.module";
import { TierModule } from "./tier/tier.module";
export const WCoreModule: GraphQLModule = new GraphQLModule({
  name: "WCoreModule",
  imports: [
    scalarsModule,
    metricsModule,
    webhookModule,
    accountModule,
    eventFrameworkModule,
    ruleModule,
    workflowModule,
    customerModule,
    entityExtendModule,
    actionsModule,
    sessionModule,
    segmentModule,
    audienceModule,
    fileSystemModule,
    communicationModule,
    productCatalogModule,
    queueProcessorModule,
    enumsModule,
    reportModule,
    PartnerModule,
    PaymentTypeModule,
    DeliveryTypeModule,
    TierModule
  ]
});
