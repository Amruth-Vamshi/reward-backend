import gql from "graphql-tag";
import { ExpiryUnit } from "../common/constants/constant";

export const typeDefs = gql`
    type RuleSet
    type Campaign
    type LoyaltyCard
    type Organization

    enum ExpiryUnit{
		${[...Object.values(ExpiryUnit)]}
    }

    scalar JSON

    type LoyaltyProgramConfig {
        id:ID
        code: String
        name: String
        description: String
        organization: Organization
        campaign: Campaign
        loyaltyCard: LoyaltyCard
        loyaltyBurnRuleSet: RuleSet
        expiryUnit: ExpiryUnit
        expiryValue: Int
        extend: JSON
        cancelTransactionRules: JSON
    }

    input CancelTransactionRulesInput{
        allowCancellation: Boolean!
        allowCancelForCompleted: Boolean!
        trackNegativePoints: Boolean!
    }

    input CreateLoyaltyProgramConfigInput{
        code: String!
        name: String!
        description: String
        campaignId: Int
        loyaltyCardId: Int!
        loyaltyBurnRuleSetId: Int!
        cancelTransactionRules: CancelTransactionRulesInput
        expiryUnit: ExpiryUnit
        expiryValue: Int
        extend: JSON
        applicableEvents: JSON
    }

    input UpdateLoyaltyProgramConfigInput{
        id: Int!
        description: String
        expiryValue: Int
        expiryUnit: String
        extended: JSON
        loyaltyBurnRuleSetId: Int
        cancelTransactionRules: CancelTransactionRulesInput
        applicableEvents: JSON
    }

    type Query{
        getLoyaltyProgramConfigs(loyaltyCardCode: String): [LoyaltyProgramConfig] @auth

        getLoyaltyProgramConfigById(configId: Int): LoyaltyProgramConfig @auth
    }
    type Mutation{
        createLoyaltyProgramConfig(input: CreateLoyaltyProgramConfigInput): LoyaltyProgramConfig @auth

        updateLoyaltyProgramConfig(input: UpdateLoyaltyProgramConfigInput): LoyaltyProgramConfig @auth

        deleteLoyaltyProgramConfig(configId: Int): LoyaltyProgramConfig @auth
    }
`;
