import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./loyalty-transaction.typeDefs";
import { LoyaltyTransactionProvider } from "./loyalty-transaction.provider";
import { CustomerLoyaltyProvider } from "../customer-loyalty/customer-loyalty.provider";
import { resolvers } from "./loyalty-transaction.resolvers";
import { LoyaltyLedgerProvider } from "../loyalty-ledger/loyalty-ledger.providers";
import { RuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/rule.provider";
import { CurrencyProvider } from "../currency/currency.provider";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { QueueProvider } from "@walkinserver/walkin-core/src/modules/queueProcessor/queue.provider";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { ActionUtils } from "../common/utils/ActionUtils";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/business_rule.provider";
import { WebhookProvider } from "@walkinserver/walkin-core/src/modules/webhook/webhook.providers";
import { LoyaltyProgramProvider } from "../loyalty-program/loyalty-program.provider";
import { CustomerLoyaltyProgramProvider } from "../customer-loyalty-program/customer-loyalty-program.provider";
import { RuleSetProvider } from "@walkinserver/walkin-core/src/modules/rule/providers";
import { OrganizationRepository } from "@walkinserver/walkin-core/src/modules/account/organization/organization.repository";
import { CustomerRepository } from "@walkinserver/walkin-core/src/modules/customer/customer.repository";
import { CollectionItemsRepository } from "../collection-items/collection-items.repository";
import { CollectionsRepository } from "../collections/collections.repository";
import { LoyaltyProgramDetailRepository } from "../loyalty-program-detail/loyalty-program-detail.repository";
import { LoyaltyProgramConfigRepository } from "../loyalty-program-config/loyalty-program-config.repository";
import { CustomerLoyaltyRepository } from "../customer-loyalty/customer-loyalty.repository";
import { CustomerLoyaltyProgramRepository } from "../customer-loyalty-program/customer-loyalty-program.repository";
import { LoyaltyCardRepository } from "../loyalty-card/loyalty-card.repository";
import { LoyaltyTransactionRepository } from "./loyalty-transaction.repository";
import { LoyaltyProgramDetailProvider } from "../loyalty-program-detail/loyalty-program-detail.provider";
import { LoyaltyProgramConfigProvider } from "../loyalty-program-config/loyalty-program-config.provider";

export const LoyaltyTransactionModule = new GraphQLModule({
  name: "LoyaltyTransactionModule",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [
    LoyaltyTransactionProvider,
    CustomerLoyaltyProvider,
    CustomerLoyaltyProgramProvider,
    LoyaltyLedgerProvider,
    LoyaltyCardProvider,
    RuleProvider,
    CurrencyProvider,
    CommunicationProvider,
    QueueProvider,
    ActionUtils,
    BusinessRuleProvider,
    WebhookProvider,
    LoyaltyProgramProvider,
    RuleSetProvider,
    OrganizationRepository,
    CustomerRepository,
    CollectionItemsRepository,
    CollectionsRepository,
    LoyaltyProgramDetailRepository,
    LoyaltyProgramConfigRepository,
    CustomerLoyaltyRepository,
    CustomerLoyaltyProgramRepository,
    LoyaltyCardRepository,
    LoyaltyTransactionRepository,
    LoyaltyProgramDetailProvider,
    LoyaltyProgramConfigProvider
  ]
});
