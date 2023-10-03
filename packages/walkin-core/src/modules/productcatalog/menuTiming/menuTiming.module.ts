import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { MenuTimingProvider } from "./menuTiming.providers";
import { resolvers } from "./menuTiming.resolvers";
import typeDefs from "./menuTiming.typeDefs";

export const MenuTimingModule = new GraphQLModule({
  name: "MenuTiming",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [MenuTimingProvider]
});
