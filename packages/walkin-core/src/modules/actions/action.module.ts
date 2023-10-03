import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { Action } from "./action.providers";
import resolvers from "./action.resolvers";
import typeDefs from "./action.typeDefs";
import { QueueProvider } from "../queueProcessor/queue.provider";
export const actionsModule = new GraphQLModule({
  name: "Action",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [Action, Organizations, QueueProvider]
});
