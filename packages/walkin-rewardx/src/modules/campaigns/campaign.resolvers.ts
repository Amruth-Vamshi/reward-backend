import {
  WorkflowEntityService,
  WorkflowEntityTransitionService,
  WorkflowProcessTransitions
} from "../../../../walkin-core/src/modules/workflow/workflow.providers";
import { CampaignProvider } from "./campaign.providers";

import { getManager } from "typeorm";
import {
  STATUS,
  WORKFLOW_ENTITY_TYPE,
  CAMPAIGN_TRIGGER_TYPE,
  WORKFLOW_STATES,
  WALKIN_QUEUES
} from "../../../../walkin-core/src/modules/common/constants/constants";
import { WalkinPlatformError } from "../../../../walkin-core/src/modules/common/exceptions/walkin-platform-error";

import {
  getEligibleProcessTransition,
  getWorkflowForEntity,
  startTheEntityWorkflow
} from "../../../../walkin-core/src/modules/common/utils/workflowUtils";

import { Injector } from "@graphql-modules/di";
import { validateAndGetCampaignInputs } from "./utils/validation";
import {
  Campaign,
  MutationCreateCampaignArgs
} from "../../../../walkin-core/src/graphql/generated-models";
import { ModuleContext, Resolvers } from "@graphql-modules/core";
import { startAudienceCreationJob } from "../../../../walkin-core/src/modules/common/utils/digdagJobsUtil";
import { WCORE_ERRORS } from "../../../../walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "../../../../walkin-core/src/modules/common/exceptions";
import {
  isUserOrAppAuthorizedToWorkOnOrganization,
  setOrganizationToInput
} from "../../../../walkin-core/src/modules/common/utils/utils";
import { QueueProvider } from "../../../../walkin-core/src/modules/queueProcessor/queue.provider";

