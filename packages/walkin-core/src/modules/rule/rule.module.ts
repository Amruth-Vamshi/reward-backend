import { GraphQLModule } from "@graphql-modules/core";

import typeDefs from "./rule.typeDefs";

import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import {
  RuleAttributeProvider,
  BusinessRuleProvider,
  RuleProvider,
  RuleEntityProvider,
  RuleConditionProvider,
  RuleEffectProvider,
  RuleSetProvider
} from "./providers";
import {
  ruleAttributeResolvers,
  ruleResolvers,
  businessRuleResolvers,
  ruleEntityResolvers,
  ruleConditionResolvers,
  ruleEffectResolvers,
  ruleSetResolvers
} from "./resolvers";

export const ruleModule = new GraphQLModule({
  name: "Rule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers: [
    ruleAttributeResolvers,
    ruleResolvers,
    businessRuleResolvers,
    ruleEntityResolvers,
    ruleConditionResolvers,
    ruleEffectResolvers,
    ruleSetResolvers
  ],
  providers: [
    RuleAttributeProvider,
    BusinessRuleProvider,
    RuleProvider,
    RuleEntityProvider,
    RuleConditionProvider,
    RuleEffectProvider,
    RuleSetProvider
  ]
});
