import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./eventType.typeDefs";
import { EventTypeService } from "./eventType.service";
import { resolvers } from "./eventType.resolver";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";

export const eventTypeModule = new GraphQLModule({
  name: "eventTypeModule",
  providers: [EventTypeService],
  imports: [AuthGuardModule],
  typeDefs,
  resolvers
});
