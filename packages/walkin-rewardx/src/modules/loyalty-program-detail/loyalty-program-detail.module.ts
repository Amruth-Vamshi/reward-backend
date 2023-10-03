import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./loyalty-program-detail.typeDefs";
import { resolvers } from "./loyalty-program-detail.resolvers";
import { LoyaltyProgramDetailProvider } from "./loyalty-program-detail.provider";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { CustomerLoyaltyProvider } from "../customer-loyalty/customer-loyalty.provider";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";

export const LoyaltyProgramDetailModule = new GraphQLModule({
  name: "LoyaltyProgramDetail",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [
    LoyaltyProgramDetailProvider,
    CustomerLoyaltyProvider,
    LoyaltyCardProvider
  ]
});
