import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./loyalty-card.typeDefs";
import { LoyaltyCardProvider } from "./loyalty-card.provider";
import { resolvers } from "./loyalty-card.resolvers";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";

export const LoyaltyCardModule = new GraphQLModule({
  name: "LoyaltyCardModule",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [LoyaltyCardProvider]
});
