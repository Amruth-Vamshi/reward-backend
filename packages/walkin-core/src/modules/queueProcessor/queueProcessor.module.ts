import { GraphQLModule } from "@graphql-modules/core";
import { QueueProvider } from "./queue.provider";
import typeDefs from "./queue.typeDefs";
import { resolvers } from "./queue.resolvers";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";

export const queueProcessorModule = new GraphQLModule({
  name: "queueProcessorModule",
  imports: [AuthGuardModule],
  providers: [QueueProvider, CampaignProvider],
  typeDefs,
  resolvers
});
