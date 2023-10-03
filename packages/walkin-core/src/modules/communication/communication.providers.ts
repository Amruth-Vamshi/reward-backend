import { EntityManager } from "typeorm";
import {
  MessageTemplate,
  MessageTemplateVariable,
  Organization,
  Communication,
  CommunicationLog
} from "../../entity";
import { QueueProvider } from "../queueProcessor/queue.provider";

import {
  STATUS,
  COMMUNICATION_STATUS,
  WALKIN_QUEUES,
  SUPPORT_MAIL_CONFIGURATION
} from "../../../../walkin-core/src/modules/common/constants/constants";
import { Inject } from "@graphql-modules/di";
import { WCoreError } from "../common/exceptions";
import { WCORE_ERRORS } from "../common/constants/errors";
import CommsAxiosConfig from "../../jobs/utils/CommsConfig";
import {
  generateSupportMailContent,
  getUTCTimeFromLocalTime,
  validateSupportEmailInput
} from "../common/utils/utils";
import nodemailer from "nodemailer";
import { SupportRequest } from "../../../../walkin-rewardx/src/entity/support-request";
import sanitizeHtml from "sanitize-html";
export class CommunicationProvider {
  constructor(
    @Inject(QueueProvider)
    private QueueProviderService: QueueProvider
  ) {}
  public async disableCommunication(
    entityManager: EntityManager,
    id: string,
    organization: string
  ): Promise<Communication> {
    let comsData = await this.getCommunication(entityManager, id, organization);
    if (comsData.status === STATUS.ACTIVE) {
      comsData.status = STATUS.INACTIVE;
    }
    comsData = await entityManager.save(comsData);
    return this.getCommunication(entityManager, id, organization);
  }

  public async getMessageTemplate(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<MessageTemplate> {
    const query: any = { organizationId, id };
    const options: any = {};
    options.where = query;
    options.relations = ["organization", "messageTemplateVariables"];
    return entityManager.findOne(MessageTemplate, options);
  }

  public async getMessageTemplates(
    entityManager: EntityManager,
    organizationId: string,
    messageFormat: string,
    status: string
  ): Promise<MessageTemplate[]> {
    const query: any = { organizationId };
    if (status !== null) {
      query.status = status;
    }
    if (messageFormat !== null) {
      query.messageFormat = messageFormat;
    }
    const options: any = {};
    options.where = query;
    options.relations = ["organization", "messageTemplateVariables"];
    return entityManager.find(MessageTemplate, options);
  }

  public async createMessageTemplate(
    entityManager: EntityManager,
    name: string,
    description: string,
    messageFormat: string,
    templateBodyText: string,
    templateSubjectText: string,
    templateStyle: string,
    org: Organization,
    url: string,
    imageUrl: string,
    status: string,
    externalTemplateId: string = null
  ): Promise<MessageTemplate> {
    // templates are http://mustache.github.io/
    const messageTemplateSchema: any = {
      name,
      description,
      messageFormat,
      templateBodyText,
      templateSubjectText,
      templateStyle,
      messageTemplateVariables: [],
      organization: org,
      url,
      imageUrl,
      status,
      externalTemplateId
    };
    const e = entityManager.create(MessageTemplate, messageTemplateSchema);
    return entityManager.save(e);
  }

  public async updateMessageTemplate(
    entityManager: EntityManager,
    id: string,
    organizationId: string,
    name: string,
    description: string,
    templateBodyText: string,
    templateSubjectText: string,
    templateStyle: string,
    url: string,
    imageUrl: string,
    status: string,
    externalTemplateId: string = null
  ): Promise<MessageTemplate> {
    let e = await this.getMessageTemplate(entityManager, id, organizationId);
    if (name !== null) {
      e.name = name;
    }
    if (description !== null) {
      e.description = description;
    }
    if (templateBodyText !== null) {
      e.templateBodyText = templateBodyText;
    }
    if (templateSubjectText !== null) {
      e.templateSubjectText = templateSubjectText;
    }
    if (templateStyle != null) {
      e.templateStyle = templateStyle;
    }
    if (url !== null) {
      e.url = url;
    }
    if (imageUrl !== null) {
      e.imageUrl = imageUrl;
    }
    if (status !== null) {
      e.status = status;
    }
    if (externalTemplateId !== null) {
      e.externalTemplateId = externalTemplateId;
    }
    e = await entityManager.save(e);
    return this.getMessageTemplate(entityManager, id, organizationId);
  }

  public async getMessageTemplateVariable(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ) {
    const query: any = { organizationId, id };
    const options: any = {};
    options.where = query;
    options.relations = ["organization"];
    return entityManager.findOne(MessageTemplateVariable, options);
  }

  public async sendMessage(
    entityManager: EntityManager,
    input: ISendMessageInput
  ) {
    let comsData: ICommsSMSBody | ICommsPushBody | ICommsEmailBody;

    if (!input.user_id) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }

    switch (input.format) {
      case "sms":
        comsData = this.formatSMSdata(input);
        break;
      case "push":
        comsData = this.formatPushData(input);
        break;
      case "email":
        comsData = this.formatEmaildata(input);
        break;
      default:
        throw new WCoreError(WCORE_ERRORS.MESSAGE_FORMAT_NOT_CONFIGURED);
    }
    return this.QueueProviderService.addToQueue(
      WALKIN_QUEUES.WALKIN_COMMS_QUEUE,
      comsData
    );
  }

