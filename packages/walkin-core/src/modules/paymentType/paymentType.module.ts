import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";

import { PaymentTypeProvider } from "./paymentType.providers";
import { resolvers } from "./paymentType.resolvers";
import typeDefs from "./paymentType.typedefs";
export const PaymentTypeModule = new GraphQLModule({
  name: "PaymentTypeModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [PaymentTypeProvider]
});
