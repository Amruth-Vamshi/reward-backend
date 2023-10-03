import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { QueueProvider } from "../queueProcessor/queue.provider";
import { WebhookProvider } from "./webhook.providers";
import resolvers from "./webhook.resolvers";
import typeDefs from "./webhook.typeDefs";
export const webhookModule = new GraphQLModule({
  name: "webhookModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [WebhookProvider, Organizations, QueueProvider]
});
