import { includes, isEmpty } from "lodash";
import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import {
  Organization,
  Rule,
  WorkflowEntity,
  WorkflowEntityTransition,
  WorkflowEntityTransitionHistory,
  WorkflowRoute,
  WorkflowState,
  Workflow,
  WorkflowProcess,
  WorkflowProcessTransition
} from "../../entity";
import { CACHE_TTL, CACHING_KEYS, EXPIRY_MODE } from "../common/constants";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../common/utils/redisUtils";
import { validationDecorator } from "./../common/validations/Validations";
import { WCoreError } from "../common/exceptions";
// import { ORDERX_ERRORS } from "@walkinserver/walkin-orderx/src/common/constants/errors";
@Injectable()
export class Workflows {
  public async getWorkflow(
    entityManager: EntityManager,
    id: string
  ): Promise<Workflow> {
    return entityManager.findOne(Workflow, id);
  }
  public getAllWorkflows(entityManager: EntityManager): Promise<Workflow[]> {
    return entityManager.find(Workflow);
  }

  public async getOrgWorkflows(
    entityManager: EntityManager,
    organization: string
  ): Promise<Workflow[]> {
    return entityManager.find(Workflow, {
      where: {
        organization
      },
      relations: ["organization"]
    });
  }

  public async getWorkflowByName(
    entityManager: EntityManager,
    name: string,
    organizationId: string
  ): Promise<Workflow> {
    return entityManager.findOne(Workflow, {
      where: {
        name,
        organization: organizationId
      },
      relations: ["organization"]
    });
  }

  public async createWorkflow(
    entityManager: EntityManager,
    workflow: any
  ): Promise<Workflow> {
    const validationPromises = [];
    if (workflow.organizationId) {
      validationPromises.push(
        Organization.availableById(entityManager, workflow.organizationId)
      );
    }

    const createWorkflowPromise = (): Promise<Workflow> => {
      const newWorkflow: any = Workflow.create(workflow);
      newWorkflow.organization = Organization.create({
        id: workflow.organizationId
      });
      return entityManager.save(newWorkflow);
    };
    return validationDecorator(createWorkflowPromise, validationPromises);
  }

  public createWorkflowWithChildren(
    entityManager: EntityManager,
    workflow: any
  ): Promise<Workflow> {
    const validationPromises = [];
    if (workflow.organizationId) {
      validationPromises.push(
        Organization.availableById(entityManager, workflow.organizationId)
      );
    }

    const createWorkflowWithChildrenPromise = async (): Promise<Workflow> => {
      const newWorkflow: any = Workflow.create(workflow);
      newWorkflow.organization = Organization.create({
        id: workflow.organizationId
      });
      const savedWorkflow = await entityManager.save(newWorkflow);

      // Saving workflow states
      const savedWorkflowStates = {};
      for (const workflowState of workflow.workflowStates) {
        const newWorkflowState: any = WorkflowState.create(workflowState);
        newWorkflowState.workflow = savedWorkflow;
        const savedWorkflowState = await entityManager.save(newWorkflowState);
        savedWorkflowStates[workflowState.name] = savedWorkflowState;
      }

      // Saving workflow processes
      for (const workflowProcess of workflow.workflowProcesses) {
        const newWorkflowProcess: any = WorkflowProcess.create(workflowProcess);
        newWorkflowProcess.workflow = savedWorkflow;
        const savedWorkflowProcess = await entityManager.save(
          newWorkflowProcess
        );

        // Saving workflow process transistions
        for (const workflowProcessTransition of workflowProcess.workflowProcessTransitions) {
          const newWorkflowProcessTransition: any = WorkflowProcessTransition.create(
            workflowProcessTransition
          );
          newWorkflowProcessTransition.workflowProcess = savedWorkflowProcess;
          newWorkflowProcessTransition.pickupState =
            savedWorkflowStates[workflowProcessTransition.pickupStateName];
          newWorkflowProcessTransition.dropState =
            savedWorkflowStates[workflowProcessTransition.dropStateName];
          await entityManager.save(newWorkflowProcessTransition);
        }
      }
      return savedWorkflow;
    };
    return validationDecorator(
      createWorkflowWithChildrenPromise,
      validationPromises
    );
  }

