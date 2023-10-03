import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./customer-loyalty.typeDefs";
import { CustomerLoyaltyProvider } from "./customer-loyalty.provider";
import { resolvers } from "./customer-loyalty.resolvers";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { LoyaltyTransactionProvider } from "../loyalty-transaction/loyalty-transaction.provider";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { QueueProvider } from "@walkinserver/walkin-core/src/modules/queueProcessor/queue.provider";
import { CustomerProvider } from "@walkinserver/walkin-core/src/modules/customer/customer.providers";
import { CustomerLoyaltyRepository } from "./customer-loyalty.repository";
import { LoyaltyCardRepository } from "../loyalty-card/loyalty-card.repository";

export const CustomerLoyaltyModule = new GraphQLModule({
  name: "CustomerLoyalty",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [CustomerLoyaltyProvider, LoyaltyCardProvider, CommunicationProvider, QueueProvider,
    LoyaltyTransactionProvider, CustomerProvider, CustomerLoyaltyRepository, LoyaltyCardRepository]
});