  public async createMessageTemplateVariable(
    entityManager: EntityManager,
    name: string,
    key: string,
    type: string,
    format: string,
    defaultValue: string,
    required: string,
    org: Organization,
    status: string
  ): Promise<MessageTemplateVariable> {
    const messageTemplateVariableSchema: any = {
      name,
      key,
      type,
      format,
      defaultValue,
      required,
      organization: org,
      status
    };
    const e = entityManager.create(
      MessageTemplateVariable,
      messageTemplateVariableSchema
    );
    return entityManager.save(e);
  }

  public async updateMessageTemplateVariable(
    entityManager: EntityManager,
    id: string,
    organizationId: string,
    name: string,
    type: string,
    format: string,
    defaultValue: string,
    required: boolean,
    status: string
  ): Promise<MessageTemplateVariable> {
    let e = await this.getMessageTemplateVariable(
      entityManager,
      id,
      organizationId
    );
    if (name !== null) {
      e.name = name;
    }
    if (type !== null) {
      e.type = type;
    }
    if (format !== null) {
      e.format = format;
    }
    if (defaultValue !== null) {
      e.defaultValue = defaultValue;
    }
    if (required !== null) {
      e.required = required;
    }
    if (status !== null) {
      e.status = status;
    }
    e = await entityManager.save(e);
    return this.getMessageTemplateVariable(entityManager, id, organizationId);
  }

  public async addVariableToMessageTemplate(
    entityManager: EntityManager,
    templateId: string,
    templateVariableId: string,
    organizationId: string
  ): Promise<MessageTemplate> {
    // tslint:disable-next-line:no-console
    console.log("----------------------------------------------");
    // tslint:disable-next-line:no-console
    console.log("templateId", templateId);
    // tslint:disable-next-line:no-console
    console.log("templateVariableId", templateVariableId);

    const messsageTemplate = await this.getMessageTemplate(
      entityManager,
      templateId,
      organizationId
    );
    const templateVariable = await this.getMessageTemplateVariable(
      entityManager,
      templateVariableId,
      organizationId
    );
    // tslint:disable-next-line:no-console
    console.log(
      "----------------------------------------------",
      templateVariable
    );
    if (
      messsageTemplate.messageTemplateVariables &&
      messsageTemplate.messageTemplateVariables.length > 0
    ) {
      // tslint:disable-next-line:no-console
      console.log("Adding to the template");
      messsageTemplate.messageTemplateVariables.push(templateVariable);
      // tslint:disable-next-line:no-console
      console.log("messsageTemplate", messsageTemplate);
    } else {
      messsageTemplate.messageTemplateVariables = [templateVariable];
    }
    return messsageTemplate.save();
  }

