import gql from "graphql-tag";
import { graphqlCustomEnums } from "../common/graphql/enums/enum";
import {
  businessRuleTypeDefs,
  ruleAttributeTypeDefs,
  ruleEntityTypeDefs,
  ruleTypeDefs,
  ruleConditionTypeDefs,
  ruleEffectTypeDefs,
  ruleSetTypeDefs
} from "./typedefs";

const typeDefs = gql`
  type Query {
    ruleEntity(id: ID!): RuleEntity @auth
    ruleEntities(input: SearchRuleEntityInput): [RuleEntity] @auth

    ruleAttribute(id: ID!): RuleAttribute @auth
    ruleAttributes(input: SearchRuleAttributeInput): [RuleAttribute] @auth

    getRuleConditions(input: SearchRuleConditionInput): [RuleCondition] @auth
    deleteRuleCondition(ruleConditionId: ID!): Boolean @auth

    getRuleEffects(input: SearchRuleEffectInput): [RuleEffect] @auth
    deleteRuleEffect(ruleEffectId: ID!): Boolean @auth

    getRuleSets(input: SearchRuleSetInput): [RuleSetForOrganization] @auth
    deleteRuleSet(ruleSetId: ID!): Boolean @auth

    rule(id: ID!): Rule @auth
    rules(input: SearchRuleInput): [Rule] @auth

    getSQLFromRule(ruleId: ID!): SQL @auth
    evaluateRule(
      ruleName: String
      data: JSON!
      ruleId: ID
    ): RuleEvaluatioResult @auth
    businessRules(input: SearchBusinessRulesInput!): [BusinessRule] @auth
    businessRule(id: ID!): BusinessRule @auth
    businessRuleDetails(
      input: SearchBusinessRuleDetailsInput!
    ): [BusinessRuleDetail] @auth
    businessRuleDetail(id: ID!): BusinessRuleDetail @auth
    businessRuleConfiguration(input: BusinessRuleConfigurationInput!): String!
      @auth
  }

  type Mutation {
    createRuleEntity(input: CreateRuleEntityInput!): RuleEntity @auth
    disableRuleEntity(id: ID!): RuleEntity @auth

    createRuleAttribute(input: CreateRuleAttributeInput!): RuleAttribute @auth
    disableRuleAttribute(id: ID!): RuleAttribute @auth

    createRuleCondition(input: CreateRuleConditionInput!): RuleCondition @auth
    updateRuleCondition(input: updateRuleConditionInput!): RuleCondition @auth

    createRuleEffect(input: CreateRuleEffectInput!): RuleEffect @auth
    updateRuleEffect(input: updateRuleEffectInput!): RuleEffect @auth

    createRuleSet(input: CreateRuleSetInput!): RuleSet @auth
    updateRuleSet(input: updateRuleSetInput!): RuleSet @auth

    createRule(input: CreateRuleInput!): Rule @auth
    updateRule(id: ID!, input: UpdateRuleInput!): Rule @auth
    disableRule(id: ID!): Rule @auth

    createBusinessRule(input: CreateBusinessRuleInput): BusinessRule @auth
    updateBusinessRule(id: ID!, input: UpdateBusinessRuleInput): BusinessRule
      @auth
    deleteBusinessRule(id: ID!): BusinessRule @auth
    createBusinessRuleDetail(
      input: CreateBusinessRuleDetailInput
    ): BusinessRuleDetail @auth
    updateBusinessRuleDetail(
      id: ID!
      input: UpdateBusinessRuleDetailInput
    ): BusinessRuleDetail @auth
    deleteBusinessRuleDetail(id: ID!): BusinessRuleDetail @auth
    updateBusinessRuleByRuleType(input: CreateBusinessRuleInput): BusinessRule
      @auth
  }

  type SQL {
    SQL: String
  }

  #   type Rule {
  #     id: ID!
  #     name: String
  #     description: String
  #     body: String
  #     organization: Organization
  #   }

  scalar JSON

  #   type Organization {
  #     rules: [Rule]
  #   }
`;

export default [
  typeDefs,
  ruleAttributeTypeDefs,
  ruleEntityTypeDefs,
  ruleTypeDefs,
  graphqlCustomEnums,
  businessRuleTypeDefs,
  ruleConditionTypeDefs,
  ruleEffectTypeDefs,
  ruleSetTypeDefs
];
