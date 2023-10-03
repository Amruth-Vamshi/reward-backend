import gql from "graphql-tag";
import {
	POLICY_RESOURCES_ENTITY,
	POLICY_PERMISSION_ENTITY,
	ROLE_NAME
} from "../../common/permissions";

const typeDefs = gql` 
	enum POLICY_EFFECTS

	enum POLICY_RESOURCES

	enum POLICY_PERMISSIONS

	enum POLICY_TYPES 

	enum POLICY_LEVELS

	enum ROLE_NAME {
		${[...Object.keys(ROLE_NAME)]}
	}

	scalar JSON

	type User

	extend type User{
		permissionMap(types:[POLICY_TYPES]):JSON
	}

	type Application

	type Policy {
		id: ID!
		effect: POLICY_EFFECTS
		resource: POLICY_RESOURCES
		permission: POLICY_PERMISSIONS
		type: POLICY_TYPES
		accessLevel: POLICY_LEVELS
	}

	type Role {
		id: ID!
		name: String
		description: String
		tags: [String]
		policies: [Policy]
		users: [User]
		createdBy: String
		lastModifiedBy: String
		createdTime: String
		lastModifiedTime: String
	}

	input RoleInput {
		name: ROLE_NAME!
		description: String
		tags: [String]
	}

	input RoleEditInput {
		id: ID!
		name: ROLE_NAME
		description: String
		tags: [String]
	}

	input PolicyInput {
		effect: POLICY_EFFECTS
		resource: POLICY_RESOURCES!
		permission: POLICY_PERMISSIONS!
		type: POLICY_TYPES!
		accessLevel: POLICY_LEVELS
	}

	input PolicyEditInput {
		id: ID!
		effect: POLICY_EFFECTS
		resource: POLICY_RESOURCES
		permission: POLICY_PERMISSIONS
		accessLevel: POLICY_LEVELS
		type: POLICY_TYPES
	}

	
	type Query {
		roles: [Role] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
		role(id: ID!): Role @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.READ}}
		])
	}

	type Mutation {
		addRole(input: RoleInput!): Role @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		editRole(input: RoleEditInput!): Role  @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		deleteRole(id: ID!): Role @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		addPolicyToRole(roleId: ID!, input: PolicyInput!): Policy  @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		addPoliciesToRole(roleId: ID!, inputs: [PolicyInput]!): Role  @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		removePolicyFromRole(roleId: ID!, policyId: ID!): Role @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		removePoliciesFromRole(roleId: ID!, policyIds: [ID!]!): Role @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		editPolicy(input: PolicyEditInput!): Policy @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		linkUserToRole(roleId: ID!, userId: ID!): User @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		linkUsersToRole(roleId: ID!, userIds: [ID!]!): [User] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		linkRolesToUser(roleIds: [ID!]!, userId: ID!): User @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		unlinkUserToRole(roleId: ID!, userId: ID!): User @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		unlinkUsersFromRole(roleId: ID!, userIds: [ID!]!): [User] @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		unlinkRolesFromUser(roleIds: [ID!]!, userId: ID!): User @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.ROLE},permission:${POLICY_PERMISSION_ENTITY.CREATE}}
		])
		
	}
`;

export default typeDefs;
