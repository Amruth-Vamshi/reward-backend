import { AuthGuardModule } from "../../../../walkin-core/src/modules/account/auth-guard/auth-guard.module";

import { GraphQLModule } from "@graphql-modules/core";
import {
  WorkflowEntityService,
  WorkflowEntityTransitionHistoryService,
  WorkflowEntityTransitionService,
  WorkflowProcesses,
  WorkflowProcessTransitions,
  WorkflowRouteService,
  Workflows,
  WorkflowStates
} from "../../../../walkin-core/src/modules//workflow/workflow.providers";
import { CampaignProvider } from "./campaign.providers";

import { ApplicationProvider } from "../../../../walkin-core/src/modules/account/application/application.providers";
import { Organizations } from "../../../../walkin-core/src/modules/account/organization/organization.providers";
import { RuleProvider } from "../../../../walkin-core/src/modules/rule/providers";
import { resolvers } from "./campaign.resolvers";
import typeDefs from "./campaign.typeDefs";
import { CustomerRepository } from "@walkinserver/walkin-core/src/modules/customer/customer.repository";
import { CollectionItemsRepository } from "../collection-items/collection-items.repository";
import { CollectionsRepository } from "../collections/collections.repository";
import { LoyaltyProgramDetailRepository } from "../loyalty-program-detail/loyalty-program-detail.repository";
import { QueueProvider } from "../../../../walkin-core/src/modules/queueProcessor/queue.provider";
import { WebhookProvider } from "../../../../walkin-core/src/modules/webhook/webhook.providers";

export const CampaignModule = new GraphQLModule({
  imports: [AuthGuardModule],
  name: "Campaign",
  typeDefs,
  resolvers,
  providers: [
    CampaignProvider,
    Organizations,
    ApplicationProvider,
    RuleProvider,
    Workflows,
    WorkflowProcesses,
    WorkflowStates,
    WorkflowProcessTransitions,
    WorkflowEntityService,
    WorkflowEntityTransitionService,
    WorkflowEntityTransitionHistoryService,
    WorkflowRouteService,
    CustomerRepository,
    CollectionItemsRepository,
    CollectionsRepository,
    LoyaltyProgramDetailRepository,
    QueueProvider,
    WebhookProvider
  ]
});
