import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";

import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./discountType.typeDefs";
import { resolvers } from "./discountType.resolvers";
import { DiscountTypeProvider } from "./discountType.providers";
export const DiscountTypeModule = new GraphQLModule({
  imports: [AuthGuardModule],
  name: "DiscountType",
  typeDefs,
  resolvers,
  providers: [DiscountTypeProvider]
});
