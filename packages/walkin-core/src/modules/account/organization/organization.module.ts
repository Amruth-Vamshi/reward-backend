import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { UserModule } from "../user/user.module";
import { Users } from "../user/user.providers";
import { Organizations } from "./organization.providers";
import resolvers from "./organization.resolvers";
import typeDefs from "./organization.typeDefs";
import { MetricProvider } from "../../metrics/metrics.providers";
import { ApplicationProvider } from "../application/application.providers";
import { RuleProvider } from "../../rule/providers/rule.provider";
import { RuleAttributeProvider } from "../../rule/providers/rule-attribute.provider";
import { RuleEntityProvider } from "../../rule/providers/rule-entity.provider";
import { WebhookProvider } from "../../webhook/webhook.providers";
import { StoreFormatProvider } from "../../productcatalog/storeformat/storeFormat.providers";
import { CatalogProvider } from "../../productcatalog/catalog/catalog.providers";
import {
  Workflows,
  WorkflowStates,
  WorkflowProcesses,
  WorkflowProcessTransitions,
  WorkflowRouteService
} from "../../workflow/workflow.providers";
import { ChannelProvider } from "../../productcatalog/channel/channel.providers";
import { ChargeTypeProvider } from "../../productcatalog/chargeType/chargeType.providers";

export const OrganizationModule = new GraphQLModule({
  imports: [AuthGuardModule, UserModule],
  name: "Organization",
  typeDefs,
  resolvers,
  providers: [
    Organizations,
    Users,
    MetricProvider,
    ApplicationProvider,
    RuleProvider,
    RuleAttributeProvider,
    RuleEntityProvider,
    Workflows,
    WorkflowStates,
    WorkflowProcesses,
    WorkflowProcessTransitions,
    WebhookProvider,
    WorkflowRouteService,
    StoreFormatProvider,
    CatalogProvider,
    ChannelProvider,
    ChargeTypeProvider
  ]
});
