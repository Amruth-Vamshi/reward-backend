import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./currency.typedefs";
import { CurrencyProvider } from "./currency.provider";
import { resolvers } from "./currency.resolvers";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";

export const CurrencyModule = new GraphQLModule({
  name: "CurrencyModule",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [CurrencyProvider, LoyaltyCardProvider]
});
