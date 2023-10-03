import { GraphQLModule } from "@graphql-modules/core";
import { ApplicationProvider } from "../account/application/application.providers";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { RuleProvider } from "../rule/providers/rule.provider";
import { SegmentProvider } from "./segment.providers";
import resolvers from "./segment.resolvers";
import typeDefs from "./segment.typeDefs";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { AudienceProvider } from "../audience/audience.providers";
import { CustomerProvider } from "../customer/customer.providers";
export const segmentModule = new GraphQLModule({
  name: "Segment",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [
    SegmentProvider,
    Organizations,
    ApplicationProvider,
    RuleProvider,
    AudienceProvider,
    CampaignProvider,
    CustomerProvider
  ]
});
