import gql from "graphql-tag";

export const ruleConditionTypeDefs = gql`
  type RuleCondition {
    id: ID
    name: String
    description: String
    type: String
    valueType: String
    transforms: JSON
    ruleEntity: RuleEntity
    ruleAttribute: RuleAttribute
  }

  input updateRuleConditionInput {
    ruleConditionId: ID!
    name: String
    description: String
    type: CONDITION_TYPE
    valueType: VALUE_TYPE
    value: String
    ruleAttributeId: ID
    ruleEntityId: ID
    transforms: JSON
  }

  input SearchRuleConditionInput {
    name: String
    id: ID
    ruleAttributeId: ID
    ruleEntityId: ID
  }

  type Organization {
    id: ID!
  }

  input CreateRuleConditionInput {
    name: String!
    description: String
    type: CONDITION_TYPE!
    valueType: VALUE_TYPE!
    value: String
    ruleEntityId: ID
    ruleAttributeId: ID
    transforms: JSON
  }
`;
