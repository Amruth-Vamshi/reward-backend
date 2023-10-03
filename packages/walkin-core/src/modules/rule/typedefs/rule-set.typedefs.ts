import gql from "graphql-tag";

export const ruleSetTypeDefs = gql`
  input PageOptions
  
  type RuleSet {
    id: ID
    name: String
    description: String
    rules: JSON
    organization: Organization
  }

  type RuleSetForOrganization {
    id: ID
    name: String
    description: String
    rules: [Rule]
    organization: Organization
  }

  input updateRuleSetInput {
    id: ID!
    name: String
    description: String
    addRules: [Int]
    removeRules: [Int]
  }

  input SearchRuleSetInput {
    name: String
    pageOptions:PageOptions
    includedRules: [Int]
    ruleSetIds: [Int]
  }

  type Organization {
    id: ID!
  }

  input CreateRuleSetInput {
    name: String!
    description: String
    rules: [Int]
  }
`;