  public async removeVariableFromMessageTemplate(
    entityManager: EntityManager,
    templateId: string,
    templateVariableId: string,
    organizationId: string
  ): Promise<any> {
    const messsageTemplate = await this.getMessageTemplate(
      entityManager,
      templateId,
      organizationId
    );
    const templateVariable = await this.getMessageTemplateVariable(
      entityManager,
      templateVariableId,
      organizationId
    );

    if (
      messsageTemplate.messageTemplateVariables &&
      messsageTemplate.messageTemplateVariables.length > 0
    ) {
      const index = messsageTemplate.messageTemplateVariables.indexOf(
        templateVariable
      );
      if (index > -1) {
        messsageTemplate.messageTemplateVariables.splice(index, 1);
      }
      messsageTemplate.save();
    }
  }

  public async getCommunicationsForCampaign(
    entityManager: EntityManager,
    campaignId: string
  ): Promise<Communication[]> {
    const query = { campaign: campaignId };
    const options = {};
    const where = "where";
    const relations = "relations";
    options[where] = query;
    options[relations] = ["organization", "messageTemplate", "campaign"];
    return entityManager.find(Communication, options);
  }

  public async getCommunication(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<Communication> {
    const query = { organizationId, id };
    const options = {};
    const where = "where";
    const relations = "relations";
    options[where] = query;
    options[relations] = ["organization", "messageTemplate", "campaign"];
    return entityManager.findOne(Communication, options);
  }

  public async getCommunications(
    entityManager: EntityManager,
    organizationId: string,
    entityId: string,
    status: string,
    entityType: string,
    campaignId: string
  ): Promise<Communication[]> {
    const query = { organizationId };
    const statusIdentifier = "status";
    const entityIdentifier = "entityId";
    const entityTypeIdentifier = "entityType";
    const campaign = "campaign";

    if (status !== undefined) {
      query[statusIdentifier] = status;
    }
    if (entityId !== undefined) {
      query[entityIdentifier] = entityId;
    }
    if (entityType !== undefined) {
      query[entityTypeIdentifier] = entityType;
    }
    if (campaignId !== undefined) {
      query[campaign] = campaignId;
    }
    const options = {};
    options["where"] = query;
    options["relations"] = ["organization", "messageTemplate", "campaign"];
    return entityManager.find(Communication, options);
  }

  public async getCommunicationforUpdate(
    entityManager: EntityManager,
    id: string
  ) {
    const query = { id };
    const options = {};
    options["where"] = query;
    options["relations"] = ["organization", "messageTemplate"];
    return entityManager.findOne(Communication, options);
  }

  public async createCommunication(
    transactionalEntityManager: EntityManager,
    entityId: string,
    entityType: string,
    messageTemplate: any,
    isScheduled: boolean,
    firstScheduleDateTime: Date,
    isRepeatable: boolean,
    lastProcessedDateTime: Date,
    repeatRuleConfiguration: any,
    commsChannelName: string,
    organization: any,
    status: string,
    campaign
  ): Promise<Communication> {
    const opts: any = {
      entityId,
      entityType,
      messageTemplate,
      isScheduled,
      firstScheduleDateTime,
      isRepeatable,
      lastProcessedDateTime,
      repeatRuleConfiguration,
      commsChannelName,
      organization,
      status,
      campaign
    };

    if (opts.repeatRuleConfiguration) {
      if (opts.repeatRuleConfiguration.time) {
        const time = opts.repeatRuleConfiguration.time;
        opts.repeatRuleConfiguration.time = getUTCTimeFromLocalTime(time);
      }
    }

    const entityManager = transactionalEntityManager;
    const e = await entityManager.create(Communication, opts);
    const ee = await entityManager.save(e);
    const query = { id: ee.id };
    const options = {};
    options["where"] = query;
    options["relations"] = ["organization", "messageTemplate"];
    return entityManager.findOne(Communication, options);
  }
  public async updateCommunication(
    transactionalEntityManager: EntityManager,
    id: string,
    entityId: string,
    entityType: string,
    isScheduled: boolean,
    firstScheduleDateTime: Date,
    isRepeatable: boolean,
    lastProcessedDateTime: Date,
    repeatRuleConfiguration: any,
    commsChannelName: string,
    status: string
  ): Promise<Communication> {
    const entityManager = transactionalEntityManager;
    const e = await this.getCommunicationforUpdate(entityManager, id);

    if (entityId !== null) {
      e.entityId = entityId;
    }

    if (entityType !== null) {
      e.entityType = entityType;
    }

    if (isScheduled !== null) {
      e.isScheduled = isScheduled;
    }
    if (firstScheduleDateTime !== null) {
      e.firstScheduleDateTime = firstScheduleDateTime;
    }
    if (isRepeatable !== null) {
      e.isRepeatable = isRepeatable;
    }
    if (lastProcessedDateTime !== null) {
      e.lastProcessedDateTime = lastProcessedDateTime;
    }
    if (repeatRuleConfiguration !== null) {
      e.repeatRuleConfiguration = repeatRuleConfiguration;
    }
    if (commsChannelName !== null) {
      e.commsChannelName = commsChannelName;
    }
    if (status !== null) {
      e.status = status;
    }
    return entityManager.save(e);
  }

  public async getCommunicationLog(
    entityManager: EntityManager,
    communicationLogId: string
  ): Promise<CommunicationLog> {
    const query = { id: communicationLogId };
    const options = {};
    const where = "where";
    const relations = "relations";
    options[where] = query;
    options[relations] = ["communication"];
    return entityManager.findOne(CommunicationLog, options);
  }

  public async getCommunicationLogs(
    entityManager: EntityManager,
    communicationId: string
  ): Promise<CommunicationLog[]> {
    const query = { communication_id: communicationId };
    console.log(query);
    const options = {};
    options["where"] = query;
    options["relations"] = ["communication"];
    return entityManager.find(CommunicationLog, options);
  }

  public async addCommunicationLog(
    entityManager: EntityManager,
    communicationId: string,
    startTime: Date,
    runType: string,
    logMessage: string
  ): Promise<CommunicationLog> {
    const log = [
      {
        time: startTime,
        communicationStatus: COMMUNICATION_STATUS.ADDED,
        message: logMessage
      }
    ];

    const communicationLog = {
      communication_id: communicationId,
      startTime,
      runType,
      communicationStatus: COMMUNICATION_STATUS.ADDED,
      status: STATUS.ACTIVE,
      log
    };

    const e = await entityManager.create(CommunicationLog, communicationLog);
    return entityManager.save(e);
  }

  public async updateCommunicationLog(
    entityManager: EntityManager,
    communicationLogId: string,
    communicationStatus: string,
    logMessage: string
  ): Promise<CommunicationLog> {
    const communicationLog = await this.getCommunicationLog(
      entityManager,
      communicationLogId
    );
    const logItem = [
      {
        time: new Date(),
        communicationStatus,
        message: logMessage
      }
    ];
    if (communicationLog) {
      communicationLog.communicationStatus = communicationStatus;
      const log = communicationLog.log;
      log.push(logItem);
      communicationLog.log = log;
      return entityManager.save(communicationLog);
    }
    // TODO: TRHOW ERROR
  }

  sendSMS(
    to,
    message,
    userId,
    channelName,
    consumerName,
    scheduledDateTime,
    externalTemplateId
  ) {
    console.log("Send SMS data", {
      to,
      message,
      userId,
      channelName,
      consumerName,
      scheduledDateTime,
      externalTemplateId
    });
    if (to)
      CommsAxiosConfig.post(process.env.COMMS_MODULE_URL, {
        consumer_name: consumerName,
        channel_name: channelName,
        scheduled_date_time: scheduledDateTime,
        template_id: externalTemplateId,
        comm_payload: {
          phone: to,
          message
        },
        user_information: {
          user_id: userId,
          phone: to
        }
      })
        .then(response => {
          console.log("success response for message is:-", response.data);
        })
        .catch(err => {
          console.log("error while sending push notification is:-", err);
        });
  }

  async sendSupportEmail(
    from,
    to,
    message,
    emailSubject,
    apiKey,
    attachments?
  ) {
    const mailOption = {
      from,
      to,
      subject: emailSubject,
      html: message
    };

    if (attachments && attachments.length > 0) {
      mailOption["attachments"] = attachments.map(file => ({
        filename: file.originalname,
        content: file.buffer
      }));
    }

    const mailer = nodemailer.createTransport({
      host: SUPPORT_MAIL_CONFIGURATION.HOST,
      port: SUPPORT_MAIL_CONFIGURATION.PORT,
      auth: {
        user: "apikey",
        pass: apiKey
      }
    });

    try {
      const info = await mailer.sendMail(mailOption);
      return {
        success: true,
        message: "Email sent successfully",
        response: info.response
      };
    } catch (error) {
      return {
        success: false,
        message: "Error sending email",
        error: error.message
      };
    } finally {
      if (mailer) {
        mailer.close();
      }
    }
  }

  sendEmail(
    to,
    message,
    userId,
    emailSubject,
    consumerName,
    scheduledDateTime,
    externalTemplateId
  ) {
    let mailoption = {
      from: process.env.SEND_EMAIL_FROM_ID,
      to: to,
      subject: emailSubject,
      html: message
    };

    if (to) {
      let mailer = nodemailer.createTransport({
        host: SUPPORT_MAIL_CONFIGURATION.HOST,
        port: SUPPORT_MAIL_CONFIGURATION.PORT,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY
        }
      });
      mailer.sendMail(mailoption, function(err, response) {
        if (err) {
          console.log("Error while sending email", err.message);
        }
        mailer.close();
      });
    }
  }

