import gql from "graphql-tag";
import {
  MESSAGE_FORMAT,
  STATUS,
  TEMPLATE_STYLE,
  VARIABLE_FORMAT,
  VARIABLE_TYPE,
  COMMUNICATION_ENTITY_TYPE,
  COMMUNICATION_FREQUENCY,
  COMMUNICATION_DAYS,
  COMMUNICATION_STATUS,
  COMMUNICATION_RUN_TYPE,
  SUPPORT_TYPE,
  SUPPORT_SUBTYPE
} from "../common/constants/constants";

const typeDefs = gql`

type Rule

type Query {
  messageTemplate(id:ID!, organization_id: ID!): MessageTemplate @auth
  messageTemplates(organization_id: ID!, messageFormat: MESSAGE_FORMAT, status: STATUS): [MessageTemplate] @auth
  communication(id:ID!, organization_id: ID!): Communication @auth
  communications(entityId: ID,entityType:COMMUNICATION_ENTITY_TYPE ,organization_id: ID!, status: STATUS, campaignId: ID): [Communication] @auth
  communicationLog(communicationLogId: ID!):CommunicationLog @auth
  communicationLogs(communicationId: ID!):[CommunicationLog] @auth
}




type Mutation {
  createMessageTemplate(input:CreateMessageTemplateInput!): MessageTemplate @auth
  updateMessageTemplate(input:UpdateMessageTemplateInput!): MessageTemplate @auth
  createMessageTemplateVariable(input: CreateMessageTemplateVariableInput!): MessageTemplateVariable @auth
  updateMessageTemplateVariable(input: UpdateMessageTemplateVariableInput!): MessageTemplateVariable @auth
  addVariableToMessageTemplate(input: AddVariableToMessageTemplateInput!): MessageTemplate @auth
  removeVariableFromMessageTemplate(input: RemoveVariableFromMessageTemplateInput!): MessageTemplate @auth
  formatMessage(input: FormatMessageInput!): FormatMessage @auth
  sendMessage(input:SendMessageInput!):Boolean @auth
  createCommunicationWithMessageTempate(communicationInput:CreateCommunicationWithoutMessageTemplateInput!,messageTemplateInput:CreateMessageTemplateInput): Communication @auth
  updateCommunicationWithMessageTempate(communicationInput:UpdateCommunicationInput!,messageTemplateInput:UpdateMessageTemplateInput): Communication @auth
  createCommunication(input: CreateCommunicationInput!): Communication @auth
  updateCommunication(input: UpdateCommunicationInput!): Communication @auth
  disableCommunication(id:ID!, organization: ID!): Communication @auth
  addCommunicationLog(input: CommunicationLogInput!): CommunicationLog @auth
  updateCommunicationLog(input: CommunicationLogUpdateInput!): CommunicationLog @auth
  getMessageTemplateAndSendSMS(input:MessageTemplateSMSInput) : SMSStatus @auth
  sendSupportMail(input: sendSupportMailInput): JSON @auth
}

  input sendSupportMailInput {
    supportType: SUPPORT_TYPE!
    supportSubType: SUPPORT_SUBTYPE!
    subject: String!
    content: String!
    email: String
    name: String
  }

  type RuleEntity{
    id: ID
  }
  type Campaign

  type Organization {
    id: ID!
  }

  type Application {
    id: ID!
  }

  type SMSStatus{
    status:String!
  }

  enum MESSAGE_FORMAT


  input SendMessageInput{
    format:MESSAGE_FORMAT
    to:String! 
    messageBody:String! 
    messageSubject: String
  }
  
type MessageTemplate {
  id: ID!
  name: String
  description: String
  messageFormat: MESSAGE_FORMAT
  templateBodyText: String
  templateSubjectText: String
  templateStyle: TEMPLATE_STYLE
  organization: Organization
  messageTemplateVariables : [MessageTemplateVariable]
  status: STATUS
  externalTemplateId: String
}



type MessageTemplateVariable{
  id: ID!
  name: String
  key: String
  type: VARIABLE_TYPE!
  format: VARIABLE_FORMAT!
  defaultValue: String
  required: Boolean
  organization: Organization
  status: STATUS
}

type FormatMessage{
  templateId: ID
  variables: JSON
  bodyText: String
  subjectText: String
  templateStyle: TEMPLATE_STYLE
}

type CommunicationLog{
  communication: Communication
  startTime: DateTime
  endTime: DateTime
  runType: COMMUNICATION_RUN_TYPE
  communicationStatus: COMMUNICATION_STATUS
  log: JSON
}

input CommunicationLogInput{
  communicationId: ID!
  startTime: DateTime!
  runType: COMMUNICATION_RUN_TYPE!
  logMessage: String!
}

input CommunicationLogUpdateInput{
  communicationLogId: ID!
  communicationStatus: COMMUNICATION_STATUS!
  logMessage: String!
}

input CreateCommunicationWithoutMessageTemplateInput{
  entityId : String!
  entityType: COMMUNICATION_ENTITY_TYPE
  isScheduled: Boolean!
  firstScheduleDateTime: DateTime
  isRepeatable: Boolean!
  lastProcessedDateTime: DateTime
  repeatRuleConfiguration: RepeatRuleConfiguration
  commsChannelName: String!
  organization_id: ID!
  campaign_id: ID
  application_id: ID
  status: STATUS!
}

input CreateMessageTemplateInput{
  name: String!
  description: String!
  messageFormat: MESSAGE_FORMAT!
  templateBodyText: String!
  templateSubjectText: String!
  templateStyle: TEMPLATE_STYLE!
  organization_id: ID!
  url: String
  imageUrl: String
  status: STATUS!
  externalTemplateId: String
}

input UpdateMessageTemplateInput{
  id: ID!
  organization_id: ID
  name: String
  description: String
  templateBodyText: String
  templateSubjectText: String
  templateStyle: TEMPLATE_STYLE
  url: String
  imageUrl: String
  status: STATUS
  externalTemplateId: String
}

input CreateMessageTemplateVariableInput{
  name: String!
  key: String!
  type: VARIABLE_TYPE!
  format: VARIABLE_FORMAT
  defaultValue: String
  required: Boolean!
  organization_id: ID!  
  status: STATUS!
}

input UpdateMessageTemplateVariableInput{
  id: ID!
  organization_id: ID!
  name: String
  type: VARIABLE_TYPE!
  format: VARIABLE_FORMAT!
  defaultValue: String
  required: Boolean
  status: STATUS
}


input AddVariableToMessageTemplateInput{
  organization_id: ID!
  templateId: ID!
  templateVariableId: ID!  
}

input RemoveVariableFromMessageTemplateInput{
  organization_id: ID! 
  templateId: ID!
  templateVariableId: ID! 
}

input FormatMessageInput{
  organization_id: ID!
  templateId: ID!
  variables: JSON!
}

type RepeatRuleConfigurationOutput{
    frequency : COMMUNICATION_FREQUENCY
    repeatInterval: Int
    endAfter: DateTime
    byWeekDay: [COMMUNICATION_DAYS]
    byMonthDate: Int
    time: String
    noOfOccurances: Int
}

input RepeatRuleConfiguration{
    frequency : COMMUNICATION_FREQUENCY
    repeatInterval: Int
    endAfter: DateTime
    byWeekDay: [COMMUNICATION_DAYS]
    byMonthDate: Int
    time: String
    noOfOccurances: Int
}  


type Communication{
  id:ID
  entityId : String
  entityType: COMMUNICATION_ENTITY_TYPE
  messageTemplate: MessageTemplate
  isScheduled: Boolean
  firstScheduleDateTime: DateTime
  isRepeatable: Boolean
  lastProcessedDateTime: DateTime
  repeatRuleConfiguration: RepeatRuleConfigurationOutput
  commsChannelName: String
  organization: Organization
  application: Application
  status: STATUS
  campaign: Campaign
}

input UpdateCommunicationInput{
  id: ID!
  entityId : String!
  entityType: COMMUNICATION_ENTITY_TYPE
  isScheduled: Boolean
  firstScheduleDateTime: DateTime
  isRepeatable: Boolean
  lastProcessedDateTime: DateTime
  repeatRuleConfiguration : RepeatRuleConfiguration
  commsChannelName: String
  status: STATUS!
  campaign_id: ID
}

input CreateCommunicationWithoutMessageTemplateIdInput{
  entityId : String!
  entityType: COMMUNICATION_ENTITY_TYPE
  isScheduled: Boolean!
  firstScheduleDateTime: DateTime
  isRepeatable: Boolean!
  lastProcessedDateTime: DateTime
  repeatRuleConfiguration: RepeatRuleConfiguration
  commsChannelName: String!
  organization_id: ID!
  application_id: ID
  status: STATUS!
}



input CreateCommunicationInput{
  entityId : String!
  entityType: COMMUNICATION_ENTITY_TYPE
  messageTemplateId: ID!
  isScheduled: Boolean!
  firstScheduleDateTime: DateTime
  isRepeatable: Boolean!
  lastProcessedDateTime: DateTime
  repeatRuleConfiguration: RepeatRuleConfiguration
  commsChannelName: String!
  organization_id: ID!
  application_id: ID
  campaign_id: ID!
  status: STATUS!
}

input MessageTemplateSMSInput{
  templateName:String!
  phoneNumber:String!
  communicationEntityType:String!
  replacableData:JSON
  consumerName:String!
  userId:String
}


scalar JSON
scalar DateTime

enum COMMUNICATION_ENTITY_TYPE{
  ${[...Object.values(COMMUNICATION_ENTITY_TYPE)]}
}

enum STATUS
enum VARIABLE_TYPE{
  ${[...Object.values(VARIABLE_TYPE)]}
}

enum VARIABLE_FORMAT{
  ${[...Object.values(VARIABLE_FORMAT)]}
}

enum MESSAGE_FORMAT{
  ${[...Object.values(MESSAGE_FORMAT)]}
}

enum SUPPORT_TYPE{
  ${[...Object.values(SUPPORT_TYPE)]}
}

enum SUPPORT_SUBTYPE{
  ${[...Object.values(SUPPORT_SUBTYPE)]}
}

enum TEMPLATE_STYLE{
  ${[...Object.values(TEMPLATE_STYLE)]}
}


enum COMMUNICATION_DAYS{
  ${[...Object.values(COMMUNICATION_DAYS)]}
}

enum COMMUNICATION_FREQUENCY{
  ${[...Object.values(COMMUNICATION_FREQUENCY)]}
}

enum COMMUNICATION_STATUS{
  ${[...Object.values(COMMUNICATION_STATUS)]}
}

enum COMMUNICATION_RUN_TYPE{
  ${[...Object.values(COMMUNICATION_RUN_TYPE)]}
}

`;

export default typeDefs;
