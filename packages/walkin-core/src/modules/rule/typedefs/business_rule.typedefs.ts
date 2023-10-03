import gql from "graphql-tag";
import { BUSINESS_RULE_LEVELS } from "../../common/constants/constants";

export const businessRuleTypeDefs = gql`
	type BusinessRule {
		id: ID!
		ruleLevel: BUSINESS_RULE_LEVELS!
		ruleType: String!
		ruleDefaultValue: String
	}

	type BusinessRuleDetail {
		id: ID!
		ruleLevel: BUSINESS_RULE_LEVELS!
		ruleLevelId: String!
		ruleType: String!
		ruleValue: String
	}

	input CreateBusinessRuleInput {
		ruleLevel: BUSINESS_RULE_LEVELS!
		ruleType: String!
		ruleDefaultValue: String
	}

	input CreateBusinessRuleDetailInput {
		ruleLevel: BUSINESS_RULE_LEVELS!
		ruleLevelId: String!
		ruleType: String!
		ruleValue: String
		organizationId: String!
	}

	input UpdateBusinessRuleInput {
		ruleDefaultValue: String
	}

	input UpdateBusinessRuleDetailInput {
		ruleLevel: BUSINESS_RULE_LEVELS
		ruleLevelId: String
		ruleType: String
		ruleValue: String
		organizationId: String!
	}

	input SearchBusinessRulesInput {
		ruleLevel: BUSINESS_RULE_LEVELS
		ruleType: String
	}
	input SearchBusinessRuleDetailsInput {
		ruleLevel: BUSINESS_RULE_LEVELS
		ruleLevelId: String
		ruleType: String
		organizationId: String
	}
	input BusinessRuleConfigurationInput {
		ruleLevel: BUSINESS_RULE_LEVELS
		ruleLevelId: String
		ruleType: String
		organizationId: String!
	}
	enum BUSINESS_RULE_LEVELS {
		${[...Object.values(BUSINESS_RULE_LEVELS)]}
	}
`;
