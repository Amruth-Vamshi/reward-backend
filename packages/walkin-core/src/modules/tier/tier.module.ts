import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { typeDefs } from "./tier.typeDefs";
import { resolvers } from "./tier.resolvers"
import { TierRepository } from "./tier.repository";

export const TierModule = new GraphQLModule({
    name: "Tier",
    imports: [AuthGuardModule],
    typeDefs,
    resolvers,
    providers: [
      TierRepository
    ]
  });