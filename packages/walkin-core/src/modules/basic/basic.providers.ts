import { Injectable, Inject } from "@graphql-modules/di";
import {
  updateEntity,
  getCountForEntity
} from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import {
  RULE_TYPE,
  WORKFLOW_ENTITY_TYPE,
  DEFAULT_RULES,
  STATUS,
  DEFAULT_RULE_EXPRESSION,
  EXPRESSION_TYPE,
  VALUE_TYPE,
  DEFAULT_APP
} from "@walkinserver/walkin-core/src/modules/common/constants/constants";
import {
  Workflows,
  WorkflowStates,
  WorkflowProcesses,
  WorkflowProcessTransitions,
  WorkflowRouteService
} from "@walkinserver/walkin-core/src/modules/workflow/workflow.providers";
import {
  campaginWorkflowProcessConst,
  frameWorkflowProcessTransitionInput,
  frameWorkflowStatesInputs,
  WORKFLOW_DESCRIPTION,
  WORKFLOW_NAMES
} from "../common/constants/orgLevelSeedData";
import { RuleProvider } from "../../../../walkin-core/src/modules/rule/providers/rule.provider";
import { RuleAttributeProvider } from "../../../../walkin-core/src/modules/rule/providers/rule-attribute.provider";
import { RuleEntityProvider } from "../../../../walkin-core/src/modules/rule/providers/rule-entity.provider";
import { WalkinError } from "../../../../walkin-core/src/modules/common/exceptions/walkin-platform-error";
import { ApplicationProvider } from "@walkinserver/walkin-core/src/modules/account/application/application.providers";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "../../../../walkin-core/src/modules/common/constants/errors";

@Injectable()
export class BasicProvider {
  constructor(
    @Inject(RuleAttributeProvider)
    private ruleAttributeProvider: RuleAttributeProvider,
    @Inject(RuleEntityProvider)
    private ruleEntityProvider: RuleEntityProvider,
    @Inject(RuleProvider)
    private ruleProvider: RuleProvider
  ) {}

