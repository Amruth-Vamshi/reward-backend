import {
  WorkflowEntityService,
  WorkflowEntityTransitionHistoryService,
  WorkflowEntityTransitionService,
  WorkflowProcesses,
  WorkflowProcessTransitions,
  WorkflowRouteService,
  Workflows,
  WorkflowStates
} from "./workflow.providers";

import { Organizations } from "../account/organization/organization.providers";
import { RuleProvider } from "../rule/providers/rule.provider";

import { Injector } from "@graphql-modules/di";
import { getManager } from "typeorm";
import { STATUS } from "../common/constants/constants";
import { WalkinPlatformError } from "../common/exceptions/walkin-platform-error";
const resolvers = {
  Query: {
    workflow: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .getWorkflow(transactionalEntityManager, args.id);
      });
    },
    workflowByName: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .getWorkflowByName(transactionalEntityManager, args.name, args.organizationId);
      });
    },
    workflowDiagram: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const workflow = await injector
          .get(Workflows)
          .getWorkflow(transactionalEntityManager, args.id);
        let diagram = "graph TD;  ";
        diagram =
          diagram +
          "title[<b>" +
          workflow.id +
          "." +
          workflow.name +
          "</b><br/>";
        diagram = diagram + workflow.description;
        diagram = diagram + "];";

        const workflowProcesses = await injector
          .get(WorkflowProcesses)
          .getWorkflowProcessesByWorkflowId(
            transactionalEntityManager,
            args.id
          );
        if (workflowProcesses && workflowProcesses.length > 0) {
          for (let i = 0; i < workflowProcesses.length; i++) {
            const workflowProcesse = workflowProcesses[i];
            const workflowProcessesTransition = await injector
              .get(WorkflowProcessTransitions)
              .getWorkflowTransitionByWProcessId(
                transactionalEntityManager,
                workflowProcesse.id
              );

            if (
              workflowProcessesTransition &&
              workflowProcessesTransition.length > 0
            ) {
              for (let j = 0; j < workflowProcessesTransition.length; j++) {
                const transition = workflowProcessesTransition[j];
                const pickupState =
                  transition.pickupState.id + "." + transition.pickupState.name;

                diagram = diagram + pickupState + "((" + pickupState + "))";

                diagram =
                  diagram +
                  "--" +
                  workflowProcesse.id +
                  "." +
                  workflowProcesse.name +
                  "-->";

                const dropState =
                  transition.dropState.id + "." + transition.dropState.name;

                diagram = diagram + dropState + "((" + dropState + ")); ";

                // console.log("------------------------\n",transition);
              }
            }
          } // for workflowProcesses
        } // if workflowProcesses
        const result = {
          ...workflow,
          diagram
        };
        // console.log(workflowProcesses);
        return result;
      });
    },

    workflows: (_, __, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .getAllWorkflows(transactionalEntityManager);
      });
    },

    orgWorkflows: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .getOrgWorkflows(transactionalEntityManager, args.orgId);
      });
    },
    workflowProcess: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcesses)
          .getWorkflowProcess(transactionalEntityManager, args.id);
      });
    },
    workflowProcessByName: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcesses)
          .getWorkflowProcessesByName(transactionalEntityManager, args.name, args.workflowId);
      });
    },
    workflowProcesses: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcesses)
          .getWorkflowProcessesByWorkflowId(
            transactionalEntityManager,
            args.workflowId
          );
      });
    },
    workflowStates: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowStates)
          .getWorkflowStatesByWorkflowId(
            transactionalEntityManager,
            args.workflowId
          );
      });
    },
    workflowState: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowStates)
          .getWorkflowState(
            transactionalEntityManager,
            args.id
          );
      });
    },
    workflowProcessTransition: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            args.id
          );
      });
    },
    workflowProcessTransitions: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcessTransitions)
          .getWorkflowTransitionByWProcessId(
            transactionalEntityManager,
            args.workflowProcessId
          );
      });
    },
    workflowEntity: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityService)
          .getWorkflowEntity(transactionalEntityManager, args.id);
      });
    },
    workflowEntityByEntityDetails: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityService)
          .workflowEntityByEntityDetails(
            transactionalEntityManager,
            args.entityId,
            args.entityType
          );
      });
    },
    workflowEntityTransition: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityTransitionService)
          .getWorkflowEntityTransition(transactionalEntityManager, args.id);
      });
    },
    workflowEntityTransitionByEntityId: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityTransitionService)
          .getWorkflowEntityTransitionByEntityId(transactionalEntityManager, args.workflowEntityId);
      });
    },
    workflowEntityTransitionHistory: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityTransitionHistoryService)
          .getWorkflowEntityTransitionHistory(
            transactionalEntityManager,
            args.workflowEntityId
          );
      });
    },
    workflowRoute: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowRouteService)
          .getWorkflowRoute(transactionalEntityManager, args.id);
      });
    },
    workflowRoutes: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const organizationId = args.organizationId;
        const entityType = args.entityType;
        const status = STATUS.ACTIVE;
        const workflowRoutes = await injector
          .get(WorkflowRouteService)
          .workflowRoutes(
            transactionalEntityManager,
            organizationId,
            entityType,
            status
          );
        console.log(
          "workflowRoutesworkflowRoutesworkflowRoutesworkflowRoutesworkflowRoutes"
        );
        console.log(workflowRoutes);
        return workflowRoutes;
      });
    }
  },
  Mutation: {
    createWorkflow: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .createWorkflow(transactionalEntityManager, args.input);
      });
    },
    createWorkflowWithChildren: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .createWorkflowWithChildren(transactionalEntityManager, args.input);
      });
    },
    updateWorkflow: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .updateWorkflow(transactionalEntityManager, args.input);
      });
    },
    createWorkflowProcess: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcesses)
          .createWorkflowProcess(transactionalEntityManager, args.input);
      });
    },
    updateWorkflowProcess: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcesses)
          .updateWorkflowProcess(transactionalEntityManager, args.input);
      });
    },
    createWorkflowProcessTransition: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcessTransitions)
          .createWorkflowProcessTransition(
            transactionalEntityManager,
            args.input
          );
      });
    },
    updateWorkflowProcessTransition: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowProcessTransitions)
          .updateWorkflowProcessTransition(
            transactionalEntityManager,
            args.input
          );
      });
    },
    createWorkflowState: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowStates)
          .createWorkflowState(transactionalEntityManager, args.input);
      });
    },
    updateWorkflowState: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowStates)
          .updateWorkflowState(transactionalEntityManager, args.input);
      });
    },
    createWorkflowEntity: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityService)
          .createWorkflowEntity(transactionalEntityManager, args.input);
      });
    },
    updateWorkflowEntity: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityService)
          .updateWorkflowEntity(transactionalEntityManager, args.input);
      });
    },
    addWorkflowEnityTransitionStatus: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            args.input
          );
      });
    },

    createWorkflowRoute: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const organizationId =
          input.organizationId !== undefined ? input.organizationId : null;
        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, organizationId);
        const status = STATUS.ACTIVE;

        if (org !== undefined && org.status === STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "ORGANIZATION_INVALID",
            "Not a valid Organziation",
            organizationId,
            400,
            "Invalid organizationId."
          );
        }

        const entityType = input.entityType;
        const ruleId = input.ruleId !== undefined ? input.ruleId : null;

        const rule = await injector
          .get(RuleProvider)
          .rule(transactionalEntityManager, ruleId);

        if (rule !== undefined && rule.status === STATUS.ACTIVE) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "RULE_INVALID",
            "Not a valid Rule",
            ruleId,
            400,
            "Invalid rule_id or Rule is inactive."
          );
        }

        const workflowId =
          input.workflowId !== undefined ? input.workflowId : null;

        const workflow = await injector
          .get(Workflows)
          .getWorkflow(transactionalEntityManager, workflowId);
        console.log(
          "workflowworkflowworkflowworkflowworkflowworkflowworkflowworkflow"
        );
        console.log(workflow);

        if (workflow !== undefined) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "WORKFLOW_INVALID",
            "Not a valid Workflow",
            workflowId,
            400,
            "Invalid workflowId or Workflow is inactive."
          );
        }

        return injector
          .get(WorkflowRouteService)
          .createWorkflowRoute(
            transactionalEntityManager,
            org,
            entityType,
            rule,
            workflow,
            status
          );
      });
    },
    updateWorkflowRoute: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const id = input.id;
        const entityType =
          input.entityType !== undefined ? input.entityType : null;
        const status = input.status !== undefined ? input.status : null;

        const ruleId = input.ruleId !== undefined ? input.ruleId : null;
        let rule = null;
        if (ruleId) {
          rule = await injector
            .get(RuleProvider)
            .rule(transactionalEntityManager, ruleId);
          if (rule !== undefined && rule.status === STATUS.ACTIVE) {
            // pass
          } else {
            throw new WalkinPlatformError(
              "RULE_INVALID",
              "Not a valid Rule",
              ruleId,
              400,
              "Invalid rule_id or Rule is inactive."
            );
          }
        }

        return injector
          .get(WorkflowRouteService)
          .updateWorkflowRoute(
            transactionalEntityManager,
            id,
            entityType,
            rule,
            status
          );
      });
    }
  },
  Workflow: {
    organization: (workflow, _, { injector }: { injector: Injector }) => {
      if (workflow && workflow.organizationId) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(Organizations)
            .getOrganization(
              transactionalEntityManager,
              workflow.organizationId
            );
        });
      }
      return null;
    },
    workflowProcesses: (workflow, _, { injector }: { injector: Injector }) => {
      if (workflow && workflow.id) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowProcesses)
            .getWorkflowProcessesByWorkflowId(
              transactionalEntityManager,
              workflow.id
            );
        });
      }
      return null;
    }
  },

  WorkflowProcess: {
    workflow: (workflowProcess, _, { injector }: { injector: Injector }) => {
      if (workflowProcess && workflowProcess.workflowId) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(Workflows)
            .getWorkflow(
              transactionalEntityManager,
              workflowProcess.workflowId
            );
        });
      }
      return null;
    },
    workflowProcessTransitions: (
      workflowProcess,
      _,
      { injector }: { injector: Injector }
    ) => {
      if (workflowProcess) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowProcessTransitions)
            .getWorkflowTransitionByWProcessId(
              transactionalEntityManager,
              workflowProcess.id
            );
        });
      }
      return null;
    }
  },
  WorkflowProcessTransition: {
    pickupState: (
      workflowProcessTransition,
      _,
      { injector }: { injector: Injector }
    ) => {
      if (
        workflowProcessTransition &&
        workflowProcessTransition.pickupStateId
      ) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowStates)
            .getWorkflowState(
              transactionalEntityManager,
              workflowProcessTransition.pickupStateId
            );
        });
      }
      return null;
    },
    dropState: (
      workflowProcessTransition,
      _,
      { injector }: { injector: Injector }
    ) => {
      if (workflowProcessTransition && workflowProcessTransition.dropStateId) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowStates)
            .getWorkflowState(
              transactionalEntityManager,
              workflowProcessTransition.dropStateId
            );
        });
      }
      return null;
    }
  },
  WorkflowState: {
    workflow: (workflowState, _, { injector }: { injector: Injector }) => {
      if (workflowState && workflowState.workflowId) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(Workflows)
            .getWorkflow(transactionalEntityManager, workflowState.workflowId);
        });
      }
      return null;
    }
  },
  WorkflowEntity: {
    workflow: (parent, _, { injector }: { injector: Injector }) => {
      if (parent && parent.workflow && parent.workflow.id) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(Workflows)
            .getWorkflow(transactionalEntityManager, parent.workflow.id);
        });
      }
      return null;
    },
    currentTransition: (parent, _, { injector }: { injector: Injector }) => {
      if (parent && parent.id) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowEntityTransitionService)
            .getWorkflowEntityTransition(transactionalEntityManager, parent.id);
        });
      }
      return null;
    },
    transitionHistory: (parent, _, { injector }: { injector: Injector }) => {
      if (parent && parent.id) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowEntityTransitionHistoryService)
            .getWorkflowEntityTransitionHistory(
              transactionalEntityManager,
              parent.id
            );
        });
      }
    }
  },
  WorkflowEntityTransition: {
    workflowProcessTransition: (
      parent,
      _,
      { injector }: { injector: Injector }
    ) => {
      if (parent && parent.workflowProcessTransitionId) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowProcessTransitions)
            .getWorkflowProcessTransition(
              transactionalEntityManager,
              parent.workflowProcessTransitionId
            );
        });
      }
      return null;
    }
  },
  WorkflowEntityTransitionHistory: {
    workflowProcessTransition: (
      parent,
      _,
      { injector }: { injector: Injector }
    ) => {
      if (parent && parent.workflowProcessTransitionId) {
        return getManager().transaction(transactionalEntityManager => {
          return injector
            .get(WorkflowProcessTransitions)
            .getWorkflowProcessTransition(
              transactionalEntityManager,
              parent.workflowProcessTransitionId
            );
        });
      }
      return null;
    }
  },
  Organization: {
    workflows: (organization, _, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(Workflows)
          .getOrgWorkflows(transactionalEntityManager, organization.id);
      });
    }
  }
};

export default resolvers;
