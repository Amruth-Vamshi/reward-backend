import gql from "graphql-tag";

export const ruleTypeDefs = gql`
  type Organization {
    id: ID!
    rules: [Rule]
  }

  type Application {
    id: ID!
  }

  type effectOrCondition {
    id: ID
    name: String
    description: String
    type: String
    value: String
  }

  type Rule {
    id: ID
    name: String
    description: String
    status: STATUS
    type: RULE_TYPE
    ruleConfiguration: JSON
    ruleExpression: JSON
    organization: Organization
    effects: [effectOrCondition]
    conditions: [effectOrCondition]
  }

  type RuleEvaluatioResult {
    id: ID
    name: String
    description: String
    status: STATUS
    type: RULE_TYPE
    ruleConfiguration: JSON
    ruleExpression: JSON
    evaluationResult: JSON
    organization: Organization
  }

  input RuleInputType {
    attributeName: String!
    attributeValue: String!
    expressionType: EXPRESSION_TYPE!
  }

  input SearchRuleInput {
    status: STATUS
  }

  input UpdateRuleInput {
    name: String
    description: String
    type: RULE_TYPE
    ruleConfiguration: JSON
    ruleExpression: JSON
    ruleConditionIds: [ID]
    ruleEffectIds: [ID]
  }

  input CreateRuleInput {
    name: String!
    description: String
    type: RULE_TYPE!
    status: STATUS
    ruleConfiguration: JSON
    ruleExpression: JSON
    ruleConditionIds: [ID]
    ruleEffectIds: [ID]
  }
`;
