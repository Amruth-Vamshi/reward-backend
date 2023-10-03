import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./loyalty-program.typeDefs";
import { LoyaltyProgramProvider } from "./loyalty-program.provider";
import { resolvers } from "./loyalty-program.resolvers";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { RuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/rule.provider";
import { CampaignProvider } from "../campaigns/campaign.providers";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";

export const LoyaltyProgramModule = new GraphQLModule({
  name: "LoyaltyProgram",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [
    LoyaltyProgramProvider,
    LoyaltyCardProvider,
    RuleProvider,
    CampaignProvider
  ]
});
