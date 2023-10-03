import gql from "graphql-tag";

export const ruleAttributeTypeDefs = gql`
  type RuleAttribute {
    id: ID
    attributeName: String
    description: String
    status: STATUS
    attributeValueType: String
    ruleEntity: RuleEntity
  }

  input SearchRuleAttributeInput {
    status: STATUS
    entityName: String
  }
  type Organization {
    id: ID!
  }

  input CreateRuleAttributeInput {
    attributeName: String!
    description: String
    status: STATUS!
    attributeValueType: VALUE_TYPE!
    ruleEntityId: ID!
  }
`;
