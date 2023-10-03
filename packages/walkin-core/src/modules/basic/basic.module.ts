import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { Organizations } from "@walkinserver/walkin-core/src/modules/account/organization/organization.providers";
import { ApplicationProvider } from "@walkinserver/walkin-core/src/modules/account/application/application.providers";
import {
    WorkflowProcesses,
    Workflows,
    WorkflowStates,
    WorkflowProcessTransitions,
    WorkflowRouteService
} from "@walkinserver/walkin-core/src/modules/workflow/workflow.providers";
import { BasicProvider } from "./basic.providers";

import { resolvers } from "./basic.resolvers";
// import typeDefs from "./basic.typeDefs";
import { RuleProvider } from "../../../../walkin-core/src/modules/rule/providers/rule.provider";
import { RuleAttributeProvider } from "../../../../walkin-core/src/modules/rule/providers/rule-attribute.provider";
import { RuleEntityProvider } from "../../../../walkin-core/src/modules/rule/providers/rule-entity.provider";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { AudienceProvider } from "@walkinserver/walkin-core/src/modules/audience/audience.providers";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { QueueProvider } from "@walkinserver/walkin-core/src/modules/queueProcessor/queue.provider";
import { EntityExtendProvider } from '../../../../walkin-core/src/modules/entityExtend/entityExtend.providers';

export const BasicModule = new GraphQLModule({
    name: "BasicModule",
    imports: [AuthGuardModule],
    resolvers,
    // typeDefs,
    providers: [
        BasicProvider,
        Organizations,
        ApplicationProvider,
        WorkflowProcesses,
        CommunicationProvider,
        RuleAttributeProvider,
        RuleProvider,
        RuleEntityProvider,
        Workflows,
        WorkflowStates,
        WorkflowProcessTransitions,
        WorkflowRouteService,
        CampaignProvider,
        AudienceProvider,
        QueueProvider,
        EntityExtendProvider,
    ]
});
