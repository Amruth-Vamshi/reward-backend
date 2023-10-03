import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";

import { DeliveryTypeProvider } from "./deliveryType.providers";
import { resolvers } from "./deliveryType.resolvers";
import typeDefs from "./deliveryType.typedefs";
export const DeliveryTypeModule = new GraphQLModule({
  name: "DeliveryTypeModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [DeliveryTypeProvider]
});
