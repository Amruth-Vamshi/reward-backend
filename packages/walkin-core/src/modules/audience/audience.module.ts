import { GraphQLModule } from "@graphql-modules/core";
import { ApplicationProvider } from "../account/application/application.providers";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { Action } from "../actions/action.providers";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { CustomerProvider } from "../customer/customer.providers";
import { RuleProvider } from "../rule/providers/rule.provider";
import { SegmentProvider } from "../segment/segment.providers";
import { AudienceProvider } from "./audience.providers";
import resolvers from "./audience.resolvers";
import typeDefs from "./audience.typeDefs";

export const audienceModule = new GraphQLModule({
  name: "Audience",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [
    CampaignProvider,
    SegmentProvider,
    Organizations,
    CustomerProvider,
    ApplicationProvider,
    RuleProvider,
    Action,
    AudienceProvider
  ]
});
