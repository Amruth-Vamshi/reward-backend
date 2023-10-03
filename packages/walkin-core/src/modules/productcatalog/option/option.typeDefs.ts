import gql from "graphql-tag";
import {
	POLICY_RESOURCES_ENTITY,
	POLICY_PERMISSION_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
	scalar JSON
	enum STATUS
	type Organization

	type Option {
		id: ID
		name: String
		description: String
		organization : Organization
		optionValues: [OptionValue]
		externalOptionId: String
		code: String
		sortSeq: Int
	}

	input OptionInput {
		name: String!
		description: String
		organizationId: String
		optionValues: [ValueInput]
		externalOptionId: String
		code: String
		sortSeq: Int
	}

	input UpdateOptionInput {
		id: ID!
		name: String
		organizationId: String
		description: String
		externalOptionId: String
		code: String
		sortSeq: Int
	}

	type OptionValue {
		id: ID
		value: String
		option: Option
		externalOptionValueId: String
		code: String
		sortSeq: Int
	}

	input ValueInput {
		value: String
		externalOptionValueId: String
		code: String
		sortSeq: Int
	}

	input OptionValueInput {
		optionId: ID!
		value: String
		externalOptionValueId: String
		code: String
		sortSeq: Int
	}

	input UpdateOptionValueInput {
		id: ID!
		optionId: ID!
		value: String
		externalOptionValueId: String
		code: String
		sortSeq: Int
	}

	input optionSortSeq {
		id: String!
		sortSeq: Int!
	}

	input updateOptionSeqInput {
	  	organizationId: String!
		optionSeq: [optionSortSeq]
	}

	input optionValueSortSeq {
		id: String!
		sortSeq: Int!
	}	  

	input updateOptionValueSeqInput {
		optionId: ID!
		optionValueSeq: [optionValueSortSeq]
	}

	type Query {
		optionById(id: ID!): Option @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
		options: [Option] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
		optionValuesByOptionId(optionId: ID!): [OptionValue] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
	}
	type Mutation {
		createOption(input: OptionInput): Option @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		updateOption(input: UpdateOptionInput): Option @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		updateOptionSortSeq(input: updateOptionSeqInput): [Option] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		createOptionValue(input: OptionValueInput): OptionValue @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		updateOptionValue(input: UpdateOptionValueInput): OptionValue @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		updateOptionValueSortSeq(input: updateOptionValueSeqInput): [OptionValue] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.PRODUCT},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
	}
`;

export default typeDefs;
