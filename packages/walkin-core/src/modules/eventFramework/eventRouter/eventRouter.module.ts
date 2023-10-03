import { GraphQLModule } from "@graphql-modules/core";
import { resolvers } from "./eventRouter.resolver";
import { EventRouterService } from "./eventRouter.service";
import { typeDefs } from "./eventRouter.typeDefs";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { QueueProvider } from "../../queueProcessor/queue.provider";
import { CampaignProvider } from "../../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { EventTypeService } from "../eventType/eventType.service";
import {
  BusinessRuleProvider,
  RuleProvider,
  RuleSetProvider
} from "../../rule/providers";
import { LoyaltyTransactionRepository } from "../../../../../walkin-rewardx/src/modules/loyalty-transaction/loyalty-transaction.repository";
import { CustomerRepository } from "../../customer/customer.repository";
import { CollectionItemsRepository } from "../../../../../walkin-rewardx/src/modules/collection-items/collection-items.repository";
import { CollectionsRepository } from "../../../../../walkin-rewardx/src/modules/collections/collections.repository";
import { LoyaltyProgramDetailRepository } from "../../../../../walkin-rewardx/src/modules/loyalty-program-detail/loyalty-program-detail.repository";
import { LoyaltyProgramConfigRepository } from "../../../../../walkin-rewardx/src/modules/loyalty-program-config/loyalty-program-config.repository";
import { LoyaltyCardRepository } from "../../../../../walkin-rewardx/src/modules/loyalty-card/loyalty-card.repository";
import { CustomerLoyaltyProgramRepository } from "../../../../../walkin-rewardx/src/modules/customer-loyalty-program/customer-loyalty-program.repository";
import { CustomerLoyaltyRepository } from "../../../../../walkin-rewardx/src/modules/customer-loyalty/customer-loyalty.repository";
import { WebhookProvider } from "../../webhook/webhook.providers";
import { CommunicationProvider } from "../../communication/communication.providers";
export const eventRouterModule = new GraphQLModule({
  name: "eventRouterModule",
  typeDefs,
  resolvers,
  providers: [
    EventRouterService,
    QueueProvider,
    CampaignProvider,
    EventTypeService,
    BusinessRuleProvider,
    LoyaltyTransactionRepository,
    CustomerRepository,
    CollectionItemsRepository,
    CollectionsRepository,
    LoyaltyProgramDetailRepository,
    LoyaltyProgramConfigRepository,
    LoyaltyCardRepository,
    CustomerLoyaltyRepository,
    CustomerLoyaltyProgramRepository,
    RuleSetProvider,
    RuleProvider,
    WebhookProvider,
    CommunicationProvider
  ],
  imports: [AuthGuardModule]
});
