import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";

import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./channel.typeDefs";
import { resolvers } from "./channel.resolvers";
import { ChannelProvider } from "./channel.providers";
import { ChargeTypeProvider } from "../chargeType/chargeType.providers";
export const ChannelModule = new GraphQLModule({
  imports: [AuthGuardModule],
  name: "Channel",
  typeDefs,
  resolvers,
  providers: [ChannelProvider, ChargeTypeProvider]
});