  public async initialise(transactionManager, org, injector) {
    const organizationId = org.id;

    // CREATE DEFAULT APPLICATION DURIING ORGANIZATION CREATION

    const applicationInput = {
      name: DEFAULT_APP.NAME,
      platform: DEFAULT_APP.PLATFORM,
      description: DEFAULT_APP.NAME,
      status: STATUS.ACTIVE,
      organization: org
    };

    const checkIfApplicationExists = await injector
      .get(ApplicationProvider)
      .getApplicationByName(
        transactionManager,
        applicationInput.name,
        organizationId
      );

    if (checkIfApplicationExists) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_ALREADY_EXISTS);
    }

    const application = await injector
      .get(ApplicationProvider)
      .createApplication(transactionManager, organizationId, applicationInput);
    if (application === undefined) {
      throw new WCoreError(WCORE_ERRORS.APPLICATION_NOT_FOUND);
    }

    /*
            CAMPAIGN RELATED WORKFLOW SETUP
            GQL: https://gitlab.com/WalkIn/walkin-server-monorepo/issues/308
        */

    console.log("--------Setting up campaign related workflow--------");

    await this.addCampaignWorkFlowSetup(transactionManager, injector, org);
    org.applications = [];

    org.applications.push(application);
    return org;
  }

  public async addBusinessRulesForCommunication(
    transactionalEntityManager,
    injector,
    organization
  ) {
    const createCommsRuleInputs = [
      {
        name: `${DEFAULT_RULES.DEFAULT}_${organization.id}${DEFAULT_RULES._COMMS_CHANNEL}`,
        description: `${DEFAULT_RULES.DEFAULT} _${organization.id} ${DEFAULT_RULES._COMMS_CHANNEL} `,
        type: RULE_TYPE.CUSTOM,
        organizationId: organization.id,
        ruleExpression: DEFAULT_RULE_EXPRESSION.ALWAYS_TRUE_RULE
      },
      {
        name: `${DEFAULT_RULES.DEFAULT} _${organization.id} ${DEFAULT_RULES._COMMS_AUTHORIZATION} `,
        description: `${DEFAULT_RULES.DEFAULT} _${organization.id} ${DEFAULT_RULES._COMMS_AUTHORIZATION} `,
        type: RULE_TYPE.CUSTOM,
        organizationId: organization.id,
        ruleExpression: DEFAULT_RULE_EXPRESSION.ALWAYS_TRUE_RULE
      }
    ];

    for (const commsRuleInput of createCommsRuleInputs) {
      await injector
        .get(RuleProvider)
        .createRule(transactionalEntityManager, injector, commsRuleInput);
    }
  }

  public async addCampaignWorkFlowSetup(
    transactionalEntityManager,
    injector,
    organization
  ) {
    const createWorkflowInput = {
      name: WORKFLOW_NAMES.DEFAULT_SIMPLE_CAMPAIGN_WORKFLOW,
      description: WORKFLOW_DESCRIPTION.THREE_STATE_WORKFLOW,
      organizationId: organization.id
    };
    const checkForWorkFlowInput = await injector
      .get(Workflows)
      .getWorkflowByName(
        transactionalEntityManager,
        createWorkflowInput.name,
        createWorkflowInput.organizationId
      );

    if (checkForWorkFlowInput) {
      throw new WalkinError(`${createWorkflowInput.name} already exists`);
    }

    // CREATE ONLY IF DEFAULT_SIMPLE_CAMPAIGN_WORKFLOW IS NOT PRESENT
    console.log("Creating campaign workflow..");

    const createWorkflowResponse = await injector
      .get(Workflows)
      .createWorkflow(transactionalEntityManager, createWorkflowInput);

    // CREATE WORKFLOW STATES
    console.log("Creating campaign workflow states..");

    if (createWorkflowResponse.id) {
      const createWorkflowStatesInputs = await frameWorkflowStatesInputs(
        createWorkflowResponse
      );
      for (const createWorkflowStatesInput of createWorkflowStatesInputs) {
        await injector
          .get(WorkflowStates)
          .createWorkflowState(
            transactionalEntityManager,
            createWorkflowStatesInput
          );
      }

      // CREATE WORKFLOW PROCESS
      console.log("Creating campaign workflow process..");

      const campaginWorkflowProcessConsts = Object.values(
        campaginWorkflowProcessConst[0]
      );
      const createWorkflowProcessInputs = campaginWorkflowProcessConsts.map(
        workflowConstant => {
          return {
            name: workflowConstant,
            description: workflowConstant,
            workflowId: createWorkflowResponse.id,
            organizationId: organization
          };
        }
      );

      const workflowProcessResponseNames = [];

      for (const createWorkflowProcessInput of createWorkflowProcessInputs) {
        const createWorkflowProcessResponse = await injector
          .get(WorkflowProcesses)
          .createWorkflowProcess(
            transactionalEntityManager,
            createWorkflowProcessInput
          );
        workflowProcessResponseNames.push(createWorkflowProcessResponse);
      }

      // CREATE WORKFLOW PROCESS TRANSISTION
      // CREATE RULE
      console.log("Creating campaign rule entity..");

      const createRuleEntityInput = {
        entityName: WORKFLOW_ENTITY_TYPE.CAMPAIGN,
        entityCode: WORKFLOW_ENTITY_TYPE.CAMPAIGN,
        organizationId: organization.id,
        status: STATUS.ACTIVE
      };
      let createRuleEntityResponse;
      const createRuleEntityExists = await this.ruleEntityProvider.ruleEntities(
        transactionalEntityManager,
        {
          entityName: WORKFLOW_ENTITY_TYPE.CAMPAIGN,
          organizationId: organization
        }
      );

      if (createRuleEntityExists.length > 0) {
        createRuleEntityResponse = createRuleEntityExists[0];
      } else {
        createRuleEntityResponse = await this.ruleEntityProvider.createRuleEntity(
          transactionalEntityManager,
          createRuleEntityInput
        );
      }

      if (createRuleEntityResponse.id) {
        const createRuleAttributeInput = {
          attributeName: "status",
          description: "",
          attributeValueType: VALUE_TYPE.STRING,
          ruleEntityId: createRuleEntityResponse.id,
          organizationId: organization.id,
          status: STATUS.ACTIVE
        };

        // CREATE RULE ATTRIBUTE
        let createRuleAttributeResponse;

        const createRuleAttributeResponseExists = await this.ruleAttributeProvider.ruleAttributes(
          transactionalEntityManager,
          {
            attributeName: "status",
            ruleEntity: createRuleEntityResponse.id,
            organization
          }
        );

        if (createRuleAttributeResponseExists.length > 0) {
          createRuleAttributeResponse = createRuleAttributeResponseExists[0];
        } else {
          createRuleAttributeResponse = await this.ruleAttributeProvider.createRuleAttribute(
            transactionalEntityManager,
            createRuleAttributeInput
          );
        }

        // CREATE SIMPLE RULE
        console.log("Creating campaign simple rule..");

        if (createRuleAttributeResponse.id) {
          const createSimpleRuleInput = {
            name: DEFAULT_RULES.STATUS_IS_ACTIVE,
            description: "",
            type: RULE_TYPE.SIMPLE,
            organizationId: organization.id,
            ruleConfiguration: {
              combinator: "and",
              rules: [
                {
                  ruleAttributeId: createRuleAttributeResponse.id,
                  expressionType: EXPRESSION_TYPE.EQUALS,
                  attributeValue: STATUS.ACTIVE
                }
              ]
            }
          };

          let createSimpleRuleResponse;

          const createRuleResponseExists = await this.ruleProvider.ruleByName(
            transactionalEntityManager,
            createSimpleRuleInput.name,
            organization.id
          );

          if (createRuleResponseExists !== undefined) {
            createSimpleRuleResponse = createRuleResponseExists;
          } else {
            createSimpleRuleResponse = await injector
              .get(RuleProvider)
              .createRule(
                transactionalEntityManager,
                injector,
                createSimpleRuleInput
              );
          }

          // CREATE WORKFLOW PROCESS TRANSITION
          console.log("Creating campaign workflow process transition..");

          const getWorkflowStates = await injector
            .get(WorkflowStates)
            .getWorkflowStatesByWorkflowId(
              transactionalEntityManager,
              createWorkflowResponse.id
            );
          if (getWorkflowStates.length > 0) {
            const createWorkflowProcessTransitionInputs: any = await frameWorkflowProcessTransitionInput(
              getWorkflowStates,
              createSimpleRuleResponse.id,
              workflowProcessResponseNames
            );
            for (const createWorkflowProcessTransitionInput of createWorkflowProcessTransitionInputs) {
              await injector
                .get(WorkflowProcessTransitions)
                .createWorkflowProcessTransition(
                  transactionalEntityManager,
                  createWorkflowProcessTransitionInput
                );
            }

            // CREATE CAMPAGIN RULE
            console.log("Creating campaign rule..");

            const createCampaignWorkflowRuleInput = {
              name: DEFAULT_RULES.CAMPAIGN_WORKFLOW_DETERMINATION,
              description: DEFAULT_RULES.CAMPAIGN_WORKFLOW_DETERMINATION,
              type: RULE_TYPE.CUSTOM,
              organizationId: organization.id,
              ruleExpression:
                DEFAULT_RULE_EXPRESSION.CHECK_REWARDX_CAMPAIGN_TYPE
            };
            const createCampaignWorkflowRuleResponse = await injector
              .get(RuleProvider)
              .createRule(
                transactionalEntityManager,
                injector,
                createCampaignWorkflowRuleInput
              );

            if (createCampaignWorkflowRuleResponse.id) {
              // CREATE WORKFLOW ROUTE FOR  CAMPAIGN
              console.log("Creating campaign workflow route..");

              const workflowRoutePriority = 0;

              return injector
                .get(WorkflowRouteService)
                .createWorkflowRoute(
                  transactionalEntityManager,
                  organization,
                  WORKFLOW_ENTITY_TYPE.CAMPAIGN,
                  createCampaignWorkflowRuleResponse.id,
                  createWorkflowResponse.id,
                  STATUS.ACTIVE,
                  workflowRoutePriority
                );
            }
          }
        }
      }
    }
  }
}

export default {
  BasicProvider: Injectable()(BasicProvider)
};
