import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { RuleProvider } from "../rule/providers/rule.provider";
import {
  WorkflowEntityService,
  WorkflowEntityTransitionHistoryService,
  WorkflowEntityTransitionService,
  WorkflowProcesses,
  WorkflowProcessTransitions,
  WorkflowRouteService,
  Workflows,
  WorkflowStates
} from "./workflow.providers";
import resolvers from "./workflow.resolvers";
import typeDefs from "./workflow.typeDefs";

export const workflowModule = new GraphQLModule({
  name: "Workflow",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [
    Workflows,
    WorkflowProcesses,
    WorkflowStates,
    WorkflowProcessTransitions,
    WorkflowEntityService,
    WorkflowEntityTransitionService,
    WorkflowEntityTransitionHistoryService,
    Organizations,
    RuleProvider,
    WorkflowRouteService
  ]
});
