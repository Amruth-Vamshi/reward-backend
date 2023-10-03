import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { AccessControls } from "./access-control.providers";
import resolvers from "./access-control.resolvers";
import typeDefs from "./access-control.typeDefs";

export const AccessControlModule: GraphQLModule = new GraphQLModule({
  name: "AccessControl",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [AccessControls]
});
