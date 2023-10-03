import { GraphQLModule } from "@graphql-modules/core";
import { LoyaltyCardModule } from "./loyalty-card/loyalty-card.module";
import { CurrencyModule } from "./currency/currency.module";
import { CustomerLoyaltyModule } from "./customer-loyalty/customer-loyalty.module";
import { LoyaltyTransactionModule } from "./loyalty-transaction/loyalty-transaction.module";
import { LoyaltyProgramModule } from "./loyalty-program/loyalty-program.module";
import { LoyaltyLedgerModule } from "./loyalty-ledger/loaylty-ledger.module";
import { ExpiryCommunicationModule } from "./expiry-communication/expiry-communication.module";
import { CollectionsModule } from "./collections/collections.module";
import { CollectionsItemsModule } from "./collection-items/collection-items.module";
import { LoyaltyProgramConfigModule } from "./loyalty-program-config/loyalty-program-config.module";
import { LoyaltyProgramDetailModule } from "./loyalty-program-detail/loyalty-program-detail.module";
import { CustomerLoyaltyProgramModule } from "./customer-loyalty-program/customer-loyalty-program.module";
import { CampaignModule } from "./campaigns/campaign.module";
import { ExternalIntegrationModule } from "./external-integration/external-integration.module";
export const RewardXModule = new GraphQLModule({
  name: "RewardX",
  imports: [
    LoyaltyCardModule,
    CustomerLoyaltyModule,
    CurrencyModule,
    LoyaltyTransactionModule,
    LoyaltyProgramModule,
    ExpiryCommunicationModule,
    LoyaltyLedgerModule,
    CollectionsModule,
    CollectionsItemsModule,
    LoyaltyProgramConfigModule,
    LoyaltyProgramDetailModule,
    CustomerLoyaltyProgramModule,
    CampaignModule,
    ExternalIntegrationModule
  ]
});
