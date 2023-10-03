import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { QueueProvider } from "../queueProcessor/queue.provider";
import { WebhookProvider } from "../webhook/webhook.providers";
import { CustomerProvider } from "./customer.providers";
import { Organizations } from "../account/organization/organization.providers";
import { EntityExtendProvider } from "../entityExtend/entityExtend.providers";
import { SegmentProvider } from "../segment/segment.providers";
import { RuleProvider } from "../rule/providers/rule.provider";

import resolvers from "./customer.resolvers";
import typeDefs from "./customer.typeDefs";
import { LoyaltyTransactionRepository } from "@walkinserver/walkin-rewardx/src/modules/loyalty-transaction/loyalty-transaction.repository";
import { BusinessRuleProvider, RuleSetProvider } from "../rule/providers";
import { CustomerRepository } from "./customer.repository";
import { CollectionItemsRepository } from "@walkinserver/walkin-rewardx/src/modules/collection-items/collection-items.repository";
import { LoyaltyProgramDetailRepository } from "@walkinserver/walkin-rewardx/src/modules/loyalty-program-detail/loyalty-program-detail.repository";
import { LoyaltyProgramConfigRepository } from "@walkinserver/walkin-rewardx/src/modules/loyalty-program-config/loyalty-program-config.repository";
import { CampaignProvider } from "@walkinserver/walkin-rewardx/src/modules/campaigns/campaign.providers";
import { CollectionsRepository } from "@walkinserver/walkin-rewardx/src/modules/collections/collections.repository";
import { LoyaltyCardRepository } from "@walkinserver/walkin-rewardx/src/modules/loyalty-card/loyalty-card.repository";
import { CustomerLoyaltyRepository } from "@walkinserver/walkin-rewardx/src/modules/customer-loyalty/customer-loyalty.repository";
import { CustomerLoyaltyProgramRepository } from "@walkinserver/walkin-rewardx/src/modules/customer-loyalty-program/customer-loyalty-program.repository";
export const customerModule = new GraphQLModule({
  name: "Customer",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [
    CustomerProvider,
    WebhookProvider,
    QueueProvider,
    Organizations,
    EntityExtendProvider,
    SegmentProvider,
    RuleProvider,
    LoyaltyTransactionRepository,
    BusinessRuleProvider,
    CustomerRepository,
    CollectionItemsRepository,
    LoyaltyProgramDetailRepository,
    LoyaltyProgramConfigRepository,
    CampaignProvider,
    CollectionsRepository,
    LoyaltyCardRepository,
    CustomerLoyaltyRepository,
    CustomerLoyaltyProgramRepository,
    RuleSetProvider,
  ]
});
