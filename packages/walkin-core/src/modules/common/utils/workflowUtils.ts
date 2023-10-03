import {
  WalkinError,
  WalkinPlatformError
} from "../../common/exceptions/walkin-platform-error";
import { RuleProvider } from "../../rule/providers/rule.provider";
import {
  WorkflowEntityService,
  WorkflowEntityTransitionService,
  WorkflowProcesses,
  WorkflowProcessTransitions,
  WorkflowRouteService,
  WorkflowStates
} from "../../workflow/workflow.providers";
import { STATUS } from "../constants/constants";
import { Injector } from "@graphql-modules/di";

export async function getWorkflowForEntity(
  transactionalEntityManager,
  injector: Injector,
  organizationId,
  entityType,
  data
) {

  const workflowRoutes = await injector
    .get(WorkflowRouteService)
    .workflowRoutes(
      transactionalEntityManager,
      organizationId,
      entityType,
      STATUS.ACTIVE
    );
  let selectedWorkflow = null;
  data.organization = organizationId;
  if (workflowRoutes) {
    for (const route of workflowRoutes) {
      const result = await injector
        .get(RuleProvider)
        .evaluateRule(transactionalEntityManager, {
          ruleName: route.rule.name,
          data,
          organizationId
        });
      if (result) {
        // TODO https://gitlab.com/WalkIn/walkin-server-monorepo/issues/124
        const evaluationResults = result.evaluationResult as any;
        const isMatched = evaluationResults;
        if (isMatched) {
          selectedWorkflow = route.workflow;
          break;
        }
      }
    }
  }
  return selectedWorkflow;
}

export async function startTheEntityWorkflow(
  transactionalEntityManager,
  injector,
  processName,
  workflowId,
  entityType
) {
  // This is a special case. Where the workflow starts. Its usually from the NO STATE
  const currentStateName = "NO_STATE";
  const executeWorkflowProcesses = await injector
    .get(WorkflowProcesses)
    .getWorkflowProcessesByName(
      transactionalEntityManager,
      processName,
      workflowId
    );
  const nextWorkflowProcessTransitions = await injector
    .get(WorkflowProcessTransitions)
    .getWorkflowTransitionByWProcessId(
      transactionalEntityManager,
      executeWorkflowProcesses.id
    );

  const eligibleNextWorkflowProcessTransitions = [];

  for (
    let i = 0;
    nextWorkflowProcessTransitions && i < nextWorkflowProcessTransitions.length;
    i++
  ) {
    const possibleNextWorkflowProcessTransition =
      nextWorkflowProcessTransitions[i];

    const pickupState = await injector
      .get(WorkflowStates)
      .getWorkflowState(
        transactionalEntityManager,
        possibleNextWorkflowProcessTransition.pickupStateId
      );
    if (pickupState.name === currentStateName) {
      // check rules, campaign object willl be the only entity for rules checking.
      const rulesMatched = true;
      if (rulesMatched) {
        eligibleNextWorkflowProcessTransitions.push(
          possibleNextWorkflowProcessTransition
        );
      }
    }
  }

  if (eligibleNextWorkflowProcessTransitions.length === 0) {
    throw new WalkinPlatformError(
      "WRONG_PROCESS_SETUP",
      "Zero eligible process",
      nextWorkflowProcessTransitions,
      400,
      "No eligible process transitions."
    );
  }

  if (eligibleNextWorkflowProcessTransitions.length > 1) {
    throw new WalkinPlatformError(
      "WRONG_PROCESS_SETUP",
      "More than one eligible process",
      nextWorkflowProcessTransitions,
      400,
      "More than one eligible process transitions. Can't decide."
    );
  }

  const eligibleNextWorkflowProcessTransition =
    eligibleNextWorkflowProcessTransitions[0];
  const eligibleProcess = {
    workflowProcessTransitionId: eligibleNextWorkflowProcessTransition.id
  };
  return eligibleProcess;
}

export async function getEligibleProcessTransition(
  transactionalEntityManager,
  injector,
  processName,
  campaignId,
  entityType
) {
  // STEP1: Get a Entity and current state
  const workflowEntity = await injector
    .get(WorkflowEntityService)
    .workflowEntityByEntityDetails(
      transactionalEntityManager,
      campaignId,
      entityType
    );

  const workflowId = workflowEntity.workflowId;
  const workflowEntityId = workflowEntity.id;

  const workflowEntityTransition = await injector
    .get(WorkflowEntityTransitionService)
    .getWorkflowEntityTransitionByEntityId(
      transactionalEntityManager,
      workflowEntityId
    );

  const lastWorkflowProcessTransition = await injector
    .get(WorkflowProcessTransitions)
    .getWorkflowProcessTransition(
      transactionalEntityManager,
      workflowEntityTransition.workflowProcessTransitionId
    );

  const currentState = await injector
    .get(WorkflowStates)
    .getWorkflowState(
      transactionalEntityManager,
      lastWorkflowProcessTransition.dropStateId
    );

  // STEP2: Find the PROCESS transition. See if its picup state is current state

  const executeWorkflowProcesses = await injector
    .get(WorkflowProcesses)
    .getWorkflowProcessesByName(
      transactionalEntityManager,
      processName,
      workflowId
    );

  // GET THE NEXT PROCESS TRANSITION, IT CAN BE MORE THAN ONE
  const nextWorkflowProcessTransitions = await injector
    .get(WorkflowProcessTransitions)
    .getWorkflowTransitionByWProcessId(
      transactionalEntityManager,
      executeWorkflowProcesses.id
    );

  const eligibleNextWorkflowProcessTransitions = [];

  for (
    let i = 0;
    nextWorkflowProcessTransitions && i < nextWorkflowProcessTransitions.length;
    i++
  ) {
    const possibleNextWorkflowProcessTransition =
      nextWorkflowProcessTransitions[i];

    const pickupState = await injector
      .get(WorkflowStates)
      .getWorkflowState(
        transactionalEntityManager,
        possibleNextWorkflowProcessTransition.pickupStateId
      );
    if (pickupState.name === currentState.name) {
      // check rules, campaign object willl be the only entity for rules checking.
      const rulesMatched = true;
      if (rulesMatched) {
        eligibleNextWorkflowProcessTransitions.push(
          possibleNextWorkflowProcessTransition
        );
      }
    }
  }


  if (eligibleNextWorkflowProcessTransitions.length === 0) {
    throw new WalkinPlatformError(
      "WRONG_PROCESS_SETUP",
      "Zero eligible process",
      nextWorkflowProcessTransitions,
      400,
      "No eligible process transitions."
    );
  }

  if (eligibleNextWorkflowProcessTransitions.length > 1) {
    throw new WalkinPlatformError(
      "WRONG_PROCESS_SETUP",
      "More than one eligible process",
      nextWorkflowProcessTransitions,
      400,
      "More than one eligible process transitions. Can't decide."
    );
  }

  const eligibleNextWorkflowProcessTransition =
    eligibleNextWorkflowProcessTransitions[0];
  const returnObj = {
    workflowEntityId,
    workflowProcessTransitionId: eligibleNextWorkflowProcessTransition.id
  };


  return returnObj;
}
