import gql from "graphql-tag";
import { STATUS, WORKFLOW_ENTITY_TYPE } from "../common/constants/constants";

const typeDefs = gql`
  type Query {
    workflow(id: ID!): Workflow @auth
    workflowByName(name: String!, organizationId: String!): Workflow @auth
    workflowDiagram(id: ID!): workflowDiagram @auth
    workflows: [Workflow] @auth
    orgWorkflows(orgId: ID!): [Workflow] @auth
    workflowState(id: ID!): WorkflowState @auth
    workflowStates(workflowId: ID!): [WorkflowState] @auth
    workflowProcess(id: ID!): WorkflowProcess @auth
    workflowProcessByName(name: String!, workflowId: String!): Workflow @auth
    workflowProcesses(workflowId: ID!): [WorkflowProcess] @auth
    workflowProcessTransition(id: ID!): WorkflowProcessTransition @auth
    workflowProcessTransitions(workflowProcessId: ID!): [WorkflowProcessTransition] @auth
    workflowEntity(id: ID!) : WorkflowEntity @auth
    workflowEntityByEntityDetails(entityId: String!, entityType: WORKFLOW_ENTITY_TYPE!) : WorkflowEntity @auth
    workflowEntityTransition(id: ID!) : WorkflowEntityTransition @auth
    workflowEntityTransitionByEntityId(workflowEntityId: ID!): WorkflowEntityTransition @auth
    workflowEntityTransitionHistory(workflowEntityId: ID!) : [WorkflowEntityTransitionHistory] @auth
    workflowRoute(id: ID!): WorkflowRoute @auth
    workflowRoutes(organizationId: ID!, entityType: WORKFLOW_ENTITY_TYPE!): [WorkflowRoute] @auth

  }

  type Mutation {
    createWorkflow(input: WorkflowInput): Workflow @auth
    createWorkflowWithChildren(input: WorkflowWithChildrenInput): Workflow @auth
    updateWorkflow(input: UpdateWorkflowInput): Workflow @auth
    createWorkflowProcess(input: WorkflowProcessInput): WorkflowProcess @auth
    updateWorkflowProcess(input: UpdateWorkflowProcessInput): WorkflowProcess @auth
    createWorkflowProcessTransition(input: WorkflowProcessTransitionInput): WorkflowProcessTransition @auth
    updateWorkflowProcessTransition(input: UpdateWorkflowProcessTransitionInput): WorkflowProcessTransition @auth
    createWorkflowState(input: WorkflowStateInput): WorkflowState @auth
    updateWorkflowState(input: UpdateWorkflowStateInput): WorkflowState @auth
    createWorkflowEntity(input: WorkflowEntityInput): WorkflowEntity @auth
    updateWorkflowEntity(input: UpdateWorkflowEntityInput): WorkflowEntity @auth
    addWorkflowEnityTransitionStatus(input: WorkflowEntityTransitionInput): WorkflowEntityTransition @auth
    createWorkflowRoute(input: WorkflowRouteInput): WorkflowRoute @auth
    updateWorkflowRoute(input: UpdateWorkflowRouteInput): WorkflowRoute @auth
  }

  type Workflow {
    id: ID!
    name: String!
    description: String!
    organization: Organization
    workflowProcesses: [WorkflowProcess]
  }

  type workflowDiagram {
    id: ID!
    name: String!
    description: String!
    diagram: String!
  }
  


  input WorkflowInput {
    name: String!
    description: String!
    organizationId: ID!
  }

  input WorkflowWithChildrenInput {
    name: String!
    description: String!
    organizationId: ID!
    workflowProcesses: [WorkflowChildrenProcessInput]!
    workflowStates: [WorkflowChildrenStateInput]!
  }

  input WorkflowChildrenProcessInput {
    name: String!
    description: String!
    workflowProcessTransitions: [WorkflowChildrenProcessTransitionInput]!
  }

  input WorkflowChildrenStateInput {
    name: String!
    description: String!
  }

  input WorkflowChildrenProcessTransitionInput {
    name: String!
    pickupStateName: String!
    dropStateName: String!
    ruleConfig: String!
  }

  input UpdateWorkflowInput {
    id: ID!
    name: String
    description: String
    organizationId: ID
  }

  type WorkflowProcess {
    id: ID!
    name: String!
    description: String!
    workflow: Workflow
    workflowProcessTransitions: [WorkflowProcessTransition]
  }

  input WorkflowProcessInput {
    name: String!
    description: String!
    workflowId: ID!
  }

  input UpdateWorkflowProcessInput {
    id: ID!
    name: String
    description: String
    workflowId: ID
  }

  type WorkflowState {
    id: ID!
    code: Int!
    name: String!
    description: String!
    workflow: Workflow
  }

  input WorkflowStateInput {
    name: String!
    code: Int!
    description: String!
    workflowId: ID!
  }

   input UpdateWorkflowStateInput {
    id: ID!
    code: Int
    name: String
    description: String
    workflowId: ID
  }

  type WorkflowProcessTransition {
    id: ID!
    name: String!
    pickupState: WorkflowState
    dropState: WorkflowState
    ruleConfig: String
  }

  input WorkflowProcessTransitionInput {
    name: String!
    pickupStateId: ID!
    dropStateId: ID!
    ruleConfig: String!
    workflowProcessId: ID!
  }

  input UpdateWorkflowProcessTransitionInput {
    id: ID!
    name: String
    pickupStateId: ID
    dropStateId: ID
    ruleConfig: String
    workflowProcessId: ID
  }

  type WorkflowEntity {
    id: ID!
    workflow: Workflow
    entityId: ID!
    entityType: WORKFLOW_ENTITY_TYPE
    currentTransition: WorkflowEntityTransition
    transitionHistory: [WorkflowEntityTransitionHistory]
  }
  type WorkflowEntityTransition {
    id: ID!
    workflowEntityId: ID!
    workflowProcessTransitionId: ID!
    workflowProcessTransition: WorkflowProcessTransition
  }

  type WorkflowEntityTransitionHistory {
    id: ID!
    workflowEntityId: ID!
    workflowProcessTransitionId: ID!
    workflowProcessTransition: WorkflowProcessTransition
  }

  input WorkflowEntityInput{
    workflowId: ID!
    entityId: ID!
    entityType: WORKFLOW_ENTITY_TYPE!
  }

  input UpdateWorkflowEntityInput{
    id: ID!
    workflowId: ID!
    entityId: ID!
    entityType: WORKFLOW_ENTITY_TYPE
  }

  input WorkflowEntityTransitionInput {
    workflowEntityId: ID!
    workflowProcessTransitionId: ID!
  }


  type Organization {
    workflows: [Workflow]
  }

  input WorkflowRouteInput{
    entityType: WORKFLOW_ENTITY_TYPE!
    organizationId: ID!
    ruleId: ID!
    workflowId: ID!
  }

  input UpdateWorkflowRouteInput{
    id: ID!
    entityType: WORKFLOW_ENTITY_TYPE
    ruleId: ID
    status: STATUS
  }

  type WorkflowRoute {
    id: ID
    entityType: WORKFLOW_ENTITY_TYPE
    organization: Organization
    rule: Rule
    workflow: Workflow
    status: STATUS
  }


  type Rule {
    id: ID!
  }

  enum STATUS{
    ${[...Object.values(STATUS)]}
  }

  enum WORKFLOW_ENTITY_TYPE{
    ${[...Object.values(WORKFLOW_ENTITY_TYPE)]}
  }


`;

export default typeDefs;
