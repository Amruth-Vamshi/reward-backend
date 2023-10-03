import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { Organizations } from "../organization/organization.providers";
import { Users } from "./user.providers";
import resolvers from "./user.resolvers";
import typeDefs from "./user.typeDefs";
import { ApplicationProvider } from "../application/application.providers";
import { MetricProvider } from "../../metrics/metrics.providers";

import {
  Workflows,
  WorkflowStates,
  WorkflowProcesses,
  WorkflowProcessTransitions,
  WorkflowRouteService,
} from "../../workflow/workflow.providers";
import { RuleEntityProvider } from "../../rule/providers/rule-entity.provider";
import { RuleAttributeProvider } from "../../rule/providers/rule-attribute.provider";
import { RuleProvider } from "../../rule/providers/rule.provider";
import { WebhookProvider } from "../../webhook/webhook.providers";
import { SegmentProvider } from "../../segment/segment.providers";
import { CommunicationProvider } from "../../communication/communication.providers";
import { QueueProvider } from "../../queueProcessor/queue.provider";
import { StoreFormatProvider } from "../../productcatalog/storeformat/storeFormat.providers";
import { CatalogProvider } from "../../productcatalog/catalog/catalog.providers";
import { ChannelProvider } from "../../productcatalog/channel/channel.providers";
import { ChargeTypeProvider } from "../../productcatalog/chargeType/chargeType.providers";
import { CategoryProvider } from "../../productcatalog/category/category.providers";
import { TaxTypeProvider } from "../../productcatalog/taxtype/taxtype.providers";
import { FileSystemProvider } from "../../filesystem/filesystem.providers";

export const UserModule = new GraphQLModule({
  name: "User",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [
    Users,
    CommunicationProvider,
    Organizations,
    MetricProvider,
    ApplicationProvider,
    Workflows,
    WorkflowStates,
    WorkflowProcesses,
    WorkflowProcessTransitions,
    WorkflowRouteService,
    RuleEntityProvider,
    RuleAttributeProvider,
    RuleProvider,
    WebhookProvider,
    SegmentProvider,
    QueueProvider,
    StoreFormatProvider,
    CatalogProvider,
    CategoryProvider,
    ChannelProvider,
    ChargeTypeProvider,
    TaxTypeProvider,
    FileSystemProvider,
  ],
});
