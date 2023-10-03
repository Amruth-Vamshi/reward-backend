import {
  createUnitTestConnection,
  closeUnitTestConnection,
  setupI18n
} from "../../../../__tests__/utils/unit";
import * as WCoreEntities from "../../../entity";
import {
  Workflows,
  WorkflowProcesses,
  WorkflowStates,
  WorkflowProcessTransitions,
  WorkflowEntityService,
  WorkflowEntityTransitionService,
  WorkflowEntityTransitionHistoryService,
  WorkflowRouteService
} from "../../workflow/workflow.providers";
import { Organizations } from "../../account/organization/organization.providers";
import { getManager } from "typeorm";
import {
  OrganizationTypeEnum,
  Status,
  Organization
} from "../../../graphql/generated-models";
import { CACHING_KEYS, WORKFLOW_ENTITY_TYPE } from "../../common/constants";
import { getValueFromCache } from "../../common/utils/redisUtils";

let organizationProvider: Organizations;
let globalOrganization: any;
let workflows: Workflows;
let workflowProcesses: WorkflowProcesses;
let workflowStates: WorkflowStates;
let workflowProcessTransitions: WorkflowProcessTransitions;
let workflowEntityService: WorkflowEntityService;
let workflowEntityTransitionService: WorkflowEntityTransitionService;
let workflowRouteService: WorkflowRouteService;
let workflowEntityTransitionHistoryService: WorkflowEntityTransitionHistoryService;

beforeAll(async () => {
  await createUnitTestConnection(WCoreEntities);
  setupI18n();
  workflows = new Workflows();
  workflowProcesses = new WorkflowProcesses();
  workflowStates = new WorkflowStates();
  workflowProcessTransitions = new WorkflowProcessTransitions();
  workflowEntityService = new WorkflowEntityService();
  workflowEntityTransitionService = new WorkflowEntityTransitionService();
  workflowRouteService = new WorkflowRouteService();
  workflowEntityTransitionHistoryService = new WorkflowEntityTransitionHistoryService();
  organizationProvider = new Organizations();
  const manager = getManager();
  globalOrganization = await organizationProvider.createOrganization(manager, {
    code: "TEST_ORG",
    name: "TEST_ORG",
    organizationType: OrganizationTypeEnum.Organization,
    status: Status.Active
  });
});

