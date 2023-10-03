import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";

import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./chargeType.typeDefs";
import { resolvers } from "./chargeType.resolvers";
import { ChargeTypeProvider } from "./chargeType.providers";
export const ChargeModule = new GraphQLModule({
  imports: [AuthGuardModule],
  name: "Channel",
  typeDefs,
  resolvers,
  providers: [ChargeTypeProvider]
});
