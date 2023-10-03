import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./loyalty-program-config.typeDefs";
import { LoyaltyProgramConfigProvider } from "./loyalty-program-config.provider";
import { resolvers } from "./loyalty-program-config.resolvers";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";

export const LoyaltyProgramConfigModule = new GraphQLModule({
  name: "LoyaltyProgramConfig",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [LoyaltyProgramConfigProvider]
});