  private formatPushData({
    channel_name,
    messageBody,
    messageSubject,
    data,
    consumer_name,
    to,
    url,
    user_id
  }: ISendMessageInput): ICommsPushBody {
    let notificationPayload = {
      data: data ? data : {}
    };
    if (messageBody) {
      notificationPayload["body"] = messageBody;
    }
    if (messageSubject) {
      notificationPayload["title"] = messageSubject;
    }

    return {
      channel_name: channel_name
        ? channel_name
        : process.env.WALKIN_COMMS_CHANNEL_NAME_PUSH_DEFAULT,
      consumer_name: consumer_name
        ? consumer_name
        : process.env.WALKIN_COMMS_CONSUMER_NAME_DEFAULT,
      comm_payload: {
        notification: notificationPayload,
        to
      },
      user_information: {
        user_id,
        fcm_token: to
      }
    };
  }

  private formatSMSdata({
    to,
    messageBody,
    channel_name,
    consumer_name,
    user_id
  }: ISendMessageInput): ICommsSMSBody {
    return {
      consumer_name: channel_name
        ? channel_name
        : process.env.WALKIN_COMMS_CONSUMER_NAME_DEFAULT,
      channel_name: channel_name
        ? channel_name
        : process.env.WALKIN_COMMS_CHANNEL_NAME_SMS_DEFAULT,
      comm_payload: {
        phone: to,
        message: messageBody
      },
      user_information: {
        user_id,
        phone: to
      }
    };
  }

