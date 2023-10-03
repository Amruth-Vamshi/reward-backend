import gql from "graphql-tag";

export const ruleEffectTypeDefs = gql`
  type RuleEffect {
    id: ID
    name: String
    description: String
    type: String
    value: String
    transforms: JSON
    organization: Organization!
    ruleEntity: RuleEntity
    ruleAttribute: RuleAttribute
  }

  input updateRuleEffectInput {
    ruleEffectId: ID!
    name: String
    description: String
    type: RULE_EFFECT_TYPE
    value: String
    ruleAttributeId: ID
    ruleEntityId: ID
    transforms: JSON
  }

  input SearchRuleEffectInput {
    name: String
    id: ID
    ruleAttributeId: ID
    ruleEntityId: ID
  }

  type Organization {
    id: ID!
  }

  input CreateRuleEffectInput {
    name: String!
    description: String
    type: RULE_EFFECT_TYPE!
    value: String
    ruleEntityId: ID
    ruleAttributeId: ID
    transforms: JSON
  }
`;
