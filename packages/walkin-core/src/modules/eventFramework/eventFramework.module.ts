import { GraphQLModule } from "@graphql-modules/core";
import { eventRouterModule } from "./eventRouter/eventRouter.module";
import { eventSubscriptionModule } from "./eventSubscription/eventSubscription.module";
import { eventTypeModule } from "./eventType/eventType.module";

export const eventFrameworkModule = new GraphQLModule({
  name: "eventFrameworkModule",
  imports: [eventRouterModule, eventSubscriptionModule, eventTypeModule]
});