describe("WorkFlows TestSuite", () => {
  test("Create Workflow Test", async () => {
    const entityManager = getManager();

    const newWorkFlow = {
      name: "TEST_WORK_FLOW",
      description: "To be tested workflow",
      organizationId: globalOrganization.id
    };

    let createdWorkFlow = await workflows.createWorkflow(
      entityManager,
      newWorkFlow
    );

    expect(createdWorkFlow).toBeDefined();
    expect(createdWorkFlow).toHaveProperty("id");
    expect(createdWorkFlow.id).toBeGreaterThanOrEqual(1);

    let getCreatedWorkflow;
    // Getting just created workflow and verify results
    getCreatedWorkflow = await workflows.getWorkflow(
      entityManager,
      createdWorkFlow.id
    );

    expect(getCreatedWorkflow).toBeDefined();
    expect(getCreatedWorkflow).toHaveProperty("id");
    expect(getCreatedWorkflow.id).toBeGreaterThanOrEqual(1);
    expect(getCreatedWorkflow).toHaveProperty("organizationId");
    expect(getCreatedWorkflow.organizationId).toEqual(globalOrganization.id);
  });

  test("Update Workflow Test", async () => {
    const entityManager = getManager();

    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    expect(workflow).toBeDefined();
    expect(workflow).toHaveProperty("id");
    expect(workflow.id).toBeGreaterThanOrEqual(1);

    let getCreatedWorkflow;
    // Getting just created workflow and verify results
    getCreatedWorkflow = await workflows.getWorkflow(
      entityManager,
      workflow.id
    );

    expect(getCreatedWorkflow).toBeDefined();
    expect(getCreatedWorkflow).toHaveProperty("id");
    expect(getCreatedWorkflow.id).toBeGreaterThanOrEqual(1);
    expect(getCreatedWorkflow).toHaveProperty("organizationId");
    expect(getCreatedWorkflow.organizationId).toEqual(globalOrganization.id);

    workflow.name = workflow.name + "_UPDATED";
    let udpatedWorkflow = await workflows.updateWorkflow(
      entityManager,
      workflow
    );

    expect(udpatedWorkflow).toBeDefined();
    expect(udpatedWorkflow).toHaveProperty("id");
    expect(udpatedWorkflow.id).toBeGreaterThanOrEqual(1);
    expect(udpatedWorkflow).toHaveProperty("organizationId");
    expect(udpatedWorkflow.organizationId).toEqual(globalOrganization.id);
    expect(udpatedWorkflow).toHaveProperty("name");
    expect(udpatedWorkflow.name).toEqual(workflow.name);

    // reverting updated workflow name
    udpatedWorkflow.name = udpatedWorkflow.name.replace("_UPDATED", "");
    let newWorkflow = await workflows.updateWorkflow(
      entityManager,
      udpatedWorkflow
    );

    expect(newWorkflow).toBeDefined();
    expect(newWorkflow).toHaveProperty("id");
    expect(newWorkflow.id).toBeGreaterThanOrEqual(1);
    expect(newWorkflow).toHaveProperty("organizationId");
    expect(newWorkflow.organizationId).toEqual(globalOrganization.id);
    expect(newWorkflow).toHaveProperty("name");
    expect(newWorkflow.name).toEqual(udpatedWorkflow.name);
  });

  test("Create WorkflowProcess Test", async () => {
    const entityManager = getManager();

    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    const newWorkflowProcess = {
      name: "TEST_WORK_FLOW_PROCESS",
      description: "To be tested workflow process",
      workflowId: workflow.id
    };

    const createdWorkflowProcess = await workflowProcesses.createWorkflowProcess(
      entityManager,
      newWorkflowProcess
    );

    const workflowProcessKey = `${CACHING_KEYS.WORKFLOW_PROCESS_NAME}_${createdWorkflowProcess.name}_${workflow.id}`;
    const workflowProcessCache = await getValueFromCache(workflowProcessKey);

    expect(createdWorkflowProcess).toBeDefined();
    expect(createdWorkflowProcess).toHaveProperty("id");
    expect(createdWorkflowProcess.id).toBeGreaterThanOrEqual(1);
    expect(workflowProcessCache).toBeNull();

    let getCreatedWorkflowProcess = await workflowProcesses.getWorkflowProcess(
      entityManager,
      createdWorkflowProcess.id
    );

    expect(getCreatedWorkflowProcess).toBeDefined();
    expect(getCreatedWorkflowProcess).toHaveProperty("id");
    expect(getCreatedWorkflowProcess.id).toBeGreaterThanOrEqual(1);

    let getWorkflowProcessByName = await workflowProcesses.getWorkflowProcessesByName(
      entityManager,
      newWorkflowProcess.name,
      workflow.id
    );

    expect(getWorkflowProcessByName).toBeDefined();
    expect(getWorkflowProcessByName).toHaveProperty("id");
    expect(getWorkflowProcessByName.id).toBeGreaterThanOrEqual(1);
  });

  test("Update WorkflowProcess Test", async () => {
    const entityManager = getManager();

    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    const newWorkflowProcess = {
      name: "UPDATE_TEST_WORK_FLOW_PROCESS",
      description: "To be tested workflow process",
      workflowId: workflow.id
    };

    const createdWorkflowProcess = await workflowProcesses.createWorkflowProcess(
      entityManager,
      newWorkflowProcess
    );

    expect(createdWorkflowProcess).toBeDefined();
    expect(createdWorkflowProcess).toHaveProperty("id");
    expect(createdWorkflowProcess.id).toBeGreaterThanOrEqual(1);

    let getCreatedWorkflowProcess = await workflowProcesses.getWorkflowProcess(
      entityManager,
      createdWorkflowProcess.id
    );

    expect(getCreatedWorkflowProcess).toBeDefined();
    expect(getCreatedWorkflowProcess).toHaveProperty("id");
    expect(getCreatedWorkflowProcess.id).toBeGreaterThanOrEqual(1);

    let getWorkflowProcessByName = await workflowProcesses.getWorkflowProcessesByName(
      entityManager,
      newWorkflowProcess.name,
      workflow.id
    );

    expect(getWorkflowProcessByName).toBeDefined();
    expect(getWorkflowProcessByName).toHaveProperty("id");
    expect(getWorkflowProcessByName.id).toBeGreaterThanOrEqual(1);

    getWorkflowProcessByName.name = getWorkflowProcessByName.name + "_UPDATED";
    let updatedWorkflowProcess = await workflowProcesses.updateWorkflowProcess(
      entityManager,
      getWorkflowProcessByName
    );

    const updateWorkflowProcessKey = `${CACHING_KEYS.WORKFLOW_PROCESS_NAME}_${updatedWorkflowProcess.name}_${workflow.id}`;
    const updateWorkflowProcessCache = await getValueFromCache(
      updateWorkflowProcessKey
    );

    expect(updatedWorkflowProcess).toBeDefined();
    expect(updatedWorkflowProcess).toHaveProperty("id");
    expect(updatedWorkflowProcess).toHaveProperty("name");
    expect(updatedWorkflowProcess.name).toEqual(getWorkflowProcessByName.name);
    expect(updateWorkflowProcessCache).toBeNull();
  });

  test("Create WorkflowState test", async () => {
    const entityManager = getManager();

    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    const newWorkflowState = {
      name: "TEST_WORK_FLOW_STATE",
      code: "TEST_WORK_FLOW_STATE",
      description: "To be tested workflow state",
      workflowId: workflow.id
    };

    let createdWorkflowState = await workflowStates.createWorkflowState(
      entityManager,
      newWorkflowState
    );

    expect(createdWorkflowState).toBeDefined();
    expect(createdWorkflowState).toHaveProperty("id");
    expect(createdWorkflowState.id).toBeGreaterThanOrEqual(1);

    let getCreatedWorkflowState = await workflowStates.getWorkflowState(
      entityManager,
      workflow.id
    );

    expect(getCreatedWorkflowState).toBeDefined();
    expect(getCreatedWorkflowState).toHaveProperty("id");
    expect(getCreatedWorkflowState.id).toBeGreaterThanOrEqual(1);
    expect(getCreatedWorkflowState).toHaveProperty("name");
    expect(getCreatedWorkflowState.name).toEqual(newWorkflowState.name);

    // testing update
    getCreatedWorkflowState.name = newWorkflowState.name + "_UPDATED";
    let udpatedWorkflowState = await workflowStates.updateWorkflowState(
      entityManager,
      getCreatedWorkflowState
    );

    const updateStateKey = `${CACHING_KEYS.WORKFLOW_STATE}_${Number(
      udpatedWorkflowState.id
    )}`;
    const updateStateCache = await getValueFromCache(updateStateKey);

    expect(udpatedWorkflowState).toBeDefined();
    expect(udpatedWorkflowState).toHaveProperty("name");
    expect(udpatedWorkflowState.name).toEqual(
      newWorkflowState.name + "_UPDATED"
    );
    expect(updateStateCache).toBeNull();

    const newWorkflowState2 = {
      name: "TEST_WORK_FLOW_STATE_2",
      code: "TEST_WORK_FLOW_STATE_2",
      description: "To be tested workflow state",
      workflowId: workflow.id
    };

    let createdState2 = await workflowStates.createWorkflowState(
      entityManager,
      newWorkflowState2
    );

    expect(createdState2).toBeDefined();
    expect(createdState2).toHaveProperty("id");
    expect(createdState2.id).toBeGreaterThanOrEqual(1);
  });

  test("test getWorkflowStatesByWorkflowId", async () => {
    const entityManager = getManager();
    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    let workflowStatesByWorkflowId = await workflowStates.getWorkflowStatesByWorkflowId(
      entityManager,
      workflow.id
    );

    expect(workflowStatesByWorkflowId).toBeDefined();
    expect(workflowStatesByWorkflowId).toHaveProperty("length");
    expect(workflowStatesByWorkflowId.length).toBeGreaterThanOrEqual(2);
  });

  test("Create WorkflowProcessTransitions test", async () => {
    let entityManager = getManager();

    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    const newWorkflowStartState = {
      name: "TEST_WORK_FLOW_START",
      code: "TEST_WORK_FLOW_START",
      description: "To be tested workflow state",
      workflowId: workflow.id
    };

    let createdStartState = await workflowStates.createWorkflowState(
      entityManager,
      newWorkflowStartState
    );

    expect(createdStartState).toBeDefined();
    expect(createdStartState).toHaveProperty("id");
    expect(createdStartState.id).toBeGreaterThanOrEqual(1);

    const newWorkflowEndState = {
      name: "TEST_WORK_FLOW_END",
      code: "TEST_WORK_FLOW_END",
      description: "To be tested workflow state",
      workflowId: workflow.id
    };

    let createdEndState = await workflowStates.createWorkflowState(
      entityManager,
      newWorkflowEndState
    );

    expect(createdEndState).toBeDefined();
    expect(createdEndState).toHaveProperty("id");
    expect(createdEndState.id).toBeGreaterThanOrEqual(1);

    let getWorkflowProcessByName = await workflowProcesses.getWorkflowProcessesByName(
      entityManager,
      "TEST_WORK_FLOW_PROCESS",
      workflow.id
    );

    let newWorkflowProcessTransition = {
      name: "TEST_WORK_FLOW_PROCESS_TRANSITION",
      pickupStateId: createdStartState.id,
      dropStateId: createdEndState.id,
      ruleConfig: '{ "a": 1}',
      workflowProcessId: getWorkflowProcessByName.id
    };

    let createdWorkflowProcessTransition = await workflowProcessTransitions.createWorkflowProcessTransition(
      entityManager,
      newWorkflowProcessTransition
    );

    expect(createdWorkflowProcessTransition).toBeDefined();
    expect(createdWorkflowProcessTransition).toHaveProperty("id");
    expect(createdWorkflowProcessTransition.id).toBeGreaterThanOrEqual(1);

    let getWorkflowProcessTransition = await workflowProcessTransitions.getWorkflowProcessTransition(
      entityManager,
      createdWorkflowProcessTransition.id
    );

    expect(getWorkflowProcessTransition).toBeDefined();
    expect(getWorkflowProcessTransition).toHaveProperty("pickupStateId");
    expect(getWorkflowProcessTransition.pickupStateId).toBeDefined();
    expect(getWorkflowProcessTransition).toHaveProperty("dropStateId");
    expect(getWorkflowProcessTransition.dropStateId).toBeDefined();

    // testing update

    const newWorkflowAbortState = {
      name: "TEST_WORK_FLOW_ABORT",
      code: "TEST_WORK_FLOW_ABORT",
      description: "Abort workflow",
      workflowId: workflow.id
    };

    let createdAbortState = await workflowStates.createWorkflowState(
      entityManager,
      newWorkflowAbortState
    );

    expect(createdAbortState).toBeDefined();
    expect(createdAbortState).toHaveProperty("id");
    expect(createdAbortState.id).toBeDefined();

    getWorkflowProcessTransition.dropStateId = createdAbortState.id;

    let updatedWorkflowProcessTransition = await workflowProcessTransitions.updateWorkflowProcessTransition(
      entityManager,
      getWorkflowProcessTransition
    );

    const key = `${CACHING_KEYS.WORKFLOW_PROCESS_TRANSITION}_${updatedWorkflowProcessTransition.id}`;
    const workflowProcessCache = await getValueFromCache(key);

    expect(updatedWorkflowProcessTransition).toBeDefined();
    expect(updatedWorkflowProcessTransition).toHaveProperty("pickupStateId");
    expect(updatedWorkflowProcessTransition.pickupStateId).toBeDefined();
    expect(updatedWorkflowProcessTransition).toHaveProperty("dropStateId");
    expect(updatedWorkflowProcessTransition.dropStateId).toBeDefined();
    expect(updatedWorkflowProcessTransition.dropStateId).toEqual(
      createdAbortState.id
    );
    expect(workflowProcessCache).toBeNull();

    let workflowProcessTransitionsByWorkflowProcessId: any = await workflowProcessTransitions.getWorkflowTransitionByWProcessId(
      entityManager,
      getWorkflowProcessByName.id
    );

    expect(workflowProcessTransitionsByWorkflowProcessId).toBeDefined();
    expect(workflowProcessTransitionsByWorkflowProcessId).toHaveProperty(
      "length"
    );
    expect(
      workflowProcessTransitionsByWorkflowProcessId.length
    ).toBeGreaterThanOrEqual(1);
  });

  test("CreateWorkflowWithChildren test", async () => {
    const entityManager = getManager();

    const newWorkFlowWithChildren = {
      name: "WORK_FLOW_CHILDREN",
      description: "workflow with children",
      organizationId: globalOrganization.id,
      workflowProcesses: [
        {
          name: "TEST_WORK_FLOW_CHILDREN_PROCESS_1",
          description: "workflow process 1",
          workflowProcessTransitions: [
            {
              name: "TEST_WORK_FLOW_CHILDREN_PROCESS_TRANSITION_1",
              pickupStateName: "TEST_WORK_FLOW_CHILDREN_START",
              dropStateName: "TEST_WORK_FLOW_CHILDREN_END",
              ruleConfig: "{}"
            },
            {
              name: "TEST_WORK_FLOW_CHILDREN_PROCESS_TRANSITION_2",
              pickupStateName: "TEST_WORK_FLOW_CHILDREN_END",
              dropStateName: "TEST_WORK_FLOW_CHILDREN_ABORT",
              ruleConfig: "{}"
            }
          ]
        },
        {
          name: "TEST_WORK_FLOW_CHILDREN_PROCESS_2",
          description: "workflow process 2",
          workflowProcessTransitions: [
            {
              name: "TEST_WORK_FLOW_CHILDREN_PROCESS_2_TRANSITION_1",
              pickupStateName: "TEST_WORK_FLOW_CHILDREN_START",
              dropStateName: "TEST_WORK_FLOW_CHILDREN_END",
              ruleConfig: "{}"
            },
            {
              name: "TEST_WORK_FLOW_CHILDREN_PROCESS_2_TRANSITION_2",
              pickupStateName: "TEST_WORK_FLOW_CHILDREN_END",
              dropStateName: "TEST_WORK_FLOW_CHILDREN_ABORT",
              ruleConfig: "{}"
            },
            {
              name: "TEST_WORK_FLOW_CHILDREN_PROCESS_2_TRANSITION_3",
              pickupStateName: "TEST_WORK_FLOW_CHILDREN_ABORT",
              dropStateName: "TEST_WORK_FLOW_CHILDREN_START",
              ruleConfig: "{}"
            }
          ]
        }
      ],
      workflowStates: [
        {
          name: "TEST_WORK_FLOW_CHILDREN_START",
          code: "TEST_WORK_FLOW_CHILDREN_START",
          description: "Workflow state start"
        },
        {
          name: "TEST_WORK_FLOW_CHILDREN_END",
          code: "TEST_WORK_FLOW_CHILDREN_END",
          description: "Workflow state end"
        },
        {
          name: "TEST_WORK_FLOW_CHILDREN_ABORT",
          code: "TEST_WORK_FLOW_CHILDREN_ABORT",
          description: "Workflow state ABORT"
        }
      ]
    };

    let createdWorkflowWithChildren = await workflows.createWorkflowWithChildren(
      entityManager,
      newWorkFlowWithChildren
    );
    expect(createdWorkflowWithChildren).toBeDefined();
    expect(createdWorkflowWithChildren).toHaveProperty("id");
    expect(createdWorkflowWithChildren.id).toBeGreaterThanOrEqual(1);
    expect(createdWorkflowWithChildren).toHaveProperty("organizationId");
    expect(createdWorkflowWithChildren.organizationId).toEqual(
      globalOrganization.id
    );

    let foundWorkflowProcesses = await workflowProcesses.getWorkflowProcessesByWorkflowId(
      entityManager,
      createdWorkflowWithChildren.id
    );
    expect(foundWorkflowProcesses).toBeDefined();
    expect(foundWorkflowProcesses).toHaveProperty("length");
    expect(foundWorkflowProcesses.length).toEqual(2);

    for (let record in foundWorkflowProcesses) {
      let foundWorkflowProcess: any = foundWorkflowProcesses[record];
      expect(foundWorkflowProcess).toBeDefined();
      expect(foundWorkflowProcess).toHaveProperty("id");
      expect(foundWorkflowProcess.id).toBeDefined();

      let foundTransistions = await workflowProcessTransitions.getWorkflowTransitionByWProcessId(
        entityManager,
        foundWorkflowProcess.id
      );
      expect(foundTransistions).toBeDefined();
      expect(foundTransistions).toHaveProperty("length");
      expect(foundTransistions.length).toBeGreaterThanOrEqual(2);

      for (let childRecord in foundTransistions) {
        let transistion: any = foundTransistions[childRecord];
        expect(transistion).toBeDefined();
        expect(transistion).toHaveProperty("id");
        expect(transistion.id).toBeDefined();
      }
    }

    let foundWorkflowStates = await workflowStates.getWorkflowStatesByWorkflowId(
      entityManager,
      createdWorkflowWithChildren.id
    );
    expect(foundWorkflowStates).toBeDefined();
    expect(foundWorkflowStates).toHaveProperty("length");
    expect(foundWorkflowStates.length).toEqual(3);
  });

  // Workflow entity test cases
  test("CreateWorkflowEntity test", async () => {
    const entityManager = getManager();
    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );
    let newWorkflowEntity = {
      workflowId: workflow.id,
      entityId: 1,
      entityType: WORKFLOW_ENTITY_TYPE.CAMPAIGN
    };

    let workflowEntity = await workflowEntityService.createWorkflowEntity(
      entityManager,
      newWorkflowEntity
    );

    const key = `${CACHING_KEYS.WORKFLOW_ENTITY}_${newWorkflowEntity.entityType}_${workflowEntity.entityId}`;
    const entityCachedValue = await getValueFromCache(key);

    expect(workflowEntity).toBeDefined();
    expect(workflowEntity).toHaveProperty("id");
    expect(workflowEntity.id).toBeDefined();
    expect(workflowEntity).toHaveProperty("entityType");
    expect(workflowEntity.entityType).toBeDefined();
    expect(workflowEntity.entityType).toEqual(WORKFLOW_ENTITY_TYPE.CAMPAIGN);
    expect(workflowEntity).toHaveProperty("entityId");
    expect(workflowEntity.entityId).toBeDefined();
    expect(workflowEntity.entityId).toEqual(1);
    expect(entityCachedValue).toBeNull();
  });

  test("UpdateWorkflowEntity test", async () => {
    const entityManager = getManager();
    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );
    let newWorkflowEntity = {
      workflowId: workflow.id,
      entityId: 1,
      entityType: WORKFLOW_ENTITY_TYPE.CAMPAIGN
    };

    let workflowEntity = await workflowEntityService.createWorkflowEntity(
      entityManager,
      newWorkflowEntity
    );

    expect(workflowEntity).toBeDefined();
    expect(workflowEntity).toHaveProperty("id");
    expect(workflowEntity.id).toBeDefined();
    expect(workflowEntity).toHaveProperty("entityType");
    expect(workflowEntity.entityType).toBeDefined();
    expect(workflowEntity.entityType).toEqual(WORKFLOW_ENTITY_TYPE.CAMPAIGN);
    expect(workflowEntity).toHaveProperty("entityId");
    expect(workflowEntity.entityId).toBeDefined();
    expect(workflowEntity.entityId).toEqual(1);
    // update workflow entity
    workflowEntity.entityType = WORKFLOW_ENTITY_TYPE.OFFER;
    workflowEntity.entityId = "2";

    let updatedWorkflowEntity = await workflowEntityService.updateWorkflowEntity(
      entityManager,
      workflowEntity
    );

    expect(updatedWorkflowEntity).toBeDefined();
    expect(updatedWorkflowEntity).toHaveProperty("id");
    expect(updatedWorkflowEntity.id).toBeDefined();
    expect(updatedWorkflowEntity).toHaveProperty("entityType");
    expect(updatedWorkflowEntity.entityType).toBeDefined();
    expect(updatedWorkflowEntity.entityType).toEqual(
      WORKFLOW_ENTITY_TYPE.OFFER
    );
    expect(updatedWorkflowEntity).toHaveProperty("entityId");
    expect(updatedWorkflowEntity.entityId).toBeDefined();
    expect(updatedWorkflowEntity.entityId).toEqual("2");

    let foundWorkflowEntity = await workflowEntityService.getWorkflowEntity(
      entityManager,
      updatedWorkflowEntity.id
    );

    expect(foundWorkflowEntity).toBeDefined();
    expect(foundWorkflowEntity).toHaveProperty("id");
    expect(foundWorkflowEntity.id).toBeDefined();
    expect(foundWorkflowEntity).toHaveProperty("entityType");
    expect(foundWorkflowEntity.entityType).toBeDefined();
    expect(foundWorkflowEntity.entityType).toEqual(WORKFLOW_ENTITY_TYPE.OFFER);
    expect(foundWorkflowEntity).toHaveProperty("entityId");
    expect(foundWorkflowEntity.entityId).toBeDefined();
    expect(foundWorkflowEntity.entityId).toEqual("2");
  });

  // Workflow transistion

  test("addWorkflowEnityTransitionStatus test", async () => {
    const entityManager = getManager();

    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    // Creating work flow entity
    let newWorkflowEntity = {
      workflowId: workflow.id,
      entityId: 1,
      entityType: WORKFLOW_ENTITY_TYPE.CAMPAIGN
    };

    let workflowEntity = await workflowEntityService.createWorkflowEntity(
      entityManager,
      newWorkflowEntity
    );

    expect(workflowEntity).toBeDefined();
    expect(workflowEntity).toHaveProperty("id");
    expect(workflowEntity.id).toBeDefined();
    expect(workflowEntity).toHaveProperty("entityType");
    expect(workflowEntity.entityType).toBeDefined();
    expect(workflowEntity.entityType).toEqual(WORKFLOW_ENTITY_TYPE.CAMPAIGN);
    expect(workflowEntity).toHaveProperty("entityId");
    expect(workflowEntity.entityId).toBeDefined();
    expect(workflowEntity.entityId).toEqual(1);

    // creating workflow entity process transistion
    const newWorkflowStartState = {
      name: "WORK_FLOW_1_START",
      code: "WORK_FLOW_1_START",
      description: "To be tested workflow state",
      workflowId: workflow.id
    };

    let createdStartState = await workflowStates.createWorkflowState(
      entityManager,
      newWorkflowStartState
    );

    expect(createdStartState).toBeDefined();
    expect(createdStartState).toHaveProperty("id");
    expect(createdStartState.id).toBeGreaterThanOrEqual(1);

    const newWorkflowEndState = {
      name: "WORK_FLOW_1_END",
      code: "WORK_FLOW_1_END",
      description: "To be tested workflow state",
      workflowId: workflow.id
    };

    let createdEndState = await workflowStates.createWorkflowState(
      entityManager,
      newWorkflowEndState
    );

    expect(createdEndState).toBeDefined();
    expect(createdEndState).toHaveProperty("id");
    expect(createdEndState.id).toBeGreaterThanOrEqual(1);

    let getWorkflowProcessByName = await workflowProcesses.getWorkflowProcessesByName(
      entityManager,
      "TEST_WORK_FLOW_PROCESS",
      workflow.id
    );

    let newWorkflowProcessTransition = {
      name: "WORK_FLOW_PROCESS_TRANSITION_1",
      pickupStateId: createdStartState.id,
      dropStateId: createdEndState.id,
      ruleConfig: '{ "a": 1}',
      workflowProcessId: getWorkflowProcessByName.id
    };

    let createdWorkflowProcessTransition = await workflowProcessTransitions.createWorkflowProcessTransition(
      entityManager,
      newWorkflowProcessTransition
    );

    const workFlowkey = `${CACHING_KEYS.WORKFLOW_PROCESS_TRANSITION}_${createdWorkflowProcessTransition.id}`;
    const createValueCache = await getValueFromCache(workFlowkey);

    expect(createdWorkflowProcessTransition).toBeDefined();
    expect(createdWorkflowProcessTransition).toHaveProperty("id");
    expect(createdWorkflowProcessTransition.id).toBeGreaterThanOrEqual(1);
    expect(createValueCache).toBeNull();

    const newWorkflowentityTransistion = {
      workflowEntityId: workflowEntity.id,
      workflowProcessTransitionId: createdWorkflowProcessTransition.id
    };

    const createdWorkflowEntityTransition = await workflowEntityTransitionService.addWorkflowEnityTransitionStatus(
      entityManager,
      newWorkflowentityTransistion
    );

    const key = `${CACHING_KEYS.WORKFLOW_ENTITY_TRANSITION}_${createdWorkflowEntityTransition.workflowEntity.id}`;
    const cachedValue = await getValueFromCache(key);

    expect(createdWorkflowEntityTransition).toBeDefined();
    expect(createdWorkflowEntityTransition).toHaveProperty("id");
    expect(createdWorkflowEntityTransition.id).toBeDefined();
    expect(createdWorkflowEntityTransition).toHaveProperty("workflowEntity");
    expect(createdWorkflowEntityTransition.workflowEntity).toBeDefined();
    expect(createdWorkflowEntityTransition.workflowEntity).toHaveProperty("id");
    expect(createdWorkflowEntityTransition.workflowEntity.id).toBeDefined();

    expect(createdWorkflowEntityTransition).toHaveProperty(
      "workflowProcessTransition"
    );
    expect(
      createdWorkflowEntityTransition.workflowProcessTransition
    ).toBeDefined();
    expect(
      createdWorkflowEntityTransition.workflowProcessTransition
    ).toBeDefined();
    expect(
      createdWorkflowEntityTransition.workflowProcessTransition
    ).toHaveProperty("id");
    expect(
      createdWorkflowEntityTransition.workflowProcessTransition.id
    ).toBeDefined();
    expect(cachedValue).toBeNull();

    let workflowEntityTransition = await workflowEntityTransitionService.getWorkflowEntityTransition(
      entityManager,
      createdWorkflowEntityTransition.id
    );

    expect(workflowEntityTransition).toBeDefined();
    expect(workflowEntityTransition).toHaveProperty("id");
    expect(workflowEntityTransition.id).toBeDefined();
    expect(workflowEntityTransition.id).toEqual(
      createdWorkflowEntityTransition.id
    );

    let foundWorkflowEntityTransition = await workflowEntityTransitionService.getWorkflowEntityTransitionByEntityId(
      entityManager,
      workflowEntity.id
    );

    expect(foundWorkflowEntityTransition).toBeDefined();
    expect(foundWorkflowEntityTransition).toHaveProperty("id");
    expect(foundWorkflowEntityTransition.id).toBeDefined();
    expect(foundWorkflowEntityTransition).toHaveProperty(
      "workflowProcessTransition"
    );
    expect(
      foundWorkflowEntityTransition.workflowProcessTransition
    ).toBeDefined();
    expect(
      foundWorkflowEntityTransition.workflowProcessTransition
    ).toHaveProperty("id");
    expect(foundWorkflowEntityTransition.workflowProcessTransition.id).toEqual(
      createdWorkflowEntityTransition.workflowProcessTransition.id
    );

    // workflowEntityTransitionHistory.

    let foundWorkflowEntityTransistionHistory = await workflowEntityTransitionHistoryService.getWorkflowEntityTransitionHistory(
      entityManager,
      workflowEntity.id
    );

    expect(foundWorkflowEntityTransistionHistory).toBeDefined();
    expect(foundWorkflowEntityTransistionHistory).toHaveProperty("length");
    expect(foundWorkflowEntityTransistionHistory.length).toBeGreaterThanOrEqual(
      1
    );
  });

  // workflow route service test
  test("CreateWorkflowRoute test", async () => {
    let entityManager = getManager();
    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    let rule: WCoreEntities.Rule = WCoreEntities.Rule.create({
      name: "TestRule",
      ruleConfiguration: {},
      ruleExpression: {}
    });

    let createdWorkflowRoute = await workflowRouteService.createWorkflowRoute(
      entityManager,
      globalOrganization,
      WORKFLOW_ENTITY_TYPE.CAMPAIGN,
      rule,
      workflow,
      Status.Active
    );

    expect(createdWorkflowRoute).toBeDefined();
    expect(createdWorkflowRoute).toHaveProperty("id");
    expect(createdWorkflowRoute.id).toBeGreaterThanOrEqual(1);

    let foundWorkflowRoute = await workflowRouteService.getWorkflowRoute(
      entityManager,
      createdWorkflowRoute.id
    );

    expect(foundWorkflowRoute).toBeDefined();
    expect(foundWorkflowRoute).toHaveProperty("id");
    expect(foundWorkflowRoute.id).toEqual(createdWorkflowRoute.id);

    let foundWorkflowRoutes = await workflowRouteService.workflowRoutes(
      entityManager,
      globalOrganization.id,
      WORKFLOW_ENTITY_TYPE.CAMPAIGN,
      Status.Active
    );

    expect(foundWorkflowRoutes).toBeDefined();
    expect(foundWorkflowRoutes).toHaveProperty("length");
    expect(foundWorkflowRoutes.length).toBeGreaterThanOrEqual(1);
  });

  test("Update WorkflowRoute test", async () => {
    let entityManager = getManager();
    const workflow = await workflows.getWorkflowByName(
      entityManager,
      "TEST_WORK_FLOW",
      globalOrganization
    );

    let rule: WCoreEntities.Rule = WCoreEntities.Rule.create({
      name: "TestRule2",
      ruleConfiguration: {},
      ruleExpression: {}
    });

    let createdWorkflowRoute = await workflowRouteService.createWorkflowRoute(
      entityManager,
      globalOrganization,
      WORKFLOW_ENTITY_TYPE.OFFER,
      rule,
      workflow,
      Status.Inactive
    );

    expect(createdWorkflowRoute).toBeDefined();
    expect(createdWorkflowRoute).toHaveProperty("id");
    expect(createdWorkflowRoute.id).toBeGreaterThanOrEqual(1);

    expect(createdWorkflowRoute).toHaveProperty("status");
    expect(createdWorkflowRoute.status).toEqual(Status.Inactive);

    expect(createdWorkflowRoute).toHaveProperty("entityType");
    expect(createdWorkflowRoute.entityType).toEqual(WORKFLOW_ENTITY_TYPE.OFFER);

    let foundWorkflowRoute = await workflowRouteService.getWorkflowRoute(
      entityManager,
      createdWorkflowRoute.id
    );

    expect(foundWorkflowRoute).toBeDefined();
    expect(foundWorkflowRoute).toHaveProperty("id");
    expect(foundWorkflowRoute.id).toEqual(createdWorkflowRoute.id);

    let foundWorkflowRoutes = await workflowRouteService.workflowRoutes(
      entityManager,
      globalOrganization.id,
      WORKFLOW_ENTITY_TYPE.CAMPAIGN,
      Status.Active
    );

    expect(foundWorkflowRoutes).toBeDefined();
    expect(foundWorkflowRoutes).toHaveProperty("length");
    expect(foundWorkflowRoutes.length).toBeGreaterThanOrEqual(1);

    let updatedWorkflowRoute = await workflowRouteService.updateWorkflowRoute(
      entityManager,
      createdWorkflowRoute.id,
      WORKFLOW_ENTITY_TYPE.CAMPAIGN,
      rule,
      Status.Active
    );

    expect(updatedWorkflowRoute).toBeDefined();
    expect(updatedWorkflowRoute).toHaveProperty("id");
    expect(updatedWorkflowRoute.id).toEqual(createdWorkflowRoute.id);

    expect(updatedWorkflowRoute).toHaveProperty("status");
    expect(updatedWorkflowRoute.status).toEqual(Status.Active);

    expect(updatedWorkflowRoute).toHaveProperty("entityType");
    expect(updatedWorkflowRoute.entityType).toEqual(
      WORKFLOW_ENTITY_TYPE.CAMPAIGN
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