  private formatEmaildata({
    consumer_name,
    channel_name,
    to,
    messageBody,
    messageSubject,
    user_id
  }: ISendMessageInput): ICommsEmailBody {
    return {
      consumer_name: consumer_name
        ? consumer_name
        : process.env.WALKIN_COMMS_CONSUMER_NAME_DEFAULT,
      channel_name: channel_name
        ? channel_name
        : process.env.WALKIN_COMMS_CHANNEL_NAME_EMAIL_DEFAULT,
      comm_payload: {
        email: to,
        message: messageBody,
        subject: messageSubject
      },
      user_information: {
        user_id,
        email: to
      }
    };
  }

  public async sendSupportMail(entityManager: EntityManager, injector, input) {
    const { user } = input;
    if (!user) {
      throw new WCoreError(WCORE_ERRORS.USER_NOT_FOUND);
    }

    const organization = user.organization;
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }

    await validateSupportEmailInput(input);

    const {
      supportType,
      supportSubType,
      email,
      name,
      subject,
      attachments,
      content: originalContent
    } = input;
    let { content } = input;

    // sanitize the content to prevent malicious code that can be injected as part of html
    content = sanitizeHtml(content);

    if (email || name) {
      content += `<br/><br/>Customer details:`;
      name ? (content += `<br/>Name: ${name}`) : "";
      email ? (content += `<br/>Email: ${email}`) : "";
    }
    content += `<br/>`;

