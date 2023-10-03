import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { CommunicationProvider } from "./communication.providers";
import resolvers from "./communication.resolvers";
import typeDefs from "./communication.typeDefs";
import { RuleProvider } from "../rule/providers/rule.provider";
import { QueueProvider } from "../queueProcessor/queue.provider";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { queueProcessorModule } from "../queueProcessor/queueProcessor.module";

export const communicationModule = new GraphQLModule({
  name: "Communication",
  imports: [AuthGuardModule, queueProcessorModule],
  typeDefs,
  resolvers,
  providers: [
    CommunicationProvider,
    Organizations,
    RuleProvider,
    CampaignProvider,
    QueueProvider
  ]
});
