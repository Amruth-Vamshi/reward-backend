import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./loaylty-ledger.typeDefs";
import { LoyaltyLedgerProvider } from "./loyalty-ledger.providers";
import { resolvers } from "./loaylty-ledger.resolver";
import { CustomerLoyaltyProvider } from "../customer-loyalty/customer-loyalty.provider";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { LoyaltyCardRepository } from "../loyalty-card/loyalty-card.repository";
import { CustomerRepository } from "@walkinserver/walkin-core/src/modules/customer/customer.repository";

export const LoyaltyLedgerModule = new GraphQLModule({
  name: "LoyaltyLedgerModule",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [
    LoyaltyLedgerProvider,
    CustomerLoyaltyProvider,
    LoyaltyCardProvider,
    LoyaltyCardRepository,
    CustomerRepository
  ]
});