    const envVariableName = `SUPPORT_${supportType}_${supportSubType}_TO`;
    let recipientList: any = process.env[envVariableName];
    if (recipientList) {
      recipientList = recipientList.split(",");

      const from = process.env.SUPPORT_EMAIL_FROM_ID;
      const messageBody = generateSupportMailContent(
        organization,
        user,
        content
      );

      const response: any = await this.sendSupportEmail(
        from,
        recipientList,
        messageBody,
        subject,
        process.env.SUPPORT_EMAIL_ID_SENDGRID_API_KEY,
        attachments
      );

      // store support request in db
      const supportRequestInput = {
        supportType,
        supportSubType,
        subject,
        content: originalContent,
        response,
        user,
        organization
      };
      const supportRequestSchema = entityManager.create(
        SupportRequest,
        supportRequestInput
      );
      await entityManager.save(supportRequestSchema);
      return response;
    } else {
      throw new WCoreError(WCORE_ERRORS.SUPPORT_EMAIL_TO_IDS_NOT_DEFINED);
    }
  }

  public async getMessageTemplateAndSendSMS(
    entityManager: EntityManager,
    injector,
    messageTemplateInput
  ): Promise<Object> {
    let templateName = messageTemplateInput.templateName;
    let phoneNumber = messageTemplateInput.phoneNumber;
    let userId = messageTemplateInput.userId
      ? messageTemplateInput.userId
      : phoneNumber;
    let communicationEntityType = messageTemplateInput.communicationEntityType;
    let replacableData = messageTemplateInput.replacableData;
    let consumerName = messageTemplateInput.consumerName;
    let communication = await this.getCommunicationByEntityTypeAndMessageTemplateName(
      entityManager,
      injector,
      templateName,
      communicationEntityType
    );
    if (communication) {
      let channelName = communication.commsChannelName;
      let messageTemplate = communication.messageTemplate;
      let messageBody: string;
      for (var key in replacableData) {
        messageBody = communication.messageTemplate.templateBodyText.replace(
          `{{${key}}}`,
          replacableData[key]
        );
      }
      this.sendSMS(
        phoneNumber,
        messageBody,
        userId,
        communication.commsChannelName,
        consumerName,
        null,
        null
      );
    }
    return { status: "SUCCESS" };
  }

  public async getCommunicationByEntityTypeAndMessageTemplateName(
    entityManager,
    injector,
    templateName,
    communicationEntityType
  ): Promise<Communication> {
    let where_clause =
      "communication.entityType=:entityType and messageTemplate.name=:name";
    let where_clause_params = {
      name: templateName,
      entityType: communicationEntityType
    };
    const communication = await entityManager
      .getRepository(Communication)
      .createQueryBuilder("communication")
      .innerJoinAndSelect("communication.messageTemplate", "messageTemplate")
      .where(where_clause, where_clause_params)
      .getOne();
    console.log("communication ", communication);
    return communication;
  }
}

interface ISendMessageInput {
  format: string;
  to: string;
  messageBody?: string;
  messageSubject?: string;
  data?: any;
  consumer_name?: string;
  channel_name?: string;
  url?: string;
  user_id?: string;
}
interface ICommsSMSBody {
  consumer_name: string;
  channel_name: string;
  comm_payload: {
    phone: string;
    message: string;
  };
  user_information?: {
    user_id?: string;
    phone?: string;
  };
}

interface ICommsEmailBody {
  consumer_name: string;
  channel_name: string;
  comm_payload: {
    email: string;
    message: string;
    subject: string;
  };
  user_information?: {
    user_id?: string;
    email?: string;
  };
}

interface ICommsPushBody {
  consumer_name: string;
  channel_name: string;
  comm_payload: {
    notification: {
      title?: string;
      body?: string;
      data?: any;
    };
    to: string;
  };
  user_information?: {
    user_id?: string;
    fcm_token?: string;
  };
}
