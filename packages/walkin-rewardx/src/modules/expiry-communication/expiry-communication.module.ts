import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./expiry-communication.typeDefs";
import { expiryCommunicationResolvers } from "./expiry-communication.resolvers";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { QueueProvider } from "@walkinserver/walkin-core/src/modules/queueProcessor/queue.provider";
import { ExpiryCommunicationProvider } from "./expiry-communication.provider";
import { CampaignProvider } from "../campaigns/campaign.providers";
import { BusinessRuleProvider } from "@walkinserver/walkin-core/src/modules/rule/providers/business_rule.provider";
import { LoyaltyProgramProvider } from "../loyalty-program/loyalty-program.provider";

export const ExpiryCommunicationModule = new GraphQLModule({
  name: "ExpiryCommunicationModule",
  imports: [AuthGuardModule],
  resolvers: expiryCommunicationResolvers,
  typeDefs,
  providers: [
    ExpiryCommunicationProvider,
    LoyaltyCardProvider,
    CommunicationProvider,
    QueueProvider,
    CampaignProvider,
    BusinessRuleProvider,
    LoyaltyProgramProvider
  ]
});
