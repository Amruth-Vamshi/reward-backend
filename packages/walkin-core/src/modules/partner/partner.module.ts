import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";

import { PartnerProvider } from "./partner.providers";
import { resolvers } from "./partner.resolvers";
import typeDefs from "./partner.typedefs";
export const PartnerModule = new GraphQLModule({
  name: "PartnerModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [PartnerProvider]
});
