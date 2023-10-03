import { GraphQLModule } from "@graphql-modules/core";
import { resolvers } from "./eventSubscription.resolver";
import { typeDefs } from "./eventSubscription.typeDefs";
import { EventSubscriptionService } from "./eventSubscription.service";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";

export const eventSubscriptionModule = new GraphQLModule({
  imports: [AuthGuardModule],
  name: "eventSubscriptionModule",
  typeDefs,
  resolvers,
  providers: [EventSubscriptionService]
});
