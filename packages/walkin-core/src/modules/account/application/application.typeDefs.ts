import gql from "graphql-tag";
import { ENVIRONMENT_TYPES } from "../../common/constants";
import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY
} from "../../common/permissions";

const typeDefs = gql`
	type Organization
	type User
	type Action
	type Role

	enum STATUS 

	enum EnvironmentEnum{
    ${[...Object.values(ENVIRONMENT_TYPES)]}
  	}

	"""
	Skeloton of the Application data sent back to the user
	"""
	type Application {
		id: ID!
		name: String
		description: String
		auth_key_hooks: String
		platform: String
		organization: Organization
		actions: [Action]
		apiKeys:APIKey
	}

	type Query {
		"""
		Fetch all the Applications data from the server
		"""
		applications: [Application!]! @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		"""
		Fetch a single Application data for the unique id provided
		"""
		application(
			"""
			Unique id of the Application which need to be fetched from the Server
			"""
			id: ID!
		): Application @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
	}

	"""
	Skeloton of the input receive by server to update Application
	"""
	input ApplicationUpdateInput {
		"""
		Unique id of the application
		"""
		id: ID!
		"""
		Name of the application
		"""
		name: String

		"""
		Description of the organization
		"""
		description: String

		"""
		auth_key_hooks associated with this application
		"""
		auth_key_hooks: String
		"""
		Platform this application will run on
		"""
		platform: String
	}

	type APIKey{
		id:ID
		environment:String
		status:String
		roles:[Role]
		api_key:String
	}

	input APIKeyInput{
		id:ID!
		environment:EnvironmentEnum
		status:STATUS	
		roleIds:[ID]
	}

		input ApplicationInput{
		"""
			Name of the application
			"""
			name: String!

			"""
			Description of the organization
			"""
			description: String

			"""
			auth_key_hooks associated with this application
			"""
			auth_key_hooks: String
			"""
			Platform this application will run on
			"""
			platform: String
	}

	type Mutation {
		"""
		Generate a API key for the application
		"""
		generateAPIKey(
			id: ID!
			roleIds: [ID]!
		): APIKey  @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

		"""
		Delete an application from the database
		"""
		deleteApplication(
			"""
			Unique id of the application which needs to be deleted
			"""
			id: ID!
		): Boolean @auth (requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

		"""
		Update information of already existing application
		"""
		updateApplication(input: ApplicationUpdateInput!): Application @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		updateAPIKey(input:APIKeyInput):APIKey @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

		deleteAPIKey(id: ID!):APIKey @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
		
		  """ Create an application for an organization """
		  createApplication(
		""" Unique id of the organization for which application needs to created """
		organizationId:ID!,input:ApplicationInput!):Application @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.APPLICATION},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
	}
`;

export default typeDefs;