  public updateWorkflow(
    entityManager: EntityManager,
    workflow: any
  ): Promise<Workflow> {
    const validationPromises = [];
    if (workflow.organizationId) {
      validationPromises.push(
        Organization.availableById(entityManager, workflow.organizationId)
      );
    }
    if (workflow.id) {
      validationPromises.push(
        Workflow.availableById(entityManager, workflow.id)
      );
    }

    const updateWorkflowPromise = async () => {
      const mergedWorkflow = await Workflow.preload({
        ...workflow,
        id: Number(workflow.id)
      });
      mergedWorkflow.organization = Organization.create({
        id: workflow.organizationId
      });
      return entityManager.save(mergedWorkflow);
    };

    return validationDecorator(updateWorkflowPromise, validationPromises);
  }
}

@Injectable()
// tslint:disable-next-line: max-classes-per-file
export class WorkflowProcesses {
  public getWorkflowProcess(
    entityManager: EntityManager,
    id: string
  ): Promise<WorkflowProcess> {
    return entityManager.findOne(WorkflowProcess, id);
  }

  public async getWorkflowProcessesByName(
    entityManager: EntityManager,
    name: string,
    workflowId
  ): Promise<WorkflowProcess> {
    console.log("WorkFlowProcessName name:", name);
    const key = `${CACHING_KEYS.WORKFLOW_PROCESS_NAME}_${name}_${workflowId}`;
    let workflowProcessName: any = await getValueFromCache(key);
    if (isEmpty(workflowProcessName) || workflowProcessName == null) {
      workflowProcessName = await entityManager.findOne(WorkflowProcess, {
        where: {
          name,
          workflow: workflowId
        }
      });
      console.log("WorkFlowProcessName id from db:", workflowProcessName?.id);
      if (workflowProcessName) {
        await setValueToCache(
          key,
          workflowProcessName,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return workflowProcessName;
  }

  public getWorkflowProcessesByWorkflowId(
    entityManager: EntityManager,
    workflowId: string
  ): Promise<WorkflowProcess[]> {
    return entityManager.find(WorkflowProcess, {
      where: {
        workflow: {
          id: workflowId
        }
      },
      relations: ["workflow"]
    });
  }

  public createWorkflowProcess(
    entityManager: EntityManager,
    workflowProcess: any
  ): Promise<WorkflowProcess> {
    const validationPromises = [];
    if (workflowProcess.workflowId) {
      validationPromises.push(
        Workflow.availableById(entityManager, workflowProcess.workflowId)
      );
    }

    const createWorkflowProcessPromise = (): Promise<WorkflowProcess> => {
      const newWorkflowProcess: any = WorkflowProcess.create(workflowProcess);
      const workflow = Workflow.create({
        id: workflowProcess.workflowId
      });
      newWorkflowProcess.workflow = workflow;
      const keys = [
        `${CACHING_KEYS.WORKFLOW_PROCESS_NAME}_${newWorkflowProcess.name}_${workflow.id}`
      ];
      console.log("WorkflowProcess Create keys", keys);
      removeValueFromCache(keys);
      return entityManager.save(newWorkflowProcess);
    };

    return validationDecorator(
      createWorkflowProcessPromise,
      validationPromises
    );
  }

  public updateWorkflowProcess(
    entityManager: EntityManager,
    workflowProcess: any
  ): Promise<WorkflowProcess> {
    const validationPromises = [];
    if (workflowProcess.workflowId) {
      validationPromises.push(
        Workflow.availableById(entityManager, workflowProcess.workflowId)
      );
    }
    if (workflowProcess.id) {
      validationPromises.push(
        WorkflowProcess.availableById(entityManager, workflowProcess.id)
      );
    }

    const updateWorkflowProcess = async (): Promise<WorkflowProcess> => {
      const mergedWorkflowProcess = await WorkflowProcess.preload({
        ...workflowProcess,
        id: Number(workflowProcess.id)
      });
      mergedWorkflowProcess.workflow = Workflow.create({
        id: workflowProcess.workflowId
      });
      const keys = [
        `${CACHING_KEYS.WORKFLOW_PROCESS_NAME}_${mergedWorkflowProcess.name}_${mergedWorkflowProcess.workflow.id}`
      ];
      console.log("WorkflowProcess update keys", keys);
      removeValueFromCache(keys);
      return entityManager.save(mergedWorkflowProcess);
    };
    return validationDecorator(updateWorkflowProcess, validationPromises);
  }
}

@Injectable()
// tslint:disable-next-line: max-classes-per-file
export class WorkflowStates {
  public async getWorkflowState(
    entityManager: EntityManager,
    id: string
  ): Promise<WorkflowState> {
    const workflowState = await entityManager.findOne(WorkflowState, {
      where: { id }
    });
    return workflowState;
  }

  public getWorkflowStatesByWorkflowId(
    entityManager: EntityManager,
    workflowId: string
  ): Promise<WorkflowState[]> {
    return entityManager.find(WorkflowState, {
      where: {
        workflow: {
          id: workflowId
        }
      },
      relations: ["workflow"]
    });
  }

  public createWorkflowState(
    entityManager: EntityManager,
    workflowState: any
  ): Promise<WorkflowState> {
    const validationPromises = [];
    if (workflowState.workflowId) {
      validationPromises.push(
        Workflow.availableById(entityManager, workflowState.workflowId)
      );
    }

    const createWorkflowStatePromise = (): Promise<WorkflowState> => {
      const newWorkflowState: any = WorkflowState.create(workflowState);
      newWorkflowState.workflow = Workflow.create({
        id: workflowState.workflowId
      });
      // const keys = [`${CACHING_KEYS.WORKFLOW_STATE}_${newWorkflowState.id}`]
      // console.log("WorkflowState Create keys", keys)
      // removeValueFromCache(keys)
      return entityManager.save(newWorkflowState);
    };

    return validationDecorator(createWorkflowStatePromise, validationPromises);
  }

  public updateWorkflowState(
    entityManager: EntityManager,
    workflowState: any
  ): Promise<WorkflowState> {
    const validationPromises = [];
    if (workflowState.workflowId) {
      validationPromises.push(
        Workflow.availableById(entityManager, workflowState.workflowId)
      );
    }
    if (workflowState.id) {
      validationPromises.push(
        WorkflowState.availableById(entityManager, workflowState.id)
      );
    }

    const updateWorkflowState = async (): Promise<WorkflowState> => {
      const mergedWorkflowState = await WorkflowState.preload({
        ...workflowState,
        id: Number(workflowState.id)
      });
      mergedWorkflowState.workflow = Workflow.create({
        id: workflowState.workflowId
      });
      // const keys = [`${CACHING_KEYS.WORKFLOW_STATE}_${Number(workflowState.id)}`]
      // console.log("WorkflowState Update keys", keys)
      // removeValueFromCache(keys)
      return entityManager.save(mergedWorkflowState);
    };
    return validationDecorator(updateWorkflowState, validationPromises);
  }
}

@Injectable()
// tslint:disable-next-line: max-classes-per-file
export class WorkflowProcessTransitions {
  public async getWorkflowProcessTransition(
    entityManager: EntityManager,
    id: string
  ): Promise<WorkflowProcessTransition> {
    const key = `${CACHING_KEYS.WORKFLOW_PROCESS_TRANSITION}_${id}`;
    console.log("WorkflowProcesDetails id:", id);
    let workflowProcessDetails: any = await getValueFromCache(key);
    if (isEmpty(workflowProcessDetails) || workflowProcessDetails == null) {
      workflowProcessDetails = await entityManager.findOne(
        WorkflowProcessTransition,
        id,
        {
          relations: ["pickupState", "dropState"]
        }
      );

      if (workflowProcessDetails) {
        await setValueToCache(
          key,
          workflowProcessDetails,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return workflowProcessDetails;
  }

  public async getWorkflowTransitionByWProcessId(
    entityManager: EntityManager,
    workflowProcessId: string
  ): Promise<WorkflowProcessTransition[]> {
    const res = await entityManager.find(WorkflowProcessTransition, {
      where: {
        workflowProcess: {
          id: workflowProcessId
        }
      },
      relations: ["pickupState", "dropState"]
    });
    return res;
  }

  public createWorkflowProcessTransition(
    entityManager: EntityManager,
    workflowTransition: any
  ): Promise<WorkflowProcessTransition> {
    const validationPromises = [];
    if (workflowTransition.workflowProcessId) {
      validationPromises.push(
        WorkflowProcess.availableById(
          entityManager,
          workflowTransition.workflowProcessId
        )
      );
    }
    if (workflowTransition.pickupStateId) {
      validationPromises.push(
        WorkflowState.availableById(
          entityManager,
          workflowTransition.pickupStateId
        )
      );
    }
    if (workflowTransition.dropStateId) {
      validationPromises.push(
        WorkflowState.availableById(
          entityManager,
          workflowTransition.dropStateId
        )
      );
    }

    const createWorkflowProcessTransitionPromise = (): Promise<
      WorkflowProcessTransition
    > => {
      const wfpt: any = WorkflowProcessTransition.create(workflowTransition);
      wfpt.pickupState = WorkflowState.create({
        id: workflowTransition.pickupStateId
      });
      wfpt.dropState = WorkflowState.create({
        id: workflowTransition.dropStateId
      });
      wfpt.workflowProcess = WorkflowProcess.create({
        id: workflowTransition.workflowProcessId
      });
      const keys = [`${CACHING_KEYS.WORKFLOW_PROCESS_TRANSITION}_${wfpt.id}`];
      console.log("WorkFlowProcTrans CRE keys", keys);
      removeValueFromCache(keys);
      return entityManager.save(wfpt);
    };

    return validationDecorator(
      createWorkflowProcessTransitionPromise,
      validationPromises
    );
  }

  public updateWorkflowProcessTransition(
    entityManager: EntityManager,
    workflowTransition: any
  ): Promise<WorkflowProcessTransition> {
    const validationPromises = [];
    if (workflowTransition.workflowProcessId) {
      validationPromises.push(
        WorkflowProcess.availableById(
          entityManager,
          workflowTransition.workflowProcessId
        )
      );
    }
    if (workflowTransition.pickupStateId) {
      validationPromises.push(
        WorkflowState.availableById(
          entityManager,
          workflowTransition.pickupStateId
        )
      );
    }
    if (workflowTransition.dropStateId) {
      validationPromises.push(
        WorkflowState.availableById(
          entityManager,
          workflowTransition.dropStateId
        )
      );
    }
    if (workflowTransition.id) {
      validationPromises.push(
        WorkflowProcessTransition.availableById(
          entityManager,
          workflowTransition.id
        )
      );
    }

    const updateWorkflowProcessTransitionPromise = async (): Promise<
      WorkflowProcessTransition
    > => {
      const mergedWorkflowProcessTransition = await WorkflowProcessTransition.preload(
        // tslint:disable-next-line:radix
        { ...workflowTransition, id: parseInt(workflowTransition.id) }
      );
      mergedWorkflowProcessTransition.workflowProcess = WorkflowProcess.create({
        id: workflowTransition.workflowProcessId
      });
      mergedWorkflowProcessTransition.pickupState = WorkflowState.create({
        id: workflowTransition.pickupStateId
      });
      mergedWorkflowProcessTransition.dropState = WorkflowState.create({
        id: workflowTransition.dropStateId
      });
      const keys = [
        `${CACHING_KEYS.WORKFLOW_PROCESS_TRANSITION}_${mergedWorkflowProcessTransition.id}`
      ];
      console.log("WorkflowProcTrans UP keys", keys);
      removeValueFromCache(keys);
      return entityManager.save(mergedWorkflowProcessTransition);
    };

    return validationDecorator(
      updateWorkflowProcessTransitionPromise,
      validationPromises
    );
  }
}

@Injectable()
// tslint:disable-next-line: max-classes-per-file
export class WorkflowEntityService {
  public async getWorkflowEntity(
    entityManager: EntityManager,
    id: string
  ): Promise<WorkflowEntity> {
    const x = await entityManager.findOne(WorkflowEntity, id, {
      relations: ["workflow"]
    });
    return x;
  }

  // public async getWorkflowByName(
  //   entityManager: EntityManager,
  //   name: string
  // ): Promise<WorkflowEntity> {
  //   const x = await entityManager.findOne(WorkflowEntity, name, {
  //     relations: ["workflow"]
  //   });
  //   return x;
  // }

  public async workflowEntityByEntityDetails(
    entityManager: EntityManager,
    entityId: string,
    entityType: string
  ): Promise<WorkflowEntity> {
    const key = `${CACHING_KEYS.WORKFLOW_ENTITY}_${entityType}_${entityId}`;
    let workflowEntityDetails: any = await getValueFromCache(key);
    if (isEmpty(workflowEntityDetails) || workflowEntityDetails == null) {
      workflowEntityDetails = await entityManager.findOne(WorkflowEntity, {
        where: {
          entityId,
          entityType
        },
        relations: ["workflow"]
      });

      if (workflowEntityDetails) {
        await setValueToCache(
          key,
          workflowEntityDetails,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      } else {
        throw new WCoreError({
          HTTP_CODE: 404,
          MESSAGE: "Workflow not found for this order",
          CODE: "WFNF"
        });
      }
    }
    return workflowEntityDetails;
  }

  public createWorkflowEntity(
    entityManager: EntityManager,
    workflowEntity: any
  ): Promise<WorkflowEntity> {
    const validationPromises = [];
    if (workflowEntity.workflowId) {
      validationPromises.push(
        Workflow.availableById(entityManager, workflowEntity.workflowId)
      );
    }

    const createWorkflowEntityPromise = (): Promise<WorkflowEntity> => {
      const newWorkflowEntity: any = WorkflowEntity.create(workflowEntity);
      newWorkflowEntity.workflow = Workflow.create({
        id: workflowEntity.workflowId
      });
      const keys = [
        `${CACHING_KEYS.WORKFLOW_ENTITY}_${newWorkflowEntity.entityType}_${newWorkflowEntity.entityId}`
      ];
      removeValueFromCache(keys);
      return entityManager.save(newWorkflowEntity);
    };

    return validationDecorator(createWorkflowEntityPromise, validationPromises);
  }

  public updateWorkflowEntity(
    entityManager: EntityManager,
    workflowEntity: any
  ): Promise<WorkflowEntity> {
    const validationPromises = [];
    if (workflowEntity.workflowId) {
      validationPromises.push(
        Workflow.availableById(entityManager, workflowEntity.workflowId)
      );
    }
    if (workflowEntity.id) {
      validationPromises.push(
        WorkflowEntity.availableById(entityManager, workflowEntity.id)
      );
    }

    const updateWorkflowEntityPromise = async (): Promise<WorkflowEntity> => {
      const mergedWorkflowEntity = await WorkflowEntity.preload({
        ...workflowEntity,
        id: Number(workflowEntity.id)
      });
      mergedWorkflowEntity.workflow = Workflow.create({
        id: workflowEntity.workflowId
      });
      const keys = [
        `${CACHING_KEYS.WORKFLOW_ENTITY}_${mergedWorkflowEntity.entityType}_${mergedWorkflowEntity.entityId}`
      ];
      console.log("WorkflowEntity update keys", keys);
      removeValueFromCache(keys);
      return entityManager.save(mergedWorkflowEntity);
    };
    return validationDecorator(updateWorkflowEntityPromise, validationPromises);
  }
}

@Injectable()
// tslint:disable-next-line: max-classes-per-file
export class WorkflowEntityTransitionService {
  public getWorkflowEntityTransition(
    entityManager: EntityManager,
    id: string
  ): Promise<WorkflowEntityTransition> {
    return entityManager.findOne(WorkflowEntityTransition, id);
  }

  public async getWorkflowEntityTransitionByEntityId(
    entityManager: EntityManager,
    entityId: string
  ): Promise<WorkflowEntityTransition> {
    const key = `${CACHING_KEYS.WORKFLOW_ENTITY_TRANSITION}_${entityId}`;
    let workflowEntityTransition: any = await getValueFromCache(key);

    if (isEmpty(workflowEntityTransition) || workflowEntityTransition == null) {
      const query = {
        where: { workflowEntity: { id: entityId } },
        relations: ["workflowProcessTransition"]
      };
      workflowEntityTransition = await entityManager.findOne(
        WorkflowEntityTransition,
        query
      );

      if (workflowEntityTransition) {
        await setValueToCache(
          key,
          workflowEntityTransition,
          EXPIRY_MODE.EXPIRE,
          CACHE_TTL
        );
      }
    }
    return workflowEntityTransition;
  }

  public addWorkflowEnityTransitionStatus(
    entityManager: EntityManager,
    workflowTransition: any
  ): Promise<WorkflowEntityTransition> {
    const validationPromises = [];
    // FIX: Fix this issue
    /*		if (workflowTransition.workflowEntityId) {
      validationPromises.push(
        WorkflowEntityService.getWorkflowEntity(
          workflowTransition.workflowEntityId
        )
      );
    }
    if (workflowTransition.workflowProcessTransitionId) {
      validationPromises.push(
        WorkflowProcessTransitions.getWorkflowProcessTransition(
          workflowTransition.workflowProcessTransitionId
        )
      );
    }
*/
    // WorkflowEntityTransition and WorkflowEnitityTransitionHistory both are same
    // but history contains all values , normal one contains latest value.

    const addWorkflowEnityTransitionStatusPromise = async (): Promise<
      WorkflowEntityTransition
    > => {
      return WorkflowEntityTransition.findOne({
        where: {
          workflowEntity: {
            id: workflowTransition.workflowEntityId
          }
        }
      })
        .then(async foundWorkflowTransition => {
          let result;
          if (foundWorkflowTransition) {
            foundWorkflowTransition.workflowEntity = await WorkflowEntity.create(
              {
                id: foundWorkflowTransition.workflowEntityId
              }
            );
            foundWorkflowTransition.workflowProcessTransition = await WorkflowProcessTransition.create(
              {
                id: workflowTransition.workflowProcessTransitionId
              }
            );
            result = await entityManager.save(
              WorkflowEntityTransition,
              foundWorkflowTransition
            );
            const keys = [
              `${CACHING_KEYS.WORKFLOW_ENTITY_TRANSITION}_${foundWorkflowTransition.workflowEntityId}`
            ];
            removeValueFromCache(keys);
          } else {
            const workflowEntityTransition = WorkflowEntityTransition.create(
              {}
            );
            workflowEntityTransition.workflowEntity = await WorkflowEntity.create(
              {
                id: workflowTransition.workflowEntityId
              }
            );
            workflowEntityTransition.workflowProcessTransition = await WorkflowProcessTransition.create(
              {
                id: workflowTransition.workflowProcessTransitionId
              }
            );
            result = await entityManager.save(
              WorkflowEntityTransition,
              workflowEntityTransition
            );
            const keys = [
              `${CACHING_KEYS.WORKFLOW_ENTITY_TRANSITION}_${workflowTransition.workflowEntityId}`
            ];
            removeValueFromCache(keys);
            foundWorkflowTransition = workflowEntityTransition;
          }

          const workflowEntityTransitionHistory = await WorkflowEntityTransitionHistory.create(
            {}
          );
          workflowEntityTransitionHistory.workflowEntity =
            foundWorkflowTransition.workflowEntity;
          workflowEntityTransitionHistory.workflowProcessTransition =
            foundWorkflowTransition.workflowProcessTransition;
          await entityManager.save(
            WorkflowEntityTransitionHistory,
            workflowEntityTransitionHistory
          );
          return result;
        })
        .catch(error => {
          throw error;
        });
    };

    return validationDecorator(
      addWorkflowEnityTransitionStatusPromise,
      validationPromises
    );
  }
}

@Injectable()
// tslint:disable-next-line: max-classes-per-file
export class WorkflowEntityTransitionHistoryService {
  public getWorkflowEntityTransitionHistory(
    entityManager: EntityManager,
    workflowEntityId: string
  ): Promise<WorkflowEntityTransitionHistory[]> {
    return entityManager.find(WorkflowEntityTransitionHistory, {
      where: {
        workflowEntity: {
          id: workflowEntityId
        }
      }
    });
  }
}

@Injectable()
// tslint:disable-next-line: max-classes-per-file
export class WorkflowRouteService {
  public getWorkflowRoute(
    entityManager: EntityManager,
    id: string
  ): Promise<WorkflowRoute> {
    const query: any = { id };
    const options: any = {};
    options.where = query;
    options.relations = ["rule", "workflow"];
    return entityManager.findOne(WorkflowRoute, options);
  }

  public async workflowRoutes(
    entityManager: EntityManager,
    organizationId: string,
    entityType: string,
    status: string
  ): Promise<WorkflowRoute[]> {
    const query: any = { organization: organizationId, status };
    if (entityType !== null) {
      query.entityType = entityType;
    }
    const options: any = {};
    options.where = query;
    options.order = {
      priority: "DESC"
    };
    options.relations = ["rule", "workflow", "organization"];
    const res: any = await entityManager.find(WorkflowRoute, options);
    return res;
  }

  public async createWorkflowRoute(
    entityManager: EntityManager,
    organization: Organization,
    entityType: string,
    rule: Rule,
    workflow: Workflow,
    status: string,
    priority?: number
  ): Promise<WorkflowRoute> {
    // Set default priority to 1, if no priority is given

    if (priority === undefined || priority === null) {
      priority = 1;
    }
    const workflowRouteSchema: any = {
      organization,
      entityType,
      workflow,
      rule,
      status,
      priority
    };
    const e = entityManager.create(WorkflowRoute, workflowRouteSchema);
    return entityManager.save(e);
  }

  public async updateWorkflowRoute(
    entityManager: EntityManager,
    id: string,
    entityType: string,
    rule: Rule,
    status: string
  ): Promise<WorkflowRoute> {
    const e = await entityManager.findOne(WorkflowRoute, id);
    if (entityType != null) {
      e.entityType = entityType;
    }
    if (rule != null) {
      e.rule = rule;
    }
    if (status != null) {
      e.status = status;
    }
    await entityManager.save(e);
    return this.getWorkflowRoute(entityManager, id);
  }
}
