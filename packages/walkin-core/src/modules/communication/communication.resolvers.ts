import { Injector } from "@graphql-modules/di";
import Mustache from "mustache";
import { getManager } from "typeorm";
import { Organizations } from "../account/organization/organization.providers";
import { STATUS, VARIABLE_FORMAT } from "../common/constants/constants";
import { CommunicationProvider } from "../communication/communication.providers";
import { WalkinPlatformError } from "./../common/exceptions/walkin-platform-error";
import { ModuleContext } from "@graphql-modules/core";
import { WCoreError } from "../common/exceptions/index";
import { CampaignProvider } from "../../../../walkin-rewardx/src/modules/campaigns/campaign.providers";
import { WCORE_ERRORS } from "../common/constants/errors";
import {
  MutationCreateMessageTemplateArgs,
  MutationCreateCommunicationArgs
} from "../../graphql/generated-models";
import { isValidMessageTemplate } from "../common/validations/Validations";
import { communicationModule } from "./communication.module";
import { setOrganizationToInput } from "../common/utils/utils";

export const resolvers = {
  Query: {
    messageTemplate: async (obj, args, { injector }: ModuleContext) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .getMessageTemplate(
            transactionalEntityManager,
            args.id,
            args.organization_id
          );
      });
    },
    messageTemplates: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        const organizationId =
          args.organization_id !== undefined ? args.organization_id : null;
        const status = args.status !== undefined ? args.status : null;
        const messageFormat =
          args.messageFormat !== undefined ? args.messageFormat : null;
        return injector
          .get(CommunicationProvider)
          .getMessageTemplates(
            transactionalEntityManager,
            organizationId,
            messageFormat,
            status
          );
      });
    },
    communication: async (
      _,
      args: { id: string; organizationId: string },
      { injector }: ModuleContext
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .getCommunication(
            transactionalEntityManager,
            args.id,
            args.organizationId
          );
      });
    },
    communications: async (obj, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const campaignId =
          args.campaignId !== undefined ? args.campaignId : undefined;
        const organizationId =
          args.organization_id !== undefined ? args.organization_id : undefined;

        if (organizationId && organizationId !== undefined) {
          const organization = await injector
            .get(Organizations)
            .getOrganization(transactionalEntityManager, args.organization_id);

          if (
            organization === undefined ||
            organization.status === STATUS.INACTIVE
          ) {
            throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
          }
        }

        if (campaignId && campaignId !== undefined) {
          const campaign = await injector
            .get(CampaignProvider)
            .getCampaign(transactionalEntityManager, campaignId);

          if (
            campaign === undefined ||
            campaign.campaignStatus === STATUS.INACTIVE
          ) {
            throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
          }
        }

        return injector
          .get(CommunicationProvider)
          .getCommunications(
            transactionalEntityManager,
            args.organization_id,
            args.entityId,
            args.status,
            args.entityType,
            args.campaignId
          );
      });
    },
    communicationLog: async (
      obj,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .getCommunicationLog(
            transactionalEntityManager,
            args.communicationLogId
          );
      });
    },
    communicationLogs: async (
      obj,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .getCommunicationLogs(
            transactionalEntityManager,
            args.communicationId
          );
      });
    }
  },
  Mutation: {
    disableCommunication: async (
      _,
      { id, organization },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .disableCommunication(transactionalEntityManager, id, organization);
      });
    },
    sendMessage: async (_, { input }, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager =>
        injector
          .get(CommunicationProvider)
          .sendMessage(transactionalEntityManager, input)
      );
    },
    createMessageTemplate: async (
      _,
      args: MutationCreateMessageTemplateArgs,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        let org = null;
        const organizationId: any =
          input.organization_id !== undefined ? input.organization_id : null;
        if (organizationId !== null) {
          org = await injector
            .get(Organizations)
            .getOrganization(transactionalEntityManager, organizationId);
          if (org !== undefined) {
            // pass
          } else {
            throw new WalkinPlatformError(
              "ORGANIZATION_INVALID",
              "Not a valid Organziation",
              organizationId,
              400,
              "Invalid organization_id."
            );
          }
        }
        await isValidMessageTemplate(transactionalEntityManager, input);

        const name: string = input.name !== undefined ? input.name : null;
        const description: string =
          input.description !== undefined ? input.description : null;
        const messageFormat: string =
          input.messageFormat !== undefined ? input.messageFormat : null;
        const templateBodyText: string =
          input.templateBodyText !== undefined ? input.templateBodyText : null;
        const templateSubjectText: string =
          input.templateSubjectText !== undefined
            ? input.templateSubjectText
            : null;
        const templateStyle: string =
          input.templateStyle !== undefined ? input.templateStyle : null;

        const url = input.url !== undefined ? input.url : null;
        const imageUrl = input.imageUrl !== undefined ? input.imageUrl : null;

        const status = input.status !== undefined ? input.status : null;
        const externalTemplateId =
          input.externalTemplateId !== undefined
            ? input.externalTemplateId
            : null;
        return injector
          .get(CommunicationProvider)
          .createMessageTemplate(
            transactionalEntityManager,
            name,
            description,
            messageFormat,
            templateBodyText,
            templateSubjectText,
            templateStyle,
            org,
            url,
            imageUrl,
            status,
            externalTemplateId
          );
      });
    },
    updateMessageTemplate: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        const input = args.input;
        const organizationId: string =
          input.organization_id !== undefined ? input.organization_id : null;
        const name: string = input.name !== undefined ? input.name : null;
        const description =
          input.description !== undefined ? input.description : null;
        const templateBodyText: string =
          input.templateBodyText !== undefined ? input.templateBodyText : null;
        const templateSubjectText: string =
          input.templateSubjectText !== undefined
            ? input.templateSubjectText
            : null;
        const templateStyle: string =
          input.templateStyle !== undefined ? input.templateStyle : null;
        const url = input.url !== undefined ? input.url : null;
        const imageUrl = input.imageUrl !== undefined ? input.imageUrl : null;
        const status = input.status !== undefined ? input.status : null;
        const externalTemplateId =
          input.externalTemplateId !== undefined
            ? input.externalTemplateId
            : null;
        return injector
          .get(CommunicationProvider)
          .updateMessageTemplate(
            transactionalEntityManager,
            input.id,
            organizationId,
            name,
            description,
            templateBodyText,
            templateSubjectText,
            templateStyle,
            url,
            imageUrl,
            status,
            externalTemplateId
          );
      });
    },
    createMessageTemplateVariable: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        let org = null;
        const organizationId: string =
          input.organization_id !== undefined ? input.organization_id : null;
        if (organizationId !== null) {
          org = await injector
            .get(Organizations)
            .getOrganization(transactionalEntityManager, organizationId);
          if (org !== undefined) {
            // pass
          } else {
            throw new WalkinPlatformError(
              "ORGANIZATION_INVALID",
              "Not a valid Organziation",
              organizationId,
              400,
              "Invalid organization_id."
            );
          }
        }
        const name: string = input.name !== undefined ? input.name : null;
        const key: string = input.key !== undefined ? input.key : null;
        const type: string = input.type !== undefined ? input.type : null;
        const format =
          input.format !== undefined
            ? input.format
            : VARIABLE_FORMAT.NO_FORMATING;
        const defaultValue: string =
          input.defaultValue !== undefined ? input.defaultValue : null;
        const required: string =
          input.required !== undefined ? input.required : null;
        const status: string = input.status !== undefined ? input.status : null;
        return injector
          .get(CommunicationProvider)
          .createMessageTemplateVariable(
            transactionalEntityManager,
            name,
            key,
            type,
            format,
            defaultValue,
            required,
            org,
            status
          );
      });
    },
    updateMessageTemplateVariable: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        const input = args.input;
        const organizationId: string =
          input.organization_id !== undefined ? input.organization_id : null;
        const name: string = input.name !== undefined ? input.name : null;
        const type: string = input.type !== undefined ? input.type : null;
        const format: string = input.format !== undefined ? input.format : null;
        const defaultValue: string =
          input.defaultValue !== undefined ? input.defaultValue : null;
        const required: boolean =
          input.required !== undefined ? input.required : null;
        const status: string = input.status !== undefined ? input.status : null;
        return injector
          .get(CommunicationProvider)
          .updateMessageTemplateVariable(
            transactionalEntityManager,
            input.id,
            organizationId,
            name,
            type,
            format,
            defaultValue,
            required,
            status
          );
      });
    },
    addVariableToMessageTemplate: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        const input = args.input;
        const organizationId =
          input.organization_id !== undefined ? input.organization_id : null;
        const templateId: string =
          input.templateId !== undefined ? input.templateId : null;
        const templateVariableId: string =
          input.templateVariableId !== undefined
            ? input.templateVariableId
            : null;

        return injector
          .get(CommunicationProvider)
          .addVariableToMessageTemplate(
            transactionalEntityManager,
            templateId,
            templateVariableId,
            organizationId
          );
      });
    },
    removeVariableFromMessageTemplate: (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        const input = args.input;
        const organizationId: string =
          input.organization_id !== undefined ? input.organization_id : null;
        const templateId: string =
          input.templateId !== undefined ? input.templateId : null;
        const templateVariableId =
          input.templateVariableId !== undefined
            ? input.templateVariableId
            : null;

        return injector
          .get(CommunicationProvider)
          .removeVariableFromMessageTemplate(
            transactionalEntityManager,
            templateId,
            templateVariableId,
            organizationId
          );
      });
    },
    formatMessage: async (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const organizationId =
          input.organization_id !== undefined ? input.organization_id : null;
        const templateId: string =
          input.templateId !== undefined ? input.templateId : null;

        const userVariables: any = input.variables;

        const messageTemplate = await injector
          .get(CommunicationProvider)
          .getMessageTemplate(
            transactionalEntityManager,
            templateId,
            organizationId
          );
        if (
          messageTemplate == null ||
          messageTemplate.status === STATUS.INACTIVE
        ) {
          throw new WalkinPlatformError(
            "TEMPLATE_INVALID",
            "Not a valid template or organization",
            templateId,
            400,
            "Invalid organization_id or template_id or template is inactive."
          );
        }

        const messageTemplateVariables =
          messageTemplate.messageTemplateVariables;

        if (messageTemplateVariables && messageTemplateVariables.length > 0) {
          // for (let i = 0; i < messageTemplateVariables.length; i++) {
          for (const messageTemplateVariable of messageTemplateVariables) {
            const v = messageTemplateVariable;
            const key = v.key;
            if (key in userVariables) {
              // exists, nothing to do
            } else {
              // doesnt exist
              const defaultValue: string =
                v.defaultValue !== undefined ? v.defaultValue : null;
              if (v.required) {
                // it is required
                if (defaultValue == null) {
                  throw new WalkinPlatformError(
                    "TEMPLATE_VARIABLE_REQUIRED",
                    "Template Variable or default value Required",
                    key,
                    400,
                    "Template Variable or default value Required {{" +
                    key +
                    "}}."
                  );
                } else {
                  userVariables[key] = defaultValue;
                }
              } else {
                // it is not required
                if (defaultValue == null) {
                  // pass
                } else {
                  userVariables[key] = defaultValue;
                }
              }
            }
          }
        }

        // finally userVariables and format. As of now we support only MUSTACHE templateStyle.
        // In future we might support other templaing styles.
        const templateStyle: string = messageTemplate.templateStyle;

        const bodyText = Mustache.render(
          messageTemplate.templateBodyText,
          userVariables
        );
        const subjectText = Mustache.render(
          messageTemplate.templateSubjectText,
          userVariables
        );

        return {
          templateId,
          templateStyle,
          variables: userVariables,
          bodyText,
          subjectText
        };
      });
    },
    createCommunication: async (
      _,
      args: MutationCreateCommunicationArgs,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        let org = null;
        if (!input.messageTemplateId) {
          throw new WCoreError(WCORE_ERRORS.CAMPAIGN_SETUP_INCOMPLETE);
        }
        const organizationId =
          input.organization_id !== undefined ? input.organization_id : null;
        if (organizationId !== null) {
          org = await injector
            .get(Organizations)
            .getOrganization(transactionalEntityManager, organizationId);
          if (org === undefined) {
            throw new WalkinPlatformError(
              "ORGANIZATION_INVALID",
              "Not a valid Organziation",
              organizationId,
              400,
              "Invalid organization_id."
            );
          }
        }
        let campaign = null;
        const entityId: string =
          input.entityId !== undefined ? input.entityId : null;
        const entityType: string =
          input.entityType !== undefined ? input.entityType : null;
        const isRepeatable: boolean =
          input.isRepeatable !== undefined ? input.isRepeatable : null;

        let messageTemplate = null;
        const messageTemplateId =
          input.messageTemplateId !== undefined
            ? input.messageTemplateId
            : null;
        if (messageTemplateId !== null) {
          messageTemplate = await injector
            .get(CommunicationProvider)
            .getMessageTemplate(
              transactionalEntityManager,
              messageTemplateId,
              organizationId
            );
          if (messageTemplate === undefined) {
            throw new WalkinPlatformError(
              "MESSAGETEMPLATE_INVALID",
              "Not a valid Message Template",
              messageTemplateId,
              400,
              "Invalid messageTemplateId."
            );
          }
        }
        const campaignId =
          input.campaign_id !== undefined ? input.campaign_id : null;
        if (campaignId !== null) {
          campaign = await injector
            .get(CampaignProvider)
            .getCampaign(transactionalEntityManager, campaignId);

          if (campaign === undefined || campaign.status === STATUS.INACTIVE) {
            throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_FOUND);
          }
        }

        if (input.isScheduled) {
          if (!input.firstScheduleDateTime) {
            // CHECK IF firstScheduledDateTime is given
            throw new WCoreError(WCORE_ERRORS.CAMPAIGN_NOT_SCHEDULED);
          } else {
            if (
              campaign &&
              !(
                new Date(input.firstScheduleDateTime) >= campaign.startTime &&
                new Date(input.lastProcessedDateTime) <= campaign.endTime
              )
            ) {
              throw new WCoreError(
                WCORE_ERRORS.COMMUNICATION_DATES_OUTFLOW_CAMPAIGN_DATES
              );
            }
          }
        }

        const isScheduled: boolean =
          input.isScheduled !== undefined ? input.isScheduled : null;
        const firstScheduleDateTime: Date =
          input.firstScheduleDateTime !== undefined
            ? input.firstScheduleDateTime
            : null;
        const lastProcessedDateTime: Date =
          input.lastProcessedDateTime !== undefined
            ? input.lastProcessedDateTime
            : new Date();
        const commsChannelName: string =
          input.commsChannelName !== undefined ? input.commsChannelName : null;
        const status: string = input.status !== undefined ? input.status : null;
        const repeatRuleConfiguration =
          input.repeatRuleConfiguration !== undefined
            ? input.repeatRuleConfiguration
            : null;

        return injector
          .get(CommunicationProvider)
          .createCommunication(
            transactionalEntityManager,
            entityId,
            entityType,
            messageTemplate,
            isScheduled,
            firstScheduleDateTime,
            isRepeatable,
            lastProcessedDateTime,
            repeatRuleConfiguration,
            commsChannelName,
            org,
            status,
            campaign
          );
      });
    },
    updateCommunication: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const isRepeatable =
          input.isRepeatable !== undefined ? input.isRepeatable : null;

        const entityId = input.entityId !== undefined ? input.entityId : null;
        const entityType =
          input.entityType !== undefined ? input.entityType : null;
        const isScheduled =
          input.isScheduled !== undefined ? input.isScheduled : null;
        const firstScheduleDateTime =
          input.firstScheduleDateTime !== undefined
            ? input.firstScheduleDateTime
            : null;
        const lastProcessedDateTime =
          input.lastProcessedDateTime !== undefined
            ? input.lastProcessedDateTime
            : null;
        const commsChannelName =
          input.commsChannelName !== undefined ? input.commsChannelName : null;
        const status = input.status !== undefined ? input.status : null;
        const repeatRuleConfiguration =
          input.repeatRuleConfiguration !== undefined
            ? input.repeatRuleConfiguration
            : null;
        return injector
          .get(CommunicationProvider)
          .updateCommunication(
            transactionalEntityManager,
            input.id,
            entityId,
            entityType,
            isScheduled,
            firstScheduleDateTime,
            isRepeatable,
            lastProcessedDateTime,
            repeatRuleConfiguration,
            commsChannelName,
            status
          );
      });
    },

    createCommunicationWithMessageTempate: async (
      root,
      args,
      { injector }: { injector: Injector },
      info
    ) =>
      getManager().transaction(async transactionalEntityManager => {
        let newCommunicationInput = {};
        const createMessageTemplate = info.schema
          .getType("Mutation")
          .getFields().createMessageTemplate;
        const messageTemplateData = await createMessageTemplate.resolve(
          root,
          { input: args.messageTemplateInput },
          { injector },
          info
        );
        console.log("messageTemplateData ", messageTemplateData);
        if (messageTemplateData) {
          newCommunicationInput = {
            ...args.communicationInput,
            messageTemplateId: messageTemplateData.id
          };
        }

        const createCommunication = info.schema.getType("Mutation").getFields()
          .createCommunication;
        const communicationData = await createCommunication.resolve(
          root,
          { input: newCommunicationInput },
          { injector },
          info
        );
        return communicationData;
      }),

    updateCommunicationWithMessageTempate: async (
      root,
      args,
      { injector }: { injector: Injector },
      info
    ) => {
      const updateMessageTemplate = info.schema.getType("Mutation").getFields()
        .updateMessageTemplate;
      const messageTemplateData = await updateMessageTemplate.resolve(
        root,
        { input: args.messageTemplateInput },
        { injector },
        info
      );
      const updateCommunication = info.schema.getType("Mutation").getFields()
        .updateCommunication;
      const communicationData = await updateCommunication.resolve(
        root,
        { input: args.communicationInput },
        { injector },
        info
      );
      return communicationData;
    },

    addCommunicationLog: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .addCommunicationLog(
            transactionalEntityManager,
            input.communicationId,
            input.startTime,
            input.runType,
            input.logMessage
          );
      });
    },

    updateCommunicationLog: async (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .updateCommunicationLog(
            transactionalEntityManager,
            input.communicationLogId,
            input.communicationStatus,
            input.logMessage
          );
      });
    },
    getMessageTemplateAndSendSMS: (
      _,
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CommunicationProvider)
          .getMessageTemplateAndSendSMS(
            transactionalEntityManager,
            injector,
            input
          );
      });
    },
    sendSupportMail: (
      { user, application },
      { input },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        input = setOrganizationToInput(input, user, application);
        input["user"] = user;
        return injector
          .get(CommunicationProvider)
          .sendSupportMail(
            transactionalEntityManager,
            injector,
            input
          );
      });
    }
  }
};

export default resolvers;
