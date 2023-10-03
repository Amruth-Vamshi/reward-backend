import gql from "graphql-tag";
import { SCHEMA_FORMAT, STATUS } from "../common/constants/constants";

import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../common/permissions";

const typeDefs = gql`
  type PaginationInfo
  input SortOptions
  input PageOptions

  type Query {
    actionDefinition(id: ID!, organizationId: ID): ActionDefinition @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION_DEFNITION},permission:${POLICY_PERMISSION_ENTITY.READ}}])

    actionDefinitions(
      organizationId: ID
      name: String
      type: String
      status: String = "ACTIVE"
      pageOptions: PageOptions = {}
      sortOptions: SortOptions = {}
    ): ActionDefinitionPage @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION_DEFNITION},permission:${POLICY_PERMISSION_ENTITY.LIST}}])

    action(id: ID!, organizationId: ID): Action @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION},permission:${POLICY_PERMISSION_ENTITY.READ}}])

    actions(
      organizationId: ID
      actionDefinitionName: String
      status: String = "ACTIVE"
      pageOptions: PageOptions = {}
      sortOptions: SortOptions = {}
    ): ActionPage @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION},permission:${POLICY_PERMISSION_ENTITY.LIST}}])

  }

  type ActionPage {
    data: [Action!]
    paginationInfo: PaginationInfo
  }

  type ActionDefinitionPage {
    data: [ActionDefinition!]
    paginationInfo: PaginationInfo
  }

  type Mutation {
    createActionDefinition(
      input: CreateActionDefinitionInput
    ): ActionDefinition @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION_DEFNITION},permission:${POLICY_PERMISSION_ENTITY.CREATE}}])

    updateActionDefinition(
      input: UpdateActionDefinitionInput
    ): ActionDefinition @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION_DEFNITION},permission:${POLICY_PERMISSION_ENTITY.UPDATE}}])

    disableActionDefinition(id: ID!, organizationId: ID): Int @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION_DEFNITION},permission:${POLICY_PERMISSION_ENTITY.DELETE}}])

    executeAction(actionDefinitionName: String!, request: JSON): Action @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.ACTION},permission:${POLICY_PERMISSION_ENTITY.EXECUTE}}])
  }

  type ActionDefinition {
    id: ID
    name: String
    type: String
    organization: Organization
    configuration: JSON
    code: String
    inputSchema: JSON
    outputSchema: JSON
    status: String
  }

  input CreateActionDefinitionInput {
    name: String!
    type: String!
    organizationId: ID!
    configuration: JSON!
    code: String
    inputSchema: JSON!
    outputSchema: JSON!
    status: String
  }

  input UpdateActionDefinitionInput {
    id: ID!
    name: String
    type: String
    organizationId: ID
    configuration: JSON
    code: String
    inputSchema: JSON
    outputSchema: JSON
    status: String
  }

  input DisableActionDefinitionInput {
    id: ID!,
    organizationId: ID
  }

  type Action {
    id: ID
    actionDefinition: ActionDefinition
    organization: Organization
    request: JSON
    response: JSON
    status: String
  }

  type Organization {
    actions: [Action]
  }

  type Application {
    actions: [Action]
  }

  scalar JSON
`;

export default typeDefs;