export const resolvers = {
  Query: {
    campaign: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, args.id);
      });
    },
    campaigns: (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        args = setOrganizationToInput(args, user, application);
        return injector
          .get(CampaignProvider)
          .getCampaigns(transactionalEntityManager, args, args.input.pageOptions);
      });
    }
  },
  Mutation: {
    createCampaign: async (
      { user, application },
      args: MutationCreateCampaignArgs,
      { injector }: { injector: Injector },
      info
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "createCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        // const PROCESS_NAME = "CREATE_CAMPAIGN";
        // const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;
        const input = args.input;
        // TODO: Calling util method to get the workflow.
        // Eventually workflowId should be taken from a configuration and should be removed from input

        // const campaignData = await validateAndGetCampaignInputs(
        //   transactionalEntityManager,
        //   injector,
        //   input
        // );
        // const campaingDataForRule = { Campaign: campaignData };
        // const workflow = await getWorkflowForEntity(
        //   transactionalEntityManager,
        //   injector,
        //   input.organization_id,
        //   entityType,
        //   campaingDataForRule
        // );
        // console.log("********************************************************");

        // if (workflow) {
        //   // pass
        //   console.log("Got a workflow");
        // } else {
        //   throw new WalkinPlatformError(
        //     "WORKFLOW_INVALID",
        //     "Not a valid workflow",
        //     null, // TODO:input.workflowId is not present in the typeDefs Fix this
        //     400,
        //     "Invalid workflowId or Workflow is inactive."
        //   );
        // }

        const campaign = await injector
          .get(CampaignProvider)
          .createCampaign(transactionalEntityManager, input, user, injector);

        // STEP3: Add new process transition history
        // const eligibleProcess: any = await startTheEntityWorkflow(
        //   transactionalEntityManager,
        //   injector,
        //   PROCESS_NAME,
        //   workflow.id,
        //   entityType
        // );
        // const workflowEntityInputs = {
        //   workflowId: workflow.id,
        //   entityId: campaign.id,
        //   entityType
        // };
        // console.log(
        //   "------------------------------------ workflowEntityInputs --------------------------------"
        // );
        // console.log("workflow", workflow);
        // console.log(workflowEntityInputs);
        // const workflowEntity = await injector
        //   .get(WorkflowEntityService)
        //   .createWorkflowEntity(
        //     transactionalEntityManager,
        //     workflowEntityInputs
        //   );
        // eligibleProcess.workflowEntityId = workflowEntity.id;
        // const destinationWorkflowEntityTransition = await injector
        //   .get(WorkflowEntityTransitionService)
        //   .addWorkflowEnityTransitionStatus(
        //     transactionalEntityManager,
        //     eligibleProcess
        //   );

        return campaign;
      });
    },
    updateCampaign: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "updateCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        // const PROCESS_NAME = "UPDATE_CAMPAIGN";
        const campaignId = args.id;
        // const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;
        let input = args.input;
        // STEP1: GET Eligible Process
        // const eligibleProcess = await getEligibleProcessTransition(
        //   transactionalEntityManager,
        //   injector,
        //   PROCESS_NAME,
        //   campaignId,
        //   entityType
        // );
        // STEP2: Do the actual work for this transition
        // STEP3: Step 2 is complete so.  Add new process transition history

        // await injector
        //   .get(WorkflowEntityTransitionService)
        //   .addWorkflowEnityTransitionStatus(
        //     transactionalEntityManager,
        //     eligibleProcess
        //   );

        // await injector
        //   .get(WorkflowProcessTransitions)
        //   .getWorkflowProcessTransition(
        //     transactionalEntityManager,
        //     eligibleProcess.workflowProcessTransitionId
        //   );

        input = setOrganizationToInput(input, user, application);
        const campaign = await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            input,
            injector
          );
        return campaign;
      });
    },
    updateCampaignStatus: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "updateCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        args = setOrganizationToInput(args, user, application);
        const { id, campaignStatus, organizationId } = args;
        const campaignData = {
          campaignStatus,
          organizationId
        };

        const campaign = await injector
          .get(CampaignProvider)
          .updateCampaignStatus(
            transactionalEntityManager,
            id,
            campaignData,
            injector
          );
        return campaign;
      });
    },
    updateCampaignSchedule: async (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "updateCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        input = setOrganizationToInput(input, user, application);
        await isUserOrAppAuthorizedToWorkOnOrganization(
          user,
          application,
          input.organizationId
        );
        const campaignSchedule = await injector
          .get(CampaignProvider)
          .updateCampaignSchedule(transactionalEntityManager, input, injector);
        return campaignSchedule;
      });
    },
    evaluateCampaignsForEvent: async (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (!application) {
          throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
        }

        input = setOrganizationToInput(input, user, application);
        return injector
          .get(CampaignProvider)
          .evaluateCampaignsForEvent(
            transactionalEntityManager,
            injector,
            input
          );
      });
    },
    launchCampaign: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "launchCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        const PROCESS_NAME = "LAUNCH_CAMPAIGN";

        const campaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, args.id);

        if (
          campaign === undefined ||
          campaign.campaignStatus === STATUS.INACTIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
        }

        const campaignId = args.id;
        const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;

        // STEP1: GET Eligible Process
        const eligibleProcess = await getEligibleProcessTransition(
          transactionalEntityManager,
          injector,
          PROCESS_NAME,
          campaignId,
          entityType
        );
        // STEP3: Step 2 is complete so.  Add new process transition history
        let destinationWorkflowEntityTransition: any = await injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            eligibleProcess
          );

        destinationWorkflowEntityTransition = await injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            eligibleProcess.workflowProcessTransitionId
          );

        const state = destinationWorkflowEntityTransition.dropState.name;

        const campaignData: Campaign = {
          id: args.id,
          campaignStatus: state
        };
        await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            campaignData,
            injector
          );

        const updatedCampaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);

        return updatedCampaign;
      });
    },

    preprocessLaunchCampaign: async (
      { jwt, user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "launchCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        let PROCESS_NAME = "PREPROCESS_LAUNCH_CAMPAIGN";

        const campaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, args.id);

        if (
          campaign === undefined ||
          campaign.campaignStatus === STATUS.INACTIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
        }

        const campaignId = args.id;
        const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;

        // STEP1: GET Eligible Process
        const eligibleProcess = await getEligibleProcessTransition(
          transactionalEntityManager,
          injector,
          PROCESS_NAME,
          campaignId,
          entityType
        );
        // STEP3: Step 2 is complete so.  Add new process transition history
        let destinationWorkflowEntityTransition: any = await injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            eligibleProcess
          );

        destinationWorkflowEntityTransition = await injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            eligibleProcess.workflowProcessTransitionId
          );

        const state = destinationWorkflowEntityTransition.dropState.name;

        const campaignData: Campaign = {
          id: args.id,
          campaignStatus: state
        };
        await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            campaignData,
            injector
          );

        const updatedCampaign = await injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);

        // If its a scheduled campaign, start creating the audience
        if (
          updatedCampaign.campaignTriggerType ===
          CAMPAIGN_TRIGGER_TYPE.SCHEDULED
        ) {
          try {
            await startAudienceCreationJob(
              updatedCampaign.organization.id,
              campaignId,
              jwt
            );
          } catch (error) {
            // TODO; Pager needs to be sent
            console.log("Error while calling digdag startAudienceCreationJob");
            console.log(error);
          }
        }

        return updatedCampaign;
      });
    },

    pauseCampaign: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "launchCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        const PROCESS_NAME = "PAUSE_CAMPAIGN";
        const campaignId = args.id;
        const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;

        // STEP1: GET Eligible Process
        const eligibleProcess = await getEligibleProcessTransition(
          transactionalEntityManager,
          injector,
          PROCESS_NAME,
          campaignId,
          entityType
        );
        // STEP2: Do the actual work for this transition
        // Pause communication??, As of now we dont have that functionality

        // STEP3: Step 2 is complete so.  Add new process transition history
        let destinationWorkflowEntityTransition: any = await injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            eligibleProcess
          );

        destinationWorkflowEntityTransition = await injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            eligibleProcess.workflowProcessTransitionId
          );

        const state = destinationWorkflowEntityTransition.dropState.name;

        const campaignData: Campaign = {
          id: args.id,
          campaignStatus: state
        };
        await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            campaignData,
            injector
          );

        return injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);
      });
    },
    unpauseCampaign: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "launchCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        const PROCESS_NAME = "UNPAUSE_CAMPAIGN";
        const campaignId = args.id;
        const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;

        // STEP1: GET Eligible Process
        const eligibleProcess = await getEligibleProcessTransition(
          transactionalEntityManager,
          injector,
          PROCESS_NAME,
          campaignId,
          entityType
        );
        // STEP2: Do the actual work for this transition

        // STEP3: Step 2 is complete so.  Add new process transition history
        let destinationWorkflowEntityTransition: any = await injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            eligibleProcess
          );

        destinationWorkflowEntityTransition = await injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            eligibleProcess.workflowProcessTransitionId
          );

        const state = destinationWorkflowEntityTransition.dropState.name;

        const campaignData: Campaign = {
          id: args.id,
          campaignStatus: state
        };
        await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            campaignData,
            injector
          );

        return injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);
      });
    },
    completeCampaign: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "launchCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        const PROCESS_NAME = "COMPLETE_CAMPAIGN";
        const campaignId = args.id;
        const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;
        // STEP1: GET Eligible Process
        const eligibleProcess = await getEligibleProcessTransition(
          transactionalEntityManager,
          injector,
          PROCESS_NAME,
          campaignId,
          entityType
        );
        // STEP2: Do the actual work for this transition

        // STEP3: Step 2 is complete so.  Add new process transition history
        let destinationWorkflowEntityTransition: any = await injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            eligibleProcess
          );

        destinationWorkflowEntityTransition = await injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            eligibleProcess.workflowProcessTransitionId
          );

        const state = destinationWorkflowEntityTransition.dropState.name;

        const campaignData: Campaign = {
          id: args.id,
          campaignStatus: state
        };
        await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            campaignData,
            injector
          );

        return injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);
      });
    },
    abandonCampaign: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "launchCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        const PROCESS_NAME = "ABANDON_CAMPAIGN";
        const campaignId = args.id;
        const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;

        // STEP1: GET Eligible Process
        const eligibleProcess = await getEligibleProcessTransition(
          transactionalEntityManager,
          injector,
          PROCESS_NAME,
          campaignId,
          entityType
        );
        // STEP2: Do the actual work for this transition

        // STEP3: Step 2 is complete so.  Add new process transition history
        let destinationWorkflowEntityTransition: any = await injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            eligibleProcess
          );

        destinationWorkflowEntityTransition = await injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            eligibleProcess.workflowProcessTransitionId
          );

        const state = destinationWorkflowEntityTransition.dropState.name;

        const campaignData: Campaign = {
          id: args.id,
          campaignStatus: state
        };
        await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            campaignData,
            injector
          );

        return injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);
      });
    },
    disableCampaign: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        if (user || application) {
          // pass
        } else {
          throw new WalkinPlatformError(
            "LOGIN_REQUIRED",
            "Login Required. Auth Failed.",
            "launchCampaign",
            400,
            "Login Required. Auth Failed."
          );
        }

        const PROCESS_NAME = "LAUNCH_CAMPAIGN";
        const campaignId = args.id;
        const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;

        // STEP1: GET Eligible Process
        const eligibleProcess = await getEligibleProcessTransition(
          transactionalEntityManager,
          injector,
          PROCESS_NAME,
          campaignId,
          entityType
        );
        // STEP2: Do the actual work for this transition. Make it INACTIVE
        const c = await injector.get(CampaignProvider).updateCampaign(
          transactionalEntityManager,
          args.id,
          {
            ...args,
            status: STATUS.INACTIVE
          },
          injector
        );

        // STEP3: Step 2 is complete so.  Add new process transition history
        let destinationWorkflowEntityTransition: any = await injector
          .get(WorkflowEntityTransitionService)
          .addWorkflowEnityTransitionStatus(
            transactionalEntityManager,
            eligibleProcess
          );

        destinationWorkflowEntityTransition = await injector
          .get(WorkflowProcessTransitions)
          .getWorkflowProcessTransition(
            transactionalEntityManager,
            eligibleProcess.workflowProcessTransitionId
          );

        const state = destinationWorkflowEntityTransition.dropState.name;

        const campaignData: Campaign = {
          id: args.id,
          campaignStatus: state
        };
        await injector
          .get(CampaignProvider)
          .updateCampaign(
            transactionalEntityManager,
            campaignId,
            campaignData,
            injector
          );

        return injector
          .get(CampaignProvider)
          .getCampaign(transactionalEntityManager, campaignId);
      });
    },
    linkCampaignToApplication: async (
      { user, application },
      input,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        injector
          .get(CampaignProvider)
          .linkCampaignToApplication(transactionManager, {
            input
          });
      }),
    unlinkCampaignFromApplication: async (
      { user, application },
      input,
      { injector }: ModuleContext
    ) =>
      getManager().transaction(async transactionManager => {
        input = setOrganizationToInput(input, user, application);
        injector
          .get(CampaignProvider)
          .unlinkCampaignFromApplication(transactionManager, {
            input
          });
      }),
    jobManageEndedCampaigns: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        // Get all the campaings that we think need to be marked as complete
        const campaignsThatNeedToBeClosed = await injector
          .get(CampaignProvider)
          .getEndedButNotClosedCampaigns(transactionalEntityManager);
        // now go through the process to complete them
        // TODO What happens if the workflow doesnt have a logical complete?
        for (const campaign of campaignsThatNeedToBeClosed) {
          const PROCESS_NAME = "COMPLETE_CAMPAIGN";
          const campaignId = campaign.id;
          const entityType = WORKFLOW_ENTITY_TYPE.CAMPAIGN;
          // STEP1: GET Eligible Process
          try {
            const eligibleProcess = await getEligibleProcessTransition(
              transactionalEntityManager,
              injector,
              PROCESS_NAME,
              campaignId,
              entityType
            );
            let destinationWorkflowEntityTransition: any = await injector
              .get(WorkflowEntityTransitionService)
              .addWorkflowEnityTransitionStatus(
                transactionalEntityManager,
                eligibleProcess
              );
            destinationWorkflowEntityTransition = await injector
              .get(WorkflowProcessTransitions)
              .getWorkflowProcessTransition(
                transactionalEntityManager,
                eligibleProcess.workflowProcessTransitionId
              );
            const state = destinationWorkflowEntityTransition.dropState.name;
            const campaignData: Campaign = {
              id: campaignId,
              campaignStatus: state
            };
            await injector
              .get(CampaignProvider)
              .updateCampaign(
                transactionalEntityManager,
                campaignId,
                campaignData,
                injector
              );
          } catch (e) {
            // If there is no eligibile process, it throws error hence we continue with rest of the updates
            continue;
          }
        }
        return true;
      });
    },
    expireCampaigns: async (
      { user, application },
      args,
      { injector }
    ) => {
      return getManager().transaction(async transactionManager => {
        args = setOrganizationToInput(args, user, application);
        return injector
          .get(CampaignProvider)
          .expireCampaigns(transactionManager, args.organizationId);
      })
    }
  }
};
