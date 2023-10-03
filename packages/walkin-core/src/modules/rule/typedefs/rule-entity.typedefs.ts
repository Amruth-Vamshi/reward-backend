import gql from "graphql-tag";

export const ruleEntityTypeDefs = gql`
  type RuleAttribute

  type RuleEntity {
    id: ID
    entityName: String
    entityCode: String
    status: STATUS
    organization: Organization
    ruleAttributes: [RuleAttribute]
  }

  input SearchRuleEntityInput {
    status: STATUS
    entityName: String
    entityCode: String
  }
  type Organization {
    id: ID!
  }

  input CreateRuleEntityInput {
    entityName: String!
    entityCode: String
    status: STATUS!
  }
`;
