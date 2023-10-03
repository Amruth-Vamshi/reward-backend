import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";
import { ModuleContext } from "@graphql-modules/core";
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  DateTime: any;
  Date: any;
  Upload: any;
};

export enum Access_Type {
  Private = "PRIVATE",
  Public = "PUBLIC"
}

export type Action = {
  __typename?: "Action";
  id?: Maybe<Scalars["ID"]>;
  actionDefinition?: Maybe<ActionDefinition>;
  organization?: Maybe<Organization>;
  request?: Maybe<Scalars["JSON"]>;
  response?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Scalars["String"]>;
};

export type ActionDefinition = {
  __typename?: "ActionDefinition";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  configuration?: Maybe<Scalars["JSON"]>;
  code?: Maybe<Scalars["String"]>;
  inputSchema?: Maybe<Scalars["JSON"]>;
  outputSchema?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Scalars["String"]>;
};

export type ActionDefinitionPage = {
  __typename?: "ActionDefinitionPage";
  data?: Maybe<Array<ActionDefinition>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type ActionPage = {
  __typename?: "ActionPage";
  data?: Maybe<Array<Action>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type AddAudienceMemberInput = {
  audience_id: Scalars["ID"];
  customer_id: Scalars["ID"];
  status: Status;
};

export type AddCampaignControl = {
  organization_id: Scalars["ID"];
  customer_id: Scalars["ID"];
  campaign_id: Scalars["ID"];
  startTime: Scalars["DateTime"];
  endTime: Scalars["DateTime"];
  status: Status;
};

export type AddEntityExtend = {
  organization_id: Scalars["ID"];
  entity_name: Extend_Entities;
  description: Scalars["String"];
};

export type AddEntityExtendField = {
  entityExtendId: Scalars["ID"];
  slug: Scalars["String"];
  label?: Maybe<Scalars["String"]>;
  help?: Maybe<Scalars["String"]>;
  type: Slugtype;
  required?: Maybe<Scalars["Boolean"]>;
  choices?: Maybe<Array<Maybe<Scalars["String"]>>>;
  defaultValue?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  searchable?: Maybe<Scalars["Boolean"]>;
  validator?: Maybe<Scalars["String"]>;
};

export type AddGlobalControl = {
  organization_id: Scalars["ID"];
  customer_id: Scalars["ID"];
  startTime: Scalars["DateTime"];
  endTime: Scalars["DateTime"];
};

export type AddVariableToMessageTemplateInput = {
  organization_id: Scalars["ID"];
  templateId: Scalars["ID"];
  templateVariableId: Scalars["ID"];
};

export type ApiKey = {
  __typename?: "APIKey";
  id: Scalars["ID"];
  environment?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  roles?: Maybe<Array<Maybe<Role>>>;
  api_key?: Maybe<Scalars["String"]>;
};

export type ApiKeyInput = {
  id: Scalars["ID"];
  environment?: Maybe<EnvironmentEnum>;
  status?: Maybe<Status>;
};

/** Skeloton of the Application data sent back to the user */
export type Application = {
  __typename?: "Application";
  /** Unique id of the application */
  id: Scalars["ID"];
  /** Name of the application */
  name?: Maybe<Scalars["String"]>;
  /** Description of the organization */
  description?: Maybe<Scalars["String"]>;
  /** auth_key_hooks associated with this application */
  auth_key_hooks?: Maybe<Scalars["String"]>;
  /** Platform this application will run on */
  platform?: Maybe<Scalars["String"]>;
  /** Data of the organization to which the application belongs */
  organization?: Maybe<Organization>;
  /** Actions associated with this application */
  actions?: Maybe<Array<Maybe<Action>>>;
  apiKeys?: Maybe<ApiKey>;
};

export type ApplicationInput = {
  /** Name of the application */
  name: Scalars["String"];
  /** Description of the organization */
  description?: Maybe<Scalars["String"]>;
  /** auth_key_hooks associated with this application */
  auth_key_hooks?: Maybe<Scalars["String"]>;
  /** Platform this application will run on */
  platform?: Maybe<Scalars["String"]>;
};

/** Skeloton of the input receive by server to update Application */
export type ApplicationUpdateInput = {
  /** Unique id of the application */
  id: Scalars["ID"];
  /** Name of the application */
  name?: Maybe<Scalars["String"]>;
  /** Description of the organization */
  description?: Maybe<Scalars["String"]>;
  /** auth_key_hooks associated with this application */
  auth_key_hooks?: Maybe<Scalars["String"]>;
  /** Platform this application will run on */
  platform?: Maybe<Scalars["String"]>;
};

export type Audience = {
  __typename?: "Audience";
  id?: Maybe<Scalars["ID"]>;
  campaign?: Maybe<Campaign>;
  segment?: Maybe<Segment>;
  organization?: Maybe<Organization>;
  application?: Maybe<Application>;
  status?: Maybe<Status>;
};

export type AudienceCountOutput = {
  __typename?: "AudienceCountOutput";
  count?: Maybe<Scalars["Int"]>;
};

export type AudienceMember = {
  __typename?: "AudienceMember";
  id: Scalars["ID"];
  audience: Audience;
  customer: Customer;
  status: Status;
};

export type BasicField = {
  __typename?: "BasicField";
  slug?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
  type?: Maybe<Slugtype>;
  required?: Maybe<Scalars["Boolean"]>;
  defaultValue?: Maybe<Scalars["String"]>;
  searchable?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
};

export enum Business_Rule_Levels {
  Organization = "ORGANIZATION",
  Store = "STORE",
  Application = "APPLICATION",
  Loyalty = "LOYALTY"
}

export type BusinessRule = {
  __typename?: "BusinessRule";
  id: Scalars["ID"];
  ruleLevel: Business_Rule_Levels;
  ruleType: Scalars["String"];
  ruleDefaultValue?: Maybe<Scalars["String"]>;
};

export type BusinessRuleConfigurationInput = {
  ruleLevel?: Maybe<Business_Rule_Levels>;
  ruleLevelId?: Maybe<Scalars["String"]>;
  ruleType?: Maybe<Scalars["String"]>;
  organizationId: Scalars["String"];
};

export type BusinessRuleDetail = {
  __typename?: "BusinessRuleDetail";
  id: Scalars["ID"];
  ruleLevel: Business_Rule_Levels;
  ruleLevelId: Scalars["String"];
  ruleType: Scalars["String"];
  ruleValue?: Maybe<Scalars["String"]>;
};

export type Campaign = {
  __typename?: "Campaign";
  createdBy?: Maybe<Scalars["String"]>;
  lastModifiedBy?: Maybe<Scalars["String"]>;
  createdTime?: Maybe<Scalars["DateTime"]>;
  lastModifiedTime?: Maybe<Scalars["DateTime"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
  organization?: Maybe<Organization>;
  application?: Maybe<Application>;
  campaignType?: Maybe<Scalars["String"]>;
  triggerRule?: Maybe<Rule>;
  status?: Maybe<Status>;
  priority?: Maybe<Scalars["Int"]>;
  campaignStatus?: Maybe<Scalars["String"]>;
  audienceFilterRule?: Maybe<Rule>;
  feedbackForm?: Maybe<FeedbackForm>;
};

export enum Campaign_Status {
  Draft = "DRAFT",
  Closed = "CLOSED",
  Pause = "PAUSE",
  Live = "LIVE",
  Upcoming = "UPCOMING",
  Complete = "COMPLETE",
  PreLiveProcessing = "PRE_LIVE_PROCESSING"
}

export enum Campaign_Trigger_Type {
  Scheduled = "SCHEDULED",
  Event = "EVENT"
}

export enum Campaign_Type {
  Offer = "OFFER",
  Feedback = "FEEDBACK",
  Messaging = "MESSAGING",
  Loyalty = "LOYALTY"
}

export type CampaignControl = {
  __typename?: "CampaignControl";
  id: Scalars["ID"];
  organization?: Maybe<Organization>;
  customer?: Maybe<Customer>;
  campaign?: Maybe<Campaign>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
  status?: Maybe<Status>;
};

export type CampaignOfferInput = {
  offerId: Scalars["ID"];
  campaignId: Scalars["ID"];
  status?: Maybe<Status>;
  organizationId: Scalars["ID"];
};

export type CampaignOfferOutput = {
  __typename?: "CampaignOfferOutput";
  id?: Maybe<Scalars["ID"]>;
  offer?: Maybe<Offer>;
  campaign?: Maybe<Campaign>;
  startDate?: Maybe<Scalars["DateTime"]>;
  endDate?: Maybe<Scalars["DateTime"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
};

export type CampaignOfferPage = {
  __typename?: "CampaignOfferPage";
  data?: Maybe<Array<Maybe<CampaignOfferOutput>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type CampaignsOutput = {
  __typename?: "CampaignsOutput";
  campaign?: Maybe<Campaign>;
  audienceCount?: Maybe<Scalars["Int"]>;
  reached?: Maybe<Scalars["Int"]>;
  redemptionRate?: Maybe<Scalars["Int"]>;
};

export type CampaignUpdateInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  campaignType?: Maybe<Campaign_Type>;
  priority?: Maybe<Scalars["Int"]>;
  campaignTriggerType?: Maybe<Campaign_Trigger_Type>;
  triggerRule?: Maybe<Scalars["ID"]>;
  isCampaignControlEnabled?: Maybe<Scalars["Boolean"]>;
  campaignControlPercent?: Maybe<Scalars["Int"]>;
  isGlobalControlEnabled?: Maybe<Scalars["Boolean"]>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
  audienceFilterRule?: Maybe<Scalars["ID"]>;
};

export type CampaignAddInput = {
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  campaignType: Campaign_Type;
  priority?: Maybe<Scalars["Int"]>;
  campaignTriggerType?: Maybe<Campaign_Trigger_Type>;
  triggerRule?: Maybe<Scalars["ID"]>;
  isCampaignControlEnabled?: Maybe<Scalars["Boolean"]>;
  campaignControlPercent?: Maybe<Scalars["Int"]>;
  isGlobalControlEnabled?: Maybe<Scalars["Boolean"]>;
  startTime: Scalars["DateTime"];
  endTime: Scalars["DateTime"];
  audienceFilterRule?: Maybe<Scalars["ID"]>;
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
};

export type CancelLoyaltyInput = {
  externalCustomerId: Scalars["ID"];
  loyaltyReferenceId: Scalars["ID"];
  organizationId?: Maybe<Scalars["String"]>;
};

export type CancelLoyaltyTransactionOutput = {
  __typename?: "CancelLoyaltyTransactionOutput";
  id?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  externalCustomerId: Scalars["String"];
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  totalPoints?: Maybe<Scalars["Float"]>;
  totalAmount?: Maybe<Scalars["String"]>;
};

export type Catalog = {
  __typename?: "Catalog";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  catalogCode?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  usage?: Maybe<CatalogUsage>;
};

export type CatalogInput = {
  name: Scalars["String"];
  catalogCode: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  usage?: Maybe<CatalogUsageInput>;
};

export type CatalogUsage = {
  __typename?: "CatalogUsage";
  id?: Maybe<Scalars["ID"]>;
  purpose?: Maybe<Scalars["String"]>;
};

export type CatalogUsageInput = {
  purpose?: Maybe<Scalars["String"]>;
};

export type Category = {
  __typename?: "Category";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  catalogId?: Maybe<Scalars["ID"]>;
  status?: Maybe<Status>;
  products?: Maybe<Array<Maybe<Product>>>;
  parent?: Maybe<Category>;
  children?: Maybe<Array<Maybe<Category>>>;
  catalog?: Maybe<Catalog>;
};

export type CategoryInput = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Status>;
};

export type CategorySearchInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type Channel = {
  __typename?: "Channel";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  channelCode?: Maybe<Scalars["String"]>;
  chargeTypes?: Maybe<Array<Maybe<Charge>>>;
};

export type ChannelFilterInput = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  channelCode?: Maybe<Scalars["String"]>;
};

export type ChannelPage = {
  __typename?: "ChannelPage";
  data?: Maybe<Array<Maybe<Channel>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type ChannelTypeInput = {
  name: Scalars["String"];
  channelCode: Scalars["String"];
  chargeTypeCode?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type ChannelTypeUpdateInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  channelCode?: Maybe<Scalars["String"]>;
  chargeTypeCode?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Charge = {
  __typename?: "Charge";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  chargeTypeCode?: Maybe<Scalars["String"]>;
};

export type ChargeTypeCreateInput = {
  name: Scalars["String"];
  chargeTypeCode: Scalars["String"];
};

export type ChargeTypeInput = {
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  chargeTypeCode?: Maybe<Scalars["String"]>;
};

export type ChargeTypesInput = {
  chargeTypeCode?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type ChargeTypeUpdateInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  chargeTypeCode?: Maybe<Scalars["String"]>;
};

/**  Skeleton of Choice being send to the user  */
export type Choice = {
  __typename?: "Choice";
  id?: Maybe<Scalars["ID"]>;
  fromQuestion?: Maybe<Question>;
  toQuestion?: Maybe<Question>;
  choiceText?: Maybe<Scalars["String"]>;
  responses?: Maybe<Array<Maybe<Response>>>;
  rangeStart?: Maybe<Scalars["Int"]>;
  rangeEnd?: Maybe<Scalars["Int"]>;
};

/**  Skeleton of the INput received from user for creating Choice  */
export type ChoiceInput = {
  choiceText: Scalars["String"];
  rangeStart?: Maybe<Scalars["Int"]>;
  rangeEnd?: Maybe<Scalars["Int"]>;
};

export enum Combinator {
  And = "and",
  Or = "or"
}

export type Communication = {
  __typename?: "Communication";
  id?: Maybe<Scalars["ID"]>;
  entityId?: Maybe<Scalars["String"]>;
  entityType?: Maybe<Communication_Entity_Type>;
  messageTemplate?: Maybe<MessageTemplate>;
  isScheduled?: Maybe<Scalars["Boolean"]>;
  firstScheduleDateTime?: Maybe<Scalars["DateTime"]>;
  isRepeatable?: Maybe<Scalars["Boolean"]>;
  lastProcessedDateTime?: Maybe<Scalars["DateTime"]>;
  repeatRuleConfiguration?: Maybe<RepeatRuleConfigurationOutput>;
  commsChannelName?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  application?: Maybe<Application>;
  status?: Maybe<Status>;
  campaign?: Maybe<Campaign>;
};

export enum Communication_Days {
  Sunday = "SUNDAY",
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY"
}

export enum Communication_Entity_Type {
  Campaign = "CAMPAIGN",
  Offer = "OFFER",
  Loyalty = "LOYALTY"
}

export enum Communication_Frequency {
  Weekly = "WEEKLY",
  Monthly = "MONTHLY",
  Daily = "DAILY"
}

export enum Communication_Run_Type {
  First = "FIRST",
  Repeat = "REPEAT"
}

export enum Communication_Status {
  Added = "ADDED",
  Started = "STARTED",
  Error = "ERROR",
  Complete = "COMPLETE"
}

export type CommunicationLog = {
  __typename?: "CommunicationLog";
  communication?: Maybe<Communication>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
  runType?: Maybe<Communication_Run_Type>;
  communicationStatus?: Maybe<Communication_Status>;
  log?: Maybe<Scalars["JSON"]>;
};

export type CommunicationLogInput = {
  communicationId: Scalars["ID"];
  startTime: Scalars["DateTime"];
  runType: Communication_Run_Type;
  logMessage: Scalars["String"];
};

export type CommunicationLogUpdateInput = {
  communicationLogId: Scalars["ID"];
  communicationStatus: Communication_Status;
  logMessage: Scalars["String"];
};

export type ConfirmEmailResponse = {
  __typename?: "ConfirmEmailResponse";
  userId?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  verified?: Maybe<Scalars["Boolean"]>;
};

export type CreateActionDefinitionInput = {
  name: Scalars["String"];
  type: Scalars["String"];
  organizationId: Scalars["ID"];
  configuration: Scalars["JSON"];
  code?: Maybe<Scalars["String"]>;
  inputSchema: Scalars["JSON"];
  outputSchema: Scalars["JSON"];
  status?: Maybe<Scalars["String"]>;
};

export type CreateAudienceInput = {
  campaign_id: Scalars["ID"];
  segment_id: Array<Maybe<Scalars["ID"]>>;
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  status: Status;
};

export type CreateBulkCustomerResponse = {
  __typename?: "CreateBulkCustomerResponse";
  savedCustomers?: Maybe<Array<Maybe<Customer>>>;
  validationErrors?: Maybe<Array<Maybe<ValidationError>>>;
};

export type CreateBusinessRuleDetailInput = {
  ruleLevel: Business_Rule_Levels;
  ruleLevelId: Scalars["String"];
  ruleType: Scalars["String"];
  ruleValue?: Maybe<Scalars["String"]>;
  organizationId: Scalars["String"];
};

export type CreateBusinessRuleInput = {
  ruleLevel: Business_Rule_Levels;
  ruleType: Scalars["String"];
  ruleDefaultValue?: Maybe<Scalars["String"]>;
};

export type CreateCategoryInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  status: Status;
  code: Scalars["String"];
  extend?: Maybe<Scalars["JSON"]>;
  catalogId: Scalars["ID"];
  parentId?: Maybe<Scalars["ID"]>;
  organizationId: Scalars["String"];
};

export type CreateCommunicationInput = {
  entityId: Scalars["String"];
  entityType?: Maybe<Communication_Entity_Type>;
  messageTemplateId: Scalars["ID"];
  isScheduled: Scalars["Boolean"];
  firstScheduleDateTime?: Maybe<Scalars["DateTime"]>;
  isRepeatable: Scalars["Boolean"];
  lastProcessedDateTime?: Maybe<Scalars["DateTime"]>;
  repeatRuleConfiguration?: Maybe<RepeatRuleConfiguration>;
  commsChannelName: Scalars["String"];
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  campaign_id: Scalars["ID"];
  status: Status;
};

export type CreateCommunicationWithoutMessageTemplateIdInput = {
  entityId: Scalars["String"];
  entityType?: Maybe<Communication_Entity_Type>;
  isScheduled: Scalars["Boolean"];
  firstScheduleDateTime?: Maybe<Scalars["DateTime"]>;
  isRepeatable: Scalars["Boolean"];
  lastProcessedDateTime?: Maybe<Scalars["DateTime"]>;
  repeatRuleConfiguration?: Maybe<RepeatRuleConfiguration>;
  commsChannelName: Scalars["String"];
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  status: Status;
};

export type CreateCommunicationWithoutMessageTemplateInput = {
  entityId: Scalars["String"];
  entityType?: Maybe<Communication_Entity_Type>;
  isScheduled: Scalars["Boolean"];
  firstScheduleDateTime?: Maybe<Scalars["DateTime"]>;
  isRepeatable: Scalars["Boolean"];
  lastProcessedDateTime?: Maybe<Scalars["DateTime"]>;
  repeatRuleConfiguration?: Maybe<RepeatRuleConfiguration>;
  commsChannelName: Scalars["String"];
  organization_id: Scalars["ID"];
  campaign_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  status: Status;
};

export type CreateCustomerSessionInput = {
  customerId: Scalars["String"];
};

export type CreateCustomerSessionOutput = {
  __typename?: "CreateCustomerSessionOutput";
  customerId: Scalars["String"];
  token: Scalars["String"];
};

export type CreateFileSystemInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  accessType: Access_Type;
  fileSystemType: File_System_Type;
  configuration: Scalars["JSON"];
  enabled: Scalars["Boolean"];
  organizationId: Scalars["ID"];
};

export type CreateLoyaltyProgramInput = {
  name?: Maybe<Scalars["String"]>;
  loyaltyCode: Scalars["String"];
  loyaltyCardCode: Scalars["String"];
  organizationId?: Maybe<Scalars["String"]>;
  expiryUnit?: Maybe<ExpiryUnit>;
  expiryValue?: Maybe<Scalars["Int"]>;
  earnRuleConfiguration?: Maybe<Scalars["JSON"]>;
  burnRuleConfiguration?: Maybe<Scalars["JSON"]>;
  expiryRuleConfiguration?: Maybe<Scalars["JSON"]>;
  campaign: CampaignAddInput;
};

export type CreateMessageTemplateInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  messageFormat: Message_Format;
  templateBodyText: Scalars["String"];
  templateSubjectText: Scalars["String"];
  templateStyle: Template_Style;
  organization_id: Scalars["ID"];
  url?: Maybe<Scalars["String"]>;
  imageUrl?: Maybe<Scalars["String"]>;
  status: Status;
};

export type CreateMessageTemplateVariableInput = {
  name: Scalars["String"];
  key: Scalars["String"];
  type: Variable_Type;
  format?: Maybe<Variable_Format>;
  defaultValue?: Maybe<Scalars["String"]>;
  required: Scalars["Boolean"];
  organization_id: Scalars["ID"];
  status: Status;
};

export type CreateOrganizationInput = {
  name: Scalars["String"];
  addressLine1?: Maybe<Scalars["String"]>;
  addressLine2?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  pinCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  externalOrganizationId?: Maybe<Scalars["String"]>;
  code: Scalars["String"];
  status: Status;
  phoneNumber?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  organizationType: OrganizationTypeEnum;
};

export type CreateProductInput = {
  code: Scalars["String"];
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  imageUrl?: Maybe<Scalars["String"]>;
  type?: Maybe<ProductTypeEnum>;
  sku?: Maybe<Scalars["String"]>;
  status: Status;
  extend?: Maybe<Scalars["JSON"]>;
  categoryIds: Array<Maybe<Scalars["ID"]>>;
  optionIds?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  variants?: Maybe<Array<CreateProductVariantInput>>;
};

export type CreateProductVariantInput = {
  sku: Scalars["String"];
  optionValueIds: Array<Scalars["ID"]>;
};

/** Skeleton of data received on server for creating a Response */
export type CreateResponseInput = {
  responseData?: Maybe<Scalars["JSON"]>;
};

export type CreateRuleAttributeInput = {
  attributeName: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  status: Status;
  attributeValueType: Value_Type;
  ruleEntityId: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type CreateRuleEntityInput = {
  entityName: Scalars["String"];
  entityCode?: Maybe<Scalars["String"]>;
  status: Status;
  organizationId: Scalars["ID"];
};

export type CreateRuleInput = {
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  type: Rule_Type;
  status?: Maybe<Status>;
  ruleConfiguration?: Maybe<Scalars["JSON"]>;
  ruleExpression?: Maybe<Scalars["JSON"]>;
  organizationId: Scalars["ID"];
};

export type CreateStoreAdminLevel = {
  name: Scalars["String"];
  code: Scalars["String"];
  parentId?: Maybe<Scalars["ID"]>;
};

export type CreateStoreInput = {
  name?: Maybe<Scalars["String"]>;
  STATUS?: Maybe<Status>;
  addressLine1?: Maybe<Scalars["String"]>;
  addressLine2?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  pinCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  externalStoreId?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  code: Scalars["String"];
  email?: Maybe<Scalars["String"]>;
  wifi?: Maybe<Scalars["Boolean"]>;
  latitude?: Maybe<Scalars["String"]>;
  longitude?: Maybe<Scalars["String"]>;
  adminLevelId?: Maybe<Scalars["String"]>;
  parentOrganizationId: Scalars["String"];
  storeFormatCode?: Maybe<Scalars["String"]>;
  catalogCode?: Maybe<Scalars["String"]>;
  channelCode?: Maybe<Scalars["String"]>;
};

export type Currency = {
  __typename?: "Currency";
  id: Scalars["ID"];
  /** Unique code to identify the currency */
  code?: Maybe<Scalars["String"]>;
  /**
   * Conversion Ratio between loyalty points and actual tender
   * eg. Conversion ratio of 1 would mean 1 loyalty point
   */
  conversionRatio?: Maybe<Scalars["Float"]>;
  /** Name of the currency */
  name?: Maybe<Scalars["String"]>;
};

export type CurrencyCreateInput = {
  /** Unique code to identify the currency */
  code: Scalars["String"];
  /**
   * Conversion Ratio between loyalty points and actual tender
   * eg. Conversion ratio of 1 would mean 1 loyalty point
   */
  conversionRatio?: Maybe<Scalars["Float"]>;
  /** Name of the currency */
  name: Scalars["String"];
};

export type CurrencyPage = {
  __typename?: "CurrencyPage";
  data?: Maybe<Array<Maybe<Currency>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type CurrencyUpdateInput = {
  id?: Maybe<Scalars["ID"]>;
  /** Unique code to identify the currency */
  code: Scalars["String"];
  /**
   * Conversion Ratio between loyalty points and actual tender
   * eg. Conversion ratio of 1 would mean 1 loyalty point
   */
  conversionRatio?: Maybe<Scalars["Float"]>;
  /** Name of the currency */
  name?: Maybe<Scalars["String"]>;
};

export type Customer = {
  __typename?: "Customer";
  id: Scalars["ID"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  customerIdentifier?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  extend?: Maybe<Scalars["JSON"]>;
  onboardSource?: Maybe<Scalars["String"]>;
  customerDevices?: Maybe<Array<Maybe<CustomerDevice>>>;
};

export type CustomerColumn = {
  __typename?: "CustomerColumn";
  column_slug?: Maybe<Scalars["String"]>;
  column_search_key?: Maybe<Scalars["String"]>;
  column_label?: Maybe<Scalars["String"]>;
  column_type?: Maybe<Scalars["String"]>;
  searchable?: Maybe<Scalars["Boolean"]>;
  extended_column?: Maybe<Scalars["Boolean"]>;
};

export type CustomerDefnition = {
  __typename?: "CustomerDefnition";
  entityName?: Maybe<Scalars["String"]>;
  searchEntityName?: Maybe<Scalars["String"]>;
  columns?: Maybe<Array<Maybe<CustomerColumn>>>;
};

export type CustomerDevice = {
  __typename?: "CustomerDevice";
  id?: Maybe<Scalars["ID"]>;
  fcmToken?: Maybe<Scalars["String"]>;
  deviceId?: Maybe<Scalars["String"]>;
  modelNumber?: Maybe<Scalars["String"]>;
  osVersion?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  organization?: Maybe<Organization>;
  customer?: Maybe<Customer>;
};

export type CustomerDeviceInput = {
  id?: Maybe<Scalars["String"]>;
  fcmToken?: Maybe<Scalars["String"]>;
  customer_id?: Maybe<Scalars["String"]>;
  osVersion?: Maybe<Scalars["String"]>;
  deviceId?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  modelNumber?: Maybe<Scalars["String"]>;
};

/** Skeleton of the Customer Feedback received by the user */
export type CustomerFeedback = {
  __typename?: "CustomerFeedback";
  id: Scalars["ID"];
  createdTime?: Maybe<Scalars["Date"]>;
  customer?: Maybe<Customer>;
  feedbackForm?: Maybe<FeedbackForm>;
  response?: Maybe<Array<Maybe<Response>>>;
  completed?: Maybe<Scalars["Boolean"]>;
  event?: Maybe<Event>;
  expiryDate?: Maybe<Scalars["Date"]>;
};

export type CustomerFeedbackResponse = {
  __typename?: "CustomerFeedbackResponse";
  data?: Maybe<Array<Maybe<CustomerFeedback>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type CustomerFields = {
  id?: Maybe<Scalars["ID"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumer?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  organization_id?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type CustomerFieldSearch = {
  id?: Maybe<Scalars["ID"]>;
  attributeName?: Maybe<Scalars["String"]>;
  attributeValue?: Maybe<Scalars["String"]>;
  expressionType?: Maybe<Expression_Type>;
};

export type CustomerFileUploadInput = {
  file: Scalars["Upload"];
  segmentName?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
};

export type CustomerInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber: Scalars["String"];
  gender?: Maybe<Gender>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  customerIdentifier?: Maybe<Scalars["String"]>;
  organization: Scalars["ID"];
  extend?: Maybe<Scalars["JSON"]>;
  onboard_source?: Maybe<Scalars["String"]>;
};

export type CustomerLedgerOutput = {
  __typename?: "CustomerLedgerOutput";
  createdTime?: Maybe<Scalars["DateTime"]>;
  lastModifiedTime?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["ID"]>;
  loyaltyTransaction?: Maybe<CustomerLoyaltyTransaction>;
  loyaltyLedger?: Maybe<LoyaltyLedger>;
};

/** @deprecated Type might not be used */
export type CustomerLoyalty = {
  __typename?: "CustomerLoyalty";
  id?: Maybe<Scalars["ID"]>;
  points?: Maybe<Scalars["Float"]>;
  pointsBlocked?: Maybe<Scalars["Float"]>;
  customer?: Maybe<Customer>;
};

export type CustomerLoyaltyInput = {
  /** CustomerId maintained by external systems */
  externalCustomerId?: Maybe<Scalars["String"]>;
  /** Extra data that can be used for implementation */
  extraData?: Maybe<Scalars["JSON"]>;
  /** LoyaltyCardCode that uniquely identifies the LoyaltyCard */
  loyaltyCardCode?: Maybe<Scalars["String"]>;
  /** UUID for the organization */
  organizationId?: Maybe<Scalars["ID"]>;
  /** If True, the API creates Customer & Customer Loyalty if customer doesn't exist */
  createCustomerIfNotExist?: Maybe<Scalars["Boolean"]>;
};

export type CustomerLoyaltyOutput = {
  __typename?: "CustomerLoyaltyOutput";
  createdTime?: Maybe<Scalars["Date"]>;
  lastModifiedTime?: Maybe<Scalars["Date"]>;
  /** CustomerId maintained by external systems */
  externalCustomerId?: Maybe<Scalars["String"]>;
  /** Overall Loyalty Points belonging to the customer */
  overallPoints?: Maybe<Scalars["Float"]>;
  /**
   * Loyalty Points that are immediately burnable. It can be different
   * from overallPoints if some points are blocked and is signified by blockedPoints.
   */
  burnablePoints?: Maybe<Scalars["Float"]>;
  /**
   * Overall Tender amount belonging to the customer. It is calculated by applying conversionRatio
   * on the loyalty points
   */
  overallAmount?: Maybe<Scalars["Float"]>;
  /** BurnableAmount = BurnablePoints * conversionRatio */
  burnableAmount?: Maybe<Scalars["Float"]>;
  /** Loyalty Points blocked as part of a transaction */
  pointsBlocked?: Maybe<Scalars["Float"]>;
  /** BlockedAmount = BlockedPoints * conversionRatio */
  blockedAmount?: Maybe<Scalars["Float"]>;
  /** Code for the loyalty card  */
  loyaltyCardCode?: Maybe<Scalars["String"]>;
  /** JFL Implementation Identifies if customer loyalty account is enabled or not */
  loyaltyEnabled?: Maybe<Scalars["Boolean"]>;
};

export type CustomerLoyaltyTransaction = {
  __typename?: "CustomerLoyaltyTransaction";
  id: Scalars["ID"];
  /** Auto-generated transaction description */
  name?: Maybe<Scalars["String"]>;
  /** Unique loyalty reference Id. This is generated externally when a transaction is created */
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  /** Loyalty Type  */
  loyaltyType?: Maybe<Scalars["String"]>;
  /** StatusCode of the transaction  */
  status?: Maybe<Scalars["String"]>;
  /** Additional data stored as part of transaction */
  data?: Maybe<Scalars["JSON"]>;
  /**
   * Points Blocked as part of the transaction. This is temporary field and will be updated
   * if points are unblocked
   */
  pointsBlocked?: Maybe<Scalars["Float"]>;
  /** Points issued as part of the transaction */
  pointsIssued?: Maybe<Scalars["Float"]>;
  /** Points redeemed as part of the transaction */
  pointsRedeemed?: Maybe<Scalars["Float"]>;
  customerLoyalty?: Maybe<CustomerLoyalty>;
};

export type CustomerLoyaltyTransactionData = {
  __typename?: "CustomerLoyaltyTransactionData";
  id?: Maybe<Scalars["String"]>;
  statusCode?: Maybe<LoyaltyStatus>;
  code?: Maybe<Scalars["String"]>;
  pointsBlocked?: Maybe<Scalars["Float"]>;
  pointsIssued?: Maybe<Scalars["Float"]>;
  pointsRedeemed?: Maybe<Scalars["Float"]>;
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  loyaltyLedgers?: Maybe<Array<Maybe<LoyaltyLedger>>>;
  customerLoyalty?: Maybe<CustomerLoyaltyOutput>;
  loyaltyProgram?: Maybe<LoyaltyProgram>;
  data?: Maybe<Scalars["JSON"]>;
};

export type CustomerOfferPage = {
  __typename?: "CustomerOfferPage";
  data?: Maybe<Array<Maybe<CustomerOffersOutput>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type CustomerOffersInput = {
  campaignId: Scalars["ID"];
  offerId: Scalars["ID"];
  customerId: Scalars["ID"];
  coupon?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type CustomerOffersOutput = {
  __typename?: "CustomerOffersOutput";
  id?: Maybe<Scalars["ID"]>;
  campaign?: Maybe<Campaign>;
  offer?: Maybe<Offer>;
  customer?: Maybe<Customer>;
  coupon?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organizationId?: Maybe<Organization>;
};

export type CustomerSearchFilters = {
  rules?: Maybe<Array<Maybe<CustomerFieldSearch>>>;
  combinator?: Maybe<Combinator>;
};

export type CustomerSearchOutput = {
  __typename?: "CustomerSearchOutput";
  data?: Maybe<Array<Maybe<Scalars["JSON"]>>>;
  total?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export enum Db_Source {
  Core = "CORE",
  Warehouse = "WAREHOUSE"
}

export type DeletedChoice = {
  __typename?: "DeletedChoice";
  choiceText?: Maybe<Scalars["String"]>;
  rangeStart?: Maybe<Scalars["Int"]>;
  rangeEnd?: Maybe<Scalars["Int"]>;
};

export type DeletedFeedbackTemplateUrl = {
  __typename?: "DeletedFeedbackTemplateUrl";
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type DeleteOrganization = {
  __typename?: "DeleteOrganization";
  name: Scalars["String"];
  addressLine1?: Maybe<Scalars["String"]>;
  addressLine2?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  pinCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  externalOrganizationId?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  status: Status;
  phoneNumber?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  organizationType?: Maybe<OrganizationTypeEnum>;
};

export type DisableActionDefinitionInput = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type EarnableBurnableLoyaltyTransactionOutput = {
  __typename?: "EarnableBurnableLoyaltyTransactionOutput";
  earnablePoints?: Maybe<Scalars["Float"]>;
  burnablePoints?: Maybe<Scalars["Float"]>;
  earnableAmount?: Maybe<Scalars["String"]>;
  burnableAmount?: Maybe<Scalars["String"]>;
  overallPoints?: Maybe<Scalars["Float"]>;
  overallAmount?: Maybe<Scalars["String"]>;
  loyaltyEnabled?: Maybe<Scalars["Boolean"]>;
  earnedPointsExpiryValue?: Maybe<Scalars["String"]>;
  earnedPointsExpiryUnit?: Maybe<Scalars["String"]>;
};

export type EarnableLoyaltyTransactionInput = {
  statusCode: Scalars["String"];
  organizationId?: Maybe<Scalars["String"]>;
  externalCustomerId: Scalars["String"];
  loyaltyCode: Scalars["String"];
  loyaltyCardCode: Scalars["String"];
  burnFromLoyaltyCard: Scalars["Boolean"];
  loyaltyReferenceId: Scalars["String"];
  externalTransationId: Scalars["String"];
  createCustomerIfNotExist?: Maybe<Scalars["Boolean"]>;
  orderData?: Maybe<Scalars["JSON"]>;
  transactionData?: Maybe<Transaction>;
};

export type EarnableLoyaltyTransactionOutput = {
  __typename?: "EarnableLoyaltyTransactionOutput";
  loyaltyCardCode?: Maybe<Scalars["String"]>;
  earnablePoints?: Maybe<Scalars["Float"]>;
  burnablePoints?: Maybe<Scalars["Float"]>;
  earnableAmount?: Maybe<Scalars["Float"]>;
  burnableAmount?: Maybe<Scalars["Float"]>;
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  blockedPoints?: Maybe<Scalars["Float"]>;
};

/**  Skeleton of Input being received from user editing choices  */
export type EditChoiceInput = {
  id: Scalars["ID"];
  choiceText?: Maybe<Scalars["String"]>;
  rangeStart?: Maybe<Scalars["Int"]>;
  rangeEnd?: Maybe<Scalars["Int"]>;
};

/**  Skeleton of Input being received from user editing questions */
export type EditQuestionInput = {
  id: Scalars["ID"];
  questionText?: Maybe<Scalars["String"]>;
  type?: Maybe<Question_Type_Enum>;
  rangeMin?: Maybe<Scalars["Int"]>;
  rangeMax?: Maybe<Scalars["Int"]>;
};

/** Skeleton of data received on server for updating a Response */
export type EditResponseInput = {
  id: Scalars["ID"];
  questionData?: Maybe<Scalars["JSON"]>;
  responseData?: Maybe<Scalars["JSON"]>;
};

export type EndSessionInput = {
  id: Scalars["ID"];
};

export enum Entity_Type {
  Initiated = "INITIATED",
  Failed = "FAILED",
  Success = "SUCCESS",
  Terminated = "TERMINATED",
  Cancelled = "CANCELLED",
  Json = "JSON",
  Xml = "XML",
  Notification = "NOTIFICATION",
  ExternalApi = "EXTERNAL_API",
  CreateCustomerFeedbackForm = "CREATE_CUSTOMER_FEEDBACK_FORM",
  Organization = "Organization",
  Product = "Product",
  Category = "Category",
  Order = "Order",
  Store = "Store",
  Customer = "Customer",
  Campaign = "Campaign",
  Segment = "Segment",
  Event = "Event",
  EventType = "EventType"
}

export type EntityExtend = {
  __typename?: "EntityExtend";
  id: Scalars["ID"];
  entityName: Extend_Entities;
  description: Scalars["String"];
  organization: Organization;
  fields?: Maybe<Array<Maybe<EntityExtendField>>>;
};

export type EntityExtendField = {
  __typename?: "EntityExtendField";
  id: Scalars["ID"];
  slug: Scalars["String"];
  label?: Maybe<Scalars["String"]>;
  help?: Maybe<Scalars["String"]>;
  type: Slugtype;
  required: Scalars["Boolean"];
  choices?: Maybe<Array<Maybe<Scalars["String"]>>>;
  defaultValue?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  searchable?: Maybe<Scalars["Boolean"]>;
  validator?: Maybe<Scalars["String"]>;
};

export enum EnvironmentEnum {
  Test = "TEST",
  Production = "PRODUCTION",
  Development = "DEVELOPMENT"
}

export type Event = {
  __typename?: "Event";
  id?: Maybe<Scalars["ID"]>;
  sourceEventId?: Maybe<Scalars["String"]>;
  sourceEventTime?: Maybe<Scalars["Date"]>;
  sourceName?: Maybe<Scalars["String"]>;
  data?: Maybe<Scalars["JSON"]>;
  metadata?: Maybe<Scalars["JSON"]>;
  eventType?: Maybe<EventType>;
  processedStatus?: Maybe<Scalars["JSON"]>;
};

export type EventCustomerDeviceInput = {
  fcmToken?: Maybe<Scalars["String"]>;
  deviceId?: Maybe<Scalars["String"]>;
  osVersion?: Maybe<Scalars["String"]>;
  modelNumber?: Maybe<Scalars["String"]>;
};

export type EventCustomerInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  customerIdentifier: Scalars["String"];
  onboard_source?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
};

export type EventInput = {
  sourceEventId?: Maybe<Scalars["String"]>;
  sourceEventTime?: Maybe<Scalars["Date"]>;
  sourceName?: Maybe<Scalars["String"]>;
  data?: Maybe<Scalars["JSON"]>;
  metadata?: Maybe<Scalars["JSON"]>;
  eventTypeCode: Scalars["String"];
};

export type EventSubscription = {
  __typename?: "EventSubscription";
  id: Scalars["ID"];
  triggerAction?: Maybe<TriggerActionEnum>;
  customAction?: Maybe<Action>;
  eventType?: Maybe<EventType>;
  sync?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<Scalars["String"]>;
};

export type EventType = {
  __typename?: "EventType";
  id: Scalars["ID"];
  code?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  application?: Maybe<Application>;
  eventSubscriptions?: Maybe<Array<Maybe<EventSubscription>>>;
  events?: Maybe<Array<Maybe<Event>>>;
};

export enum ExpiryUnit {
  Hour = "HOUR",
  Day = "DAY",
  Month = "MONTH",
  Year = "YEAR"
}

export enum Expression_Type {
  Equals = "EQUALS",
  NotEquals = "NOT_EQUALS",
  LessThan = "LESS_THAN",
  GreaterThan = "GREATER_THAN",
  LessThanOrEqual = "LESS_THAN_OR_EQUAL",
  GreaterThanOrEqual = "GREATER_THAN_OR_EQUAL",
  Like = "LIKE",
  In = "IN"
}

export enum Extend_Entities {
  Customer = "Customer",
  CustomerSearch = "CustomerSearch",
  CustomerDevice = "CustomerDevice",
  Product = "Product",
  Store = "Store",
  Organization = "Organization",
  User = "User",
  Session = "Session",
  Category = "Category"
}

/**
 * Skeleton of the feedback category received by user
 * STILL IN DEVELOPMENT
 */
export type FeedbackCategory = {
  __typename?: "FeedbackCategory";
  id?: Maybe<Scalars["ID"]>;
  title?: Maybe<Scalars["String"]>;
  children?: Maybe<Array<Maybe<FeedbackCategory>>>;
  parent?: Maybe<FeedbackCategory>;
  organization?: Maybe<Organization>;
  feedbackHandler?: Maybe<FeedbackHandler>;
  questions?: Maybe<Array<Maybe<Question>>>;
};

/**
 * Skeleton of the data received by the server to create a feedback category
 * STILL IN DEVELOPMENT
 */
export type FeedbackCategoryInput = {
  title?: Maybe<Scalars["String"]>;
};

/** Skeleton of Feedback form being sent to user */
export type FeedbackForm = {
  __typename?: "FeedbackForm";
  id: Scalars["ID"];
  /** This is just used as an identifier for the feedback form */
  title?: Maybe<Scalars["String"]>;
  questionnaireRoot?: Maybe<Question>;
  customerFeedbacks?: Maybe<Array<Maybe<CustomerFeedback>>>;
  campaign?: Maybe<Campaign>;
  feedbackUIConfig?: Maybe<FeedbackUiConfig>;
  /**
   * Use this flag to tell the system wether it should automatically create customer or not,
   * in case the incoming event has a phonenumber/fcm which is not mapped to any customer in the system
   */
  autoCreateCustomer?: Maybe<Scalars["Boolean"]>;
  feedbackTemplateURL?: Maybe<FeedbackTemplateUrl>;
  expireAfter?: Maybe<FormExpiry>;
  firebaseDynamicLinkPrefix?: Maybe<Scalars["String"]>;
  firebaseDynamicLinkAPIURL?: Maybe<Scalars["String"]>;
  fireBaseAPIKey?: Maybe<Scalars["String"]>;
  createMultipleFeedbacks?: Maybe<Scalars["Boolean"]>;
};

/** Skeleton of Input receive from user to create a feedback form */
export type FeedbackFormCreateInput = {
  /** This is just used as an identifier for the feedback form */
  title?: Maybe<Scalars["String"]>;
  /**
   * Use this flag to tell the system wether it should automatically create customer or not,
   * in case the incoming event has a phonenumber/fcm which is not mapped to any customer in the system
   */
  autoCreateCustomer?: Maybe<Scalars["Boolean"]>;
  expireAfter?: Maybe<FormExpiryInput>;
  firebaseDynamicLinkPrefix?: Maybe<Scalars["String"]>;
  firebaseDynamicLinkAPIURL?: Maybe<Scalars["String"]>;
  fireBaseAPIKey?: Maybe<Scalars["String"]>;
  createMultipleFeedbacks?: Maybe<Scalars["Boolean"]>;
};

export type FeedbackFormsResponse = {
  __typename?: "FeedbackFormsResponse";
  data?: Maybe<Array<Maybe<FeedbackForm>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

/** Skeleton of Input receive from user to update a feedback form */
export type FeedbackFormUpdateInput = {
  id: Scalars["ID"];
  /** This is just used as an identifier for the feedback form */
  title?: Maybe<Scalars["String"]>;
  /**
   * Use this flag to tell the system wether it should automatically create customer or not,
   * in case the incoming event has a phonenumber/fcm which is not mapped to any customer in the system
   */
  autoCreateCustomer?: Maybe<Scalars["Boolean"]>;
  expireAfter?: Maybe<FormExpiryInput>;
  firebaseDynamicLinkPrefix?: Maybe<Scalars["String"]>;
  firebaseDynamicLinkAPIURL?: Maybe<Scalars["String"]>;
  fireBaseAPIKey?: Maybe<Scalars["String"]>;
  createMultipleFeedbacks?: Maybe<Scalars["Boolean"]>;
};

export type FeedbackHandler = {
  __typename?: "FeedbackHandler";
  title?: Maybe<Scalars["String"]>;
  category?: Maybe<FeedbackCategory>;
};

export type FeedbackResponse = {
  choiceIds: Array<Maybe<Scalars["ID"]>>;
  responseData?: Maybe<Scalars["JSON"]>;
  questionId: Scalars["ID"];
};

export type FeedbackTemplateUrl = {
  __typename?: "FeedbackTemplateUrl";
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  feedbackForms?: Maybe<Array<Maybe<FeedbackForm>>>;
};

export type FeedbackUiConfig = {
  __typename?: "FeedbackUIConfig";
  id?: Maybe<Scalars["ID"]>;
  layoutCode?: Maybe<Scalars["String"]>;
  backgroundColor?: Maybe<Scalars["String"]>;
  accentColor?: Maybe<Scalars["String"]>;
  transition?: Maybe<Scalars["String"]>;
  logoUrl?: Maybe<Scalars["String"]>;
  formStructure?: Maybe<Scalars["String"]>;
  headerText?: Maybe<Scalars["String"]>;
  exitMessage?: Maybe<Scalars["String"]>;
  buttonText?: Maybe<Scalars["String"]>;
  feedbackForm?: Maybe<FeedbackForm>;
};

export type FeedbackUiConfigUpdateInput = {
  layoutCode?: Maybe<Scalars["String"]>;
  backgroundColor?: Maybe<Scalars["String"]>;
  accentColor?: Maybe<Scalars["String"]>;
  transition?: Maybe<Scalars["String"]>;
  logoUrl?: Maybe<Scalars["String"]>;
  formStructure?: Maybe<Scalars["String"]>;
  headerText?: Maybe<Scalars["String"]>;
  exitMessage?: Maybe<Scalars["String"]>;
  buttonText?: Maybe<Scalars["String"]>;
};

export type File = {
  __typename?: "File";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  mimeType?: Maybe<Scalars["String"]>;
  encoding?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  internalUrl?: Maybe<Scalars["String"]>;
  publicUrl?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  fileSystem?: Maybe<FileSystem>;
};

export enum File_System_Type {
  S3 = "S3",
  Cloudinary = "CLOUDINARY"
}

export type FilesPage = {
  __typename?: "FilesPage";
  data?: Maybe<Array<File>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type FileSystem = {
  __typename?: "FileSystem";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  accessType?: Maybe<Access_Type>;
  fileSystemType?: Maybe<File_System_Type>;
  configuration?: Maybe<Scalars["JSON"]>;
  enabled?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
};

export type FileSystemsPage = {
  __typename?: "FileSystemsPage";
  data?: Maybe<Array<FileSystem>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type FileUploadInput = {
  file: Scalars["Upload"];
  description?: Maybe<Scalars["String"]>;
  fileSystemId?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
};

export enum Format {
  Json = "JSON",
  Xml = "XML"
}

export type FormatMessage = {
  __typename?: "FormatMessage";
  templateId?: Maybe<Scalars["ID"]>;
  variables?: Maybe<Scalars["JSON"]>;
  bodyText?: Maybe<Scalars["String"]>;
  subjectText?: Maybe<Scalars["String"]>;
  templateStyle?: Maybe<Template_Style>;
};

export type FormatMessageInput = {
  organization_id: Scalars["ID"];
  templateId: Scalars["ID"];
  variables: Scalars["JSON"];
};

export type FormExpiry = {
  __typename?: "FormExpiry";
  value?: Maybe<Scalars["Int"]>;
  unit?: Maybe<UnitOfTime>;
};

export type FormExpiryInput = {
  value: Scalars["Int"];
  unit: UnitOfTime;
};

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  Others = "OTHERS"
}

export type GlobalControl = {
  __typename?: "GlobalControl";
  id: Scalars["ID"];
  organization?: Maybe<Organization>;
  customer?: Maybe<Customer>;
  startTime?: Maybe<Scalars["DateTime"]>;
  endTime?: Maybe<Scalars["DateTime"]>;
  status?: Maybe<Status>;
};

export type HyperXCampaignInput = {
  organizationId?: Maybe<Scalars["ID"]>;
  applicationId?: Maybe<Scalars["ID"]>;
  campaignType?: Maybe<Array<Maybe<Scalars["String"]>>>;
  campaignStatus?: Maybe<Campaign_Status>;
  status?: Maybe<Status>;
};

export type HyperXOutput = {
  __typename?: "HyperXOutput";
  id: Scalars["ID"];
  version?: Maybe<Scalars["Int"]>;
  initStatus?: Maybe<Scalars["String"]>;
};

export type InitCustomerFeedbackData = {
  __typename?: "InitCustomerFeedbackData";
  customerFeedback?: Maybe<CustomerFeedback>;
  feedbackForm?: Maybe<FeedbackForm>;
  questions?: Maybe<Array<Maybe<Question>>>;
};

export type InitFeedbackFormData = {
  __typename?: "InitFeedbackFormData";
  feedbackForm?: Maybe<FeedbackForm>;
  questions?: Maybe<Array<Maybe<Question>>>;
};

export type Jwt = {
  __typename?: "JWT";
  jwt: Scalars["String"];
};

export type LedgerOutput = {
  __typename?: "LedgerOutput";
  data?: Maybe<Array<Maybe<CustomerLedgerOutput>>>;
  ledgerCount?: Maybe<Scalars["Int"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  dateStart?: Maybe<Scalars["DateTime"]>;
  dateEnd?: Maybe<Scalars["DateTime"]>;
  page?: Maybe<Scalars["Int"]>;
  itemsPerPage?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Sorting_Directions>;
  loyaltyCardCode?: Maybe<Scalars["String"]>;
};

export type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type LoyaltyCard = {
  __typename?: "LoyaltyCard";
  id: Scalars["ID"];
  /** Unique code to identify the LoyaltyCard */
  code?: Maybe<Scalars["String"]>;
  /** Description for the LoyaltyCard */
  description?: Maybe<Scalars["String"]>;
  /** Name of the Loyalty card */
  name?: Maybe<Scalars["String"]>;
  /** Currency associated with the LoyaltyCard */
  currency: Currency;
  /** Organization associated with the LoyaltyCard */
  organization?: Maybe<Organization>;
};

export type LoyaltyCardCreateInput = {
  /** Unique code to identify the LoyaltyCard */
  code: Scalars["String"];
  /** Description for the LoyaltyCard */
  description?: Maybe<Scalars["String"]>;
  /** Name of the Loyalty card */
  name: Scalars["String"];
  /** CurrencyCode for the LoyaltyCard */
  currencyCode: Scalars["String"];
  /** UUID of the Organization */
  organizationId?: Maybe<Scalars["String"]>;
};

export type LoyaltyCardPage = {
  __typename?: "LoyaltyCardPage";
  data?: Maybe<Array<Maybe<LoyaltyCard>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type LoyaltyCardUpdateInput = {
  id: Scalars["ID"];
  /** Unique code to identify the LoyaltyCard */
  code: Scalars["String"];
  /** Description for the LoyaltyCard */
  description?: Maybe<Scalars["String"]>;
  /** Name of the Loyalty card */
  name: Scalars["String"];
  /** CurrencyCode for the LoyaltyCard */
  currencyCode: Scalars["String"];
  /** UUID of the Organization */
  organizationId?: Maybe<Scalars["String"]>;
};

export type LoyaltyLedger = {
  __typename?: "LoyaltyLedger";
  id?: Maybe<Scalars["ID"]>;
  /** Loyalty ledger points */
  points?: Maybe<Scalars["Float"]>;
  /** Description of ledger entry */
  remarks?: Maybe<Scalars["String"]>;
  /**
   * Snapshot of the balance when ledger entry was created
   * This is never updated.
   */
  balanceSnapshot?: Maybe<Scalars["Float"]>;
  /**
   * Type of ledger entry.
   * 1. EXPIRED
   * 2. ISSUE
   * 3. REDUCE
   */
  type?: Maybe<Scalars["String"]>;
  /** @deprecated Not using it */
  totalAmount?: Maybe<Scalars["Float"]>;
  /** StoreId of the external system */
  externalStoreId?: Maybe<Scalars["String"]>;
  /** Expiry Date of loyalty points, if type is ISSUE */
  expiryDate?: Maybe<Scalars["DateTime"]>;
  /** Internal calculated field that tells how many points from this ledger is used or expired */
  pointsRemaining?: Maybe<Scalars["Float"]>;
  /** Internal calculated field useful for loyalty burn and expiry.  */
  details?: Maybe<Scalars["JSON"]>;
};

export type LoyaltyLedgerOutputType = {
  __typename?: "LoyaltyLedgerOutputType";
  id?: Maybe<Scalars["ID"]>;
  /** Loyalty ledger points */
  points?: Maybe<Scalars["Float"]>;
  /**
   * Snapshot of the balance when ledger entry was created
   * This is never updated.
   */
  balanceSnapshot?: Maybe<Scalars["Float"]>;
  /** Internal calculated field that tells how many points from this ledger is used or expired */
  pointsRemaining?: Maybe<Scalars["Float"]>;
  /**
   * Type of ledger entry.
   * 1. EXPIRED
   * 2. ISSUE
   * 3. REDUCE
   */
  type?: Maybe<Scalars["String"]>;
  /** Expiry Date of loyalty points, if type is ISSUE */
  expiryDate?: Maybe<Scalars["String"]>;
  /** Internal calculated field useful for loyalty burn and expiry.  */
  details?: Maybe<Scalars["JSON"]>;
  /** Description of ledger entry */
  remarks?: Maybe<Scalars["String"]>;
};

export type LoyaltyProgram = {
  __typename?: "LoyaltyProgram";
  loyaltyBurnRule?: Maybe<Rule>;
  loyaltyEarnRule?: Maybe<Rule>;
  loyaltyExpiryRule?: Maybe<Rule>;
  expiryUnit?: Maybe<ExpiryUnit>;
  expiryValue?: Maybe<Scalars["Int"]>;
  campaign?: Maybe<Campaign>;
  code?: Maybe<Scalars["String"]>;
  loyaltyCode?: Maybe<Scalars["String"]>;
  /** Code for the loyalty card  */
  loyaltyCardCode?: Maybe<Scalars["String"]>;
  /** UUID for the organization */
  organizationId?: Maybe<Scalars["String"]>;
  loyaltyCard?: Maybe<LoyaltyCard>;
};

export type LoyaltyProgramInput = {
  loyaltyCode: Scalars["String"];
  /** Code for the loyalty card  */
  loyaltyCardCode?: Maybe<Scalars["String"]>;
  /** UUID for the organization */
  organizationId?: Maybe<Scalars["String"]>;
};

export type LoyaltyProgramPage = {
  __typename?: "LoyaltyProgramPage";
  data?: Maybe<Array<Maybe<LoyaltyProgram>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type LoyaltyStatus = {
  __typename?: "LoyaltyStatus";
  statusId?: Maybe<Scalars["Int"]>;
  statusCode?: Maybe<Scalars["String"]>;
  statusType?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type LoyaltyStatusInput = {
  statusId: Scalars["String"];
  statusCode: StatusCodes;
  statusType?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type LoyaltyStatusOutput = {
  __typename?: "LoyaltyStatusOutput";
  statusId?: Maybe<Scalars["Int"]>;
  statusCode?: Maybe<Scalars["String"]>;
  statusType?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type LoyaltyTransaction = {
  __typename?: "LoyaltyTransaction";
  id?: Maybe<Scalars["String"]>;
  statusCode?: Maybe<LoyaltyStatus>;
  code?: Maybe<Scalars["String"]>;
  pointsBlocked?: Maybe<Scalars["Float"]>;
  pointsIssued?: Maybe<Scalars["Float"]>;
  pointsRedeemed?: Maybe<Scalars["Float"]>;
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  loyaltyLedgers?: Maybe<Array<Maybe<LoyaltyLedger>>>;
  customerLoyalty?: Maybe<CustomerLoyaltyOutput>;
  loyaltyProgram?: Maybe<LoyaltyProgram>;
};

export type LoyaltyTransactionPage = {
  __typename?: "LoyaltyTransactionPage";
  data?: Maybe<Array<Maybe<CustomerLoyaltyTransactionData>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type Member = {
  __typename?: "Member";
  applicationId?: Maybe<Scalars["ID"]>;
  application?: Maybe<Application>;
  user?: Maybe<User>;
  Role?: Maybe<Scalars["String"]>;
};

export enum Message_Format {
  Sms = "SMS",
  Push = "PUSH",
  Email = "EMAIL"
}

export type MessageTemplate = {
  __typename?: "MessageTemplate";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  messageFormat?: Maybe<Message_Format>;
  templateBodyText?: Maybe<Scalars["String"]>;
  templateSubjectText?: Maybe<Scalars["String"]>;
  templateStyle?: Maybe<Template_Style>;
  organization?: Maybe<Organization>;
  messageTemplateVariables?: Maybe<Array<Maybe<MessageTemplateVariable>>>;
  status?: Maybe<Status>;
};

export type MessageTemplateVariable = {
  __typename?: "MessageTemplateVariable";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  key?: Maybe<Scalars["String"]>;
  type: Variable_Type;
  format: Variable_Format;
  defaultValue?: Maybe<Scalars["String"]>;
  required?: Maybe<Scalars["Boolean"]>;
  organization?: Maybe<Organization>;
  status?: Maybe<Status>;
};

export type Metric = {
  __typename?: "Metric";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  query?: Maybe<Scalars["String"]>;
  type?: Maybe<Metric_Type>;
  filters?: Maybe<Array<Maybe<MetricFilter>>>;
  organization?: Maybe<Organization>;
  status?: Maybe<Status>;
  source?: Maybe<Db_Source>;
};

export enum Metric_Filter_Type {
  Number = "NUMBER",
  String = "STRING",
  Datetime = "DATETIME"
}

export enum Metric_Type {
  Scalar = "SCALAR",
  Sequence = "SEQUENCE",
  Matrix = "MATRIX"
}

export type MetricAddInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  query: Scalars["String"];
  type: Metric_Type;
  filters: Array<Maybe<Scalars["String"]>>;
  organizationId?: Maybe<Scalars["ID"]>;
  source: Db_Source;
};

export type MetricExecutionResult = {
  __typename?: "MetricExecutionResult";
  name?: Maybe<Scalars["String"]>;
  type?: Maybe<Metric_Type>;
  rows?: Maybe<Scalars["Int"]>;
  cols?: Maybe<Scalars["Int"]>;
  headers?: Maybe<Array<Maybe<Scalars["String"]>>>;
  data?: Maybe<Scalars["JSON"]>;
  total?: Maybe<Scalars["Int"]>;
};

export type MetricExecutionResultPage = {
  __typename?: "MetricExecutionResultPage";
  data?: Maybe<Array<Maybe<MetricExecutionResult>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type MetricFilter = {
  __typename?: "MetricFilter";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  key?: Maybe<Scalars["String"]>;
  type?: Maybe<Metric_Filter_Type>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
};

export type MetricFilterAddInput = {
  key: Scalars["String"];
  name: Scalars["String"];
  type: Metric_Filter_Type;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type MetricFilterPage = {
  __typename?: "MetricFilterPage";
  data?: Maybe<Array<Maybe<MetricFilter>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type MetricFilterUpdateInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  type?: Maybe<Metric_Filter_Type>;
  key?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organizationId: Scalars["ID"];
};

export type MetricPage = {
  __typename?: "MetricPage";
  data?: Maybe<Array<Metric>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type MetricUpdateInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  query?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  type?: Maybe<Metric_Type>;
  filters?: Maybe<Array<Maybe<Scalars["String"]>>>;
  status?: Maybe<Status>;
  source?: Maybe<Db_Source>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type Mutation = {
  __typename?: "Mutation";
  createMetric?: Maybe<Metric>;
  updateMetric?: Maybe<Metric>;
  createMetricFilter?: Maybe<MetricFilter>;
  updateMetricFilter?: Maybe<MetricFilter>;
  createWebhookEventType?: Maybe<WebhookEvent>;
  updateWebhookEventType?: Maybe<WebhookEvent>;
  createWebhook?: Maybe<Webhook>;
  updateWebhook?: Maybe<Webhook>;
  createWebhookEventData?: Maybe<WebhookEventData>;
  updateWebhookEventData?: Maybe<WebhookEventData>;
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  deleteUserById?: Maybe<Scalars["Boolean"]>;
  linkApplicationToUser?: Maybe<User>;
  addUserToOrganization?: Maybe<User>;
  updatePassword?: Maybe<UpdatePasswordResponse>;
  confirmEmail?: Maybe<ConfirmEmailResponse>;
  sendPasswordResetLink?: Maybe<ResetPasswordResponse>;
  createOrganization?: Maybe<Organization>;
  deleteOrganization: DeleteOrganization;
  updateOrganization: Organization;
  deleteOrganizationHierarchy?: Maybe<Array<Maybe<DeleteOrganization>>>;
  linkUserToOrganization?: Maybe<Organization>;
  linkOrganizationToparent?: Maybe<Organization>;
  linkOrganizationToWalkinProducts?: Maybe<Organization>;
  linkOrganizationToMetrics?: Maybe<Array<Maybe<Metric>>>;
  /** Generate a API key for the application */
  generateAPIKey?: Maybe<ApiKey>;
  /** Delete an application from the database */
  deleteApplication?: Maybe<Scalars["Boolean"]>;
  /** Update information of already existing application */
  updateApplication?: Maybe<Application>;
  updateAPIKey?: Maybe<ApiKey>;
  /**  Create an application for an organization  */
  createApplication?: Maybe<Application>;
  login: Jwt;
  logout?: Maybe<Scalars["Boolean"]>;
  refreshToken: Jwt;
  addRole?: Maybe<Role>;
  editRole?: Maybe<Role>;
  deleteRole?: Maybe<Role>;
  addPolicyToRole?: Maybe<Policy>;
  addPoliciesToRole?: Maybe<Role>;
  removePolicyFromRole?: Maybe<Role>;
  removePoliciesFromRole?: Maybe<Role>;
  editPolicy?: Maybe<Policy>;
  linkUserToRole?: Maybe<User>;
  linkUsersToRole?: Maybe<Array<Maybe<User>>>;
  linkRolesToUser?: Maybe<User>;
  unlinkUserToRole?: Maybe<User>;
  unlinkUsersFromRole?: Maybe<Array<Maybe<User>>>;
  unlinkRolesFromUser?: Maybe<User>;
  createStoreAdminLevel?: Maybe<StoreAdminLevel>;
  updateStoreAdminLevel?: Maybe<StoreAdminLevel>;
  updateStore?: Maybe<Store>;
  createStore?: Maybe<Store>;
  updateStoreByCode?: Maybe<Store>;
  pushEvents?: Maybe<Array<Maybe<Event>>>;
  processEventById?: Maybe<Scalars["JSON"]>;
  createEventSubscription?: Maybe<EventSubscription>;
  deleteEventSubscription?: Maybe<TypeDeleteEventSubscription>;
  createEventType?: Maybe<EventType>;
  updateEventType?: Maybe<EventType>;
  deleteEventType?: Maybe<TypeDeleteEvent>;
  createRuleEntity?: Maybe<RuleEntity>;
  disableRuleEntity?: Maybe<RuleEntity>;
  createRuleAttribute?: Maybe<RuleAttribute>;
  disableRuleAttribute?: Maybe<RuleAttribute>;
  createRule?: Maybe<Rule>;
  updateRule?: Maybe<Rule>;
  disableRule?: Maybe<Rule>;
  createBusinessRule?: Maybe<BusinessRule>;
  updateBusinessRule?: Maybe<BusinessRule>;
  deleteBusinessRule?: Maybe<BusinessRule>;
  createBusinessRuleDetail?: Maybe<BusinessRuleDetail>;
  updateBusinessRuleDetail?: Maybe<BusinessRuleDetail>;
  deleteBusinessRuleDetail?: Maybe<BusinessRuleDetail>;
  updateBusinessRuleByRuleType?: Maybe<BusinessRule>;
  createWorkflow?: Maybe<Workflow>;
  createWorkflowWithChildren?: Maybe<Workflow>;
  updateWorkflow?: Maybe<Workflow>;
  createWorkflowProcess?: Maybe<WorkflowProcess>;
  updateWorkflowProcess?: Maybe<WorkflowProcess>;
  createWorkflowProcessTransition?: Maybe<WorkflowProcessTransition>;
  updateWorkflowProcessTransition?: Maybe<WorkflowProcessTransition>;
  createWorkflowState?: Maybe<WorkflowState>;
  updateWorkflowState?: Maybe<WorkflowState>;
  createWorkflowEntity?: Maybe<WorkflowEntity>;
  updateWorkflowEntity?: Maybe<WorkflowEntity>;
  addWorkflowEnityTransitionStatus?: Maybe<WorkflowEntityTransition>;
  createWorkflowRoute?: Maybe<WorkflowRoute>;
  updateWorkflowRoute?: Maybe<WorkflowRoute>;
  createCustomer?: Maybe<Customer>;
  createBulkCustomer?: Maybe<CreateBulkCustomerResponse>;
  updateCustomer?: Maybe<UpdateCustomer>;
  createCustomerDevice?: Maybe<CustomerDevice>;
  updateCustomerDevice?: Maybe<CustomerDevice>;
  disableCustomer?: Maybe<Customer>;
  disableCustomerDevice?: Maybe<CustomerDevice>;
  uploadFileForCreateBulkCustomer?: Maybe<
    UploadFileForCreateBulkCustomerResponse
  >;
  /**  Creates new entry for entityExtend  */
  addEntityExtend?: Maybe<EntityExtend>;
  /**  Creates new entry for entity extend fields  */
  addEntityExtendField?: Maybe<EntityExtendField>;
  createActionDefinition?: Maybe<ActionDefinition>;
  updateActionDefinition?: Maybe<ActionDefinition>;
  disableActionDefinition?: Maybe<Scalars["Int"]>;
  executeAction?: Maybe<Action>;
  startSession?: Maybe<Session>;
  endSession?: Maybe<Session>;
  createSegmentForCustomers?: Maybe<Segment>;
  createSegment?: Maybe<Segment>;
  updateSegment?: Maybe<Segment>;
  disableSegment?: Maybe<Segment>;
  createCampaign?: Maybe<Campaign>;
  updateCampaign?: Maybe<Campaign>;
  launchCampaign?: Maybe<Campaign>;
  preprocessLaunchCampaign?: Maybe<Campaign>;
  pauseCampaign?: Maybe<Campaign>;
  unpauseCampaign?: Maybe<Campaign>;
  completeCampaign?: Maybe<Campaign>;
  abandonCampaign?: Maybe<Campaign>;
  disableCampaign?: Maybe<Campaign>;
  linkCampaignToApplication?: Maybe<Campaign>;
  unlinkCampaignFromApplication?: Maybe<Campaign>;
  jobManageEndedCampaigns?: Maybe<Scalars["Boolean"]>;
  createAudience?: Maybe<Array<Maybe<Audience>>>;
  updateAudience?: Maybe<Audience>;
  createAudienceForCampaign?: Maybe<Array<Maybe<Audience>>>;
  createCampaignControl?: Maybe<CampaignControl>;
  updateCampaignControl?: Maybe<CampaignControl>;
  createGlobalControl?: Maybe<GlobalControl>;
  deactivateGlobalControl?: Maybe<GlobalControl>;
  createAudienceMember?: Maybe<AudienceMember>;
  updateAudienceMember?: Maybe<AudienceMember>;
  createFileSystem?: Maybe<FileSystem>;
  updateFileSystem?: Maybe<FileSystem>;
  deleteFileSystem?: Maybe<Scalars["Boolean"]>;
  generateSignedUploadURL?: Maybe<SignedUrl>;
  uploadFile?: Maybe<File>;
  updateFile?: Maybe<File>;
  deleteFile?: Maybe<Scalars["Boolean"]>;
  createMessageTemplate?: Maybe<MessageTemplate>;
  updateMessageTemplate?: Maybe<MessageTemplate>;
  createMessageTemplateVariable?: Maybe<MessageTemplateVariable>;
  updateMessageTemplateVariable?: Maybe<MessageTemplateVariable>;
  addVariableToMessageTemplate?: Maybe<MessageTemplate>;
  removeVariableFromMessageTemplate?: Maybe<MessageTemplate>;
  formatMessage?: Maybe<FormatMessage>;
  sendMessage?: Maybe<Scalars["Boolean"]>;
  createCommunicationWithMessageTempate?: Maybe<Communication>;
  updateCommunicationWithMessageTempate?: Maybe<Communication>;
  createCommunication?: Maybe<Communication>;
  updateCommunication?: Maybe<Communication>;
  disableCommunication?: Maybe<Communication>;
  addCommunicationLog?: Maybe<CommunicationLog>;
  updateCommunicationLog?: Maybe<CommunicationLog>;
  createCatalog: Catalog;
  updateCatalog: Catalog;
  createCategory: Category;
  updateCategory: Category;
  disableCategory: Category;
  createOption?: Maybe<Option>;
  updateOption?: Maybe<Option>;
  createOptionValue?: Maybe<OptionValue>;
  updateOptionValue?: Maybe<OptionValue>;
  createProduct?: Maybe<Product>;
  updateProduct?: Maybe<Product>;
  disableProduct?: Maybe<Product>;
  createProductOption?: Maybe<ProductOption>;
  updateProductOption?: Maybe<ProductOption>;
  createProductVariant?: Maybe<ProductVariant>;
  updateProductVariant?: Maybe<ProductVariant>;
  createProductVariantValue?: Maybe<ProductVariantValue>;
  updateProductVariantValue?: Maybe<ProductVariantValue>;
  createProductCategory?: Maybe<ProductCategory>;
  updateProductCategory?: Maybe<ProductCategory>;
  createChargeType?: Maybe<Charge>;
  updateChargeType?: Maybe<Charge>;
  deleteChargeType?: Maybe<Scalars["Boolean"]>;
  createChannel?: Maybe<Channel>;
  updateChannel?: Maybe<Channel>;
  deleteChannel?: Maybe<Scalars["Boolean"]>;
  createTaxType?: Maybe<TaxType>;
  updateTaxType?: Maybe<TaxType>;
  createStoreFormat?: Maybe<StoreFormat>;
  updateStoreFormat?: Maybe<StoreFormat>;
  addReportConfig?: Maybe<ReportConfig>;
  deactivateReportConfig?: Maybe<Scalars["Boolean"]>;
  addReport?: Maybe<Report>;
  deleteReport?: Maybe<Scalars["Boolean"]>;
  addOfferToCampaign?: Maybe<CampaignOfferOutput>;
  removeOfferFromCampaign?: Maybe<Array<Maybe<CampaignOfferOutput>>>;
  createCustomerOffer?: Maybe<CustomerOffersOutput>;
  updateCustomerOffer?: Maybe<CustomerOffersOutput>;
  deactivateCustomerOffer?: Maybe<CustomerOffersOutput>;
  createOffer?: Maybe<Offer>;
  updateOffer?: Maybe<Offer>;
  launchOffer?: Maybe<Offer>;
  closeOffer?: Maybe<Offer>;
  redeemOffer?: Maybe<RedemptionOutput>;
  initializeHyperX?: Maybe<HyperXOutput>;
  /**
   * Creates a feedback form
   * This creates a feedback form for the inputs provided which needs to exist inorder to send ,
   * it also contains the starting points for the questionnaire. Which needs to be attached seperatley.
   */
  createFeedbackForm?: Maybe<FeedbackForm>;
  /**
   * Update the feedback form for a campaign,
   * You can update any attribute of a feedback form using this API
   */
  updateFeedbackForm?: Maybe<FeedbackForm>;
  /**
   * Delete a feedback form from a campaign
   * This api will delete a feedback form, however eventually delete should only mean status changing to inactive
   */
  deleteFeedbackForm?: Maybe<FeedbackForm>;
  /**
   * Feedback UI config is an entity auto created when we create a feedback form.
   * One feedback form has only one feedback ui config
   * it is required to configure the ui for the feedback form, it is read by the
   * front end scripts to use these variables and update components in the Feedback Form UI
   * There is no find create or delete api for this as the control entirely lies with the feedback form.
   */
  updateFeedbackUIConfig?: Maybe<FeedbackUiConfig>;
  /**
   * This is a very important API  as without linking the feedback form to a
   * feedback UI template there will be no rendering of the feedback form
   * A feedback form template is just the hosted feedback form, which uses the
   * config from the feedback form to personalize it for the user.
   * The template also contains the URL which will house the feedback form, Few
   * feedback forms are added to the DB in the table feedback_template_url , as a
   * part of the factory setup
   * and can be used to link here. If a custom ui is used then an entry needs to be
   * added in the feedback_template_url table using the createfeedbacktemplate api
   * and the saved ID should be used here to link it.
   */
  linkFeedbackFormToFeedbackTemplate?: Maybe<FeedbackForm>;
  /**
   * The feedback form templates can be delinked before linking it to some other
   * feedback form here. It is not adviced to overwrite the linked feedback form
   * using the link api
   * so it's necessary to unlink before relinking.
   */
  unlinkFeedbackFormFromFeedbackTemplate?: Maybe<FeedbackForm>;
  /**
   * Will be used to create the feedback root category
   * We need to create a feedback category root before adding a node because the feedback category is a tree
   * and we need a root node before we can create the childrens.
   * STILL IN DEVELOPMENT
   */
  createFeedbackCategoryRoot?: Maybe<FeedbackCategory>;
  /**
   * Adds a new category to the existing category tree
   * Please make sure you have a node or a root before adding a node, as feedback
   * category is a tree with 1 root and multiple nodes
   * STILL IN DEVELOPMENT
   */
  addFeedbackCategoryNode?: Maybe<FeedbackCategory>;
  /**
   * Update an existing category for feedback
   * You can directly update the attributes of a feedback category node using this api
   * STILL IN DEVELOPMENT
   */
  updateFeedbackCategory?: Maybe<FeedbackCategory>;
  /**
   * Link an existing question to an category
   * This is necessary to track the health of a category using all the questions connected to the category, so it is
   * necessary to connect feedback category to connect to the questions for analytics and automatic triggers
   * STILL IN DEVELOPMENT
   */
  linkFeedbackCategorytoQuestion?: Maybe<FeedbackCategory>;
  /**
   * A customer feedback serves as an entity used to track a feedback generated for a customer,
   * We also send it as the parameter for customer feedback urls to track the relevant customer feedback
   * The url in the www.somefeedbackformdomain.com/customer-feedback-id
   * A customer feedback is connected to the feedback form which is connected to the questionnaire
   * and CF is also connected to the answers a customer gives, via feedback response.
   * You can manually create a customer feedback using this API however, this API is internally called by events framework
   */
  createCustomerFeedback?: Maybe<CustomerFeedback>;
  /**
   * This internal use API is called after an event has been created in the system,
   * and if the event is subscribed to REFINEX_SEND_FEEDBACK
   * then this mutation is being called, from the event processor.
   */
  refineXSendFeedbackByEventId?: Maybe<Scalars["JSON"]>;
  /** This external use API is called to directly send customer feedback without creating an event */
  refineXSendFeedbackByInput?: Maybe<Scalars["JSON"]>;
  /**
   * Create root or first question for a feedback form , this is being called from the console to create a questionnaire root.
   * We define a questionnaire root as the first question of the feedback form, the
   * entire questionnaire is a tree, where a question
   * hasmany answer which hasone question.
   */
  createQuestionnaire?: Maybe<Question>;
  /**
   * Add a new Question to the database. This is being called from the console on adding new questions to the questionnaire,
   * since questionniare is a tree, where a question is connected to a choice which
   * is connected to a questionnaire, this needs a choice id for the branching logic
   */
  addQuestion?: Maybe<Question>;
  /**
   * Add a choice for a Question
   * Used from the console mainly, to add a choice for a question.
   */
  addChoice?: Maybe<Array<Maybe<Choice>>>;
  /** Used to remove a question from the database */
  removeQuestion?: Maybe<RemovedQuestion>;
  /** Remove a choice from the database . */
  removeChoice?: Maybe<DeletedChoice>;
  /** Edit a question already saved in database  */
  editQuestion?: Maybe<Question>;
  /** Edit a choice already saved in DB */
  editChoice?: Maybe<Choice>;
  /** Link a choice to a question , also used to update the relation between the question and the choice. */
  linkChoiceToQuestion?: Maybe<Choice>;
  /**
   * Submit the response of the User to server
   * This api is called from the front end to submit an answer at each page.
   *
   *        This API will be deprecated in favour of new feedback capture API's
   * nextQuestion, previousQuestion and SubmitResponse
   */
  submitResponse?: Maybe<ResponseSubmit>;
  /**
   * Edit the response being submitted by the user
   * This api is called to update an already given response.
   *
   *       This API will be deprecated in favour of new feedback capture API's
   * nextQuestion, previousQuestion and SubmitResponse
   */
  updateResponse?: Maybe<ResponseDep>;
  /**
   * Intialize refinex for an organization, used when the organization starts using refinex,
   * Adds basic workflows and other factory data required for functioning of refinex
   */
  initializeRefineX?: Maybe<Scalars["Boolean"]>;
  /**
   * In case a custom feedback UI is being used, this api is called inorder to use
   * the custom deployment, in case the feedback form is deployed at some other URL
   * please use the updateFeedbackTemplate API to update the database
   */
  addFeedbackTemplateUrl?: Maybe<FeedbackTemplateUrl>;
  /** This API can update the attributes for the custom deployed template. */
  updateFeedbackTemplateUrl?: Maybe<FeedbackTemplateUrl>;
  /** This api is used to delete any custom deployed feedback form template url. */
  deleteFeedbackTemplateUrl?: Maybe<FeedbackTemplateUrl>;
  createFeedbackTemplate?: Maybe<FeedbackForm>;
  deleteFeedbackTemplate?: Maybe<DeletedFeedbackTemplateUrl>;
  initCustomerFeedback?: Maybe<InitCustomerFeedbackData>;
  previousQuestions?: Maybe<Array<Maybe<Question>>>;
  nextQuestions?: Maybe<Array<Maybe<Question>>>;
  submitResponses?: Maybe<Scalars["Boolean"]>;
  /** Creates a Loyalty Card for an organization */
  createLoyaltyCard?: Maybe<LoyaltyCard>;
  /** Updates LoyaltyCard based on ID */
  updateLoyaltyCard?: Maybe<LoyaltyCard>;
  /** Creates Customer Loyalty for a customer */
  createCustomerLoyalty?: Maybe<CustomerLoyaltyOutput>;
  /** Create a new Currency. Currency defines the conversion between points and actual tender */
  createCurrency?: Maybe<Currency>;
  /** Updates Currency queriable by code */
  updateCurrency?: Maybe<Currency>;
  issuePoints?: Maybe<ProcessLoyaltyOutput>;
  burnPoints?: Maybe<ProcessLoyaltyOutput>;
  expireCustomerLoyaltyPoints?: Maybe<Scalars["Boolean"]>;
  blockPoints?: Maybe<EarnableLoyaltyTransactionOutput>;
  applyBlock?: Maybe<Scalars["Boolean"]>;
  loyaltyTransactionCompleted?: Maybe<TransactionStatusOutput>;
  cancelLoyaltyTransaction?: Maybe<CancelLoyaltyTransactionOutput>;
  createLoyaltyTransactionStatusCodes?: Maybe<LoyaltyStatusOutput>;
  processLoyaltyIssuance?: Maybe<ProcessLoyaltyOutput>;
  processLoyaltyRedemption?: Maybe<ProcessLoyaltyOutput>;
  createOrUpdateLoyaltyTransaction?: Maybe<LoyaltyTransaction>;
  processLoyaltyTransaction?: Maybe<TransactionStatus>;
  issuePointsWithOrderId?: Maybe<ProcessLoyaltyOutput>;
  initiateLoyaltyTransaction?: Maybe<TransactionStatus>;
  /** Creates a new loyalty program */
  createLoyaltyProgram?: Maybe<LoyaltyProgram>;
  updateLoyaltyProgram?: Maybe<LoyaltyProgram>;
  createCustomerSession: CreateCustomerSessionOutput;
  updateCustomerProfileInSession: UpdateCustomerProfileOutputInSession;
  /** Intialize NearX for an organization, used when the organization starts using nearX, */
  initializeNearX?: Maybe<Scalars["Boolean"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateMetricArgs = {
  input?: Maybe<MetricAddInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateMetricArgs = {
  input?: Maybe<MetricUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateMetricFilterArgs = {
  input?: Maybe<MetricFilterAddInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateMetricFilterArgs = {
  input?: Maybe<MetricFilterUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWebhookEventTypeArgs = {
  input?: Maybe<WebhookEventTypeAddInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWebhookEventTypeArgs = {
  input?: Maybe<WebhookEventTypeUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWebhookArgs = {
  input?: Maybe<WebhookAddInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWebhookArgs = {
  input?: Maybe<WebhookUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWebhookEventDataArgs = {
  input?: Maybe<WebhookEventDataAddInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWebhookEventDataArgs = {
  input?: Maybe<WebhookEventDataUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateUserArgs = {
  input: UserCreateInput;
  createOrganization?: Maybe<CreateOrganizationInput>;
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateUserArgs = {
  input?: Maybe<UserUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteUserByIdArgs = {
  id?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkApplicationToUserArgs = {
  userId?: Maybe<Scalars["String"]>;
  applicationID?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddUserToOrganizationArgs = {
  userData: UserCreateInput;
  organization_id: Scalars["ID"];
  role_id?: Maybe<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdatePasswordArgs = {
  oldPassword?: Maybe<Scalars["String"]>;
  newPassword?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationConfirmEmailArgs = {
  email?: Maybe<Scalars["String"]>;
  emailToken?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationSendPasswordResetLinkArgs = {
  email?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateOrganizationArgs = {
  organizationInput: CreateOrganizationInput;
  parentId?: Maybe<Scalars["ID"]>;
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
  adminUserInput?: Maybe<UserCreateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteOrganizationArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateOrganizationArgs = {
  organization: UpdateOrganizationInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteOrganizationHierarchyArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkUserToOrganizationArgs = {
  organizationId: Scalars["ID"];
  userId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkOrganizationToparentArgs = {
  organizationId: Scalars["ID"];
  parentId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkOrganizationToWalkinProductsArgs = {
  organizationId: Scalars["ID"];
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkOrganizationToMetricsArgs = {
  organizationId: Scalars["ID"];
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationGenerateApiKeyArgs = {
  id: Scalars["ID"];
  environment?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteApplicationArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateApplicationArgs = {
  input: ApplicationUpdateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateApiKeyArgs = {
  input?: Maybe<ApiKeyInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateApplicationArgs = {
  organizationId: Scalars["ID"];
  input: ApplicationInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLoginArgs = {
  input: LoginInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLogoutArgs = {
  input?: Maybe<Scalars["Boolean"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRefreshTokenArgs = {
  jwt: Scalars["String"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddRoleArgs = {
  input: RoleInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationEditRoleArgs = {
  input: RoleEditInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteRoleArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddPolicyToRoleArgs = {
  roleId: Scalars["ID"];
  input: PolicyInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddPoliciesToRoleArgs = {
  roleId: Scalars["ID"];
  inputs: Array<Maybe<PolicyInput>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRemovePolicyFromRoleArgs = {
  roleId: Scalars["ID"];
  policyId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRemovePoliciesFromRoleArgs = {
  roleId: Scalars["ID"];
  policyIds: Array<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationEditPolicyArgs = {
  input: PolicyEditInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkUserToRoleArgs = {
  roleId: Scalars["ID"];
  userId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkUsersToRoleArgs = {
  roleId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkRolesToUserArgs = {
  roleIds: Array<Scalars["ID"]>;
  userId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUnlinkUserToRoleArgs = {
  roleId: Scalars["ID"];
  userId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUnlinkUsersFromRoleArgs = {
  roleId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUnlinkRolesFromUserArgs = {
  roleIds: Array<Scalars["ID"]>;
  userId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateStoreAdminLevelArgs = {
  input: CreateStoreAdminLevel;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateStoreAdminLevelArgs = {
  input: UpdateStoreAdminLevel;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateStoreArgs = {
  input: UpdateStoreInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateStoreArgs = {
  input: CreateStoreInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateStoreByCodeArgs = {
  input: CreateStoreInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationPushEventsArgs = {
  events: Array<Maybe<EventInput>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationProcessEventByIdArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateEventSubscriptionArgs = {
  eventTypeId: Scalars["ID"];
  triggerAction: TriggerActionEnum;
  customActionId?: Maybe<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteEventSubscriptionArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateEventTypeArgs = {
  code: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  applicationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateEventTypeArgs = {
  id: Scalars["ID"];
  code?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteEventTypeArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateRuleEntityArgs = {
  input: CreateRuleEntityInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableRuleEntityArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateRuleAttributeArgs = {
  input: CreateRuleAttributeInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableRuleAttributeArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateRuleArgs = {
  input: CreateRuleInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateRuleArgs = {
  id: Scalars["ID"];
  input: UpdateRuleInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableRuleArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateBusinessRuleArgs = {
  input?: Maybe<CreateBusinessRuleInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateBusinessRuleArgs = {
  id: Scalars["ID"];
  input?: Maybe<UpdateBusinessRuleInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteBusinessRuleArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateBusinessRuleDetailArgs = {
  input?: Maybe<CreateBusinessRuleDetailInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateBusinessRuleDetailArgs = {
  id: Scalars["ID"];
  input?: Maybe<UpdateBusinessRuleDetailInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteBusinessRuleDetailArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateBusinessRuleByRuleTypeArgs = {
  input?: Maybe<CreateBusinessRuleInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWorkflowArgs = {
  input?: Maybe<WorkflowInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWorkflowWithChildrenArgs = {
  input?: Maybe<WorkflowWithChildrenInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWorkflowArgs = {
  input?: Maybe<UpdateWorkflowInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWorkflowProcessArgs = {
  input?: Maybe<WorkflowProcessInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWorkflowProcessArgs = {
  input?: Maybe<UpdateWorkflowProcessInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWorkflowProcessTransitionArgs = {
  input?: Maybe<WorkflowProcessTransitionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWorkflowProcessTransitionArgs = {
  input?: Maybe<UpdateWorkflowProcessTransitionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWorkflowStateArgs = {
  input?: Maybe<WorkflowStateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWorkflowStateArgs = {
  input?: Maybe<UpdateWorkflowStateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWorkflowEntityArgs = {
  input?: Maybe<WorkflowEntityInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWorkflowEntityArgs = {
  input?: Maybe<UpdateWorkflowEntityInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddWorkflowEnityTransitionStatusArgs = {
  input?: Maybe<WorkflowEntityTransitionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateWorkflowRouteArgs = {
  input?: Maybe<WorkflowRouteInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateWorkflowRouteArgs = {
  input?: Maybe<UpdateWorkflowRouteInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCustomerArgs = {
  customer: CustomerInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateBulkCustomerArgs = {
  customers: Array<Maybe<CustomerInput>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCustomerArgs = {
  customer?: Maybe<UpdateCustomerInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCustomerDeviceArgs = {
  customerDevice: CustomerDeviceInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCustomerDeviceArgs = {
  customerDevice: UpdateCustomerDeviceInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableCustomerArgs = {
  customer: CustomerInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableCustomerDeviceArgs = {
  customerDevice: CustomerDeviceInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUploadFileForCreateBulkCustomerArgs = {
  input?: Maybe<CustomerFileUploadInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddEntityExtendArgs = {
  input: AddEntityExtend;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddEntityExtendFieldArgs = {
  input: AddEntityExtendField;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateActionDefinitionArgs = {
  input?: Maybe<CreateActionDefinitionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateActionDefinitionArgs = {
  input?: Maybe<UpdateActionDefinitionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableActionDefinitionArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationExecuteActionArgs = {
  actionDefinitionName: Scalars["String"];
  request?: Maybe<Scalars["JSON"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationStartSessionArgs = {
  input?: Maybe<StartSessionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationEndSessionArgs = {
  input?: Maybe<EndSessionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateSegmentForCustomersArgs = {
  customerPhoneNumbers?: Maybe<Array<Maybe<Scalars["String"]>>>;
  segmentName?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateSegmentArgs = {
  input?: Maybe<SegmentAddInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateSegmentArgs = {
  input?: Maybe<SegmentUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableSegmentArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCampaignArgs = {
  input?: Maybe<CampaignAddInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCampaignArgs = {
  id: Scalars["ID"];
  input?: Maybe<CampaignUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLaunchCampaignArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationPreprocessLaunchCampaignArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationPauseCampaignArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUnpauseCampaignArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCompleteCampaignArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAbandonCampaignArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableCampaignArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkCampaignToApplicationArgs = {
  campaignId: Scalars["ID"];
  applicationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUnlinkCampaignFromApplicationArgs = {
  campaignId: Scalars["ID"];
  applicationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateAudienceArgs = {
  input?: Maybe<CreateAudienceInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateAudienceArgs = {
  input?: Maybe<UpdateAudienceInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateAudienceForCampaignArgs = {
  campaignId?: Maybe<Scalars["ID"]>;
  segments: Array<Maybe<Scalars["ID"]>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCampaignControlArgs = {
  input?: Maybe<AddCampaignControl>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCampaignControlArgs = {
  input?: Maybe<UpdateCampaignControl>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateGlobalControlArgs = {
  input?: Maybe<AddGlobalControl>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeactivateGlobalControlArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateAudienceMemberArgs = {
  input?: Maybe<AddAudienceMemberInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateAudienceMemberArgs = {
  input?: Maybe<UpdateAudienceMemberInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateFileSystemArgs = {
  input: CreateFileSystemInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateFileSystemArgs = {
  input: UpdateFileSystemInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteFileSystemArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationGenerateSignedUploadUrlArgs = {
  input: SignedUploadUrlInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUploadFileArgs = {
  input: FileUploadInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateFileArgs = {
  file: Scalars["Upload"];
  input: UpdateUploadFileInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteFileArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateMessageTemplateArgs = {
  input: CreateMessageTemplateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateMessageTemplateArgs = {
  input: UpdateMessageTemplateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateMessageTemplateVariableArgs = {
  input: CreateMessageTemplateVariableInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateMessageTemplateVariableArgs = {
  input: UpdateMessageTemplateVariableInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddVariableToMessageTemplateArgs = {
  input: AddVariableToMessageTemplateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRemoveVariableFromMessageTemplateArgs = {
  input: RemoveVariableFromMessageTemplateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationFormatMessageArgs = {
  input: FormatMessageInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationSendMessageArgs = {
  input: SendMessageInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCommunicationWithMessageTempateArgs = {
  communicationInput: CreateCommunicationWithoutMessageTemplateInput;
  messageTemplateInput?: Maybe<CreateMessageTemplateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCommunicationWithMessageTempateArgs = {
  communicationInput: UpdateCommunicationInput;
  messageTemplateInput?: Maybe<UpdateMessageTemplateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCommunicationArgs = {
  input: CreateCommunicationInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCommunicationArgs = {
  input: UpdateCommunicationInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableCommunicationArgs = {
  id: Scalars["ID"];
  organization: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddCommunicationLogArgs = {
  input: CommunicationLogInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCommunicationLogArgs = {
  input: CommunicationLogUpdateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCatalogArgs = {
  input: CatalogInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCatalogArgs = {
  input: UpdateCatalogInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableCategoryArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateOptionArgs = {
  input?: Maybe<OptionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateOptionArgs = {
  input?: Maybe<UpdateOptionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateOptionValueArgs = {
  input?: Maybe<OptionValueInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateOptionValueArgs = {
  input?: Maybe<UpdateOptionValueInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateProductArgs = {
  input: CreateProductInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDisableProductArgs = {
  productName: Scalars["String"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateProductOptionArgs = {
  input?: Maybe<ProductOptionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateProductOptionArgs = {
  input?: Maybe<UpdateProductOptionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateProductVariantArgs = {
  input?: Maybe<ProductVariantInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateProductVariantArgs = {
  input?: Maybe<UpdateProductVariantInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateProductVariantValueArgs = {
  input?: Maybe<ProductVariantValueInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateProductVariantValueArgs = {
  input?: Maybe<UpdateProductVariantValueInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateProductCategoryArgs = {
  input?: Maybe<ProductCategoryInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateProductCategoryArgs = {
  input?: Maybe<UpdateProductCategoryInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateChargeTypeArgs = {
  input?: Maybe<ChargeTypeCreateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateChargeTypeArgs = {
  input?: Maybe<ChargeTypeUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteChargeTypeArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateChannelArgs = {
  input?: Maybe<ChannelTypeInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateChannelArgs = {
  input?: Maybe<ChannelTypeUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteChannelArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateTaxTypeArgs = {
  input?: Maybe<TaxTypeInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateTaxTypeArgs = {
  id: Scalars["ID"];
  input?: Maybe<TaxTypeInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateStoreFormatArgs = {
  input?: Maybe<StoreFormatInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateStoreFormatArgs = {
  id: Scalars["ID"];
  input?: Maybe<StoreFormatInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddReportConfigArgs = {
  name: Scalars["String"];
  description: Scalars["String"];
  organizationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeactivateReportConfigArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddReportArgs = {
  reportConfigId: Scalars["ID"];
  reportFileId: Scalars["ID"];
  reportDate: Scalars["Date"];
  organizationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteReportArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddOfferToCampaignArgs = {
  input?: Maybe<CampaignOfferInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRemoveOfferFromCampaignArgs = {
  input?: Maybe<UpdateCampaignOfferInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCustomerOfferArgs = {
  input: CustomerOffersInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCustomerOfferArgs = {
  input: UpdateCustomerOffersInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeactivateCustomerOfferArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateOfferArgs = {
  input?: Maybe<OfferInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateOfferArgs = {
  input?: Maybe<UpdateOfferInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLaunchOfferArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCloseOfferArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRedeemOfferArgs = {
  input?: Maybe<RedeemOfferInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationInitializeHyperXArgs = {
  organizationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateFeedbackFormArgs = {
  campaignId: Scalars["ID"];
  input: FeedbackFormCreateInput;
  feedbackTemplateId?: Maybe<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateFeedbackFormArgs = {
  input?: Maybe<FeedbackFormUpdateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteFeedbackFormArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateFeedbackUiConfigArgs = {
  feedbackFormId: Scalars["ID"];
  feedbackUIConfig: FeedbackUiConfigUpdateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkFeedbackFormToFeedbackTemplateArgs = {
  feedbackFormId: Scalars["ID"];
  feedbackTemplateId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUnlinkFeedbackFormFromFeedbackTemplateArgs = {
  feedbackFormId: Scalars["ID"];
  feedbackTemplateId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateFeedbackCategoryRootArgs = {
  organizationId: Scalars["ID"];
  input?: Maybe<FeedbackCategoryInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddFeedbackCategoryNodeArgs = {
  parentFeedbackCategoryId: Scalars["ID"];
  input?: Maybe<FeedbackCategoryInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateFeedbackCategoryArgs = {
  input?: Maybe<UpdateFeedbackCategoryInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkFeedbackCategorytoQuestionArgs = {
  feedbackCategoryId: Scalars["ID"];
  questionId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCustomerFeedbackArgs = {
  customerId?: Maybe<Scalars["ID"]>;
  feedbackFormId: Scalars["ID"];
  event_id?: Maybe<Scalars["ID"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRefineXSendFeedbackByEventIdArgs = {
  eventId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRefineXSendFeedbackByInputArgs = {
  campaignId: Scalars["String"];
  customer: EventCustomerInput;
  customerDevice?: Maybe<EventCustomerDeviceInput>;
  forTest?: Maybe<Scalars["Boolean"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateQuestionnaireArgs = {
  feedbackFormId: Scalars["ID"];
  input?: Maybe<QuestionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddQuestionArgs = {
  choiceId: Scalars["ID"];
  input: QuestionInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddChoiceArgs = {
  questionId: Scalars["ID"];
  input: ChoiceInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRemoveQuestionArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationRemoveChoiceArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationEditQuestionArgs = {
  input?: Maybe<EditQuestionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationEditChoiceArgs = {
  input?: Maybe<EditChoiceInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLinkChoiceToQuestionArgs = {
  choiceId: Scalars["ID"];
  questionId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationSubmitResponseArgs = {
  customerFeedbackId: Scalars["ID"];
  choiceIds: Array<Scalars["ID"]>;
  input?: Maybe<CreateResponseInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateResponseArgs = {
  input?: Maybe<EditResponseInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationInitializeRefineXArgs = {
  organizationId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationAddFeedbackTemplateUrlArgs = {
  title: Scalars["String"];
  url: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateFeedbackTemplateUrlArgs = {
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteFeedbackTemplateUrlArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateFeedbackTemplateArgs = {
  input?: Maybe<FeedbackFormCreateInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationDeleteFeedbackTemplateArgs = {
  id: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationInitCustomerFeedbackArgs = {
  customerFeedbackId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationPreviousQuestionsArgs = {
  customerFeedbackId: Scalars["ID"];
  questionIds: Array<Maybe<Scalars["ID"]>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationNextQuestionsArgs = {
  customerFeedbackId: Scalars["ID"];
  responses?: Maybe<Array<Maybe<FeedbackResponse>>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationSubmitResponsesArgs = {
  customerFeedbackId: Scalars["ID"];
  responses: Array<Maybe<FeedbackResponse>>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateLoyaltyCardArgs = {
  input: LoyaltyCardCreateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateLoyaltyCardArgs = {
  input: LoyaltyCardUpdateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCustomerLoyaltyArgs = {
  input: CustomerLoyaltyInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCurrencyArgs = {
  input: CurrencyCreateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCurrencyArgs = {
  input: CurrencyUpdateInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationIssuePointsArgs = {
  input?: Maybe<EarnableLoyaltyTransactionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationBurnPointsArgs = {
  input?: Maybe<EarnableLoyaltyTransactionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationBlockPointsArgs = {
  input?: Maybe<EarnableLoyaltyTransactionInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationApplyBlockArgs = {
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationLoyaltyTransactionCompletedArgs = {
  loyaltyReferenceId: Scalars["ID"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCancelLoyaltyTransactionArgs = {
  externalCustomerId: Scalars["String"];
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  loyaltyType?: Maybe<Scalars["String"]>;
  completeBurn?: Maybe<Scalars["Boolean"]>;
  completeEarn?: Maybe<Scalars["Boolean"]>;
  organizationId?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateLoyaltyTransactionStatusCodesArgs = {
  StatusInput?: Maybe<LoyaltyStatusInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationProcessLoyaltyIssuanceArgs = {
  externalCustomerId?: Maybe<Scalars["String"]>;
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  loyaltyType?: Maybe<Scalars["String"]>;
  data: Scalars["JSON"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationProcessLoyaltyRedemptionArgs = {
  externalCustomerId?: Maybe<Scalars["String"]>;
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  loyaltyType?: Maybe<Scalars["String"]>;
  pointsToRedeem?: Maybe<Scalars["Float"]>;
  data: Scalars["JSON"];
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateOrUpdateLoyaltyTransactionArgs = {
  externalCustomerId?: Maybe<Scalars["String"]>;
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  loyaltyType?: Maybe<Scalars["String"]>;
  statusCode?: Maybe<Scalars["String"]>;
  data?: Maybe<Scalars["JSON"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationProcessLoyaltyTransactionArgs = {
  eventType?: Maybe<Scalars["String"]>;
  loyaltyDate?: Maybe<Scalars["String"]>;
  recordCount?: Maybe<Scalars["Int"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationIssuePointsWithOrderIdArgs = {
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationInitiateLoyaltyTransactionArgs = {
  eventType?: Maybe<Scalars["String"]>;
  loyaltyDate?: Maybe<Scalars["String"]>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateLoyaltyProgramArgs = {
  input: CreateLoyaltyProgramInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateLoyaltyProgramArgs = {
  input?: Maybe<UpdateLoyaltyProgramInput>;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationCreateCustomerSessionArgs = {
  input: CreateCustomerSessionInput;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationUpdateCustomerProfileInSessionArgs = {
  input: UpdateCustomerProfileInputInSession;
};

/**  Mutation is used to Add, Edit or Delete data on server  */
export type MutationInitializeNearXArgs = {
  organizationId: Scalars["ID"];
};

export type Offer = {
  __typename?: "Offer";
  createdBy?: Maybe<Scalars["String"]>;
  createdTime?: Maybe<Scalars["DateTime"]>;
  lastModifiedBy?: Maybe<Scalars["String"]>;
  lastModifiedTime?: Maybe<Scalars["DateTime"]>;
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  offerType?: Maybe<Offer_Type>;
  offerCategory?: Maybe<Offer_Category>;
  reward?: Maybe<Scalars["JSON"]>;
  offerEligibilityRule?: Maybe<Rule>;
  rewardRedemptionRule?: Maybe<Rule>;
  isCustomCoupon?: Maybe<Scalars["Boolean"]>;
  coupon?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  state?: Maybe<Scalars["String"]>;
  stateCode?: Maybe<Scalars["Int"]>;
  status?: Maybe<Status>;
};

export enum Offer_Category {
  AutoApply = "AUTO_APPLY",
  Coupons = "COUPONS"
}

export enum Offer_States {
  Draft = "DRAFT",
  NoState = "NO_STATE",
  Live = "LIVE",
  Closed = "CLOSED"
}

export enum Offer_Type {
  PercentageDiscount = "PERCENTAGE_DISCOUNT",
  FlatxDiscount = "FLATX_DISCOUNT",
  PercentageCashback = "PERCENTAGE_CASHBACK",
  FlatxCashback = "FLATX_CASHBACK",
  FreeItemsFromList = "FREE_ITEMS_FROM_LIST"
}

export type OfferInput = {
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  offerType: Offer_Type;
  offerCategory: Offer_Category;
  reward?: Maybe<Scalars["JSON"]>;
  offerEligibilityRule?: Maybe<Scalars["ID"]>;
  rewardRedemptionRule?: Maybe<Scalars["ID"]>;
  isCustomCoupon?: Maybe<Scalars["Boolean"]>;
  coupon?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type OfferPage = {
  __typename?: "OfferPage";
  data?: Maybe<Array<Maybe<Offer>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type Option = {
  __typename?: "Option";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  optionValues?: Maybe<Array<Maybe<OptionValue>>>;
};

export type OptionInput = {
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  optionValues?: Maybe<Array<Maybe<ValueInput>>>;
};

export type OptionValue = {
  __typename?: "OptionValue";
  id?: Maybe<Scalars["ID"]>;
  value?: Maybe<Scalars["String"]>;
  option?: Maybe<Option>;
};

export type OptionValueInput = {
  optionId: Scalars["ID"];
  value?: Maybe<Scalars["String"]>;
};

export enum Order {
  Asc = "ASC",
  Desc = "DESC"
}

export type Organization = {
  __typename?: "Organization";
  id: Scalars["ID"];
  webhooks?: Maybe<Array<Maybe<Webhook>>>;
  name: Scalars["String"];
  addressLine1?: Maybe<Scalars["String"]>;
  addressLine2?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  pinCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  externalOrganizationId?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  status: Status;
  phoneNumber?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  organizationType?: Maybe<OrganizationTypeEnum>;
  applications?: Maybe<Array<Maybe<Application>>>;
  parent?: Maybe<Organization>;
  children?: Maybe<Array<Maybe<Organization>>>;
  store?: Maybe<Store>;
  users?: Maybe<Array<Maybe<User>>>;
  walkinProducts?: Maybe<Array<Maybe<WalkinProduct>>>;
  rules?: Maybe<Array<Maybe<Rule>>>;
  workflows?: Maybe<Array<Maybe<Workflow>>>;
  actions?: Maybe<Array<Maybe<Action>>>;
};

export type OrganizationWebhooksArgs = {
  event?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export enum OrganizationTypeEnum {
  Organization = "ORGANIZATION",
  Store = "STORE"
}

export type PageOptions = {
  page?: Maybe<Scalars["Int"]>;
  pageSize?: Maybe<Scalars["Int"]>;
};

export type PaginationInfo = {
  __typename?: "PaginationInfo";
  totalPages: Scalars["Int"];
  totalItems: Scalars["Int"];
  page: Scalars["Int"];
  perPage: Scalars["Int"];
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
};

export type PermissionMap = {
  resource?: Maybe<Policy_Resources>;
  permission?: Maybe<Policy_Permissions>;
};

export type Policy = {
  __typename?: "Policy";
  id: Scalars["ID"];
  effect?: Maybe<Policy_Effects>;
  resource?: Maybe<Policy_Resources>;
  permission?: Maybe<Policy_Permissions>;
  type?: Maybe<Policy_Types>;
  accessLevel?: Maybe<Policy_Levels>;
};

export enum Policy_Effects {
  Allow = "ALLOW",
  Deny = "DENY"
}

export enum Policy_Levels {
  Own = "OWN",
  All = "ALL"
}

export enum Policy_Permissions {
  View = "VIEW",
  Modify = "MODIFY",
  Create = "CREATE",
  Read = "READ",
  Update = "UPDATE",
  Delete = "DELETE",
  List = "LIST",
  Search = "SEARCH",
  Execute = "EXECUTE"
}

export enum Policy_Resources {
  Organization = "ORGANIZATION",
  User = "USER",
  Application = "APPLICATION",
  Store = "STORE",
  Role = "ROLE",
  Catalog = "CATALOG",
  Category = "CATEGORY",
  Product = "PRODUCT",
  Webhooks = "WEBHOOKS",
  Events = "EVENTS",
  Places = "PLACES",
  Customer = "CUSTOMER",
  CustomerDevice = "CUSTOMER_DEVICE",
  FeedbackCategory = "FEEDBACK_CATEGORY",
  FeedbackForm = "FEEDBACK_FORM",
  FeedbackResponse = "FEEDBACK_RESPONSE",
  FeedbackQuestion = "FEEDBACK_QUESTION",
  FeedbackChoice = "FEEDBACK_CHOICE",
  Apikey = "APIKEY",
  Action = "ACTION",
  ActionDefnition = "ACTION_DEFNITION",
  Audience = "AUDIENCE",
  BusinessRule = "BUSINESS_RULE",
  Campaign = "CAMPAIGN",
  Communication = "COMMUNICATION",
  EntityExtend = "ENTITY_EXTEND",
  Event = "EVENT",
  FileSystem = "FILE_SYSTEM",
  Member = "MEMBER",
  Metric = "METRIC",
  MetricFilter = "METRIC_FILTER",
  Policy = "POLICY",
  Rule = "RULE",
  Segment = "SEGMENT",
  Session = "SESSION",
  Workflow = "WORKFLOW",
  ReportConfig = "REPORT_CONFIG",
  Reports = "REPORTS",
  File = "FILE",
  CustomerFeedback = "CUSTOMER_FEEDBACK",
  Taxtype = "TAXTYPE",
  Storeformat = "STOREFORMAT",
  RefinexConsole = "REFINEX_CONSOLE",
  DownloadEvents = "DOWNLOAD_EVENTS",
  DownloadCustomers = "DOWNLOAD_CUSTOMERS",
  SettingsGlobal = "SETTINGS_GLOBAL",
  SettingsNearx = "SETTINGS_NEARX",
  UploadPlaces = "UPLOAD_PLACES"
}

export enum Policy_Types {
  Ui = "UI",
  Entity = "ENTITY"
}

export type PolicyEditInput = {
  id: Scalars["ID"];
  effect?: Maybe<Policy_Effects>;
  resource?: Maybe<Policy_Resources>;
  permission?: Maybe<Policy_Permissions>;
  accessLevel?: Maybe<Policy_Levels>;
  type?: Maybe<Policy_Types>;
};

export type PolicyInput = {
  effect?: Maybe<Policy_Effects>;
  resource?: Maybe<Policy_Resources>;
  permission?: Maybe<Policy_Permissions>;
  type?: Maybe<Policy_Types>;
  accessLevel?: Maybe<Policy_Levels>;
};

export type ProcessEventInput = {
  id: Scalars["ID"];
  sourceEventId?: Maybe<Scalars["String"]>;
  sourceEventTime?: Maybe<Scalars["Date"]>;
  sourceName?: Maybe<Scalars["String"]>;
  data?: Maybe<Scalars["JSON"]>;
  metadata?: Maybe<Scalars["JSON"]>;
  eventTypeCode: Scalars["String"];
};

export type ProcessLoyaltyOutput = {
  __typename?: "ProcessLoyaltyOutput";
  id?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  earnedPoints?: Maybe<Scalars["Float"]>;
  earnedAmount?: Maybe<Scalars["String"]>;
  burnedPoints?: Maybe<Scalars["Float"]>;
  burnedAmount?: Maybe<Scalars["String"]>;
  loyaltyCardCode?: Maybe<Scalars["String"]>;
  earnedPointsExpiryValue?: Maybe<Scalars["String"]>;
  earnedPointsExpiryUnit?: Maybe<Scalars["String"]>;
  blockedPoints?: Maybe<Scalars["Float"]>;
};

export type Product = {
  __typename?: "Product";
  id?: Maybe<Scalars["ID"]>;
  code?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  imageUrl?: Maybe<Scalars["String"]>;
  sku?: Maybe<Scalars["String"]>;
  type?: Maybe<ProductTypeEnum>;
  extend?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
};

export type ProductCategory = {
  __typename?: "ProductCategory";
  id?: Maybe<Scalars["ID"]>;
  category?: Maybe<Category>;
  product?: Maybe<Product>;
};

export type ProductCategoryInput = {
  productId: Scalars["ID"];
  categoryId: Scalars["ID"];
};

export type ProductOption = {
  __typename?: "ProductOption";
  id?: Maybe<Scalars["ID"]>;
  option?: Maybe<Option>;
  product?: Maybe<Product>;
};

export type ProductOptionInput = {
  optionId: Scalars["ID"];
  productId: Scalars["ID"];
};

export type ProductSearchInput = {
  categoryId?: Maybe<Scalars["ID"]>;
  organizationId: Scalars["ID"];
};

export enum ProductTypeEnum {
  Regular = "REGULAR",
  Variant = "VARIANT",
  FixedBundle = "FIXED_BUNDLE",
  DynamicBundle = "DYNAMIC_BUNDLE"
}

export type ProductVariant = {
  __typename?: "ProductVariant";
  id?: Maybe<Scalars["ID"]>;
  sku?: Maybe<Scalars["String"]>;
  product?: Maybe<Product>;
  optionValues?: Maybe<Array<Maybe<OptionValue>>>;
};

export type ProductVariantInput = {
  sku: Scalars["String"];
  productId: Scalars["ID"];
};

export type ProductVariantValue = {
  __typename?: "ProductVariantValue";
  id?: Maybe<Scalars["ID"]>;
  productVariant?: Maybe<ProductVariant>;
  optionValue?: Maybe<OptionValue>;
};

export type ProductVariantValueInput = {
  productVariantId: Scalars["ID"];
  optionValueId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type Query = {
  __typename?: "Query";
  metric?: Maybe<Metric>;
  metrics?: Maybe<MetricPage>;
  metricFilter?: Maybe<MetricFilter>;
  metricFilters?: Maybe<MetricFilterPage>;
  executeMetric?: Maybe<MetricExecutionResult>;
  executeMetrics?: Maybe<MetricExecutionResultPage>;
  webhookEventType?: Maybe<WebhookEvent>;
  webhookEventTypes?: Maybe<WebhookEventPage>;
  webhook?: Maybe<Webhook>;
  webhooks?: Maybe<WebhookPage>;
  webhookEventData?: Maybe<WebhookEventDataPage>;
  users?: Maybe<UserPage>;
  user?: Maybe<User>;
  organizationHierarchies?: Maybe<Array<Maybe<Scalars["JSON"]>>>;
  organizationHierarchy?: Maybe<Scalars["JSON"]>;
  organization?: Maybe<Organization>;
  organizationRoots?: Maybe<Array<Maybe<Organization>>>;
  subOrganizations?: Maybe<Array<Maybe<Organization>>>;
  /** Fetch all the Applications data from the server */
  applications: Array<Application>;
  /** Fetch a single Application data for the unique id provided */
  application?: Maybe<Application>;
  roles?: Maybe<Array<Maybe<Role>>>;
  role?: Maybe<Role>;
  store?: Maybe<Store>;
  stores?: Maybe<Array<Maybe<Store>>>;
  storeByCode?: Maybe<Store>;
  storeSearch?: Maybe<StoreSearchOutput>;
  storeDefnition?: Maybe<StoreDefnition>;
  eventById?: Maybe<Event>;
  eventBySourceEventId?: Maybe<Event>;
  eventsByFilters?: Maybe<Array<Maybe<Event>>>;
  eventSubscriptionsForEventType?: Maybe<Array<Maybe<EventSubscription>>>;
  eventSubscriptionById?: Maybe<EventSubscription>;
  eventTypeById?: Maybe<EventType>;
  eventTypeByCode?: Maybe<EventType>;
  eventTypesForApplication?: Maybe<Array<Maybe<EventType>>>;
  ruleEntity?: Maybe<RuleEntity>;
  ruleEntities?: Maybe<Array<Maybe<RuleEntity>>>;
  ruleAttribute?: Maybe<RuleAttribute>;
  ruleAttributes?: Maybe<Array<Maybe<RuleAttribute>>>;
  rule?: Maybe<Rule>;
  rules?: Maybe<Array<Maybe<Rule>>>;
  getSQLFromRule?: Maybe<Sql>;
  evaluateRule?: Maybe<RuleEvaluatioResult>;
  businessRules?: Maybe<Array<Maybe<BusinessRule>>>;
  businessRule?: Maybe<BusinessRule>;
  businessRuleDetails?: Maybe<Array<Maybe<BusinessRuleDetail>>>;
  businessRuleDetail?: Maybe<BusinessRuleDetail>;
  businessRuleConfiguration: Scalars["String"];
  workflow?: Maybe<Workflow>;
  workflowByName?: Maybe<Workflow>;
  workflowDiagram?: Maybe<WorkflowDiagram>;
  workflows?: Maybe<Array<Maybe<Workflow>>>;
  orgWorkflows?: Maybe<Array<Maybe<Workflow>>>;
  workflowState?: Maybe<WorkflowState>;
  workflowStates?: Maybe<Array<Maybe<WorkflowState>>>;
  workflowProcess?: Maybe<WorkflowProcess>;
  workflowProcessByName?: Maybe<Workflow>;
  workflowProcesses?: Maybe<Array<Maybe<WorkflowProcess>>>;
  workflowProcessTransition?: Maybe<WorkflowProcessTransition>;
  workflowProcessTransitions?: Maybe<Array<Maybe<WorkflowProcessTransition>>>;
  workflowEntity?: Maybe<WorkflowEntity>;
  workflowEntityByEntityDetails?: Maybe<WorkflowEntity>;
  workflowEntityTransition?: Maybe<WorkflowEntityTransition>;
  workflowEntityTransitionByEntityId?: Maybe<WorkflowEntityTransition>;
  workflowEntityTransitionHistory?: Maybe<
    Array<Maybe<WorkflowEntityTransitionHistory>>
  >;
  workflowRoute?: Maybe<WorkflowRoute>;
  workflowRoutes?: Maybe<Array<Maybe<WorkflowRoute>>>;
  customer?: Maybe<Customer>;
  customers?: Maybe<Array<Maybe<Customer>>>;
  customerDevice?: Maybe<CustomerDevice>;
  customerDefnition?: Maybe<CustomerDefnition>;
  customerDevicesByCustomerId?: Maybe<Array<Maybe<CustomerDevice>>>;
  customerDevices?: Maybe<Array<Maybe<CustomerDevice>>>;
  customerCount?: Maybe<Scalars["JSON"]>;
  customerSearch?: Maybe<CustomerSearchOutput>;
  getSegmentRuleAsText?: Maybe<Scalars["JSON"]>;
  /**  Fetches entityNames  */
  entities?: Maybe<Array<Maybe<Extend_Entities>>>;
  /**  Fetches all extended entities, specific to organization  */
  entityExtend?: Maybe<EntityExtend>;
  /**  Fetches all extended entities, specific to organization  */
  entityExtendByName?: Maybe<EntityExtend>;
  /**  Fetches corresponding fields of the extended entities specific to organization  */
  entityExtendField?: Maybe<EntityExtendField>;
  /**  Fetches basic fields of an entity  */
  basicFields?: Maybe<Array<Maybe<BasicField>>>;
  actionDefinition?: Maybe<ActionDefinition>;
  actionDefinitions?: Maybe<ActionDefinitionPage>;
  action?: Maybe<Action>;
  actions?: Maybe<ActionPage>;
  session?: Maybe<Session>;
  activeSession?: Maybe<Session>;
  segment?: Maybe<Segment>;
  segments?: Maybe<Array<Maybe<Segment>>>;
  campaign?: Maybe<Campaign>;
  campaigns?: Maybe<Array<Maybe<Campaign>>>;
  audience?: Maybe<Audience>;
  audiences?: Maybe<Array<Maybe<Audience>>>;
  campaignControls?: Maybe<Array<Maybe<CampaignControl>>>;
  globalControls?: Maybe<Array<Maybe<GlobalControl>>>;
  audienceCount?: Maybe<AudienceCountOutput>;
  audienceMembers?: Maybe<Array<Maybe<AudienceMember>>>;
  /** Outputs totalAudienceCount for a campaign. Executes rule associated to campaign & audiences */
  totalAudienceCountForCampaign?: Maybe<AudienceCountOutput>;
  fileSystem?: Maybe<FileSystem>;
  fileSystems?: Maybe<FileSystemsPage>;
  file?: Maybe<File>;
  files?: Maybe<FilesPage>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplates?: Maybe<Array<Maybe<MessageTemplate>>>;
  communication?: Maybe<Communication>;
  communications?: Maybe<Array<Maybe<Communication>>>;
  communicationLog?: Maybe<CommunicationLog>;
  communicationLogs?: Maybe<Array<Maybe<CommunicationLog>>>;
  catalog?: Maybe<Catalog>;
  catalogs?: Maybe<Array<Maybe<Catalog>>>;
  category?: Maybe<Category>;
  categoryByCode?: Maybe<Category>;
  categoriesWithChildren?: Maybe<Category>;
  categories?: Maybe<Array<Maybe<Category>>>;
  optionById?: Maybe<Option>;
  options?: Maybe<Array<Maybe<Option>>>;
  optionValuesByOptionId?: Maybe<Array<Maybe<OptionValue>>>;
  products?: Maybe<Array<Maybe<Product>>>;
  productOptionsByProductId?: Maybe<Array<Maybe<ProductOption>>>;
  productVariantsByProductId?: Maybe<Array<Maybe<ProductVariant>>>;
  productVariantValuesByProductVariantId?: Maybe<
    Array<Maybe<ProductVariantValue>>
  >;
  productCategoriesByCategoryId?: Maybe<Array<Maybe<ProductCategory>>>;
  productCategoriesByCategoryCode?: Maybe<Array<Maybe<ProductCategory>>>;
  chargeTypes?: Maybe<Array<Maybe<Charge>>>;
  chargeType?: Maybe<Charge>;
  channels?: Maybe<Array<Maybe<Channel>>>;
  channel?: Maybe<ChannelPage>;
  taxType?: Maybe<TaxType>;
  taxTypes?: Maybe<TaxTypePage>;
  storeFormat?: Maybe<StoreFormat>;
  storeFormats?: Maybe<StoreFormatPage>;
  reportConfig?: Maybe<ReportConfig>;
  reportConfigs?: Maybe<ReportConfigPage>;
  report?: Maybe<Report>;
  reports?: Maybe<ReportPage>;
  offersForACampaign?: Maybe<CampaignOfferPage>;
  campaignsForOffer?: Maybe<CampaignOfferPage>;
  customerOffer?: Maybe<CustomerOffersOutput>;
  customerOffers?: Maybe<CustomerOfferPage>;
  offer?: Maybe<Offer>;
  offers?: Maybe<OfferPage>;
  redemption?: Maybe<RedemptionOutput>;
  redemptions?: Maybe<Array<Maybe<RedemptionOutput>>>;
  getHyperX?: Maybe<Array<Maybe<HyperXOutput>>>;
  viewCampaignsForHyperX?: Maybe<ViewHyperXCampaignsOutput>;
  viewCampaignForHyperX?: Maybe<ViewHyperXCampaignOutput>;
  /**
   * Fetch a feedback form by id, feedback form provides the starting point for a questionnaire as well as contains
   * settings for a feedback form
   */
  getFeedbackForm?: Maybe<FeedbackForm>;
  /**
   * Fetch all the feedback forms from the database
   * This just returns all the feedback forms from the database, eventually it
   * should be only returning feedback form for the calling entity's organization
   */
  feedbackForms?: Maybe<FeedbackFormsResponse>;
  /**
   * Fetch a feedback category for the unique id
   * A feedback category is used to map a question to a category, think of this as issue tags
   * STILL IN DEVELOPMENT
   */
  feedbackCategory?: Maybe<FeedbackCategory>;
  /**
   * Fetch the entire feedback category tree for an organization
   * The feedback category is actually a tree, so that we can have parent categories and their childrens
   * STILL IN DEVELOPMENT
   */
  feedbackCategoryTree?: Maybe<FeedbackCategory>;
  /**
   * Fetch the Category Sub tree for a Category
   * If you want to get all the categories under a feedack category the you can use this api to get the entiry subtree
   * STILL IN DEVELOPMENT
   */
  feedbackCategorySubTree?: Maybe<FeedbackCategory>;
  /**
   * Fetch all feedback categories from database
   * This just returns all the feedback categories as a flat array, please note
   * that the feedback categories are actually a tree
   * STILL IN DEVELOPMENT
   */
  feedbackCategories?: Maybe<Array<Maybe<FeedbackCategory>>>;
  /**
   * Fetches the customer feedback instance generated for a
   * customer, which has the feedback form nested in it
   */
  customerFeedback?: Maybe<CustomerFeedback>;
  /**
   * This is a newer api created for instances where the feedback form is sent to unknown customer,
   * So we create a new customer based on the customer identifier and then we create a customer feedback,
   * so therefore a customer identifier is necessary, if possible provide a phone
   * number or external customer id as this, or just send any random unique string
   */
  customerFeedbackForNewCustomer?: Maybe<CustomerFeedback>;
  /**
   * Fetches a list of  Feedback form  external customer ID,
   * You can get all the different customer feedbacks generated for the customer, using this API
   */
  customerFeedbackByExternalCustomerId?: Maybe<CustomerFeedbackResponse>;
  /**
   * Fetches a list of  Feedback form  customer mobile number
   * You can get all the different customer feedbacks generated for the customer, using this API
   */
  customerFeedbackByMobileNumber?: Maybe<CustomerFeedbackResponse>;
  /**
   * Gets the entire questionnaire as a tree, givent the root question ID is provided,
   * used in case entire questionnaire needs to be loaded on the client side
   */
  questionHierarchy?: Maybe<Array<Maybe<QuestionTreeData>>>;
  /** Fetch the first question of the feedback form, not being used though as we directly get this data in getFeedbackForm */
  questionnaireRoot?: Maybe<Question>;
  /** Fetch a single question from the server , When you need a single question from the server */
  question?: Maybe<Question>;
  /** Fetch a choice from the server , for when you need to fetch a single choice from the server */
  choice?: Maybe<Choice>;
  /** This returns a list of all the available question types, supported by RefineX */
  questionTypes?: Maybe<Scalars["JSON"]>;
  /**
   * Fetch a response from the database
   * This query fetches just a response, a response is connected to the answer choice and the customer feedback
   */
  response?: Maybe<Response>;
  /** Fetch all responses from the database for a feedback for */
  responsesForFeedbackForm?: Maybe<Array<Maybe<CustomerFeedback>>>;
  /**
   * Get all the feedback templates available in the system. This basically fetches
   * all the hosted URLs from the feedback_template_url table
   * You should have few templated by default, as its part of the seed data. If not
   * deploy the feedback form and use the createFeedbackTemplateURL to create the entity.
   */
  feedbackTemplateURLs?: Maybe<Array<Maybe<FeedbackTemplateUrl>>>;
  /** Gets a particular feedback template url from the db */
  feedbackTemplateURL?: Maybe<FeedbackTemplateUrl>;
  feedbackTemplates?: Maybe<Array<Maybe<FeedbackForm>>>;
  initFeedbackForm?: Maybe<InitFeedbackFormData>;
  /** Get LoyaltyCard by ID */
  loyaltyCard?: Maybe<Array<Maybe<LoyaltyCard>>>;
  /** Get LoyaltyCard by Code */
  loyaltyCardByCode?: Maybe<LoyaltyCard>;
  loyaltyCards?: Maybe<LoyaltyCardPage>;
  /** Gets CustomerLoyalty object queried by externalCustomerId */
  getCustomerLoyaltyByExternalCustomerId?: Maybe<CustomerLoyaltyOutput>;
  /**
   * Gets CustomerLoyalty object queried by externalCustomerId
   * This API has been built for JFL Implementation
   */
  getCustomerLoyalty?: Maybe<CustomerLoyaltyOutput>;
  /** Get Currency object by currencyCode */
  currencyByCode?: Maybe<Currency>;
  currencyList?: Maybe<CurrencyPage>;
  earnBurnPoints?: Maybe<EarnableBurnableLoyaltyTransactionOutput>;
  loyaltyTransaction?: Maybe<LoyaltyTransactionPage>;
  getCommunicationQuery?: Maybe<Communication>;
  earnableBurnablePoints?: Maybe<EarnableBurnableLoyaltyTransactionOutput>;
  loyaltyTransactionStatus?: Maybe<TransactionStatus>;
  /** Returns loyalty Program accessed by loyaltyCode */
  getLoyaltyProgramsByCode?: Maybe<LoyaltyProgram>;
  loyaltyPrograms?: Maybe<LoyaltyProgramPage>;
  /** Gets LoyaltyLedgerHistory based on externalCustomerId & loyaltyCardCode  */
  loyaltyLedgerHistory?: Maybe<Array<Maybe<LoyaltyLedgerOutputType>>>;
  /**
   * Gets CustomerLedgerHistory
   * Built for JFL Implementation
   */
  getCustomerLedger?: Maybe<LedgerOutput>;
};

/**  Query is used to fetch data from the server  */
export type QueryMetricArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryMetricsArgs = {
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
  organizationId?: Maybe<Scalars["ID"]>;
  status: Status;
};

/**  Query is used to fetch data from the server  */
export type QueryMetricFilterArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryMetricFiltersArgs = {
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
  status: Status;
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryExecuteMetricArgs = {
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  filterValues?: Maybe<Scalars["JSON"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryExecuteMetricsArgs = {
  names?: Maybe<Array<Maybe<Scalars["String"]>>>;
  organizationId?: Maybe<Scalars["ID"]>;
  walkinProducts: Walkin_Products;
  filterValues?: Maybe<Scalars["JSON"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryWebhookEventTypeArgs = {
  organizationId: Scalars["ID"];
  event: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryWebhookEventTypesArgs = {
  organizationId: Scalars["ID"];
  status: Status;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryWebhookArgs = {
  organizationId: Scalars["ID"];
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWebhooksArgs = {
  organizationId: Scalars["ID"];
  event?: Maybe<Scalars["String"]>;
  status: Status;
  enabled?: Maybe<Scalars["Boolean"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryWebhookEventDataArgs = {
  organizationId: Scalars["ID"];
  webhookId: Scalars["ID"];
  httpStatus?: Maybe<Scalars["String"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryUsersArgs = {
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
  organizationId: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryUserArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryOrganizationHierarchyArgs = {
  rootId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryOrganizationArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QuerySubOrganizationsArgs = {
  parentId: Scalars["ID"];
  type?: Maybe<OrganizationTypeEnum>;
  status?: Maybe<Status>;
};

/**  Query is used to fetch data from the server  */
export type QueryApplicationArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryRoleArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryStoreArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryStoreByCodeArgs = {
  code: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryStoreSearchArgs = {
  organizationId: Scalars["ID"];
  filterValues?: Maybe<StoreSearchFilters>;
  pageNumber: Scalars["Int"];
  sort?: Maybe<Sort>;
};

/**  Query is used to fetch data from the server  */
export type QueryStoreDefnitionArgs = {
  organizationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryEventByIdArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryEventBySourceEventIdArgs = {
  sourceEventId: Scalars["String"];
  eventTypeId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryEventsByFiltersArgs = {
  sourceName?: Maybe<Scalars["String"]>;
  eventTypeCode?: Maybe<Scalars["String"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryEventSubscriptionsForEventTypeArgs = {
  eventTypeId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryEventSubscriptionByIdArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryEventTypeByIdArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryEventTypeByCodeArgs = {
  code: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryEventTypesForApplicationArgs = {
  appId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryRuleEntityArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryRuleEntitiesArgs = {
  input?: Maybe<SearchRuleEntityInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryRuleAttributeArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryRuleAttributesArgs = {
  input: SearchRuleAttributeInput;
};

/**  Query is used to fetch data from the server  */
export type QueryRuleArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryRulesArgs = {
  input?: Maybe<SearchRuleInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryGetSqlFromRuleArgs = {
  ruleId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryEvaluateRuleArgs = {
  ruleName?: Maybe<Scalars["String"]>;
  data: Scalars["JSON"];
  ruleId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryBusinessRulesArgs = {
  input: SearchBusinessRulesInput;
};

/**  Query is used to fetch data from the server  */
export type QueryBusinessRuleArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryBusinessRuleDetailsArgs = {
  input: SearchBusinessRuleDetailsInput;
};

/**  Query is used to fetch data from the server  */
export type QueryBusinessRuleDetailArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryBusinessRuleConfigurationArgs = {
  input: BusinessRuleConfigurationInput;
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowByNameArgs = {
  name: Scalars["String"];
  organizationId: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowDiagramArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryOrgWorkflowsArgs = {
  orgId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowStateArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowStatesArgs = {
  workflowId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowProcessArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowProcessByNameArgs = {
  name: Scalars["String"];
  workflowId: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowProcessesArgs = {
  workflowId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowProcessTransitionArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowProcessTransitionsArgs = {
  workflowProcessId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowEntityArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowEntityByEntityDetailsArgs = {
  entityId: Scalars["String"];
  entityType: Workflow_Entity_Type;
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowEntityTransitionArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowEntityTransitionByEntityIdArgs = {
  workflowEntityId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowEntityTransitionHistoryArgs = {
  workflowEntityId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowRouteArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryWorkflowRoutesArgs = {
  organizationId: Scalars["ID"];
  entityType: Workflow_Entity_Type;
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerArgs = {
  input?: Maybe<SearchCustomerInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerDeviceArgs = {
  input?: Maybe<SearchCustomerDeviceInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerDefnitionArgs = {
  organization_id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerDevicesByCustomerIdArgs = {
  customerId: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerSearchArgs = {
  organizationId: Scalars["ID"];
  filterValues?: Maybe<CustomerSearchFilters>;
  pageNumber: Scalars["Int"];
  sort?: Maybe<Sort>;
};

/**  Query is used to fetch data from the server  */
export type QueryGetSegmentRuleAsTextArgs = {
  ruleId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryEntityExtendArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryEntityExtendByNameArgs = {
  entityName: Extend_Entities;
};

/**  Query is used to fetch data from the server  */
export type QueryEntityExtendFieldArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryBasicFieldsArgs = {
  entityName: Extend_Entities;
};

/**  Query is used to fetch data from the server  */
export type QueryActionDefinitionArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryActionDefinitionsArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryActionArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryActionsArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
  actionDefinitionName?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QuerySessionArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryActiveSessionArgs = {
  customer_identifier: Scalars["String"];
  organization_id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QuerySegmentArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QuerySegmentsArgs = {
  name?: Maybe<Scalars["String"]>;
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  segmentType?: Maybe<Scalars["String"]>;
  status: Status;
};

/**  Query is used to fetch data from the server  */
export type QueryCampaignArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCampaignsArgs = {
  organization_id?: Maybe<Scalars["ID"]>;
  application_id?: Maybe<Scalars["ID"]>;
  campaignType?: Maybe<Array<Maybe<Scalars["String"]>>>;
  status: Status;
};

/**  Query is used to fetch data from the server  */
export type QueryAudienceArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryAudiencesArgs = {
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  campaign_id?: Maybe<Scalars["ID"]>;
  segment_id?: Maybe<Scalars["ID"]>;
  status?: Maybe<Status>;
};

/**  Query is used to fetch data from the server  */
export type QueryCampaignControlsArgs = {
  organization_id: Scalars["ID"];
  campaign_id: Scalars["ID"];
  customer_id?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryGlobalControlsArgs = {
  organization_id: Scalars["ID"];
  customer_id?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryAudienceCountArgs = {
  segments?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  organizationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryAudienceMembersArgs = {
  audience_id: Scalars["ID"];
  customer_id?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryTotalAudienceCountForCampaignArgs = {
  campaignId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryFileSystemArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryFileSystemsArgs = {
  name?: Maybe<Scalars["String"]>;
  accessType?: Maybe<Scalars["String"]>;
  fileSystemType?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryFileArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryFilesArgs = {
  fileSystemId?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryMessageTemplateArgs = {
  id: Scalars["ID"];
  organization_id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryMessageTemplatesArgs = {
  organization_id: Scalars["ID"];
  messageFormat?: Maybe<Message_Format>;
  status?: Maybe<Status>;
};

/**  Query is used to fetch data from the server  */
export type QueryCommunicationArgs = {
  id: Scalars["ID"];
  organization_id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCommunicationsArgs = {
  entityId?: Maybe<Scalars["ID"]>;
  entityType?: Maybe<Communication_Entity_Type>;
  organization_id: Scalars["ID"];
  status?: Maybe<Status>;
  campaignId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryCommunicationLogArgs = {
  communicationLogId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCommunicationLogsArgs = {
  communicationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCatalogArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCatalogsArgs = {
  organizationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCategoryArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCategoryByCodeArgs = {
  catalogId: Scalars["ID"];
  categoryCode: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryCategoriesWithChildrenArgs = {
  catalogId: Scalars["ID"];
  categoryCode?: Maybe<Scalars["String"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryCategoriesArgs = {
  catalogId: Scalars["ID"];
  parentCategoryId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryOptionByIdArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryOptionValuesByOptionIdArgs = {
  optionId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryProductsArgs = {
  input?: Maybe<ProductSearchInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryProductOptionsByProductIdArgs = {
  productId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryProductVariantsByProductIdArgs = {
  productId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryProductVariantValuesByProductVariantIdArgs = {
  productVariantId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryProductCategoriesByCategoryIdArgs = {
  categoryId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryProductCategoriesByCategoryCodeArgs = {
  categoryCode: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryChargeTypesArgs = {
  input?: Maybe<ChargeTypesInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryChargeTypeArgs = {
  input?: Maybe<ChargeTypeInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryChannelArgs = {
  input?: Maybe<ChannelFilterInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryTaxTypeArgs = {
  id: Scalars["ID"];
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryTaxTypesArgs = {
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryStoreFormatArgs = {
  id: Scalars["ID"];
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryStoreFormatsArgs = {
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryReportConfigArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryReportConfigsArgs = {
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryReportArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryReportsArgs = {
  reportConfigId: Scalars["ID"];
  reportDate: Scalars["Date"];
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryOffersForACampaignArgs = {
  campaignId: Scalars["ID"];
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryCampaignsForOfferArgs = {
  offerId: Scalars["ID"];
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerOfferArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerOffersArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
  offerId?: Maybe<Scalars["ID"]>;
  customerId?: Maybe<Scalars["ID"]>;
  status?: Maybe<Status>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryOfferArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryOffersArgs = {
  stateCode?: Maybe<Scalars["Int"]>;
  state?: Maybe<Offer_States>;
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryRedemptionArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryRedemptionsArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
  customerId?: Maybe<Scalars["ID"]>;
  campaignId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryGetHyperXArgs = {
  organizationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryViewCampaignsForHyperXArgs = {
  input?: Maybe<HyperXCampaignInput>;
  page: Scalars["Int"];
  perPage: Scalars["Int"];
  sort: SortOptions;
};

/**  Query is used to fetch data from the server  */
export type QueryViewCampaignForHyperXArgs = {
  campaignId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryGetFeedbackFormArgs = {
  feedbackFormId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryFeedbackFormsArgs = {
  filter?: Maybe<FeedbackFormCreateInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryFeedbackCategoryArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryFeedbackCategoryTreeArgs = {
  organizationId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryFeedbackCategorySubTreeArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerFeedbackArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerFeedbackForNewCustomerArgs = {
  customerIdentifier: Scalars["String"];
  feedbackFormId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerFeedbackByExternalCustomerIdArgs = {
  externalCustomerId: Scalars["String"];
  eventType?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
  pageOptions: PageOptions;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryCustomerFeedbackByMobileNumberArgs = {
  mobileNumber: Scalars["String"];
  eventType?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
  pageOptions: PageOptions;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryQuestionHierarchyArgs = {
  questionId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryQuestionnaireRootArgs = {
  feedbackFormId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryQuestionArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryChoiceArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryResponseArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryResponsesForFeedbackFormArgs = {
  feedbackFormId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryFeedbackTemplateUrlArgs = {
  id: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryInitFeedbackFormArgs = {
  feedbackFormId: Scalars["ID"];
};

/**  Query is used to fetch data from the server  */
export type QueryLoyaltyCardByCodeArgs = {
  loyaltyCardCode: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryLoyaltyCardsArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryGetCustomerLoyaltyByExternalCustomerIdArgs = {
  input: CustomerLoyaltyInput;
};

/**  Query is used to fetch data from the server  */
export type QueryGetCustomerLoyaltyArgs = {
  storeId?: Maybe<Scalars["String"]>;
  externalCustomerId: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryCurrencyByCodeArgs = {
  currencyCode: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryCurrencyListArgs = {
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryEarnBurnPointsArgs = {
  input?: Maybe<EarnableLoyaltyTransactionInput>;
};

/**  Query is used to fetch data from the server  */
export type QueryLoyaltyTransactionArgs = {
  externalCustomerId: Scalars["ID"];
  cardCode?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryGetCommunicationQueryArgs = {
  loyaltyProgramId?: Maybe<Scalars["ID"]>;
  campaignID?: Maybe<Scalars["ID"]>;
  transactionType?: Maybe<Scalars["String"]>;
  customerData?: Maybe<Scalars["JSON"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryEarnableBurnablePointsArgs = {
  externalCustomerId?: Maybe<Scalars["String"]>;
  loyaltyType?: Maybe<Scalars["String"]>;
  data: Scalars["JSON"];
};

/**  Query is used to fetch data from the server  */
export type QueryLoyaltyTransactionStatusArgs = {
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
};

/**  Query is used to fetch data from the server  */
export type QueryGetLoyaltyProgramsByCodeArgs = {
  input: LoyaltyProgramInput;
};

/**  Query is used to fetch data from the server  */
export type QueryLoyaltyProgramsArgs = {
  loyaltyCardCode: Scalars["String"];
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

/**  Query is used to fetch data from the server  */
export type QueryLoyaltyLedgerHistoryArgs = {
  externalCustomerId: Scalars["ID"];
  cardCode: Scalars["String"];
};

/**  Query is used to fetch data from the server  */
export type QueryGetCustomerLedgerArgs = {
  externalCustomerId: Scalars["String"];
  cardCode?: Maybe<Scalars["String"]>;
  dateStart?: Maybe<Scalars["DateTime"]>;
  dateEnd?: Maybe<Scalars["DateTime"]>;
  page?: Maybe<Scalars["Int"]>;
  itemsPerPage?: Maybe<Scalars["Int"]>;
  orderBy?: Maybe<Sorting_Directions>;
};

/**  Skeleton of Question being send to the user  */
export type Question = {
  __typename?: "Question";
  id: Scalars["ID"];
  questionText?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  feedbackCategory?: Maybe<FeedbackCategory>;
  feedbackForm?: Maybe<FeedbackForm>;
  choices?: Maybe<Array<Maybe<Choice>>>;
  fromChoice?: Maybe<Choice>;
  rangeMin?: Maybe<Scalars["Int"]>;
  rangeMax?: Maybe<Scalars["Int"]>;
};

export enum Question_Type_Enum {
  SingleAnswer = "SINGLE_ANSWER",
  MultipleAnswer = "MULTIPLE_ANSWER",
  RatingScale = "RATING_SCALE",
  OpinionScale = "OPINION_SCALE",
  Ranking = "RANKING",
  Dichotomous = "DICHOTOMOUS",
  Text = "TEXT",
  Image = "IMAGE",
  Video = "VIDEO",
  Audio = "AUDIO",
  Numeric = "NUMERIC"
}

/**  Skeleton of Input being received from user creating questions  */
export type QuestionInput = {
  questionText: Scalars["String"];
  type: Question_Type_Enum;
  rangeMin?: Maybe<Scalars["Int"]>;
  rangeMax?: Maybe<Scalars["Int"]>;
};

export type QuestionTreeData = {
  __typename?: "QuestionTreeData";
  id: Scalars["ID"];
  questionText?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  feedbackCategory?: Maybe<FeedbackCategory>;
  feedbackForm?: Maybe<FeedbackForm>;
  choices?: Maybe<Array<Maybe<Choice>>>;
  fromChoice?: Maybe<Array<Maybe<Choice>>>;
  rangeMin?: Maybe<Scalars["Int"]>;
  rangeMax?: Maybe<Scalars["Int"]>;
};

export type RedeemOfferInput = {
  customerId: Scalars["ID"];
  campaignId: Scalars["ID"];
  offerId: Scalars["ID"];
  redeemDateTime: Scalars["DateTime"];
  transactionDateTime: Scalars["DateTime"];
  transactionData: Scalars["JSON"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type RedemptionOutput = {
  __typename?: "RedemptionOutput";
  id?: Maybe<Scalars["ID"]>;
  customer?: Maybe<Customer>;
  campaign?: Maybe<Campaign>;
  offer?: Maybe<Offer>;
  redeemDateTime?: Maybe<Scalars["DateTime"]>;
  transactionDateTime?: Maybe<Scalars["DateTime"]>;
  transactionData?: Maybe<Scalars["JSON"]>;
  organizationId?: Maybe<Organization>;
};

export type RedemptionPage = {
  __typename?: "RedemptionPage";
  data?: Maybe<Array<Maybe<RedemptionOutput>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type RemovedQuestion = {
  __typename?: "RemovedQuestion";
  questionText?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  rangeMin?: Maybe<Scalars["Int"]>;
  rangeMax?: Maybe<Scalars["Int"]>;
};

export type RemoveVariableFromMessageTemplateInput = {
  organization_id: Scalars["ID"];
  templateId: Scalars["ID"];
  templateVariableId: Scalars["ID"];
};

export type RepeatRuleConfiguration = {
  frequency?: Maybe<Communication_Frequency>;
  repeatInterval?: Maybe<Scalars["Int"]>;
  endAfter?: Maybe<Scalars["DateTime"]>;
  byWeekDay?: Maybe<Array<Maybe<Communication_Days>>>;
  byMonthDate?: Maybe<Scalars["Int"]>;
  time?: Maybe<Scalars["String"]>;
  noOfOccurances?: Maybe<Scalars["Int"]>;
};

export type RepeatRuleConfigurationOutput = {
  __typename?: "RepeatRuleConfigurationOutput";
  frequency?: Maybe<Communication_Frequency>;
  repeatInterval?: Maybe<Scalars["Int"]>;
  endAfter?: Maybe<Scalars["DateTime"]>;
  byWeekDay?: Maybe<Array<Maybe<Communication_Days>>>;
  byMonthDate?: Maybe<Scalars["Int"]>;
  time?: Maybe<Scalars["String"]>;
  noOfOccurances?: Maybe<Scalars["Int"]>;
};

export type Report = {
  __typename?: "Report";
  id: Scalars["ID"];
  reportConfig?: Maybe<ReportConfig>;
  organizationId: Scalars["ID"];
  reportDate?: Maybe<Scalars["Date"]>;
  reportFile?: Maybe<File>;
  status?: Maybe<Status>;
};

export type ReportConfig = {
  __typename?: "ReportConfig";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  status?: Maybe<Status>;
};

export type ReportConfigPage = {
  __typename?: "ReportConfigPage";
  data?: Maybe<Array<ReportConfig>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type ReportPage = {
  __typename?: "ReportPage";
  data?: Maybe<Array<Report>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export enum Request_Method {
  Post = "POST",
  Get = "GET"
}

export type ResetPasswordResponse = {
  __typename?: "ResetPasswordResponse";
  userId?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  sentLink?: Maybe<Scalars["Boolean"]>;
};

/** Skeleton of Response send to user */
export type Response = {
  __typename?: "Response";
  id: Scalars["ID"];
  createdTime: Scalars["Date"];
  questionData?: Maybe<Scalars["JSON"]>;
  responseData?: Maybe<Scalars["JSON"]>;
  customerFeedback?: Maybe<CustomerFeedback>;
  choicesSelected?: Maybe<Array<Maybe<Choice>>>;
};

export type ResponseDep = {
  __typename?: "ResponseDep";
  id: Scalars["ID"];
  createdTime: Scalars["Date"];
  questionData?: Maybe<Scalars["JSON"]>;
  responseData?: Maybe<Scalars["JSON"]>;
  customerFeedback?: Maybe<CustomerFeedback>;
  choiceSelected?: Maybe<Array<Maybe<Choice>>>;
};

/** Skeleton of data send to user when a new response submit to database */
export type ResponseSubmit = {
  __typename?: "ResponseSubmit";
  savedResponses?: Maybe<Array<Maybe<ResponseDep>>>;
  nextQuestions?: Maybe<Array<Maybe<Question>>>;
};

export type Role = {
  __typename?: "Role";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  policies?: Maybe<Array<Maybe<Policy>>>;
  users?: Maybe<Array<Maybe<User>>>;
  createdBy?: Maybe<Scalars["String"]>;
  lastModifiedBy?: Maybe<Scalars["String"]>;
  createdTime?: Maybe<Scalars["String"]>;
  lastModifiedTime?: Maybe<Scalars["String"]>;
};

export type RoleEditInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type RoleInput = {
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Rule = {
  __typename?: "Rule";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  type?: Maybe<Rule_Type>;
  ruleConfiguration?: Maybe<Scalars["JSON"]>;
  ruleExpression?: Maybe<Scalars["JSON"]>;
  organization?: Maybe<Organization>;
};

export enum Rule_Type {
  Simple = "SIMPLE",
  Custom = "CUSTOM"
}

export type RuleAttribute = {
  __typename?: "RuleAttribute";
  id?: Maybe<Scalars["ID"]>;
  attributeName?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  attributeValueType?: Maybe<Scalars["String"]>;
  organization: Organization;
  ruleEntity: RuleEntity;
};

export type RuleEntity = {
  __typename?: "RuleEntity";
  id?: Maybe<Scalars["ID"]>;
  entityName?: Maybe<Scalars["String"]>;
  entityCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  ruleAttributes?: Maybe<Array<Maybe<RuleAttribute>>>;
};

export type RuleEvaluatioResult = {
  __typename?: "RuleEvaluatioResult";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  type?: Maybe<Rule_Type>;
  ruleConfiguration?: Maybe<Scalars["JSON"]>;
  ruleExpression?: Maybe<Scalars["JSON"]>;
  evaluationResult?: Maybe<Scalars["JSON"]>;
  organization?: Maybe<Organization>;
};

export type RuleInputType = {
  attributeName: Scalars["String"];
  attributeValue: Scalars["String"];
  expressionType: Expression_Type;
};

export type S3Response = {
  __typename?: "S3Response";
  url?: Maybe<Scalars["String"]>;
  expiry?: Maybe<Scalars["String"]>;
};

export type SearchBusinessRuleDetailsInput = {
  ruleLevel?: Maybe<Business_Rule_Levels>;
  ruleLevelId?: Maybe<Scalars["String"]>;
  ruleType?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["String"]>;
};

export type SearchBusinessRulesInput = {
  ruleLevel?: Maybe<Business_Rule_Levels>;
  ruleType?: Maybe<Scalars["String"]>;
};

export type SearchCustomerDeviceInput = {
  id?: Maybe<Scalars["ID"]>;
  fcmToken?: Maybe<Scalars["String"]>;
  deviceId?: Maybe<Scalars["String"]>;
  modelNumber?: Maybe<Scalars["String"]>;
  customerId?: Maybe<Scalars["String"]>;
};

export type SearchCustomerInput = {
  id?: Maybe<Scalars["ID"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  organization_id?: Maybe<Scalars["ID"]>;
  customerIdentifier?: Maybe<Scalars["String"]>;
};

export type SearchRuleAttributeInput = {
  status?: Maybe<Status>;
  organizationId: Scalars["ID"];
  entityName?: Maybe<Scalars["String"]>;
};

export type SearchRuleEntityInput = {
  status?: Maybe<Status>;
  organizationId: Scalars["ID"];
  entityName?: Maybe<Scalars["String"]>;
};

export type SearchRuleInput = {
  status?: Maybe<Status>;
  organizationId: Scalars["ID"];
};

export type Segment = {
  __typename?: "Segment";
  createdBy?: Maybe<Scalars["String"]>;
  lastModifiedBy?: Maybe<Scalars["String"]>;
  createdTime?: Maybe<Scalars["DateTime"]>;
  lastModifiedTime?: Maybe<Scalars["DateTime"]>;
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  segmentType?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  application?: Maybe<Application>;
  rule?: Maybe<Rule>;
  status?: Maybe<Status>;
};

export enum Segment_Type {
  Custom = "CUSTOM"
}

export type SegmentAddInput = {
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  segmentType: Segment_Type;
  organization_id: Scalars["ID"];
  application_id: Scalars["ID"];
  rule_id: Scalars["ID"];
  status: Status;
};

export type SegmentUpdateInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  segmentType?: Maybe<Segment_Type>;
  rule_id?: Maybe<Scalars["ID"]>;
  status?: Maybe<Status>;
};

export type SendMessageInput = {
  format?: Maybe<Message_Format>;
  to: Scalars["String"];
  messageBody: Scalars["String"];
  messageSubject?: Maybe<Scalars["String"]>;
};

export type Session = {
  __typename?: "Session";
  id: Scalars["ID"];
  customer_id: Scalars["ID"];
  organization_id: Scalars["ID"];
  extend?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Status>;
};

export type SignedUploadUrlInput = {
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organizationId: Scalars["String"];
  fileSystemId: Scalars["String"];
};

export type SignedUrl = {
  __typename?: "SignedURL";
  s3Response?: Maybe<S3Response>;
  cloudinaryResponse?: Maybe<Scalars["JSON"]>;
};

export enum Slugtype {
  Date = "DATE",
  Timestamp = "TIMESTAMP",
  Time = "TIME",
  ShortText = "SHORT_TEXT",
  LongText = "LONG_TEXT",
  Number = "NUMBER",
  Choices = "CHOICES",
  Boolean = "BOOLEAN",
  Json = "JSON"
}

export type Sort = {
  attributeName?: Maybe<Scalars["String"]>;
  order?: Maybe<Order>;
};

export enum Sorting_Directions {
  Ascending = "ASCENDING",
  Descending = "DESCENDING"
}

export type SortOptions = {
  sortBy?: Maybe<Scalars["String"]>;
  sortOrder?: Maybe<Order>;
};

export type Sql = {
  __typename?: "SQL";
  SQL?: Maybe<Scalars["String"]>;
};

export type StartSessionInput = {
  customer_identifier: Scalars["String"];
  organization_id: Scalars["ID"];
  extend?: Maybe<Scalars["JSON"]>;
};

export enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

export enum StatusCodes {
  Initiated = "INITIATED",
  Processed = "PROCESSED",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED"
}

export type Store = {
  __typename?: "Store";
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  STATUS?: Maybe<Status>;
  addressLine1?: Maybe<Scalars["String"]>;
  addressLine2?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  pinCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  externalStoreId?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  email?: Maybe<Scalars["String"]>;
  wifi?: Maybe<Scalars["Boolean"]>;
  latitude?: Maybe<Scalars["String"]>;
  longitude?: Maybe<Scalars["String"]>;
  adminLevelId?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  storeFormats?: Maybe<Array<Maybe<StoreFormat>>>;
  catalog?: Maybe<Catalog>;
  channels?: Maybe<Array<Maybe<Channel>>>;
};

export type StoreAdminLevel = {
  __typename?: "StoreAdminLevel";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  parent?: Maybe<StoreAdminLevel>;
  stores?: Maybe<Array<Maybe<Store>>>;
};

export type StoreColumn = {
  __typename?: "StoreColumn";
  column_slug?: Maybe<Scalars["String"]>;
  column_search_key?: Maybe<Scalars["String"]>;
  column_label?: Maybe<Scalars["String"]>;
  column_type?: Maybe<Scalars["String"]>;
  searchable?: Maybe<Scalars["Boolean"]>;
  extended_column?: Maybe<Scalars["Boolean"]>;
};

export type StoreDefnition = {
  __typename?: "StoreDefnition";
  entityName?: Maybe<Scalars["String"]>;
  searchEntityName?: Maybe<Scalars["String"]>;
  columns?: Maybe<Array<Maybe<StoreColumn>>>;
};

export type StoreFieldSearch = {
  id?: Maybe<Scalars["ID"]>;
  attributeName?: Maybe<Scalars["String"]>;
  attributeValue?: Maybe<Scalars["String"]>;
  expressionType?: Maybe<Expression_Type>;
};

export type StoreFormat = {
  __typename?: "StoreFormat";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  storeFormatCode?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
  taxTypes?: Maybe<Array<Maybe<TaxType>>>;
};

export type StoreFormatInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  storeFormatCode: Scalars["String"];
  status?: Maybe<Status>;
  organization?: Maybe<Scalars["ID"]>;
  taxTypeCodes?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type StoreFormatPage = {
  __typename?: "StoreFormatPage";
  data?: Maybe<Array<Maybe<StoreFormat>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type StoreFormatSearchInput = {
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type StoreSearchFilters = {
  rules?: Maybe<Array<Maybe<StoreFieldSearch>>>;
  combinator?: Maybe<Combinator>;
};

export type StoreSearchOutput = {
  __typename?: "StoreSearchOutput";
  data?: Maybe<Array<Maybe<Scalars["JSON"]>>>;
  total?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type TaxType = {
  __typename?: "TaxType";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  taxTypeCode?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Organization>;
};

export type TaxTypeInput = {
  name?: Maybe<Scalars["String"]>;
  taxTypeCode: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organization?: Maybe<Scalars["ID"]>;
};

export type TaxTypePage = {
  __typename?: "TaxTypePage";
  data?: Maybe<Array<Maybe<TaxType>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type TaxTypeSearchInput = {
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export enum Template_Style {
  Mustache = "MUSTACHE"
}

export type Transaction = {
  transactionType?: Maybe<Scalars["String"]>;
  transactionDate?: Maybe<Scalars["Date"]>;
  transactionChannel?: Maybe<Scalars["String"]>;
  totalAmount?: Maybe<Scalars["Float"]>;
  externalStoreId?: Maybe<Scalars["String"]>;
};

export type TransactionStatus = {
  __typename?: "TransactionStatus";
  status?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
};

export type TransactionStatusOutput = {
  __typename?: "TransactionStatusOutput";
  loyaltyReferenceId?: Maybe<Scalars["String"]>;
  statusCode?: Maybe<Scalars["String"]>;
};

export enum TriggerActionEnum {
  Nearx = "NEARX",
  Custom = "CUSTOM",
  Webhook = "WEBHOOK",
  RefinexSendFeedback = "REFINEX_SEND_FEEDBACK"
}

export type TypeDeleteEvent = {
  __typename?: "TypeDeleteEvent";
  id: Scalars["ID"];
  code?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  application?: Maybe<Application>;
  eventSubscriptions?: Maybe<Array<Maybe<EventSubscription>>>;
  events?: Maybe<Array<Maybe<Event>>>;
};

export type TypeDeleteEventSubscription = {
  __typename?: "TypeDeleteEventSubscription";
  triggerAction?: Maybe<TriggerActionEnum>;
  customAction?: Maybe<Action>;
  eventType?: Maybe<EventType>;
  sync?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<Scalars["String"]>;
};

export enum UnitOfTime {
  Year = "year",
  Month = "month",
  Week = "week",
  Day = "day",
  Hour = "hour",
  Minute = "minute",
  Second = "second",
  Millisecond = "millisecond"
}

export type UpdateActionDefinitionInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  configuration?: Maybe<Scalars["JSON"]>;
  code?: Maybe<Scalars["String"]>;
  inputSchema?: Maybe<Scalars["JSON"]>;
  outputSchema?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Scalars["String"]>;
};

export type UpdateAudienceInput = {
  id: Scalars["ID"];
  status?: Maybe<Status>;
};

export type UpdateAudienceMemberInput = {
  id: Scalars["ID"];
  status?: Maybe<Status>;
};

export type UpdateBusinessRuleDetailInput = {
  ruleLevel?: Maybe<Business_Rule_Levels>;
  ruleLevelId?: Maybe<Scalars["String"]>;
  ruleType?: Maybe<Scalars["String"]>;
  ruleValue?: Maybe<Scalars["String"]>;
  organizationId: Scalars["String"];
};

export type UpdateBusinessRuleInput = {
  ruleLevel?: Maybe<Business_Rule_Levels>;
  ruleType?: Maybe<Scalars["String"]>;
  ruleDefaultValue?: Maybe<Scalars["String"]>;
};

export type UpdateCampaignControl = {
  id: Scalars["ID"];
  endTime?: Maybe<Scalars["DateTime"]>;
  status?: Maybe<Status>;
};

export type UpdateCampaignOfferInput = {
  offerId: Scalars["ID"];
  campaignId: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type UpdateCatalogInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  usage?: Maybe<UpdateCatalogUsageInput>;
};

export type UpdateCatalogUsageInput = {
  id: Scalars["ID"];
  purpose?: Maybe<Scalars["String"]>;
};

export type UpdateCategoryInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  catalogId?: Maybe<Scalars["ID"]>;
  status?: Maybe<Status>;
  extend?: Maybe<Scalars["JSON"]>;
  code?: Maybe<Scalars["String"]>;
  parentId?: Maybe<Scalars["ID"]>;
  organizationId: Scalars["String"];
};

export type UpdateCommunicationInput = {
  id: Scalars["ID"];
  entityId: Scalars["String"];
  entityType?: Maybe<Communication_Entity_Type>;
  isScheduled?: Maybe<Scalars["Boolean"]>;
  firstScheduleDateTime?: Maybe<Scalars["DateTime"]>;
  isRepeatable?: Maybe<Scalars["Boolean"]>;
  lastProcessedDateTime?: Maybe<Scalars["DateTime"]>;
  repeatRuleConfiguration?: Maybe<RepeatRuleConfiguration>;
  commsChannelName?: Maybe<Scalars["String"]>;
  status: Status;
  campaign_id?: Maybe<Scalars["ID"]>;
};

export type UpdateCustomer = {
  __typename?: "UpdateCustomer";
  id?: Maybe<Scalars["ID"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  customerIdentifier?: Maybe<Scalars["String"]>;
  organization?: Maybe<Organization>;
  extend?: Maybe<Scalars["JSON"]>;
  onboard_source?: Maybe<Scalars["String"]>;
  customerDevices?: Maybe<Array<Maybe<CustomerDevice>>>;
};

export type UpdateCustomerDeviceInput = {
  id: Scalars["ID"];
  fcmToken?: Maybe<Scalars["String"]>;
  modelNumber?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  deviceId?: Maybe<Scalars["String"]>;
  customerId?: Maybe<Scalars["String"]>;
};

export type UpdateCustomerInput = {
  id: Scalars["ID"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  gender?: Maybe<Gender>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  externalCustomerId?: Maybe<Scalars["String"]>;
  customerIdentifier?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  organization?: Maybe<Scalars["ID"]>;
};

export type UpdateCustomerOffersInput = {
  id: Scalars["ID"];
  campaignId?: Maybe<Scalars["ID"]>;
  offerId?: Maybe<Scalars["ID"]>;
  customerId?: Maybe<Scalars["ID"]>;
  coupon?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type UpdateCustomerProfileInputInSession = {
  id: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  authToken?: Maybe<Scalars["String"]>;
};

export type UpdateCustomerProfileOutputInSession = {
  __typename?: "UpdateCustomerProfileOutputInSession";
  id: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  phoneNumber?: Maybe<Scalars["String"]>;
  gender?: Maybe<Scalars["String"]>;
  dateOfBirth?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
};

/**
 * Skeleton of the data received by the server to update the feedback category
 * STILL IN DEVELOPMENT
 */
export type UpdateFeedbackCategoryInput = {
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
};

export type UpdateFileSystemInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  accessType?: Maybe<Access_Type>;
  fileSystemType?: Maybe<File_System_Type>;
  configuration?: Maybe<Scalars["JSON"]>;
  enabled?: Maybe<Scalars["Boolean"]>;
  organizationId: Scalars["ID"];
};

export type UpdateLoyaltyProgramInput = {
  id: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  loyaltyCode: Scalars["String"];
  loyaltyCardCode: Scalars["String"];
  organizationId?: Maybe<Scalars["String"]>;
  expiryUnit?: Maybe<ExpiryUnit>;
  expiryValue?: Maybe<Scalars["Int"]>;
  earnRuleConfiguration?: Maybe<Scalars["JSON"]>;
  burnRuleConfiguration?: Maybe<Scalars["JSON"]>;
  expiryRuleConfiguration?: Maybe<Scalars["JSON"]>;
  campaign?: Maybe<CampaignAddInput>;
};

export type UpdateMessageTemplateInput = {
  id: Scalars["ID"];
  organization_id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  templateBodyText?: Maybe<Scalars["String"]>;
  templateSubjectText?: Maybe<Scalars["String"]>;
  templateStyle?: Maybe<Template_Style>;
  url?: Maybe<Scalars["String"]>;
  imageUrl?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type UpdateMessageTemplateVariableInput = {
  id: Scalars["ID"];
  organization_id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  type: Variable_Type;
  format: Variable_Format;
  defaultValue?: Maybe<Scalars["String"]>;
  required?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<Status>;
};

export type UpdateOfferInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  reward?: Maybe<Scalars["JSON"]>;
  offerEligibilityRule?: Maybe<Scalars["ID"]>;
  rewardRedemptionRule?: Maybe<Scalars["ID"]>;
  isCustomCoupon?: Maybe<Scalars["Boolean"]>;
  coupon?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type UpdateOptionInput = {
  id: Scalars["ID"];
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
};

export type UpdateOptionValueInput = {
  id: Scalars["ID"];
  optionId: Scalars["ID"];
  value?: Maybe<Scalars["String"]>;
};

export type UpdateOrganizationInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  addressLine1?: Maybe<Scalars["String"]>;
  addressLine2?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  pinCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  externalOrganizationId?: Maybe<Scalars["String"]>;
  code?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  phoneNumber?: Maybe<Scalars["String"]>;
  website?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  organizationType?: Maybe<OrganizationTypeEnum>;
};

export type UpdatePasswordResponse = {
  __typename?: "UpdatePasswordResponse";
  updated?: Maybe<Scalars["Boolean"]>;
};

export type UpdateProductCategoryInput = {
  id: Scalars["ID"];
  productId: Scalars["ID"];
  categoryId: Scalars["ID"];
};

export type UpdateProductInput = {
  id: Scalars["ID"];
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  imageUrl?: Maybe<Scalars["String"]>;
  type?: Maybe<ProductTypeEnum>;
  sku?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  extend?: Maybe<Scalars["JSON"]>;
};

export type UpdateProductOptionInput = {
  id: Scalars["ID"];
  optionId?: Maybe<Scalars["ID"]>;
  productId?: Maybe<Scalars["ID"]>;
};

export type UpdateProductVariantInput = {
  id: Scalars["ID"];
  sku?: Maybe<Scalars["String"]>;
  productId: Scalars["ID"];
};

export type UpdateProductVariantValueInput = {
  id: Scalars["ID"];
  productVariantId: Scalars["ID"];
  optionValueId: Scalars["ID"];
};

export type UpdateRuleInput = {
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  type?: Maybe<Rule_Type>;
  ruleConfiguration?: Maybe<Scalars["JSON"]>;
  ruleExpression?: Maybe<Scalars["JSON"]>;
};

export type UpdateStoreAdminLevel = {
  id: Scalars["ID"];
  name: Scalars["String"];
  code: Scalars["String"];
  parentId?: Maybe<Scalars["ID"]>;
};

export type UpdateStoreInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  STATUS?: Maybe<Status>;
  addressLine1?: Maybe<Scalars["String"]>;
  addressLine2?: Maybe<Scalars["String"]>;
  city?: Maybe<Scalars["String"]>;
  state?: Maybe<Scalars["String"]>;
  pinCode?: Maybe<Scalars["String"]>;
  country?: Maybe<Scalars["String"]>;
  externalStoreId?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  code?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  wifi?: Maybe<Scalars["Boolean"]>;
  latitude?: Maybe<Scalars["String"]>;
  longitude?: Maybe<Scalars["String"]>;
  adminLevelId?: Maybe<Scalars["String"]>;
  parentOrganizationId: Scalars["String"];
  storeFormatCode?: Maybe<Scalars["String"]>;
  catalogCode?: Maybe<Scalars["String"]>;
  channelCode?: Maybe<Scalars["String"]>;
};

export type UpdateUploadFileInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  fileSystemId?: Maybe<Scalars["String"]>;
  organizationId: Scalars["String"];
};

export type UpdateWorkflowEntityInput = {
  id: Scalars["ID"];
  workflowId: Scalars["ID"];
  entityId: Scalars["ID"];
  entityType?: Maybe<Workflow_Entity_Type>;
};

export type UpdateWorkflowInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type UpdateWorkflowProcessInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  workflowId?: Maybe<Scalars["ID"]>;
};

export type UpdateWorkflowProcessTransitionInput = {
  id: Scalars["ID"];
  name?: Maybe<Scalars["String"]>;
  pickupStateId?: Maybe<Scalars["ID"]>;
  dropStateId?: Maybe<Scalars["ID"]>;
  ruleConfig?: Maybe<Scalars["String"]>;
  workflowProcessId?: Maybe<Scalars["ID"]>;
};

export type UpdateWorkflowRouteInput = {
  id: Scalars["ID"];
  entityType?: Maybe<Workflow_Entity_Type>;
  ruleId?: Maybe<Scalars["ID"]>;
  status?: Maybe<Status>;
};

export type UpdateWorkflowStateInput = {
  id: Scalars["ID"];
  code?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  workflowId?: Maybe<Scalars["ID"]>;
};

export type UploadFileForCreateBulkCustomerResponse = {
  __typename?: "UploadFileForCreateBulkCustomerResponse";
  rowCount?: Maybe<Scalars["Int"]>;
  createdCount?: Maybe<Scalars["Int"]>;
  failedCount?: Maybe<Scalars["Int"]>;
  createBulkCustomerResponse?: Maybe<CreateBulkCustomerResponse>;
  segmentResponse?: Maybe<Segment>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Status>;
  members?: Maybe<Array<Maybe<Member>>>;
  organization?: Maybe<Organization>;
  createdCampaigns?: Maybe<Array<Maybe<Campaign>>>;
  roles?: Maybe<Array<Maybe<Role>>>;
  permissionMap?: Maybe<Scalars["JSON"]>;
};

export type UserPermissionMapArgs = {
  types?: Maybe<Array<Maybe<Policy_Types>>>;
};

export type UserCreateInput = {
  email: Scalars["String"];
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  password: Scalars["String"];
};

export type UserPage = {
  __typename?: "UserPage";
  data?: Maybe<Array<User>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type UserUpdateInput = {
  id: Scalars["ID"];
  email?: Maybe<Scalars["String"]>;
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
  extend?: Maybe<Scalars["JSON"]>;
  status?: Maybe<Status>;
};

export type ValidationError = {
  __typename?: "ValidationError";
  phoneNumber?: Maybe<Scalars["String"]>;
  errors?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export enum Value_Type {
  Number = "NUMBER",
  String = "STRING",
  Object = "OBJECT",
  Boolean = "BOOLEAN",
  Array = "ARRAY"
}

export type ValueInput = {
  value?: Maybe<Scalars["String"]>;
};

export enum Variable_Format {
  Yyyymmdd = "YYYYMMDD",
  Hhmm = "HHMM",
  NoFormating = "NO_FORMATING"
}

export enum Variable_Type {
  String = "STRING",
  Number = "NUMBER",
  Date = "DATE"
}

export type ViewHyperXCampaignOutput = {
  __typename?: "ViewHyperXCampaignOutput";
  campaign?: Maybe<Campaign>;
  audiences?: Maybe<Array<Maybe<Audience>>>;
  offers?: Maybe<Array<Maybe<Offer>>>;
  communications?: Maybe<Array<Maybe<Communication>>>;
};

export type ViewHyperXCampaignsOutput = {
  __typename?: "ViewHyperXCampaignsOutput";
  data?: Maybe<Array<Maybe<CampaignsOutput>>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export enum Walkin_Products {
  Refinex = "REFINEX",
  Nearx = "NEARX",
  Rewardx = "REWARDX",
  Hyperx = "HYPERX"
}

export type WalkinProduct = {
  __typename?: "WalkinProduct";
  id?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  latest_version?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export enum WalkinProducts {
  Refinex = "REFINEX",
  Nearx = "NEARX",
  Rewardx = "REWARDX",
  Hyperx = "HYPERX"
}

export type Webhook = {
  __typename?: "Webhook";
  id: Scalars["ID"];
  name: Scalars["String"];
  organization: Organization;
  event: Scalars["String"];
  url: Scalars["String"];
  headers: Scalars["JSON"];
  method: Scalars["String"];
  enabled: Scalars["Boolean"];
  status?: Maybe<Status>;
};

export type WebhookAddInput = {
  organizationId: Scalars["ID"];
  event: Scalars["String"];
  name: Scalars["String"];
  url: Scalars["String"];
  headers: Scalars["JSON"];
  method: Request_Method;
};

export type WebhookDeleteInput = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type WebhookEvent = {
  __typename?: "WebhookEvent";
  id: Scalars["ID"];
  event: Scalars["String"];
  description: Scalars["String"];
  status?: Maybe<Status>;
};

export type WebhookEventData = {
  __typename?: "WebhookEventData";
  id: Scalars["ID"];
  webhook?: Maybe<Webhook>;
  data: Scalars["JSON"];
  httpStatus: Scalars["String"];
  status?: Maybe<Status>;
};

export type WebhookEventDataAddInput = {
  webhookId: Scalars["ID"];
  organizationId: Scalars["ID"];
  data: Scalars["String"];
};

export type WebhookEventDataDeleteInput = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type WebhookEventDataPage = {
  __typename?: "WebhookEventDataPage";
  data?: Maybe<Array<WebhookEventData>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type WebhookEventDataUpdateInput = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
  httpStatus?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  webhookId: Scalars["ID"];
};

export type WebhookEventPage = {
  __typename?: "WebhookEventPage";
  data?: Maybe<Array<WebhookEvent>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type WebhookEventTypeAddInput = {
  event: Scalars["String"];
  description: Scalars["String"];
  organizationId: Scalars["ID"];
};

export type WebhookEventTypeDeleteInput = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type WebhookEventTypeUpdateInput = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
};

export type WebhookPage = {
  __typename?: "WebhookPage";
  data?: Maybe<Array<Webhook>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type WebhookTypePage = {
  __typename?: "WebhookTypePage";
  data?: Maybe<Array<WebhookEvent>>;
  paginationInfo?: Maybe<PaginationInfo>;
};

export type WebhookUpdateInput = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
  url?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  headers?: Maybe<Scalars["JSON"]>;
  method?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  enabled?: Maybe<Scalars["Boolean"]>;
};

export type Workflow = {
  __typename?: "Workflow";
  id: Scalars["ID"];
  name: Scalars["String"];
  description: Scalars["String"];
  organization?: Maybe<Organization>;
  workflowProcesses?: Maybe<Array<Maybe<WorkflowProcess>>>;
};

export enum Workflow_Entity_Type {
  Campaign = "Campaign",
  Offer = "Offer"
}

export type WorkflowChildrenProcessInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  workflowProcessTransitions: Array<
    Maybe<WorkflowChildrenProcessTransitionInput>
  >;
};

export type WorkflowChildrenProcessTransitionInput = {
  name: Scalars["String"];
  pickupStateName: Scalars["String"];
  dropStateName: Scalars["String"];
  ruleConfig: Scalars["String"];
};

export type WorkflowChildrenStateInput = {
  name: Scalars["String"];
  description: Scalars["String"];
};

export type WorkflowDiagram = {
  __typename?: "workflowDiagram";
  id: Scalars["ID"];
  name: Scalars["String"];
  description: Scalars["String"];
  diagram: Scalars["String"];
};

export type WorkflowEntity = {
  __typename?: "WorkflowEntity";
  id: Scalars["ID"];
  workflow?: Maybe<Workflow>;
  entityId: Scalars["ID"];
  entityType?: Maybe<Workflow_Entity_Type>;
  currentTransition?: Maybe<WorkflowEntityTransition>;
  transitionHistory?: Maybe<Array<Maybe<WorkflowEntityTransitionHistory>>>;
};

export type WorkflowEntityInput = {
  workflowId: Scalars["ID"];
  entityId: Scalars["ID"];
  entityType: Workflow_Entity_Type;
};

export type WorkflowEntityTransition = {
  __typename?: "WorkflowEntityTransition";
  id: Scalars["ID"];
  workflowEntityId: Scalars["ID"];
  workflowProcessTransitionId: Scalars["ID"];
  workflowProcessTransition?: Maybe<WorkflowProcessTransition>;
};

export type WorkflowEntityTransitionHistory = {
  __typename?: "WorkflowEntityTransitionHistory";
  id: Scalars["ID"];
  workflowEntityId: Scalars["ID"];
  workflowProcessTransitionId: Scalars["ID"];
  workflowProcessTransition?: Maybe<WorkflowProcessTransition>;
};

export type WorkflowEntityTransitionInput = {
  workflowEntityId: Scalars["ID"];
  workflowProcessTransitionId: Scalars["ID"];
};

export type WorkflowInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  organizationId: Scalars["ID"];
};

export type WorkflowProcess = {
  __typename?: "WorkflowProcess";
  id: Scalars["ID"];
  name: Scalars["String"];
  description: Scalars["String"];
  workflow?: Maybe<Workflow>;
  workflowProcessTransitions?: Maybe<Array<Maybe<WorkflowProcessTransition>>>;
};

export type WorkflowProcessInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  workflowId: Scalars["ID"];
};

export type WorkflowProcessTransition = {
  __typename?: "WorkflowProcessTransition";
  id: Scalars["ID"];
  name: Scalars["String"];
  pickupState?: Maybe<WorkflowState>;
  dropState?: Maybe<WorkflowState>;
  ruleConfig?: Maybe<Scalars["String"]>;
};

export type WorkflowProcessTransitionInput = {
  name: Scalars["String"];
  pickupStateId: Scalars["ID"];
  dropStateId: Scalars["ID"];
  ruleConfig: Scalars["String"];
  workflowProcessId: Scalars["ID"];
};

export type WorkflowRoute = {
  __typename?: "WorkflowRoute";
  id?: Maybe<Scalars["ID"]>;
  entityType?: Maybe<Workflow_Entity_Type>;
  organization?: Maybe<Organization>;
  rule?: Maybe<Rule>;
  workflow?: Maybe<Workflow>;
  status?: Maybe<Status>;
};

export type WorkflowRouteInput = {
  entityType: Workflow_Entity_Type;
  organizationId: Scalars["ID"];
  ruleId: Scalars["ID"];
  workflowId: Scalars["ID"];
};

export type WorkflowState = {
  __typename?: "WorkflowState";
  id: Scalars["ID"];
  code: Scalars["Int"];
  name: Scalars["String"];
  description: Scalars["String"];
  workflow?: Maybe<Workflow>;
};

export type WorkflowStateInput = {
  name: Scalars["String"];
  code: Scalars["Int"];
  description: Scalars["String"];
  workflowId: Scalars["ID"];
};

export type WorkflowWithChildrenInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  organizationId: Scalars["ID"];
  workflowProcesses: Array<Maybe<WorkflowChildrenProcessInput>>;
  workflowStates: Array<Maybe<WorkflowChildrenStateInput>>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Metric: ResolverTypeWrapper<Metric>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  METRIC_TYPE: Metric_Type;
  MetricFilter: ResolverTypeWrapper<MetricFilter>;
  METRIC_FILTER_TYPE: Metric_Filter_Type;
  STATUS: Status;
  Organization: ResolverTypeWrapper<Organization>;
  Webhook: ResolverTypeWrapper<Webhook>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  OrganizationTypeEnum: OrganizationTypeEnum;
  Application: ResolverTypeWrapper<Application>;
  Action: ResolverTypeWrapper<Action>;
  ActionDefinition: ResolverTypeWrapper<ActionDefinition>;
  APIKey: ResolverTypeWrapper<ApiKey>;
  Role: ResolverTypeWrapper<Role>;
  Policy: ResolverTypeWrapper<Policy>;
  POLICY_EFFECTS: Policy_Effects;
  POLICY_RESOURCES: Policy_Resources;
  POLICY_PERMISSIONS: Policy_Permissions;
  POLICY_TYPES: Policy_Types;
  POLICY_LEVELS: Policy_Levels;
  User: ResolverTypeWrapper<User>;
  Member: ResolverTypeWrapper<Member>;
  Campaign: ResolverTypeWrapper<Campaign>;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  Rule: ResolverTypeWrapper<Rule>;
  RULE_TYPE: Rule_Type;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  FeedbackForm: ResolverTypeWrapper<FeedbackForm>;
  Question: ResolverTypeWrapper<Question>;
  FeedbackCategory: ResolverTypeWrapper<FeedbackCategory>;
  FeedbackHandler: ResolverTypeWrapper<FeedbackHandler>;
  Choice: ResolverTypeWrapper<Choice>;
  Response: ResolverTypeWrapper<Response>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  CustomerFeedback: ResolverTypeWrapper<CustomerFeedback>;
  Customer: ResolverTypeWrapper<Customer>;
  CustomerDevice: ResolverTypeWrapper<CustomerDevice>;
  Event: ResolverTypeWrapper<Event>;
  EventType: ResolverTypeWrapper<EventType>;
  EventSubscription: ResolverTypeWrapper<EventSubscription>;
  TriggerActionEnum: TriggerActionEnum;
  FeedbackUIConfig: ResolverTypeWrapper<FeedbackUiConfig>;
  FeedbackTemplateUrl: ResolverTypeWrapper<FeedbackTemplateUrl>;
  FormExpiry: ResolverTypeWrapper<FormExpiry>;
  UnitOfTime: UnitOfTime;
  Store: ResolverTypeWrapper<Store>;
  StoreFormat: ResolverTypeWrapper<StoreFormat>;
  TaxType: ResolverTypeWrapper<TaxType>;
  Catalog: ResolverTypeWrapper<Catalog>;
  CatalogUsage: ResolverTypeWrapper<CatalogUsage>;
  Channel: ResolverTypeWrapper<Channel>;
  Charge: ResolverTypeWrapper<Charge>;
  WalkinProduct: ResolverTypeWrapper<WalkinProduct>;
  Workflow: ResolverTypeWrapper<Workflow>;
  WorkflowProcess: ResolverTypeWrapper<WorkflowProcess>;
  WorkflowProcessTransition: ResolverTypeWrapper<WorkflowProcessTransition>;
  WorkflowState: ResolverTypeWrapper<WorkflowState>;
  DB_SOURCE: Db_Source;
  PageOptions: PageOptions;
  SortOptions: SortOptions;
  ORDER: Order;
  MetricPage: ResolverTypeWrapper<MetricPage>;
  PaginationInfo: ResolverTypeWrapper<PaginationInfo>;
  MetricFilterPage: ResolverTypeWrapper<MetricFilterPage>;
  MetricExecutionResult: ResolverTypeWrapper<MetricExecutionResult>;
  WALKIN_PRODUCTS: Walkin_Products;
  MetricExecutionResultPage: ResolverTypeWrapper<MetricExecutionResultPage>;
  WebhookEvent: ResolverTypeWrapper<WebhookEvent>;
  WebhookEventPage: ResolverTypeWrapper<WebhookEventPage>;
  WebhookPage: ResolverTypeWrapper<WebhookPage>;
  WebhookEventDataPage: ResolverTypeWrapper<WebhookEventDataPage>;
  WebhookEventData: ResolverTypeWrapper<WebhookEventData>;
  UserPage: ResolverTypeWrapper<UserPage>;
  StoreSearchFilters: StoreSearchFilters;
  StoreFieldSearch: StoreFieldSearch;
  EXPRESSION_TYPE: Expression_Type;
  COMBINATOR: Combinator;
  Sort: Sort;
  StoreSearchOutput: ResolverTypeWrapper<StoreSearchOutput>;
  StoreDefnition: ResolverTypeWrapper<StoreDefnition>;
  StoreColumn: ResolverTypeWrapper<StoreColumn>;
  RuleEntity: ResolverTypeWrapper<RuleEntity>;
  RuleAttribute: ResolverTypeWrapper<RuleAttribute>;
  SearchRuleEntityInput: SearchRuleEntityInput;
  SearchRuleAttributeInput: SearchRuleAttributeInput;
  SearchRuleInput: SearchRuleInput;
  SQL: ResolverTypeWrapper<Sql>;
  RuleEvaluatioResult: ResolverTypeWrapper<RuleEvaluatioResult>;
  SearchBusinessRulesInput: SearchBusinessRulesInput;
  BUSINESS_RULE_LEVELS: Business_Rule_Levels;
  BusinessRule: ResolverTypeWrapper<BusinessRule>;
  SearchBusinessRuleDetailsInput: SearchBusinessRuleDetailsInput;
  BusinessRuleDetail: ResolverTypeWrapper<BusinessRuleDetail>;
  BusinessRuleConfigurationInput: BusinessRuleConfigurationInput;
  workflowDiagram: ResolverTypeWrapper<WorkflowDiagram>;
  WorkflowEntity: ResolverTypeWrapper<WorkflowEntity>;
  WORKFLOW_ENTITY_TYPE: Workflow_Entity_Type;
  WorkflowEntityTransition: ResolverTypeWrapper<WorkflowEntityTransition>;
  WorkflowEntityTransitionHistory: ResolverTypeWrapper<
    WorkflowEntityTransitionHistory
  >;
  WorkflowRoute: ResolverTypeWrapper<WorkflowRoute>;
  SearchCustomerInput: SearchCustomerInput;
  SearchCustomerDeviceInput: SearchCustomerDeviceInput;
  CustomerDefnition: ResolverTypeWrapper<CustomerDefnition>;
  CustomerColumn: ResolverTypeWrapper<CustomerColumn>;
  CustomerSearchFilters: CustomerSearchFilters;
  CustomerFieldSearch: CustomerFieldSearch;
  CustomerSearchOutput: ResolverTypeWrapper<CustomerSearchOutput>;
  EXTEND_ENTITIES: Extend_Entities;
  EntityExtend: ResolverTypeWrapper<EntityExtend>;
  EntityExtendField: ResolverTypeWrapper<EntityExtendField>;
  SLUGTYPE: Slugtype;
  BasicField: ResolverTypeWrapper<BasicField>;
  ActionDefinitionPage: ResolverTypeWrapper<ActionDefinitionPage>;
  ActionPage: ResolverTypeWrapper<ActionPage>;
  Session: ResolverTypeWrapper<Session>;
  Segment: ResolverTypeWrapper<Segment>;
  Audience: ResolverTypeWrapper<Audience>;
  CampaignControl: ResolverTypeWrapper<CampaignControl>;
  GlobalControl: ResolverTypeWrapper<GlobalControl>;
  AudienceCountOutput: ResolverTypeWrapper<AudienceCountOutput>;
  AudienceMember: ResolverTypeWrapper<AudienceMember>;
  FileSystem: ResolverTypeWrapper<FileSystem>;
  ACCESS_TYPE: Access_Type;
  FILE_SYSTEM_TYPE: File_System_Type;
  FileSystemsPage: ResolverTypeWrapper<FileSystemsPage>;
  File: ResolverTypeWrapper<File>;
  FilesPage: ResolverTypeWrapper<FilesPage>;
  MessageTemplate: ResolverTypeWrapper<MessageTemplate>;
  MESSAGE_FORMAT: Message_Format;
  TEMPLATE_STYLE: Template_Style;
  MessageTemplateVariable: ResolverTypeWrapper<MessageTemplateVariable>;
  VARIABLE_TYPE: Variable_Type;
  VARIABLE_FORMAT: Variable_Format;
  Communication: ResolverTypeWrapper<Communication>;
  COMMUNICATION_ENTITY_TYPE: Communication_Entity_Type;
  RepeatRuleConfigurationOutput: ResolverTypeWrapper<
    RepeatRuleConfigurationOutput
  >;
  COMMUNICATION_FREQUENCY: Communication_Frequency;
  COMMUNICATION_DAYS: Communication_Days;
  CommunicationLog: ResolverTypeWrapper<CommunicationLog>;
  COMMUNICATION_RUN_TYPE: Communication_Run_Type;
  COMMUNICATION_STATUS: Communication_Status;
  Category: ResolverTypeWrapper<Category>;
  Product: ResolverTypeWrapper<Product>;
  ProductTypeEnum: ProductTypeEnum;
  ProductVariant: ResolverTypeWrapper<ProductVariant>;
  OptionValue: ResolverTypeWrapper<OptionValue>;
  Option: ResolverTypeWrapper<Option>;
  ProductSearchInput: ProductSearchInput;
  ProductOption: ResolverTypeWrapper<ProductOption>;
  ProductVariantValue: ResolverTypeWrapper<ProductVariantValue>;
  ProductCategory: ResolverTypeWrapper<ProductCategory>;
  ChargeTypesInput: ChargeTypesInput;
  ChargeTypeInput: ChargeTypeInput;
  ChannelFilterInput: ChannelFilterInput;
  ChannelPage: ResolverTypeWrapper<ChannelPage>;
  TaxTypePage: ResolverTypeWrapper<TaxTypePage>;
  StoreFormatPage: ResolverTypeWrapper<StoreFormatPage>;
  ReportConfig: ResolverTypeWrapper<ReportConfig>;
  ReportConfigPage: ResolverTypeWrapper<ReportConfigPage>;
  Report: ResolverTypeWrapper<Report>;
  ReportPage: ResolverTypeWrapper<ReportPage>;
  CampaignOfferPage: ResolverTypeWrapper<CampaignOfferPage>;
  CampaignOfferOutput: ResolverTypeWrapper<CampaignOfferOutput>;
  Offer: ResolverTypeWrapper<Offer>;
  OFFER_TYPE: Offer_Type;
  OFFER_CATEGORY: Offer_Category;
  CustomerOffersOutput: ResolverTypeWrapper<CustomerOffersOutput>;
  CustomerOfferPage: ResolverTypeWrapper<CustomerOfferPage>;
  OFFER_STATES: Offer_States;
  OfferPage: ResolverTypeWrapper<OfferPage>;
  RedemptionOutput: ResolverTypeWrapper<RedemptionOutput>;
  HyperXOutput: ResolverTypeWrapper<HyperXOutput>;
  HyperXCampaignInput: HyperXCampaignInput;
  CAMPAIGN_STATUS: Campaign_Status;
  ViewHyperXCampaignsOutput: ResolverTypeWrapper<ViewHyperXCampaignsOutput>;
  CampaignsOutput: ResolverTypeWrapper<CampaignsOutput>;
  ViewHyperXCampaignOutput: ResolverTypeWrapper<ViewHyperXCampaignOutput>;
  FeedbackFormCreateInput: FeedbackFormCreateInput;
  FormExpiryInput: FormExpiryInput;
  FeedbackFormsResponse: ResolverTypeWrapper<FeedbackFormsResponse>;
  CustomerFeedbackResponse: ResolverTypeWrapper<CustomerFeedbackResponse>;
  QuestionTreeData: ResolverTypeWrapper<QuestionTreeData>;
  InitFeedbackFormData: ResolverTypeWrapper<InitFeedbackFormData>;
  LoyaltyCard: ResolverTypeWrapper<LoyaltyCard>;
  Currency: ResolverTypeWrapper<Currency>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  LoyaltyCardPage: ResolverTypeWrapper<LoyaltyCardPage>;
  CustomerLoyaltyInput: CustomerLoyaltyInput;
  CustomerLoyaltyOutput: ResolverTypeWrapper<CustomerLoyaltyOutput>;
  CurrencyPage: ResolverTypeWrapper<CurrencyPage>;
  EarnableLoyaltyTransactionInput: EarnableLoyaltyTransactionInput;
  Transaction: Transaction;
  EarnableBurnableLoyaltyTransactionOutput: ResolverTypeWrapper<
    EarnableBurnableLoyaltyTransactionOutput
  >;
  LoyaltyTransactionPage: ResolverTypeWrapper<LoyaltyTransactionPage>;
  CustomerLoyaltyTransactionData: ResolverTypeWrapper<
    CustomerLoyaltyTransactionData
  >;
  LoyaltyStatus: ResolverTypeWrapper<LoyaltyStatus>;
  LoyaltyLedger: ResolverTypeWrapper<LoyaltyLedger>;
  LoyaltyProgram: ResolverTypeWrapper<LoyaltyProgram>;
  ExpiryUnit: ExpiryUnit;
  TransactionStatus: ResolverTypeWrapper<TransactionStatus>;
  LoyaltyProgramInput: LoyaltyProgramInput;
  LoyaltyProgramPage: ResolverTypeWrapper<LoyaltyProgramPage>;
  LoyaltyLedgerOutputType: ResolverTypeWrapper<LoyaltyLedgerOutputType>;
  SORTING_DIRECTIONS: Sorting_Directions;
  LedgerOutput: ResolverTypeWrapper<LedgerOutput>;
  CustomerLedgerOutput: ResolverTypeWrapper<CustomerLedgerOutput>;
  CustomerLoyaltyTransaction: ResolverTypeWrapper<CustomerLoyaltyTransaction>;
  CustomerLoyalty: ResolverTypeWrapper<CustomerLoyalty>;
  Mutation: ResolverTypeWrapper<{}>;
  MetricAddInput: MetricAddInput;
  MetricUpdateInput: MetricUpdateInput;
  MetricFilterAddInput: MetricFilterAddInput;
  MetricFilterUpdateInput: MetricFilterUpdateInput;
  WebhookEventTypeAddInput: WebhookEventTypeAddInput;
  WebhookEventTypeUpdateInput: WebhookEventTypeUpdateInput;
  WebhookAddInput: WebhookAddInput;
  REQUEST_METHOD: Request_Method;
  WebhookUpdateInput: WebhookUpdateInput;
  WebhookEventDataAddInput: WebhookEventDataAddInput;
  WebhookEventDataUpdateInput: WebhookEventDataUpdateInput;
  UserCreateInput: UserCreateInput;
  CreateOrganizationInput: CreateOrganizationInput;
  walkinProducts: WalkinProducts;
  UserUpdateInput: UserUpdateInput;
  UpdatePasswordResponse: ResolverTypeWrapper<UpdatePasswordResponse>;
  ConfirmEmailResponse: ResolverTypeWrapper<ConfirmEmailResponse>;
  ResetPasswordResponse: ResolverTypeWrapper<ResetPasswordResponse>;
  DeleteOrganization: ResolverTypeWrapper<DeleteOrganization>;
  UpdateOrganizationInput: UpdateOrganizationInput;
  ApplicationUpdateInput: ApplicationUpdateInput;
  APIKeyInput: ApiKeyInput;
  EnvironmentEnum: EnvironmentEnum;
  ApplicationInput: ApplicationInput;
  LoginInput: LoginInput;
  JWT: ResolverTypeWrapper<Jwt>;
  RoleInput: RoleInput;
  RoleEditInput: RoleEditInput;
  PolicyInput: PolicyInput;
  PolicyEditInput: PolicyEditInput;
  CreateStoreAdminLevel: CreateStoreAdminLevel;
  StoreAdminLevel: ResolverTypeWrapper<StoreAdminLevel>;
  UpdateStoreAdminLevel: UpdateStoreAdminLevel;
  UpdateStoreInput: UpdateStoreInput;
  CreateStoreInput: CreateStoreInput;
  EventInput: EventInput;
  TypeDeleteEventSubscription: ResolverTypeWrapper<TypeDeleteEventSubscription>;
  TypeDeleteEvent: ResolverTypeWrapper<TypeDeleteEvent>;
  CreateRuleEntityInput: CreateRuleEntityInput;
  CreateRuleAttributeInput: CreateRuleAttributeInput;
  VALUE_TYPE: Value_Type;
  CreateRuleInput: CreateRuleInput;
  UpdateRuleInput: UpdateRuleInput;
  CreateBusinessRuleInput: CreateBusinessRuleInput;
  UpdateBusinessRuleInput: UpdateBusinessRuleInput;
  CreateBusinessRuleDetailInput: CreateBusinessRuleDetailInput;
  UpdateBusinessRuleDetailInput: UpdateBusinessRuleDetailInput;
  WorkflowInput: WorkflowInput;
  WorkflowWithChildrenInput: WorkflowWithChildrenInput;
  WorkflowChildrenProcessInput: WorkflowChildrenProcessInput;
  WorkflowChildrenProcessTransitionInput: WorkflowChildrenProcessTransitionInput;
  WorkflowChildrenStateInput: WorkflowChildrenStateInput;
  UpdateWorkflowInput: UpdateWorkflowInput;
  WorkflowProcessInput: WorkflowProcessInput;
  UpdateWorkflowProcessInput: UpdateWorkflowProcessInput;
  WorkflowProcessTransitionInput: WorkflowProcessTransitionInput;
  UpdateWorkflowProcessTransitionInput: UpdateWorkflowProcessTransitionInput;
  WorkflowStateInput: WorkflowStateInput;
  UpdateWorkflowStateInput: UpdateWorkflowStateInput;
  WorkflowEntityInput: WorkflowEntityInput;
  UpdateWorkflowEntityInput: UpdateWorkflowEntityInput;
  WorkflowEntityTransitionInput: WorkflowEntityTransitionInput;
  WorkflowRouteInput: WorkflowRouteInput;
  UpdateWorkflowRouteInput: UpdateWorkflowRouteInput;
  CustomerInput: CustomerInput;
  GENDER: Gender;
  CreateBulkCustomerResponse: ResolverTypeWrapper<CreateBulkCustomerResponse>;
  ValidationError: ResolverTypeWrapper<ValidationError>;
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateCustomer: ResolverTypeWrapper<UpdateCustomer>;
  CustomerDeviceInput: CustomerDeviceInput;
  UpdateCustomerDeviceInput: UpdateCustomerDeviceInput;
  CustomerFileUploadInput: CustomerFileUploadInput;
  Upload: ResolverTypeWrapper<Scalars["Upload"]>;
  UploadFileForCreateBulkCustomerResponse: ResolverTypeWrapper<
    UploadFileForCreateBulkCustomerResponse
  >;
  AddEntityExtend: AddEntityExtend;
  AddEntityExtendField: AddEntityExtendField;
  CreateActionDefinitionInput: CreateActionDefinitionInput;
  UpdateActionDefinitionInput: UpdateActionDefinitionInput;
  StartSessionInput: StartSessionInput;
  EndSessionInput: EndSessionInput;
  SegmentAddInput: SegmentAddInput;
  SEGMENT_TYPE: Segment_Type;
  SegmentUpdateInput: SegmentUpdateInput;
  CampaignAddInput: CampaignAddInput;
  CAMPAIGN_TYPE: Campaign_Type;
  CAMPAIGN_TRIGGER_TYPE: Campaign_Trigger_Type;
  CampaignUpdateInput: CampaignUpdateInput;
  createAudienceInput: CreateAudienceInput;
  updateAudienceInput: UpdateAudienceInput;
  addCampaignControl: AddCampaignControl;
  updateCampaignControl: UpdateCampaignControl;
  addGlobalControl: AddGlobalControl;
  addAudienceMemberInput: AddAudienceMemberInput;
  updateAudienceMemberInput: UpdateAudienceMemberInput;
  CreateFileSystemInput: CreateFileSystemInput;
  UpdateFileSystemInput: UpdateFileSystemInput;
  SignedUploadURLInput: SignedUploadUrlInput;
  SignedURL: ResolverTypeWrapper<SignedUrl>;
  S3Response: ResolverTypeWrapper<S3Response>;
  FileUploadInput: FileUploadInput;
  UpdateUploadFileInput: UpdateUploadFileInput;
  CreateMessageTemplateInput: CreateMessageTemplateInput;
  UpdateMessageTemplateInput: UpdateMessageTemplateInput;
  CreateMessageTemplateVariableInput: CreateMessageTemplateVariableInput;
  UpdateMessageTemplateVariableInput: UpdateMessageTemplateVariableInput;
  AddVariableToMessageTemplateInput: AddVariableToMessageTemplateInput;
  RemoveVariableFromMessageTemplateInput: RemoveVariableFromMessageTemplateInput;
  FormatMessageInput: FormatMessageInput;
  FormatMessage: ResolverTypeWrapper<FormatMessage>;
  SendMessageInput: SendMessageInput;
  CreateCommunicationWithoutMessageTemplateInput: CreateCommunicationWithoutMessageTemplateInput;
  RepeatRuleConfiguration: RepeatRuleConfiguration;
  UpdateCommunicationInput: UpdateCommunicationInput;
  CreateCommunicationInput: CreateCommunicationInput;
  CommunicationLogInput: CommunicationLogInput;
  CommunicationLogUpdateInput: CommunicationLogUpdateInput;
  CatalogInput: CatalogInput;
  CatalogUsageInput: CatalogUsageInput;
  UpdateCatalogInput: UpdateCatalogInput;
  UpdateCatalogUsageInput: UpdateCatalogUsageInput;
  CreateCategoryInput: CreateCategoryInput;
  UpdateCategoryInput: UpdateCategoryInput;
  OptionInput: OptionInput;
  ValueInput: ValueInput;
  UpdateOptionInput: UpdateOptionInput;
  OptionValueInput: OptionValueInput;
  UpdateOptionValueInput: UpdateOptionValueInput;
  CreateProductInput: CreateProductInput;
  CreateProductVariantInput: CreateProductVariantInput;
  UpdateProductInput: UpdateProductInput;
  ProductOptionInput: ProductOptionInput;
  UpdateProductOptionInput: UpdateProductOptionInput;
  ProductVariantInput: ProductVariantInput;
  UpdateProductVariantInput: UpdateProductVariantInput;
  ProductVariantValueInput: ProductVariantValueInput;
  UpdateProductVariantValueInput: UpdateProductVariantValueInput;
  ProductCategoryInput: ProductCategoryInput;
  UpdateProductCategoryInput: UpdateProductCategoryInput;
  ChargeTypeCreateInput: ChargeTypeCreateInput;
  ChargeTypeUpdateInput: ChargeTypeUpdateInput;
  ChannelTypeInput: ChannelTypeInput;
  ChannelTypeUpdateInput: ChannelTypeUpdateInput;
  TaxTypeInput: TaxTypeInput;
  StoreFormatInput: StoreFormatInput;
  CampaignOfferInput: CampaignOfferInput;
  updateCampaignOfferInput: UpdateCampaignOfferInput;
  CustomerOffersInput: CustomerOffersInput;
  updateCustomerOffersInput: UpdateCustomerOffersInput;
  OfferInput: OfferInput;
  updateOfferInput: UpdateOfferInput;
  RedeemOfferInput: RedeemOfferInput;
  FeedbackFormUpdateInput: FeedbackFormUpdateInput;
  FeedbackUIConfigUpdateInput: FeedbackUiConfigUpdateInput;
  FeedbackCategoryInput: FeedbackCategoryInput;
  UpdateFeedbackCategoryInput: UpdateFeedbackCategoryInput;
  EventCustomerInput: EventCustomerInput;
  EventCustomerDeviceInput: EventCustomerDeviceInput;
  QuestionInput: QuestionInput;
  Question_Type_Enum: Question_Type_Enum;
  ChoiceInput: ChoiceInput;
  RemovedQuestion: ResolverTypeWrapper<RemovedQuestion>;
  DeletedChoice: ResolverTypeWrapper<DeletedChoice>;
  EditQuestionInput: EditQuestionInput;
  EditChoiceInput: EditChoiceInput;
  CreateResponseInput: CreateResponseInput;
  ResponseSubmit: ResolverTypeWrapper<ResponseSubmit>;
  ResponseDep: ResolverTypeWrapper<ResponseDep>;
  EditResponseInput: EditResponseInput;
  DeletedFeedbackTemplateUrl: ResolverTypeWrapper<DeletedFeedbackTemplateUrl>;
  InitCustomerFeedbackData: ResolverTypeWrapper<InitCustomerFeedbackData>;
  FeedbackResponse: FeedbackResponse;
  LoyaltyCardCreateInput: LoyaltyCardCreateInput;
  LoyaltyCardUpdateInput: LoyaltyCardUpdateInput;
  CurrencyCreateInput: CurrencyCreateInput;
  CurrencyUpdateInput: CurrencyUpdateInput;
  ProcessLoyaltyOutput: ResolverTypeWrapper<ProcessLoyaltyOutput>;
  EarnableLoyaltyTransactionOutput: ResolverTypeWrapper<
    EarnableLoyaltyTransactionOutput
  >;
  TransactionStatusOutput: ResolverTypeWrapper<TransactionStatusOutput>;
  CancelLoyaltyTransactionOutput: ResolverTypeWrapper<
    CancelLoyaltyTransactionOutput
  >;
  LoyaltyStatusInput: LoyaltyStatusInput;
  statusCodes: StatusCodes;
  LoyaltyStatusOutput: ResolverTypeWrapper<LoyaltyStatusOutput>;
  LoyaltyTransaction: ResolverTypeWrapper<LoyaltyTransaction>;
  CreateLoyaltyProgramInput: CreateLoyaltyProgramInput;
  UpdateLoyaltyProgramInput: UpdateLoyaltyProgramInput;
  CreateCustomerSessionInput: CreateCustomerSessionInput;
  CreateCustomerSessionOutput: ResolverTypeWrapper<CreateCustomerSessionOutput>;
  UpdateCustomerProfileInputInSession: UpdateCustomerProfileInputInSession;
  UpdateCustomerProfileOutputInSession: ResolverTypeWrapper<
    UpdateCustomerProfileOutputInSession
  >;
  PermissionMap: PermissionMap;
  WebhookEventTypeDeleteInput: WebhookEventTypeDeleteInput;
  WebhookDeleteInput: WebhookDeleteInput;
  WebhookEventDataDeleteInput: WebhookEventDataDeleteInput;
  WebhookTypePage: ResolverTypeWrapper<WebhookTypePage>;
  ProcessEventInput: ProcessEventInput;
  RuleInputType: RuleInputType;
  ENTITY_TYPE: Entity_Type;
  CustomerFields: CustomerFields;
  DisableActionDefinitionInput: DisableActionDefinitionInput;
  CreateCommunicationWithoutMessageTemplateIdInput: CreateCommunicationWithoutMessageTemplateIdInput;
  CategoryInput: CategoryInput;
  CategorySearchInput: CategorySearchInput;
  TaxTypeSearchInput: TaxTypeSearchInput;
  StoreFormatSearchInput: StoreFormatSearchInput;
  FORMAT: Format;
  RedemptionPage: ResolverTypeWrapper<RedemptionPage>;
  cancelLoyaltyInput: CancelLoyaltyInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars["ID"];
  Metric: Metric;
  String: Scalars["String"];
  METRIC_TYPE: Metric_Type;
  MetricFilter: MetricFilter;
  METRIC_FILTER_TYPE: Metric_Filter_Type;
  STATUS: Status;
  Organization: Organization;
  Webhook: Webhook;
  JSON: Scalars["JSON"];
  Boolean: Scalars["Boolean"];
  OrganizationTypeEnum: OrganizationTypeEnum;
  Application: Application;
  Action: Action;
  ActionDefinition: ActionDefinition;
  APIKey: ApiKey;
  Role: Role;
  Policy: Policy;
  POLICY_EFFECTS: Policy_Effects;
  POLICY_RESOURCES: Policy_Resources;
  POLICY_PERMISSIONS: Policy_Permissions;
  POLICY_TYPES: Policy_Types;
  POLICY_LEVELS: Policy_Levels;
  User: User;
  Member: Member;
  Campaign: Campaign;
  DateTime: Scalars["DateTime"];
  Rule: Rule;
  RULE_TYPE: Rule_Type;
  Int: Scalars["Int"];
  FeedbackForm: FeedbackForm;
  Question: Question;
  FeedbackCategory: FeedbackCategory;
  FeedbackHandler: FeedbackHandler;
  Choice: Choice;
  Response: Response;
  Date: Scalars["Date"];
  CustomerFeedback: CustomerFeedback;
  Customer: Customer;
  CustomerDevice: CustomerDevice;
  Event: Event;
  EventType: EventType;
  EventSubscription: EventSubscription;
  TriggerActionEnum: TriggerActionEnum;
  FeedbackUIConfig: FeedbackUiConfig;
  FeedbackTemplateUrl: FeedbackTemplateUrl;
  FormExpiry: FormExpiry;
  UnitOfTime: UnitOfTime;
  Store: Store;
  StoreFormat: StoreFormat;
  TaxType: TaxType;
  Catalog: Catalog;
  CatalogUsage: CatalogUsage;
  Channel: Channel;
  Charge: Charge;
  WalkinProduct: WalkinProduct;
  Workflow: Workflow;
  WorkflowProcess: WorkflowProcess;
  WorkflowProcessTransition: WorkflowProcessTransition;
  WorkflowState: WorkflowState;
  DB_SOURCE: Db_Source;
  PageOptions: PageOptions;
  SortOptions: SortOptions;
  ORDER: Order;
  MetricPage: MetricPage;
  PaginationInfo: PaginationInfo;
  MetricFilterPage: MetricFilterPage;
  MetricExecutionResult: MetricExecutionResult;
  WALKIN_PRODUCTS: Walkin_Products;
  MetricExecutionResultPage: MetricExecutionResultPage;
  WebhookEvent: WebhookEvent;
  WebhookEventPage: WebhookEventPage;
  WebhookPage: WebhookPage;
  WebhookEventDataPage: WebhookEventDataPage;
  WebhookEventData: WebhookEventData;
  UserPage: UserPage;
  StoreSearchFilters: StoreSearchFilters;
  StoreFieldSearch: StoreFieldSearch;
  EXPRESSION_TYPE: Expression_Type;
  COMBINATOR: Combinator;
  Sort: Sort;
  StoreSearchOutput: StoreSearchOutput;
  StoreDefnition: StoreDefnition;
  StoreColumn: StoreColumn;
  RuleEntity: RuleEntity;
  RuleAttribute: RuleAttribute;
  SearchRuleEntityInput: SearchRuleEntityInput;
  SearchRuleAttributeInput: SearchRuleAttributeInput;
  SearchRuleInput: SearchRuleInput;
  SQL: Sql;
  RuleEvaluatioResult: RuleEvaluatioResult;
  SearchBusinessRulesInput: SearchBusinessRulesInput;
  BUSINESS_RULE_LEVELS: Business_Rule_Levels;
  BusinessRule: BusinessRule;
  SearchBusinessRuleDetailsInput: SearchBusinessRuleDetailsInput;
  BusinessRuleDetail: BusinessRuleDetail;
  BusinessRuleConfigurationInput: BusinessRuleConfigurationInput;
  workflowDiagram: WorkflowDiagram;
  WorkflowEntity: WorkflowEntity;
  WORKFLOW_ENTITY_TYPE: Workflow_Entity_Type;
  WorkflowEntityTransition: WorkflowEntityTransition;
  WorkflowEntityTransitionHistory: WorkflowEntityTransitionHistory;
  WorkflowRoute: WorkflowRoute;
  SearchCustomerInput: SearchCustomerInput;
  SearchCustomerDeviceInput: SearchCustomerDeviceInput;
  CustomerDefnition: CustomerDefnition;
  CustomerColumn: CustomerColumn;
  CustomerSearchFilters: CustomerSearchFilters;
  CustomerFieldSearch: CustomerFieldSearch;
  CustomerSearchOutput: CustomerSearchOutput;
  EXTEND_ENTITIES: Extend_Entities;
  EntityExtend: EntityExtend;
  EntityExtendField: EntityExtendField;
  SLUGTYPE: Slugtype;
  BasicField: BasicField;
  ActionDefinitionPage: ActionDefinitionPage;
  ActionPage: ActionPage;
  Session: Session;
  Segment: Segment;
  Audience: Audience;
  CampaignControl: CampaignControl;
  GlobalControl: GlobalControl;
  AudienceCountOutput: AudienceCountOutput;
  AudienceMember: AudienceMember;
  FileSystem: FileSystem;
  ACCESS_TYPE: Access_Type;
  FILE_SYSTEM_TYPE: File_System_Type;
  FileSystemsPage: FileSystemsPage;
  File: File;
  FilesPage: FilesPage;
  MessageTemplate: MessageTemplate;
  MESSAGE_FORMAT: Message_Format;
  TEMPLATE_STYLE: Template_Style;
  MessageTemplateVariable: MessageTemplateVariable;
  VARIABLE_TYPE: Variable_Type;
  VARIABLE_FORMAT: Variable_Format;
  Communication: Communication;
  COMMUNICATION_ENTITY_TYPE: Communication_Entity_Type;
  RepeatRuleConfigurationOutput: RepeatRuleConfigurationOutput;
  COMMUNICATION_FREQUENCY: Communication_Frequency;
  COMMUNICATION_DAYS: Communication_Days;
  CommunicationLog: CommunicationLog;
  COMMUNICATION_RUN_TYPE: Communication_Run_Type;
  COMMUNICATION_STATUS: Communication_Status;
  Category: Category;
  Product: Product;
  ProductTypeEnum: ProductTypeEnum;
  ProductVariant: ProductVariant;
  OptionValue: OptionValue;
  Option: Option;
  ProductSearchInput: ProductSearchInput;
  ProductOption: ProductOption;
  ProductVariantValue: ProductVariantValue;
  ProductCategory: ProductCategory;
  ChargeTypesInput: ChargeTypesInput;
  ChargeTypeInput: ChargeTypeInput;
  ChannelFilterInput: ChannelFilterInput;
  ChannelPage: ChannelPage;
  TaxTypePage: TaxTypePage;
  StoreFormatPage: StoreFormatPage;
  ReportConfig: ReportConfig;
  ReportConfigPage: ReportConfigPage;
  Report: Report;
  ReportPage: ReportPage;
  CampaignOfferPage: CampaignOfferPage;
  CampaignOfferOutput: CampaignOfferOutput;
  Offer: Offer;
  OFFER_TYPE: Offer_Type;
  OFFER_CATEGORY: Offer_Category;
  CustomerOffersOutput: CustomerOffersOutput;
  CustomerOfferPage: CustomerOfferPage;
  OFFER_STATES: Offer_States;
  OfferPage: OfferPage;
  RedemptionOutput: RedemptionOutput;
  HyperXOutput: HyperXOutput;
  HyperXCampaignInput: HyperXCampaignInput;
  CAMPAIGN_STATUS: Campaign_Status;
  ViewHyperXCampaignsOutput: ViewHyperXCampaignsOutput;
  CampaignsOutput: CampaignsOutput;
  ViewHyperXCampaignOutput: ViewHyperXCampaignOutput;
  FeedbackFormCreateInput: FeedbackFormCreateInput;
  FormExpiryInput: FormExpiryInput;
  FeedbackFormsResponse: FeedbackFormsResponse;
  CustomerFeedbackResponse: CustomerFeedbackResponse;
  QuestionTreeData: QuestionTreeData;
  InitFeedbackFormData: InitFeedbackFormData;
  LoyaltyCard: LoyaltyCard;
  Currency: Currency;
  Float: Scalars["Float"];
  LoyaltyCardPage: LoyaltyCardPage;
  CustomerLoyaltyInput: CustomerLoyaltyInput;
  CustomerLoyaltyOutput: CustomerLoyaltyOutput;
  CurrencyPage: CurrencyPage;
  EarnableLoyaltyTransactionInput: EarnableLoyaltyTransactionInput;
  Transaction: Transaction;
  EarnableBurnableLoyaltyTransactionOutput: EarnableBurnableLoyaltyTransactionOutput;
  LoyaltyTransactionPage: LoyaltyTransactionPage;
  CustomerLoyaltyTransactionData: CustomerLoyaltyTransactionData;
  LoyaltyStatus: LoyaltyStatus;
  LoyaltyLedger: LoyaltyLedger;
  LoyaltyProgram: LoyaltyProgram;
  ExpiryUnit: ExpiryUnit;
  TransactionStatus: TransactionStatus;
  LoyaltyProgramInput: LoyaltyProgramInput;
  LoyaltyProgramPage: LoyaltyProgramPage;
  LoyaltyLedgerOutputType: LoyaltyLedgerOutputType;
  SORTING_DIRECTIONS: Sorting_Directions;
  LedgerOutput: LedgerOutput;
  CustomerLedgerOutput: CustomerLedgerOutput;
  CustomerLoyaltyTransaction: CustomerLoyaltyTransaction;
  CustomerLoyalty: CustomerLoyalty;
  Mutation: {};
  MetricAddInput: MetricAddInput;
  MetricUpdateInput: MetricUpdateInput;
  MetricFilterAddInput: MetricFilterAddInput;
  MetricFilterUpdateInput: MetricFilterUpdateInput;
  WebhookEventTypeAddInput: WebhookEventTypeAddInput;
  WebhookEventTypeUpdateInput: WebhookEventTypeUpdateInput;
  WebhookAddInput: WebhookAddInput;
  REQUEST_METHOD: Request_Method;
  WebhookUpdateInput: WebhookUpdateInput;
  WebhookEventDataAddInput: WebhookEventDataAddInput;
  WebhookEventDataUpdateInput: WebhookEventDataUpdateInput;
  UserCreateInput: UserCreateInput;
  CreateOrganizationInput: CreateOrganizationInput;
  walkinProducts: WalkinProducts;
  UserUpdateInput: UserUpdateInput;
  UpdatePasswordResponse: UpdatePasswordResponse;
  ConfirmEmailResponse: ConfirmEmailResponse;
  ResetPasswordResponse: ResetPasswordResponse;
  DeleteOrganization: DeleteOrganization;
  UpdateOrganizationInput: UpdateOrganizationInput;
  ApplicationUpdateInput: ApplicationUpdateInput;
  APIKeyInput: ApiKeyInput;
  EnvironmentEnum: EnvironmentEnum;
  ApplicationInput: ApplicationInput;
  LoginInput: LoginInput;
  JWT: Jwt;
  RoleInput: RoleInput;
  RoleEditInput: RoleEditInput;
  PolicyInput: PolicyInput;
  PolicyEditInput: PolicyEditInput;
  CreateStoreAdminLevel: CreateStoreAdminLevel;
  StoreAdminLevel: StoreAdminLevel;
  UpdateStoreAdminLevel: UpdateStoreAdminLevel;
  UpdateStoreInput: UpdateStoreInput;
  CreateStoreInput: CreateStoreInput;
  EventInput: EventInput;
  TypeDeleteEventSubscription: TypeDeleteEventSubscription;
  TypeDeleteEvent: TypeDeleteEvent;
  CreateRuleEntityInput: CreateRuleEntityInput;
  CreateRuleAttributeInput: CreateRuleAttributeInput;
  VALUE_TYPE: Value_Type;
  CreateRuleInput: CreateRuleInput;
  UpdateRuleInput: UpdateRuleInput;
  CreateBusinessRuleInput: CreateBusinessRuleInput;
  UpdateBusinessRuleInput: UpdateBusinessRuleInput;
  CreateBusinessRuleDetailInput: CreateBusinessRuleDetailInput;
  UpdateBusinessRuleDetailInput: UpdateBusinessRuleDetailInput;
  WorkflowInput: WorkflowInput;
  WorkflowWithChildrenInput: WorkflowWithChildrenInput;
  WorkflowChildrenProcessInput: WorkflowChildrenProcessInput;
  WorkflowChildrenProcessTransitionInput: WorkflowChildrenProcessTransitionInput;
  WorkflowChildrenStateInput: WorkflowChildrenStateInput;
  UpdateWorkflowInput: UpdateWorkflowInput;
  WorkflowProcessInput: WorkflowProcessInput;
  UpdateWorkflowProcessInput: UpdateWorkflowProcessInput;
  WorkflowProcessTransitionInput: WorkflowProcessTransitionInput;
  UpdateWorkflowProcessTransitionInput: UpdateWorkflowProcessTransitionInput;
  WorkflowStateInput: WorkflowStateInput;
  UpdateWorkflowStateInput: UpdateWorkflowStateInput;
  WorkflowEntityInput: WorkflowEntityInput;
  UpdateWorkflowEntityInput: UpdateWorkflowEntityInput;
  WorkflowEntityTransitionInput: WorkflowEntityTransitionInput;
  WorkflowRouteInput: WorkflowRouteInput;
  UpdateWorkflowRouteInput: UpdateWorkflowRouteInput;
  CustomerInput: CustomerInput;
  GENDER: Gender;
  CreateBulkCustomerResponse: CreateBulkCustomerResponse;
  ValidationError: ValidationError;
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateCustomer: UpdateCustomer;
  CustomerDeviceInput: CustomerDeviceInput;
  UpdateCustomerDeviceInput: UpdateCustomerDeviceInput;
  CustomerFileUploadInput: CustomerFileUploadInput;
  Upload: Scalars["Upload"];
  UploadFileForCreateBulkCustomerResponse: UploadFileForCreateBulkCustomerResponse;
  AddEntityExtend: AddEntityExtend;
  AddEntityExtendField: AddEntityExtendField;
  CreateActionDefinitionInput: CreateActionDefinitionInput;
  UpdateActionDefinitionInput: UpdateActionDefinitionInput;
  StartSessionInput: StartSessionInput;
  EndSessionInput: EndSessionInput;
  SegmentAddInput: SegmentAddInput;
  SEGMENT_TYPE: Segment_Type;
  SegmentUpdateInput: SegmentUpdateInput;
  CampaignAddInput: CampaignAddInput;
  CAMPAIGN_TYPE: Campaign_Type;
  CAMPAIGN_TRIGGER_TYPE: Campaign_Trigger_Type;
  CampaignUpdateInput: CampaignUpdateInput;
  createAudienceInput: CreateAudienceInput;
  updateAudienceInput: UpdateAudienceInput;
  addCampaignControl: AddCampaignControl;
  updateCampaignControl: UpdateCampaignControl;
  addGlobalControl: AddGlobalControl;
  addAudienceMemberInput: AddAudienceMemberInput;
  updateAudienceMemberInput: UpdateAudienceMemberInput;
  CreateFileSystemInput: CreateFileSystemInput;
  UpdateFileSystemInput: UpdateFileSystemInput;
  SignedUploadURLInput: SignedUploadUrlInput;
  SignedURL: SignedUrl;
  S3Response: S3Response;
  FileUploadInput: FileUploadInput;
  UpdateUploadFileInput: UpdateUploadFileInput;
  CreateMessageTemplateInput: CreateMessageTemplateInput;
  UpdateMessageTemplateInput: UpdateMessageTemplateInput;
  CreateMessageTemplateVariableInput: CreateMessageTemplateVariableInput;
  UpdateMessageTemplateVariableInput: UpdateMessageTemplateVariableInput;
  AddVariableToMessageTemplateInput: AddVariableToMessageTemplateInput;
  RemoveVariableFromMessageTemplateInput: RemoveVariableFromMessageTemplateInput;
  FormatMessageInput: FormatMessageInput;
  FormatMessage: FormatMessage;
  SendMessageInput: SendMessageInput;
  CreateCommunicationWithoutMessageTemplateInput: CreateCommunicationWithoutMessageTemplateInput;
  RepeatRuleConfiguration: RepeatRuleConfiguration;
  UpdateCommunicationInput: UpdateCommunicationInput;
  CreateCommunicationInput: CreateCommunicationInput;
  CommunicationLogInput: CommunicationLogInput;
  CommunicationLogUpdateInput: CommunicationLogUpdateInput;
  CatalogInput: CatalogInput;
  CatalogUsageInput: CatalogUsageInput;
  UpdateCatalogInput: UpdateCatalogInput;
  UpdateCatalogUsageInput: UpdateCatalogUsageInput;
  CreateCategoryInput: CreateCategoryInput;
  UpdateCategoryInput: UpdateCategoryInput;
  OptionInput: OptionInput;
  ValueInput: ValueInput;
  UpdateOptionInput: UpdateOptionInput;
  OptionValueInput: OptionValueInput;
  UpdateOptionValueInput: UpdateOptionValueInput;
  CreateProductInput: CreateProductInput;
  CreateProductVariantInput: CreateProductVariantInput;
  UpdateProductInput: UpdateProductInput;
  ProductOptionInput: ProductOptionInput;
  UpdateProductOptionInput: UpdateProductOptionInput;
  ProductVariantInput: ProductVariantInput;
  UpdateProductVariantInput: UpdateProductVariantInput;
  ProductVariantValueInput: ProductVariantValueInput;
  UpdateProductVariantValueInput: UpdateProductVariantValueInput;
  ProductCategoryInput: ProductCategoryInput;
  UpdateProductCategoryInput: UpdateProductCategoryInput;
  ChargeTypeCreateInput: ChargeTypeCreateInput;
  ChargeTypeUpdateInput: ChargeTypeUpdateInput;
  ChannelTypeInput: ChannelTypeInput;
  ChannelTypeUpdateInput: ChannelTypeUpdateInput;
  TaxTypeInput: TaxTypeInput;
  StoreFormatInput: StoreFormatInput;
  CampaignOfferInput: CampaignOfferInput;
  updateCampaignOfferInput: UpdateCampaignOfferInput;
  CustomerOffersInput: CustomerOffersInput;
  updateCustomerOffersInput: UpdateCustomerOffersInput;
  OfferInput: OfferInput;
  updateOfferInput: UpdateOfferInput;
  RedeemOfferInput: RedeemOfferInput;
  FeedbackFormUpdateInput: FeedbackFormUpdateInput;
  FeedbackUIConfigUpdateInput: FeedbackUiConfigUpdateInput;
  FeedbackCategoryInput: FeedbackCategoryInput;
  UpdateFeedbackCategoryInput: UpdateFeedbackCategoryInput;
  EventCustomerInput: EventCustomerInput;
  EventCustomerDeviceInput: EventCustomerDeviceInput;
  QuestionInput: QuestionInput;
  Question_Type_Enum: Question_Type_Enum;
  ChoiceInput: ChoiceInput;
  RemovedQuestion: RemovedQuestion;
  DeletedChoice: DeletedChoice;
  EditQuestionInput: EditQuestionInput;
  EditChoiceInput: EditChoiceInput;
  CreateResponseInput: CreateResponseInput;
  ResponseSubmit: ResponseSubmit;
  ResponseDep: ResponseDep;
  EditResponseInput: EditResponseInput;
  DeletedFeedbackTemplateUrl: DeletedFeedbackTemplateUrl;
  InitCustomerFeedbackData: InitCustomerFeedbackData;
  FeedbackResponse: FeedbackResponse;
  LoyaltyCardCreateInput: LoyaltyCardCreateInput;
  LoyaltyCardUpdateInput: LoyaltyCardUpdateInput;
  CurrencyCreateInput: CurrencyCreateInput;
  CurrencyUpdateInput: CurrencyUpdateInput;
  ProcessLoyaltyOutput: ProcessLoyaltyOutput;
  EarnableLoyaltyTransactionOutput: EarnableLoyaltyTransactionOutput;
  TransactionStatusOutput: TransactionStatusOutput;
  CancelLoyaltyTransactionOutput: CancelLoyaltyTransactionOutput;
  LoyaltyStatusInput: LoyaltyStatusInput;
  statusCodes: StatusCodes;
  LoyaltyStatusOutput: LoyaltyStatusOutput;
  LoyaltyTransaction: LoyaltyTransaction;
  CreateLoyaltyProgramInput: CreateLoyaltyProgramInput;
  UpdateLoyaltyProgramInput: UpdateLoyaltyProgramInput;
  CreateCustomerSessionInput: CreateCustomerSessionInput;
  CreateCustomerSessionOutput: CreateCustomerSessionOutput;
  UpdateCustomerProfileInputInSession: UpdateCustomerProfileInputInSession;
  UpdateCustomerProfileOutputInSession: UpdateCustomerProfileOutputInSession;
  PermissionMap: PermissionMap;
  WebhookEventTypeDeleteInput: WebhookEventTypeDeleteInput;
  WebhookDeleteInput: WebhookDeleteInput;
  WebhookEventDataDeleteInput: WebhookEventDataDeleteInput;
  WebhookTypePage: WebhookTypePage;
  ProcessEventInput: ProcessEventInput;
  RuleInputType: RuleInputType;
  ENTITY_TYPE: Entity_Type;
  CustomerFields: CustomerFields;
  DisableActionDefinitionInput: DisableActionDefinitionInput;
  CreateCommunicationWithoutMessageTemplateIdInput: CreateCommunicationWithoutMessageTemplateIdInput;
  CategoryInput: CategoryInput;
  CategorySearchInput: CategorySearchInput;
  TaxTypeSearchInput: TaxTypeSearchInput;
  StoreFormatSearchInput: StoreFormatSearchInput;
  FORMAT: Format;
  RedemptionPage: RedemptionPage;
  cancelLoyaltyInput: CancelLoyaltyInput;
};

export type AuthDirectiveResolver<
  Result,
  Parent,
  ContextType = ModuleContext,
  Args = { requires?: Maybe<Maybe<Array<Maybe<PermissionMap>>>> }
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ActionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Action"] = ResolversParentTypes["Action"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  actionDefinition?: Resolver<
    Maybe<ResolversTypes["ActionDefinition"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  request?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  response?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type ActionDefinitionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ActionDefinition"] = ResolversParentTypes["ActionDefinition"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  configuration?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  inputSchema?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  outputSchema?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type ActionDefinitionPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ActionDefinitionPage"] = ResolversParentTypes["ActionDefinitionPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["ActionDefinition"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type ActionPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ActionPage"] = ResolversParentTypes["ActionPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["Action"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type ApiKeyResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["APIKey"] = ResolversParentTypes["APIKey"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  environment?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  roles?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Role"]>>>,
    ParentType,
    ContextType
  >;
  api_key?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type ApplicationResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Application"] = ResolversParentTypes["Application"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  auth_key_hooks?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  platform?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  actions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Action"]>>>,
    ParentType,
    ContextType
  >;
  apiKeys?: Resolver<Maybe<ResolversTypes["APIKey"]>, ParentType, ContextType>;
};

export type AudienceResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Audience"] = ResolversParentTypes["Audience"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  segment?: Resolver<Maybe<ResolversTypes["Segment"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type AudienceCountOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["AudienceCountOutput"] = ResolversParentTypes["AudienceCountOutput"]
> = {
  count?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type AudienceMemberResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["AudienceMember"] = ResolversParentTypes["AudienceMember"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  audience?: Resolver<ResolversTypes["Audience"], ParentType, ContextType>;
  customer?: Resolver<ResolversTypes["Customer"], ParentType, ContextType>;
  status?: Resolver<ResolversTypes["STATUS"], ParentType, ContextType>;
};

export type BasicFieldResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["BasicField"] = ResolversParentTypes["BasicField"]
> = {
  slug?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["SLUGTYPE"]>, ParentType, ContextType>;
  required?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  defaultValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  searchable?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type BusinessRuleResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["BusinessRule"] = ResolversParentTypes["BusinessRule"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ruleLevel?: Resolver<
    ResolversTypes["BUSINESS_RULE_LEVELS"],
    ParentType,
    ContextType
  >;
  ruleType?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ruleDefaultValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type BusinessRuleDetailResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["BusinessRuleDetail"] = ResolversParentTypes["BusinessRuleDetail"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ruleLevel?: Resolver<
    ResolversTypes["BUSINESS_RULE_LEVELS"],
    ParentType,
    ContextType
  >;
  ruleLevelId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ruleType?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ruleValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type CampaignResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Campaign"] = ResolversParentTypes["Campaign"]
> = {
  createdBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastModifiedBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  lastModifiedTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  startTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  endTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  campaignType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  triggerRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  campaignStatus?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  audienceFilterRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType
  >;
  feedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType
  >;
};

export type CampaignControlResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CampaignControl"] = ResolversParentTypes["CampaignControl"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  startTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  endTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type CampaignOfferOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CampaignOfferOutput"] = ResolversParentTypes["CampaignOfferOutput"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes["Offer"]>, ParentType, ContextType>;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  startDate?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  endDate?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type CampaignOfferPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CampaignOfferPage"] = ResolversParentTypes["CampaignOfferPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CampaignOfferOutput"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type CampaignsOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CampaignsOutput"] = ResolversParentTypes["CampaignsOutput"]
> = {
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  audienceCount?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  reached?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  redemptionRate?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
};

export type CancelLoyaltyTransactionOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CancelLoyaltyTransactionOutput"] = ResolversParentTypes["CancelLoyaltyTransactionOutput"]
> = {
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  externalCustomerId?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  loyaltyReferenceId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  totalPoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  totalAmount?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type CatalogResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Catalog"] = ResolversParentTypes["Catalog"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  catalogCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  usage?: Resolver<
    Maybe<ResolversTypes["CatalogUsage"]>,
    ParentType,
    ContextType
  >;
};

export type CatalogUsageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CatalogUsage"] = ResolversParentTypes["CatalogUsage"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  purpose?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type CategoryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Category"] = ResolversParentTypes["Category"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  catalogId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  products?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Product"]>>>,
    ParentType,
    ContextType
  >;
  parent?: Resolver<Maybe<ResolversTypes["Category"]>, ParentType, ContextType>;
  children?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Category"]>>>,
    ParentType,
    ContextType
  >;
  catalog?: Resolver<Maybe<ResolversTypes["Catalog"]>, ParentType, ContextType>;
};

export type ChannelResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Channel"] = ResolversParentTypes["Channel"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  channelCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  chargeTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Charge"]>>>,
    ParentType,
    ContextType
  >;
};

export type ChannelPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ChannelPage"] = ResolversParentTypes["ChannelPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Channel"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type ChargeResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Charge"] = ResolversParentTypes["Charge"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  chargeTypeCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type ChoiceResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Choice"] = ResolversParentTypes["Choice"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  fromQuestion?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType
  >;
  toQuestion?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType
  >;
  choiceText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  responses?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Response"]>>>,
    ParentType,
    ContextType
  >;
  rangeStart?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  rangeEnd?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type CommunicationResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Communication"] = ResolversParentTypes["Communication"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  entityId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  entityType?: Resolver<
    Maybe<ResolversTypes["COMMUNICATION_ENTITY_TYPE"]>,
    ParentType,
    ContextType
  >;
  messageTemplate?: Resolver<
    Maybe<ResolversTypes["MessageTemplate"]>,
    ParentType,
    ContextType
  >;
  isScheduled?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  firstScheduleDateTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  isRepeatable?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  lastProcessedDateTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  repeatRuleConfiguration?: Resolver<
    Maybe<ResolversTypes["RepeatRuleConfigurationOutput"]>,
    ParentType,
    ContextType
  >;
  commsChannelName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
};

export type CommunicationLogResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CommunicationLog"] = ResolversParentTypes["CommunicationLog"]
> = {
  communication?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType
  >;
  startTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  endTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  runType?: Resolver<
    Maybe<ResolversTypes["COMMUNICATION_RUN_TYPE"]>,
    ParentType,
    ContextType
  >;
  communicationStatus?: Resolver<
    Maybe<ResolversTypes["COMMUNICATION_STATUS"]>,
    ParentType,
    ContextType
  >;
  log?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
};

export type ConfirmEmailResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ConfirmEmailResponse"] = ResolversParentTypes["ConfirmEmailResponse"]
> = {
  userId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  verified?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
};

export type CreateBulkCustomerResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CreateBulkCustomerResponse"] = ResolversParentTypes["CreateBulkCustomerResponse"]
> = {
  savedCustomers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Customer"]>>>,
    ParentType,
    ContextType
  >;
  validationErrors?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ValidationError"]>>>,
    ParentType,
    ContextType
  >;
};

export type CreateCustomerSessionOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CreateCustomerSessionOutput"] = ResolversParentTypes["CreateCustomerSessionOutput"]
> = {
  customerId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type CurrencyResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Currency"] = ResolversParentTypes["Currency"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  conversionRatio?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type CurrencyPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CurrencyPage"] = ResolversParentTypes["CurrencyPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Currency"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Customer"] = ResolversParentTypes["Customer"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  phoneNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  gender?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  dateOfBirth?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  externalCustomerId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  customerIdentifier?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  onboardSource?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  customerDevices?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerDevice"]>>>,
    ParentType,
    ContextType
  >;
};

export type CustomerColumnResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerColumn"] = ResolversParentTypes["CustomerColumn"]
> = {
  column_slug?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  column_search_key?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  column_label?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  column_type?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  searchable?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  extended_column?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerDefnitionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerDefnition"] = ResolversParentTypes["CustomerDefnition"]
> = {
  entityName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  searchEntityName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  columns?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerColumn"]>>>,
    ParentType,
    ContextType
  >;
};

export type CustomerDeviceResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerDevice"] = ResolversParentTypes["CustomerDevice"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  fcmToken?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  deviceId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  modelNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  osVersion?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerFeedbackResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerFeedback"] = ResolversParentTypes["CustomerFeedback"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  createdTime?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >;
  feedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType
  >;
  response?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Response"]>>>,
    ParentType,
    ContextType
  >;
  completed?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  event?: Resolver<Maybe<ResolversTypes["Event"]>, ParentType, ContextType>;
  expiryDate?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
};

export type CustomerFeedbackResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerFeedbackResponse"] = ResolversParentTypes["CustomerFeedbackResponse"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerFeedback"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerLedgerOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerLedgerOutput"] = ResolversParentTypes["CustomerLedgerOutput"]
> = {
  createdTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  lastModifiedTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  loyaltyTransaction?: Resolver<
    Maybe<ResolversTypes["CustomerLoyaltyTransaction"]>,
    ParentType,
    ContextType
  >;
  loyaltyLedger?: Resolver<
    Maybe<ResolversTypes["LoyaltyLedger"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerLoyaltyResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerLoyalty"] = ResolversParentTypes["CustomerLoyalty"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  points?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  pointsBlocked?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerLoyaltyOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerLoyaltyOutput"] = ResolversParentTypes["CustomerLoyaltyOutput"]
> = {
  createdTime?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  lastModifiedTime?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  externalCustomerId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  overallPoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  burnablePoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  overallAmount?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  burnableAmount?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsBlocked?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  blockedAmount?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  loyaltyCardCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  loyaltyEnabled?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerLoyaltyTransactionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerLoyaltyTransaction"] = ResolversParentTypes["CustomerLoyaltyTransaction"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  loyaltyReferenceId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  loyaltyType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  pointsBlocked?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsIssued?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsRedeemed?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  customerLoyalty?: Resolver<
    Maybe<ResolversTypes["CustomerLoyalty"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerLoyaltyTransactionDataResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerLoyaltyTransactionData"] = ResolversParentTypes["CustomerLoyaltyTransactionData"]
> = {
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  statusCode?: Resolver<
    Maybe<ResolversTypes["LoyaltyStatus"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pointsBlocked?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsIssued?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsRedeemed?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  loyaltyReferenceId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  loyaltyLedgers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["LoyaltyLedger"]>>>,
    ParentType,
    ContextType
  >;
  customerLoyalty?: Resolver<
    Maybe<ResolversTypes["CustomerLoyaltyOutput"]>,
    ParentType,
    ContextType
  >;
  loyaltyProgram?: Resolver<
    Maybe<ResolversTypes["LoyaltyProgram"]>,
    ParentType,
    ContextType
  >;
  data?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
};

export type CustomerOfferPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerOfferPage"] = ResolversParentTypes["CustomerOfferPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerOffersOutput"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerOffersOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerOffersOutput"] = ResolversParentTypes["CustomerOffersOutput"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  offer?: Resolver<Maybe<ResolversTypes["Offer"]>, ParentType, ContextType>;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >;
  coupon?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organizationId?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type CustomerSearchOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["CustomerSearchOutput"] = ResolversParentTypes["CustomerSearchOutput"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["JSON"]>>>,
    ParentType,
    ContextType
  >;
  total?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  page?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export type DeletedChoiceResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["DeletedChoice"] = ResolversParentTypes["DeletedChoice"]
> = {
  choiceText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  rangeStart?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  rangeEnd?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type DeletedFeedbackTemplateUrlResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["DeletedFeedbackTemplateUrl"] = ResolversParentTypes["DeletedFeedbackTemplateUrl"]
> = {
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type DeleteOrganizationResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["DeleteOrganization"] = ResolversParentTypes["DeleteOrganization"]
> = {
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  addressLine1?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  addressLine2?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pinCode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  externalOrganizationId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["STATUS"], ParentType, ContextType>;
  phoneNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  website?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  organizationType?: Resolver<
    Maybe<ResolversTypes["OrganizationTypeEnum"]>,
    ParentType,
    ContextType
  >;
};

export type EarnableBurnableLoyaltyTransactionOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["EarnableBurnableLoyaltyTransactionOutput"] = ResolversParentTypes["EarnableBurnableLoyaltyTransactionOutput"]
> = {
  earnablePoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  burnablePoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  earnableAmount?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  burnableAmount?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  overallPoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  overallAmount?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  loyaltyEnabled?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  earnedPointsExpiryValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  earnedPointsExpiryUnit?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type EarnableLoyaltyTransactionOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["EarnableLoyaltyTransactionOutput"] = ResolversParentTypes["EarnableLoyaltyTransactionOutput"]
> = {
  loyaltyCardCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  earnablePoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  burnablePoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  earnableAmount?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  burnableAmount?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  loyaltyReferenceId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  blockedPoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
};

export type EntityExtendResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["EntityExtend"] = ResolversParentTypes["EntityExtend"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  entityName?: Resolver<
    ResolversTypes["EXTEND_ENTITIES"],
    ParentType,
    ContextType
  >;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  organization?: Resolver<
    ResolversTypes["Organization"],
    ParentType,
    ContextType
  >;
  fields?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["EntityExtendField"]>>>,
    ParentType,
    ContextType
  >;
};

export type EntityExtendFieldResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["EntityExtendField"] = ResolversParentTypes["EntityExtendField"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  help?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes["SLUGTYPE"], ParentType, ContextType>;
  required?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  choices?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  defaultValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  searchable?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  validator?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type EventResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Event"] = ResolversParentTypes["Event"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  sourceEventId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  sourceEventTime?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  sourceName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  data?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  eventType?: Resolver<
    Maybe<ResolversTypes["EventType"]>,
    ParentType,
    ContextType
  >;
  processedStatus?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
};

export type EventSubscriptionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["EventSubscription"] = ResolversParentTypes["EventSubscription"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  triggerAction?: Resolver<
    Maybe<ResolversTypes["TriggerActionEnum"]>,
    ParentType,
    ContextType
  >;
  customAction?: Resolver<
    Maybe<ResolversTypes["Action"]>,
    ParentType,
    ContextType
  >;
  eventType?: Resolver<
    Maybe<ResolversTypes["EventType"]>,
    ParentType,
    ContextType
  >;
  sync?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type EventTypeResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["EventType"] = ResolversParentTypes["EventType"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  eventSubscriptions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["EventSubscription"]>>>,
    ParentType,
    ContextType
  >;
  events?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Event"]>>>,
    ParentType,
    ContextType
  >;
};

export type FeedbackCategoryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FeedbackCategory"] = ResolversParentTypes["FeedbackCategory"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  children?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FeedbackCategory"]>>>,
    ParentType,
    ContextType
  >;
  parent?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  feedbackHandler?: Resolver<
    Maybe<ResolversTypes["FeedbackHandler"]>,
    ParentType,
    ContextType
  >;
  questions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Question"]>>>,
    ParentType,
    ContextType
  >;
};

export type FeedbackFormResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FeedbackForm"] = ResolversParentTypes["FeedbackForm"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  questionnaireRoot?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType
  >;
  customerFeedbacks?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerFeedback"]>>>,
    ParentType,
    ContextType
  >;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  feedbackUIConfig?: Resolver<
    Maybe<ResolversTypes["FeedbackUIConfig"]>,
    ParentType,
    ContextType
  >;
  autoCreateCustomer?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  feedbackTemplateURL?: Resolver<
    Maybe<ResolversTypes["FeedbackTemplateUrl"]>,
    ParentType,
    ContextType
  >;
  expireAfter?: Resolver<
    Maybe<ResolversTypes["FormExpiry"]>,
    ParentType,
    ContextType
  >;
  firebaseDynamicLinkPrefix?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  firebaseDynamicLinkAPIURL?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  fireBaseAPIKey?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createMultipleFeedbacks?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
};

export type FeedbackFormsResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FeedbackFormsResponse"] = ResolversParentTypes["FeedbackFormsResponse"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FeedbackForm"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type FeedbackHandlerResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FeedbackHandler"] = ResolversParentTypes["FeedbackHandler"]
> = {
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  category?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType
  >;
};

export type FeedbackTemplateUrlResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FeedbackTemplateUrl"] = ResolversParentTypes["FeedbackTemplateUrl"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  feedbackForms?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FeedbackForm"]>>>,
    ParentType,
    ContextType
  >;
};

export type FeedbackUiConfigResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FeedbackUIConfig"] = ResolversParentTypes["FeedbackUIConfig"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  layoutCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  backgroundColor?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  accentColor?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  transition?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  logoUrl?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  formStructure?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  headerText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  exitMessage?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  buttonText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  feedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType
  >;
};

export type FileResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["File"] = ResolversParentTypes["File"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  mimeType?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  encoding?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  internalUrl?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  publicUrl?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  fileSystem?: Resolver<
    Maybe<ResolversTypes["FileSystem"]>,
    ParentType,
    ContextType
  >;
};

export type FilesPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FilesPage"] = ResolversParentTypes["FilesPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["File"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type FileSystemResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FileSystem"] = ResolversParentTypes["FileSystem"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  accessType?: Resolver<
    Maybe<ResolversTypes["ACCESS_TYPE"]>,
    ParentType,
    ContextType
  >;
  fileSystemType?: Resolver<
    Maybe<ResolversTypes["FILE_SYSTEM_TYPE"]>,
    ParentType,
    ContextType
  >;
  configuration?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  enabled?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type FileSystemsPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FileSystemsPage"] = ResolversParentTypes["FileSystemsPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["FileSystem"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type FormatMessageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FormatMessage"] = ResolversParentTypes["FormatMessage"]
> = {
  templateId?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  variables?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  bodyText?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  subjectText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  templateStyle?: Resolver<
    Maybe<ResolversTypes["TEMPLATE_STYLE"]>,
    ParentType,
    ContextType
  >;
};

export type FormExpiryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["FormExpiry"] = ResolversParentTypes["FormExpiry"]
> = {
  value?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes["UnitOfTime"]>, ParentType, ContextType>;
};

export type GlobalControlResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["GlobalControl"] = ResolversParentTypes["GlobalControl"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >;
  startTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  endTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type HyperXOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["HyperXOutput"] = ResolversParentTypes["HyperXOutput"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  initStatus?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type InitCustomerFeedbackDataResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["InitCustomerFeedbackData"] = ResolversParentTypes["InitCustomerFeedbackData"]
> = {
  customerFeedback?: Resolver<
    Maybe<ResolversTypes["CustomerFeedback"]>,
    ParentType,
    ContextType
  >;
  feedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType
  >;
  questions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Question"]>>>,
    ParentType,
    ContextType
  >;
};

export type InitFeedbackFormDataResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["InitFeedbackFormData"] = ResolversParentTypes["InitFeedbackFormData"]
> = {
  feedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType
  >;
  questions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Question"]>>>,
    ParentType,
    ContextType
  >;
};

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export type JwtResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["JWT"] = ResolversParentTypes["JWT"]
> = {
  jwt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type LedgerOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LedgerOutput"] = ResolversParentTypes["LedgerOutput"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerLedgerOutput"]>>>,
    ParentType,
    ContextType
  >;
  ledgerCount?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  externalCustomerId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  dateStart?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  dateEnd?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  page?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  itemsPerPage?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  orderBy?: Resolver<
    Maybe<ResolversTypes["SORTING_DIRECTIONS"]>,
    ParentType,
    ContextType
  >;
  loyaltyCardCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyCardResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyCard"] = ResolversParentTypes["LoyaltyCard"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  currency?: Resolver<ResolversTypes["Currency"], ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyCardPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyCardPage"] = ResolversParentTypes["LoyaltyCardPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["LoyaltyCard"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyLedgerResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyLedger"] = ResolversParentTypes["LoyaltyLedger"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  points?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  remarks?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  balanceSnapshot?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  totalAmount?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  externalStoreId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  expiryDate?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  pointsRemaining?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  details?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
};

export type LoyaltyLedgerOutputTypeResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyLedgerOutputType"] = ResolversParentTypes["LoyaltyLedgerOutputType"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  points?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  balanceSnapshot?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsRemaining?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  expiryDate?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  details?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  remarks?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type LoyaltyProgramResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyProgram"] = ResolversParentTypes["LoyaltyProgram"]
> = {
  loyaltyBurnRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType
  >;
  loyaltyEarnRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType
  >;
  loyaltyExpiryRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType
  >;
  expiryUnit?: Resolver<
    Maybe<ResolversTypes["ExpiryUnit"]>,
    ParentType,
    ContextType
  >;
  expiryValue?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  loyaltyCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  loyaltyCardCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organizationId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  loyaltyCard?: Resolver<
    Maybe<ResolversTypes["LoyaltyCard"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyProgramPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyProgramPage"] = ResolversParentTypes["LoyaltyProgramPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["LoyaltyProgram"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyStatusResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyStatus"] = ResolversParentTypes["LoyaltyStatus"]
> = {
  statusId?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  statusCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  statusType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyStatusOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyStatusOutput"] = ResolversParentTypes["LoyaltyStatusOutput"]
> = {
  statusId?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  statusCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  statusType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyTransactionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyTransaction"] = ResolversParentTypes["LoyaltyTransaction"]
> = {
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  statusCode?: Resolver<
    Maybe<ResolversTypes["LoyaltyStatus"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pointsBlocked?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsIssued?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  pointsRedeemed?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  loyaltyReferenceId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  loyaltyLedgers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["LoyaltyLedger"]>>>,
    ParentType,
    ContextType
  >;
  customerLoyalty?: Resolver<
    Maybe<ResolversTypes["CustomerLoyaltyOutput"]>,
    ParentType,
    ContextType
  >;
  loyaltyProgram?: Resolver<
    Maybe<ResolversTypes["LoyaltyProgram"]>,
    ParentType,
    ContextType
  >;
};

export type LoyaltyTransactionPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["LoyaltyTransactionPage"] = ResolversParentTypes["LoyaltyTransactionPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerLoyaltyTransactionData"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type MemberResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Member"] = ResolversParentTypes["Member"]
> = {
  applicationId?: Resolver<
    Maybe<ResolversTypes["ID"]>,
    ParentType,
    ContextType
  >;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  Role?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type MessageTemplateResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["MessageTemplate"] = ResolversParentTypes["MessageTemplate"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  messageFormat?: Resolver<
    Maybe<ResolversTypes["MESSAGE_FORMAT"]>,
    ParentType,
    ContextType
  >;
  templateBodyText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  templateSubjectText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  templateStyle?: Resolver<
    Maybe<ResolversTypes["TEMPLATE_STYLE"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  messageTemplateVariables?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["MessageTemplateVariable"]>>>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type MessageTemplateVariableResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["MessageTemplateVariable"] = ResolversParentTypes["MessageTemplateVariable"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes["VARIABLE_TYPE"], ParentType, ContextType>;
  format?: Resolver<ResolversTypes["VARIABLE_FORMAT"], ParentType, ContextType>;
  defaultValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  required?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type MetricResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Metric"] = ResolversParentTypes["Metric"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  query?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<
    Maybe<ResolversTypes["METRIC_TYPE"]>,
    ParentType,
    ContextType
  >;
  filters?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["MetricFilter"]>>>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  source?: Resolver<
    Maybe<ResolversTypes["DB_SOURCE"]>,
    ParentType,
    ContextType
  >;
};

export type MetricExecutionResultResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["MetricExecutionResult"] = ResolversParentTypes["MetricExecutionResult"]
> = {
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<
    Maybe<ResolversTypes["METRIC_TYPE"]>,
    ParentType,
    ContextType
  >;
  rows?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  cols?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  headers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  data?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type MetricExecutionResultPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["MetricExecutionResultPage"] = ResolversParentTypes["MetricExecutionResultPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["MetricExecutionResult"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type MetricFilterResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["MetricFilter"] = ResolversParentTypes["MetricFilter"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<
    Maybe<ResolversTypes["METRIC_FILTER_TYPE"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type MetricFilterPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["MetricFilterPage"] = ResolversParentTypes["MetricFilterPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["MetricFilter"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type MetricPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["MetricPage"] = ResolversParentTypes["MetricPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["Metric"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type MutationResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  createMetric?: Resolver<
    Maybe<ResolversTypes["Metric"]>,
    ParentType,
    ContextType,
    MutationCreateMetricArgs
  >;
  updateMetric?: Resolver<
    Maybe<ResolversTypes["Metric"]>,
    ParentType,
    ContextType,
    MutationUpdateMetricArgs
  >;
  createMetricFilter?: Resolver<
    Maybe<ResolversTypes["MetricFilter"]>,
    ParentType,
    ContextType,
    MutationCreateMetricFilterArgs
  >;
  updateMetricFilter?: Resolver<
    Maybe<ResolversTypes["MetricFilter"]>,
    ParentType,
    ContextType,
    MutationUpdateMetricFilterArgs
  >;
  createWebhookEventType?: Resolver<
    Maybe<ResolversTypes["WebhookEvent"]>,
    ParentType,
    ContextType,
    MutationCreateWebhookEventTypeArgs
  >;
  updateWebhookEventType?: Resolver<
    Maybe<ResolversTypes["WebhookEvent"]>,
    ParentType,
    ContextType,
    MutationUpdateWebhookEventTypeArgs
  >;
  createWebhook?: Resolver<
    Maybe<ResolversTypes["Webhook"]>,
    ParentType,
    ContextType,
    MutationCreateWebhookArgs
  >;
  updateWebhook?: Resolver<
    Maybe<ResolversTypes["Webhook"]>,
    ParentType,
    ContextType,
    MutationUpdateWebhookArgs
  >;
  createWebhookEventData?: Resolver<
    Maybe<ResolversTypes["WebhookEventData"]>,
    ParentType,
    ContextType,
    MutationCreateWebhookEventDataArgs
  >;
  updateWebhookEventData?: Resolver<
    Maybe<ResolversTypes["WebhookEventData"]>,
    ParentType,
    ContextType,
    MutationUpdateWebhookEventDataArgs
  >;
  createUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, "input">
  >;
  updateUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    MutationUpdateUserArgs
  >;
  deleteUserById?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    MutationDeleteUserByIdArgs
  >;
  linkApplicationToUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    MutationLinkApplicationToUserArgs
  >;
  addUserToOrganization?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationAddUserToOrganizationArgs,
      "userData" | "organization_id"
    >
  >;
  updatePassword?: Resolver<
    Maybe<ResolversTypes["UpdatePasswordResponse"]>,
    ParentType,
    ContextType,
    MutationUpdatePasswordArgs
  >;
  confirmEmail?: Resolver<
    Maybe<ResolversTypes["ConfirmEmailResponse"]>,
    ParentType,
    ContextType,
    MutationConfirmEmailArgs
  >;
  sendPasswordResetLink?: Resolver<
    Maybe<ResolversTypes["ResetPasswordResponse"]>,
    ParentType,
    ContextType,
    MutationSendPasswordResetLinkArgs
  >;
  createOrganization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateOrganizationArgs, "organizationInput">
  >;
  deleteOrganization?: Resolver<
    ResolversTypes["DeleteOrganization"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteOrganizationArgs, "id">
  >;
  updateOrganization?: Resolver<
    ResolversTypes["Organization"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOrganizationArgs, "organization">
  >;
  deleteOrganizationHierarchy?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["DeleteOrganization"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteOrganizationHierarchyArgs, "id">
  >;
  linkUserToOrganization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLinkUserToOrganizationArgs,
      "organizationId" | "userId"
    >
  >;
  linkOrganizationToparent?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLinkOrganizationToparentArgs,
      "organizationId" | "parentId"
    >
  >;
  linkOrganizationToWalkinProducts?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLinkOrganizationToWalkinProductsArgs,
      "organizationId"
    >
  >;
  linkOrganizationToMetrics?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Metric"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationLinkOrganizationToMetricsArgs, "organizationId">
  >;
  generateAPIKey?: Resolver<
    Maybe<ResolversTypes["APIKey"]>,
    ParentType,
    ContextType,
    RequireFields<MutationGenerateApiKeyArgs, "id">
  >;
  deleteApplication?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteApplicationArgs, "id">
  >;
  updateApplication?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateApplicationArgs, "input">
  >;
  updateAPIKey?: Resolver<
    Maybe<ResolversTypes["APIKey"]>,
    ParentType,
    ContextType,
    MutationUpdateApiKeyArgs
  >;
  createApplication?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateApplicationArgs, "organizationId" | "input">
  >;
  login?: Resolver<
    ResolversTypes["JWT"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "input">
  >;
  logout?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    MutationLogoutArgs
  >;
  refreshToken?: Resolver<
    ResolversTypes["JWT"],
    ParentType,
    ContextType,
    RequireFields<MutationRefreshTokenArgs, "jwt">
  >;
  addRole?: Resolver<
    Maybe<ResolversTypes["Role"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddRoleArgs, "input">
  >;
  editRole?: Resolver<
    Maybe<ResolversTypes["Role"]>,
    ParentType,
    ContextType,
    RequireFields<MutationEditRoleArgs, "input">
  >;
  deleteRole?: Resolver<
    Maybe<ResolversTypes["Role"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRoleArgs, "id">
  >;
  addPolicyToRole?: Resolver<
    Maybe<ResolversTypes["Policy"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddPolicyToRoleArgs, "roleId" | "input">
  >;
  addPoliciesToRole?: Resolver<
    Maybe<ResolversTypes["Role"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddPoliciesToRoleArgs, "roleId" | "inputs">
  >;
  removePolicyFromRole?: Resolver<
    Maybe<ResolversTypes["Role"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemovePolicyFromRoleArgs, "roleId" | "policyId">
  >;
  removePoliciesFromRole?: Resolver<
    Maybe<ResolversTypes["Role"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemovePoliciesFromRoleArgs, "roleId" | "policyIds">
  >;
  editPolicy?: Resolver<
    Maybe<ResolversTypes["Policy"]>,
    ParentType,
    ContextType,
    RequireFields<MutationEditPolicyArgs, "input">
  >;
  linkUserToRole?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLinkUserToRoleArgs, "roleId" | "userId">
  >;
  linkUsersToRole?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationLinkUsersToRoleArgs, "roleId" | "userIds">
  >;
  linkRolesToUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLinkRolesToUserArgs, "roleIds" | "userId">
  >;
  unlinkUserToRole?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUnlinkUserToRoleArgs, "roleId" | "userId">
  >;
  unlinkUsersFromRole?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationUnlinkUsersFromRoleArgs, "roleId" | "userIds">
  >;
  unlinkRolesFromUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUnlinkRolesFromUserArgs, "roleIds" | "userId">
  >;
  createStoreAdminLevel?: Resolver<
    Maybe<ResolversTypes["StoreAdminLevel"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateStoreAdminLevelArgs, "input">
  >;
  updateStoreAdminLevel?: Resolver<
    Maybe<ResolversTypes["StoreAdminLevel"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateStoreAdminLevelArgs, "input">
  >;
  updateStore?: Resolver<
    Maybe<ResolversTypes["Store"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateStoreArgs, "input">
  >;
  createStore?: Resolver<
    Maybe<ResolversTypes["Store"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateStoreArgs, "input">
  >;
  updateStoreByCode?: Resolver<
    Maybe<ResolversTypes["Store"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateStoreByCodeArgs, "input">
  >;
  pushEvents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Event"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationPushEventsArgs, "events">
  >;
  processEventById?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    RequireFields<MutationProcessEventByIdArgs, "id">
  >;
  createEventSubscription?: Resolver<
    Maybe<ResolversTypes["EventSubscription"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationCreateEventSubscriptionArgs,
      "eventTypeId" | "triggerAction"
    >
  >;
  deleteEventSubscription?: Resolver<
    Maybe<ResolversTypes["TypeDeleteEventSubscription"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteEventSubscriptionArgs, "id">
  >;
  createEventType?: Resolver<
    Maybe<ResolversTypes["EventType"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateEventTypeArgs, "code" | "applicationId">
  >;
  updateEventType?: Resolver<
    Maybe<ResolversTypes["EventType"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateEventTypeArgs, "id">
  >;
  deleteEventType?: Resolver<
    Maybe<ResolversTypes["TypeDeleteEvent"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteEventTypeArgs, "id">
  >;
  createRuleEntity?: Resolver<
    Maybe<ResolversTypes["RuleEntity"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateRuleEntityArgs, "input">
  >;
  disableRuleEntity?: Resolver<
    Maybe<ResolversTypes["RuleEntity"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableRuleEntityArgs, "id">
  >;
  createRuleAttribute?: Resolver<
    Maybe<ResolversTypes["RuleAttribute"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateRuleAttributeArgs, "input">
  >;
  disableRuleAttribute?: Resolver<
    Maybe<ResolversTypes["RuleAttribute"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableRuleAttributeArgs, "id">
  >;
  createRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateRuleArgs, "input">
  >;
  updateRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateRuleArgs, "id" | "input">
  >;
  disableRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableRuleArgs, "id">
  >;
  createBusinessRule?: Resolver<
    Maybe<ResolversTypes["BusinessRule"]>,
    ParentType,
    ContextType,
    MutationCreateBusinessRuleArgs
  >;
  updateBusinessRule?: Resolver<
    Maybe<ResolversTypes["BusinessRule"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateBusinessRuleArgs, "id">
  >;
  deleteBusinessRule?: Resolver<
    Maybe<ResolversTypes["BusinessRule"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteBusinessRuleArgs, "id">
  >;
  createBusinessRuleDetail?: Resolver<
    Maybe<ResolversTypes["BusinessRuleDetail"]>,
    ParentType,
    ContextType,
    MutationCreateBusinessRuleDetailArgs
  >;
  updateBusinessRuleDetail?: Resolver<
    Maybe<ResolversTypes["BusinessRuleDetail"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateBusinessRuleDetailArgs, "id">
  >;
  deleteBusinessRuleDetail?: Resolver<
    Maybe<ResolversTypes["BusinessRuleDetail"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteBusinessRuleDetailArgs, "id">
  >;
  updateBusinessRuleByRuleType?: Resolver<
    Maybe<ResolversTypes["BusinessRule"]>,
    ParentType,
    ContextType,
    MutationUpdateBusinessRuleByRuleTypeArgs
  >;
  createWorkflow?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType,
    MutationCreateWorkflowArgs
  >;
  createWorkflowWithChildren?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType,
    MutationCreateWorkflowWithChildrenArgs
  >;
  updateWorkflow?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType,
    MutationUpdateWorkflowArgs
  >;
  createWorkflowProcess?: Resolver<
    Maybe<ResolversTypes["WorkflowProcess"]>,
    ParentType,
    ContextType,
    MutationCreateWorkflowProcessArgs
  >;
  updateWorkflowProcess?: Resolver<
    Maybe<ResolversTypes["WorkflowProcess"]>,
    ParentType,
    ContextType,
    MutationUpdateWorkflowProcessArgs
  >;
  createWorkflowProcessTransition?: Resolver<
    Maybe<ResolversTypes["WorkflowProcessTransition"]>,
    ParentType,
    ContextType,
    MutationCreateWorkflowProcessTransitionArgs
  >;
  updateWorkflowProcessTransition?: Resolver<
    Maybe<ResolversTypes["WorkflowProcessTransition"]>,
    ParentType,
    ContextType,
    MutationUpdateWorkflowProcessTransitionArgs
  >;
  createWorkflowState?: Resolver<
    Maybe<ResolversTypes["WorkflowState"]>,
    ParentType,
    ContextType,
    MutationCreateWorkflowStateArgs
  >;
  updateWorkflowState?: Resolver<
    Maybe<ResolversTypes["WorkflowState"]>,
    ParentType,
    ContextType,
    MutationUpdateWorkflowStateArgs
  >;
  createWorkflowEntity?: Resolver<
    Maybe<ResolversTypes["WorkflowEntity"]>,
    ParentType,
    ContextType,
    MutationCreateWorkflowEntityArgs
  >;
  updateWorkflowEntity?: Resolver<
    Maybe<ResolversTypes["WorkflowEntity"]>,
    ParentType,
    ContextType,
    MutationUpdateWorkflowEntityArgs
  >;
  addWorkflowEnityTransitionStatus?: Resolver<
    Maybe<ResolversTypes["WorkflowEntityTransition"]>,
    ParentType,
    ContextType,
    MutationAddWorkflowEnityTransitionStatusArgs
  >;
  createWorkflowRoute?: Resolver<
    Maybe<ResolversTypes["WorkflowRoute"]>,
    ParentType,
    ContextType,
    MutationCreateWorkflowRouteArgs
  >;
  updateWorkflowRoute?: Resolver<
    Maybe<ResolversTypes["WorkflowRoute"]>,
    ParentType,
    ContextType,
    MutationUpdateWorkflowRouteArgs
  >;
  createCustomer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCustomerArgs, "customer">
  >;
  createBulkCustomer?: Resolver<
    Maybe<ResolversTypes["CreateBulkCustomerResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateBulkCustomerArgs, "customers">
  >;
  updateCustomer?: Resolver<
    Maybe<ResolversTypes["UpdateCustomer"]>,
    ParentType,
    ContextType,
    MutationUpdateCustomerArgs
  >;
  createCustomerDevice?: Resolver<
    Maybe<ResolversTypes["CustomerDevice"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCustomerDeviceArgs, "customerDevice">
  >;
  updateCustomerDevice?: Resolver<
    Maybe<ResolversTypes["CustomerDevice"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCustomerDeviceArgs, "customerDevice">
  >;
  disableCustomer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableCustomerArgs, "customer">
  >;
  disableCustomerDevice?: Resolver<
    Maybe<ResolversTypes["CustomerDevice"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableCustomerDeviceArgs, "customerDevice">
  >;
  uploadFileForCreateBulkCustomer?: Resolver<
    Maybe<ResolversTypes["UploadFileForCreateBulkCustomerResponse"]>,
    ParentType,
    ContextType,
    MutationUploadFileForCreateBulkCustomerArgs
  >;
  addEntityExtend?: Resolver<
    Maybe<ResolversTypes["EntityExtend"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddEntityExtendArgs, "input">
  >;
  addEntityExtendField?: Resolver<
    Maybe<ResolversTypes["EntityExtendField"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddEntityExtendFieldArgs, "input">
  >;
  createActionDefinition?: Resolver<
    Maybe<ResolversTypes["ActionDefinition"]>,
    ParentType,
    ContextType,
    MutationCreateActionDefinitionArgs
  >;
  updateActionDefinition?: Resolver<
    Maybe<ResolversTypes["ActionDefinition"]>,
    ParentType,
    ContextType,
    MutationUpdateActionDefinitionArgs
  >;
  disableActionDefinition?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableActionDefinitionArgs, "id">
  >;
  executeAction?: Resolver<
    Maybe<ResolversTypes["Action"]>,
    ParentType,
    ContextType,
    RequireFields<MutationExecuteActionArgs, "actionDefinitionName">
  >;
  startSession?: Resolver<
    Maybe<ResolversTypes["Session"]>,
    ParentType,
    ContextType,
    MutationStartSessionArgs
  >;
  endSession?: Resolver<
    Maybe<ResolversTypes["Session"]>,
    ParentType,
    ContextType,
    MutationEndSessionArgs
  >;
  createSegmentForCustomers?: Resolver<
    Maybe<ResolversTypes["Segment"]>,
    ParentType,
    ContextType,
    MutationCreateSegmentForCustomersArgs
  >;
  createSegment?: Resolver<
    Maybe<ResolversTypes["Segment"]>,
    ParentType,
    ContextType,
    MutationCreateSegmentArgs
  >;
  updateSegment?: Resolver<
    Maybe<ResolversTypes["Segment"]>,
    ParentType,
    ContextType,
    MutationUpdateSegmentArgs
  >;
  disableSegment?: Resolver<
    Maybe<ResolversTypes["Segment"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableSegmentArgs, "id">
  >;
  createCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    MutationCreateCampaignArgs
  >;
  updateCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCampaignArgs, "id">
  >;
  launchCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLaunchCampaignArgs, "id">
  >;
  preprocessLaunchCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationPreprocessLaunchCampaignArgs, "id">
  >;
  pauseCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationPauseCampaignArgs, "id">
  >;
  unpauseCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUnpauseCampaignArgs, "id">
  >;
  completeCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCompleteCampaignArgs, "id">
  >;
  abandonCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAbandonCampaignArgs, "id">
  >;
  disableCampaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableCampaignArgs, "id">
  >;
  linkCampaignToApplication?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLinkCampaignToApplicationArgs,
      "campaignId" | "applicationId"
    >
  >;
  unlinkCampaignFromApplication?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationUnlinkCampaignFromApplicationArgs,
      "campaignId" | "applicationId"
    >
  >;
  jobManageEndedCampaigns?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  createAudience?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Audience"]>>>,
    ParentType,
    ContextType,
    MutationCreateAudienceArgs
  >;
  updateAudience?: Resolver<
    Maybe<ResolversTypes["Audience"]>,
    ParentType,
    ContextType,
    MutationUpdateAudienceArgs
  >;
  createAudienceForCampaign?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Audience"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateAudienceForCampaignArgs, "segments">
  >;
  createCampaignControl?: Resolver<
    Maybe<ResolversTypes["CampaignControl"]>,
    ParentType,
    ContextType,
    MutationCreateCampaignControlArgs
  >;
  updateCampaignControl?: Resolver<
    Maybe<ResolversTypes["CampaignControl"]>,
    ParentType,
    ContextType,
    MutationUpdateCampaignControlArgs
  >;
  createGlobalControl?: Resolver<
    Maybe<ResolversTypes["GlobalControl"]>,
    ParentType,
    ContextType,
    MutationCreateGlobalControlArgs
  >;
  deactivateGlobalControl?: Resolver<
    Maybe<ResolversTypes["GlobalControl"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeactivateGlobalControlArgs, "id">
  >;
  createAudienceMember?: Resolver<
    Maybe<ResolversTypes["AudienceMember"]>,
    ParentType,
    ContextType,
    MutationCreateAudienceMemberArgs
  >;
  updateAudienceMember?: Resolver<
    Maybe<ResolversTypes["AudienceMember"]>,
    ParentType,
    ContextType,
    MutationUpdateAudienceMemberArgs
  >;
  createFileSystem?: Resolver<
    Maybe<ResolversTypes["FileSystem"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateFileSystemArgs, "input">
  >;
  updateFileSystem?: Resolver<
    Maybe<ResolversTypes["FileSystem"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateFileSystemArgs, "input">
  >;
  deleteFileSystem?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteFileSystemArgs, "id">
  >;
  generateSignedUploadURL?: Resolver<
    Maybe<ResolversTypes["SignedURL"]>,
    ParentType,
    ContextType,
    RequireFields<MutationGenerateSignedUploadUrlArgs, "input">
  >;
  uploadFile?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUploadFileArgs, "input">
  >;
  updateFile?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateFileArgs, "file" | "input">
  >;
  deleteFile?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteFileArgs, "id">
  >;
  createMessageTemplate?: Resolver<
    Maybe<ResolversTypes["MessageTemplate"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateMessageTemplateArgs, "input">
  >;
  updateMessageTemplate?: Resolver<
    Maybe<ResolversTypes["MessageTemplate"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMessageTemplateArgs, "input">
  >;
  createMessageTemplateVariable?: Resolver<
    Maybe<ResolversTypes["MessageTemplateVariable"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateMessageTemplateVariableArgs, "input">
  >;
  updateMessageTemplateVariable?: Resolver<
    Maybe<ResolversTypes["MessageTemplateVariable"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMessageTemplateVariableArgs, "input">
  >;
  addVariableToMessageTemplate?: Resolver<
    Maybe<ResolversTypes["MessageTemplate"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddVariableToMessageTemplateArgs, "input">
  >;
  removeVariableFromMessageTemplate?: Resolver<
    Maybe<ResolversTypes["MessageTemplate"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveVariableFromMessageTemplateArgs, "input">
  >;
  formatMessage?: Resolver<
    Maybe<ResolversTypes["FormatMessage"]>,
    ParentType,
    ContextType,
    RequireFields<MutationFormatMessageArgs, "input">
  >;
  sendMessage?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationSendMessageArgs, "input">
  >;
  createCommunicationWithMessageTempate?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationCreateCommunicationWithMessageTempateArgs,
      "communicationInput"
    >
  >;
  updateCommunicationWithMessageTempate?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateCommunicationWithMessageTempateArgs,
      "communicationInput"
    >
  >;
  createCommunication?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCommunicationArgs, "input">
  >;
  updateCommunication?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCommunicationArgs, "input">
  >;
  disableCommunication?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableCommunicationArgs, "id" | "organization">
  >;
  addCommunicationLog?: Resolver<
    Maybe<ResolversTypes["CommunicationLog"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddCommunicationLogArgs, "input">
  >;
  updateCommunicationLog?: Resolver<
    Maybe<ResolversTypes["CommunicationLog"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCommunicationLogArgs, "input">
  >;
  createCatalog?: Resolver<
    ResolversTypes["Catalog"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCatalogArgs, "input">
  >;
  updateCatalog?: Resolver<
    ResolversTypes["Catalog"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCatalogArgs, "input">
  >;
  createCategory?: Resolver<
    ResolversTypes["Category"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCategoryArgs, "input">
  >;
  updateCategory?: Resolver<
    ResolversTypes["Category"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCategoryArgs, "input">
  >;
  disableCategory?: Resolver<
    ResolversTypes["Category"],
    ParentType,
    ContextType,
    RequireFields<MutationDisableCategoryArgs, "id">
  >;
  createOption?: Resolver<
    Maybe<ResolversTypes["Option"]>,
    ParentType,
    ContextType,
    MutationCreateOptionArgs
  >;
  updateOption?: Resolver<
    Maybe<ResolversTypes["Option"]>,
    ParentType,
    ContextType,
    MutationUpdateOptionArgs
  >;
  createOptionValue?: Resolver<
    Maybe<ResolversTypes["OptionValue"]>,
    ParentType,
    ContextType,
    MutationCreateOptionValueArgs
  >;
  updateOptionValue?: Resolver<
    Maybe<ResolversTypes["OptionValue"]>,
    ParentType,
    ContextType,
    MutationUpdateOptionValueArgs
  >;
  createProduct?: Resolver<
    Maybe<ResolversTypes["Product"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateProductArgs, "input">
  >;
  updateProduct?: Resolver<
    Maybe<ResolversTypes["Product"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProductArgs, "input">
  >;
  disableProduct?: Resolver<
    Maybe<ResolversTypes["Product"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDisableProductArgs, "productName">
  >;
  createProductOption?: Resolver<
    Maybe<ResolversTypes["ProductOption"]>,
    ParentType,
    ContextType,
    MutationCreateProductOptionArgs
  >;
  updateProductOption?: Resolver<
    Maybe<ResolversTypes["ProductOption"]>,
    ParentType,
    ContextType,
    MutationUpdateProductOptionArgs
  >;
  createProductVariant?: Resolver<
    Maybe<ResolversTypes["ProductVariant"]>,
    ParentType,
    ContextType,
    MutationCreateProductVariantArgs
  >;
  updateProductVariant?: Resolver<
    Maybe<ResolversTypes["ProductVariant"]>,
    ParentType,
    ContextType,
    MutationUpdateProductVariantArgs
  >;
  createProductVariantValue?: Resolver<
    Maybe<ResolversTypes["ProductVariantValue"]>,
    ParentType,
    ContextType,
    MutationCreateProductVariantValueArgs
  >;
  updateProductVariantValue?: Resolver<
    Maybe<ResolversTypes["ProductVariantValue"]>,
    ParentType,
    ContextType,
    MutationUpdateProductVariantValueArgs
  >;
  createProductCategory?: Resolver<
    Maybe<ResolversTypes["ProductCategory"]>,
    ParentType,
    ContextType,
    MutationCreateProductCategoryArgs
  >;
  updateProductCategory?: Resolver<
    Maybe<ResolversTypes["ProductCategory"]>,
    ParentType,
    ContextType,
    MutationUpdateProductCategoryArgs
  >;
  createChargeType?: Resolver<
    Maybe<ResolversTypes["Charge"]>,
    ParentType,
    ContextType,
    MutationCreateChargeTypeArgs
  >;
  updateChargeType?: Resolver<
    Maybe<ResolversTypes["Charge"]>,
    ParentType,
    ContextType,
    MutationUpdateChargeTypeArgs
  >;
  deleteChargeType?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteChargeTypeArgs, "id">
  >;
  createChannel?: Resolver<
    Maybe<ResolversTypes["Channel"]>,
    ParentType,
    ContextType,
    MutationCreateChannelArgs
  >;
  updateChannel?: Resolver<
    Maybe<ResolversTypes["Channel"]>,
    ParentType,
    ContextType,
    MutationUpdateChannelArgs
  >;
  deleteChannel?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteChannelArgs, "id">
  >;
  createTaxType?: Resolver<
    Maybe<ResolversTypes["TaxType"]>,
    ParentType,
    ContextType,
    MutationCreateTaxTypeArgs
  >;
  updateTaxType?: Resolver<
    Maybe<ResolversTypes["TaxType"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTaxTypeArgs, "id">
  >;
  createStoreFormat?: Resolver<
    Maybe<ResolversTypes["StoreFormat"]>,
    ParentType,
    ContextType,
    MutationCreateStoreFormatArgs
  >;
  updateStoreFormat?: Resolver<
    Maybe<ResolversTypes["StoreFormat"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateStoreFormatArgs, "id">
  >;
  addReportConfig?: Resolver<
    Maybe<ResolversTypes["ReportConfig"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationAddReportConfigArgs,
      "name" | "description" | "organizationId"
    >
  >;
  deactivateReportConfig?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeactivateReportConfigArgs, "id" | "organizationId">
  >;
  addReport?: Resolver<
    Maybe<ResolversTypes["Report"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationAddReportArgs,
      "reportConfigId" | "reportFileId" | "reportDate" | "organizationId"
    >
  >;
  deleteReport?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteReportArgs, "id" | "organizationId">
  >;
  addOfferToCampaign?: Resolver<
    Maybe<ResolversTypes["CampaignOfferOutput"]>,
    ParentType,
    ContextType,
    MutationAddOfferToCampaignArgs
  >;
  removeOfferFromCampaign?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CampaignOfferOutput"]>>>,
    ParentType,
    ContextType,
    MutationRemoveOfferFromCampaignArgs
  >;
  createCustomerOffer?: Resolver<
    Maybe<ResolversTypes["CustomerOffersOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCustomerOfferArgs, "input">
  >;
  updateCustomerOffer?: Resolver<
    Maybe<ResolversTypes["CustomerOffersOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCustomerOfferArgs, "input">
  >;
  deactivateCustomerOffer?: Resolver<
    Maybe<ResolversTypes["CustomerOffersOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeactivateCustomerOfferArgs, "id">
  >;
  createOffer?: Resolver<
    Maybe<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    MutationCreateOfferArgs
  >;
  updateOffer?: Resolver<
    Maybe<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    MutationUpdateOfferArgs
  >;
  launchOffer?: Resolver<
    Maybe<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLaunchOfferArgs, "id">
  >;
  closeOffer?: Resolver<
    Maybe<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCloseOfferArgs, "id">
  >;
  redeemOffer?: Resolver<
    Maybe<ResolversTypes["RedemptionOutput"]>,
    ParentType,
    ContextType,
    MutationRedeemOfferArgs
  >;
  initializeHyperX?: Resolver<
    Maybe<ResolversTypes["HyperXOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationInitializeHyperXArgs, "organizationId">
  >;
  createFeedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateFeedbackFormArgs, "campaignId" | "input">
  >;
  updateFeedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType,
    MutationUpdateFeedbackFormArgs
  >;
  deleteFeedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteFeedbackFormArgs, "id">
  >;
  updateFeedbackUIConfig?: Resolver<
    Maybe<ResolversTypes["FeedbackUIConfig"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationUpdateFeedbackUiConfigArgs,
      "feedbackFormId" | "feedbackUIConfig"
    >
  >;
  linkFeedbackFormToFeedbackTemplate?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLinkFeedbackFormToFeedbackTemplateArgs,
      "feedbackFormId" | "feedbackTemplateId"
    >
  >;
  unlinkFeedbackFormFromFeedbackTemplate?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationUnlinkFeedbackFormFromFeedbackTemplateArgs,
      "feedbackFormId" | "feedbackTemplateId"
    >
  >;
  createFeedbackCategoryRoot?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateFeedbackCategoryRootArgs, "organizationId">
  >;
  addFeedbackCategoryNode?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationAddFeedbackCategoryNodeArgs,
      "parentFeedbackCategoryId"
    >
  >;
  updateFeedbackCategory?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType,
    MutationUpdateFeedbackCategoryArgs
  >;
  linkFeedbackCategorytoQuestion?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationLinkFeedbackCategorytoQuestionArgs,
      "feedbackCategoryId" | "questionId"
    >
  >;
  createCustomerFeedback?: Resolver<
    Maybe<ResolversTypes["CustomerFeedback"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCustomerFeedbackArgs, "feedbackFormId">
  >;
  refineXSendFeedbackByEventId?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRefineXSendFeedbackByEventIdArgs, "eventId">
  >;
  refineXSendFeedbackByInput?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationRefineXSendFeedbackByInputArgs,
      "campaignId" | "customer"
    >
  >;
  createQuestionnaire?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateQuestionnaireArgs, "feedbackFormId">
  >;
  addQuestion?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddQuestionArgs, "choiceId" | "input">
  >;
  addChoice?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Choice"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationAddChoiceArgs, "questionId" | "input">
  >;
  removeQuestion?: Resolver<
    Maybe<ResolversTypes["RemovedQuestion"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveQuestionArgs, "id">
  >;
  removeChoice?: Resolver<
    Maybe<ResolversTypes["DeletedChoice"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveChoiceArgs, "id">
  >;
  editQuestion?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType,
    MutationEditQuestionArgs
  >;
  editChoice?: Resolver<
    Maybe<ResolversTypes["Choice"]>,
    ParentType,
    ContextType,
    MutationEditChoiceArgs
  >;
  linkChoiceToQuestion?: Resolver<
    Maybe<ResolversTypes["Choice"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLinkChoiceToQuestionArgs, "choiceId" | "questionId">
  >;
  submitResponse?: Resolver<
    Maybe<ResolversTypes["ResponseSubmit"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationSubmitResponseArgs,
      "customerFeedbackId" | "choiceIds"
    >
  >;
  updateResponse?: Resolver<
    Maybe<ResolversTypes["ResponseDep"]>,
    ParentType,
    ContextType,
    MutationUpdateResponseArgs
  >;
  initializeRefineX?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationInitializeRefineXArgs, "organizationId">
  >;
  addFeedbackTemplateUrl?: Resolver<
    Maybe<ResolversTypes["FeedbackTemplateUrl"]>,
    ParentType,
    ContextType,
    RequireFields<MutationAddFeedbackTemplateUrlArgs, "title" | "url">
  >;
  updateFeedbackTemplateUrl?: Resolver<
    Maybe<ResolversTypes["FeedbackTemplateUrl"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateFeedbackTemplateUrlArgs, "id">
  >;
  deleteFeedbackTemplateUrl?: Resolver<
    Maybe<ResolversTypes["FeedbackTemplateUrl"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteFeedbackTemplateUrlArgs, "id">
  >;
  createFeedbackTemplate?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType,
    MutationCreateFeedbackTemplateArgs
  >;
  deleteFeedbackTemplate?: Resolver<
    Maybe<ResolversTypes["DeletedFeedbackTemplateUrl"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteFeedbackTemplateArgs, "id">
  >;
  initCustomerFeedback?: Resolver<
    Maybe<ResolversTypes["InitCustomerFeedbackData"]>,
    ParentType,
    ContextType,
    RequireFields<MutationInitCustomerFeedbackArgs, "customerFeedbackId">
  >;
  previousQuestions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Question"]>>>,
    ParentType,
    ContextType,
    RequireFields<
      MutationPreviousQuestionsArgs,
      "customerFeedbackId" | "questionIds"
    >
  >;
  nextQuestions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Question"]>>>,
    ParentType,
    ContextType,
    RequireFields<MutationNextQuestionsArgs, "customerFeedbackId">
  >;
  submitResponses?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<
      MutationSubmitResponsesArgs,
      "customerFeedbackId" | "responses"
    >
  >;
  createLoyaltyCard?: Resolver<
    Maybe<ResolversTypes["LoyaltyCard"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateLoyaltyCardArgs, "input">
  >;
  updateLoyaltyCard?: Resolver<
    Maybe<ResolversTypes["LoyaltyCard"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateLoyaltyCardArgs, "input">
  >;
  createCustomerLoyalty?: Resolver<
    Maybe<ResolversTypes["CustomerLoyaltyOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCustomerLoyaltyArgs, "input">
  >;
  createCurrency?: Resolver<
    Maybe<ResolversTypes["Currency"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateCurrencyArgs, "input">
  >;
  updateCurrency?: Resolver<
    Maybe<ResolversTypes["Currency"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCurrencyArgs, "input">
  >;
  issuePoints?: Resolver<
    Maybe<ResolversTypes["ProcessLoyaltyOutput"]>,
    ParentType,
    ContextType,
    MutationIssuePointsArgs
  >;
  burnPoints?: Resolver<
    Maybe<ResolversTypes["ProcessLoyaltyOutput"]>,
    ParentType,
    ContextType,
    MutationBurnPointsArgs
  >;
  expireCustomerLoyaltyPoints?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  blockPoints?: Resolver<
    Maybe<ResolversTypes["EarnableLoyaltyTransactionOutput"]>,
    ParentType,
    ContextType,
    MutationBlockPointsArgs
  >;
  applyBlock?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    MutationApplyBlockArgs
  >;
  loyaltyTransactionCompleted?: Resolver<
    Maybe<ResolversTypes["TransactionStatusOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLoyaltyTransactionCompletedArgs, "loyaltyReferenceId">
  >;
  cancelLoyaltyTransaction?: Resolver<
    Maybe<ResolversTypes["CancelLoyaltyTransactionOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCancelLoyaltyTransactionArgs, "externalCustomerId">
  >;
  createLoyaltyTransactionStatusCodes?: Resolver<
    Maybe<ResolversTypes["LoyaltyStatusOutput"]>,
    ParentType,
    ContextType,
    MutationCreateLoyaltyTransactionStatusCodesArgs
  >;
  processLoyaltyIssuance?: Resolver<
    Maybe<ResolversTypes["ProcessLoyaltyOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationProcessLoyaltyIssuanceArgs, "data">
  >;
  processLoyaltyRedemption?: Resolver<
    Maybe<ResolversTypes["ProcessLoyaltyOutput"]>,
    ParentType,
    ContextType,
    RequireFields<MutationProcessLoyaltyRedemptionArgs, "data">
  >;
  createOrUpdateLoyaltyTransaction?: Resolver<
    Maybe<ResolversTypes["LoyaltyTransaction"]>,
    ParentType,
    ContextType,
    MutationCreateOrUpdateLoyaltyTransactionArgs
  >;
  processLoyaltyTransaction?: Resolver<
    Maybe<ResolversTypes["TransactionStatus"]>,
    ParentType,
    ContextType,
    MutationProcessLoyaltyTransactionArgs
  >;
  issuePointsWithOrderId?: Resolver<
    Maybe<ResolversTypes["ProcessLoyaltyOutput"]>,
    ParentType,
    ContextType,
    MutationIssuePointsWithOrderIdArgs
  >;
  initiateLoyaltyTransaction?: Resolver<
    Maybe<ResolversTypes["TransactionStatus"]>,
    ParentType,
    ContextType,
    MutationInitiateLoyaltyTransactionArgs
  >;
  createLoyaltyProgram?: Resolver<
    Maybe<ResolversTypes["LoyaltyProgram"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateLoyaltyProgramArgs, "input">
  >;
  updateLoyaltyProgram?: Resolver<
    Maybe<ResolversTypes["LoyaltyProgram"]>,
    ParentType,
    ContextType,
    MutationUpdateLoyaltyProgramArgs
  >;
  createCustomerSession?: Resolver<
    ResolversTypes["CreateCustomerSessionOutput"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateCustomerSessionArgs, "input">
  >;
  updateCustomerProfileInSession?: Resolver<
    ResolversTypes["UpdateCustomerProfileOutputInSession"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCustomerProfileInSessionArgs, "input">
  >;
  initializeNearX?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationInitializeNearXArgs, "organizationId">
  >;
};

export type OfferResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Offer"] = ResolversParentTypes["Offer"]
> = {
  createdBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  lastModifiedBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastModifiedTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  offerType?: Resolver<
    Maybe<ResolversTypes["OFFER_TYPE"]>,
    ParentType,
    ContextType
  >;
  offerCategory?: Resolver<
    Maybe<ResolversTypes["OFFER_CATEGORY"]>,
    ParentType,
    ContextType
  >;
  reward?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  offerEligibilityRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType
  >;
  rewardRedemptionRule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType
  >;
  isCustomCoupon?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  coupon?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  stateCode?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type OfferPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["OfferPage"] = ResolversParentTypes["OfferPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Offer"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type OptionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Option"] = ResolversParentTypes["Option"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  optionValues?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["OptionValue"]>>>,
    ParentType,
    ContextType
  >;
};

export type OptionValueResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["OptionValue"] = ResolversParentTypes["OptionValue"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  option?: Resolver<Maybe<ResolversTypes["Option"]>, ParentType, ContextType>;
};

export type OrganizationResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Organization"] = ResolversParentTypes["Organization"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  webhooks?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Webhook"]>>>,
    ParentType,
    ContextType,
    OrganizationWebhooksArgs
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  addressLine1?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  addressLine2?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pinCode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  externalOrganizationId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["STATUS"], ParentType, ContextType>;
  phoneNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  website?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  organizationType?: Resolver<
    Maybe<ResolversTypes["OrganizationTypeEnum"]>,
    ParentType,
    ContextType
  >;
  applications?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Application"]>>>,
    ParentType,
    ContextType
  >;
  parent?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  children?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Organization"]>>>,
    ParentType,
    ContextType
  >;
  store?: Resolver<Maybe<ResolversTypes["Store"]>, ParentType, ContextType>;
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  walkinProducts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WalkinProduct"]>>>,
    ParentType,
    ContextType
  >;
  rules?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Rule"]>>>,
    ParentType,
    ContextType
  >;
  workflows?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Workflow"]>>>,
    ParentType,
    ContextType
  >;
  actions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Action"]>>>,
    ParentType,
    ContextType
  >;
};

export type PaginationInfoResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["PaginationInfo"] = ResolversParentTypes["PaginationInfo"]
> = {
  totalPages?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  page?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  perPage?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
};

export type PolicyResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Policy"] = ResolversParentTypes["Policy"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  effect?: Resolver<
    Maybe<ResolversTypes["POLICY_EFFECTS"]>,
    ParentType,
    ContextType
  >;
  resource?: Resolver<
    Maybe<ResolversTypes["POLICY_RESOURCES"]>,
    ParentType,
    ContextType
  >;
  permission?: Resolver<
    Maybe<ResolversTypes["POLICY_PERMISSIONS"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<
    Maybe<ResolversTypes["POLICY_TYPES"]>,
    ParentType,
    ContextType
  >;
  accessLevel?: Resolver<
    Maybe<ResolversTypes["POLICY_LEVELS"]>,
    ParentType,
    ContextType
  >;
};

export type ProcessLoyaltyOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ProcessLoyaltyOutput"] = ResolversParentTypes["ProcessLoyaltyOutput"]
> = {
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  externalCustomerId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  loyaltyReferenceId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  earnedPoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  earnedAmount?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  burnedPoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  burnedAmount?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  loyaltyCardCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  earnedPointsExpiryValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  earnedPointsExpiryUnit?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  blockedPoints?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
};

export type ProductResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Product"] = ResolversParentTypes["Product"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  imageUrl?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  type?: Resolver<
    Maybe<ResolversTypes["ProductTypeEnum"]>,
    ParentType,
    ContextType
  >;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  variants?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ProductVariant"]>>>,
    ParentType,
    ContextType
  >;
};

export type ProductCategoryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ProductCategory"] = ResolversParentTypes["ProductCategory"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  category?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType
  >;
  product?: Resolver<Maybe<ResolversTypes["Product"]>, ParentType, ContextType>;
};

export type ProductOptionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ProductOption"] = ResolversParentTypes["ProductOption"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  option?: Resolver<Maybe<ResolversTypes["Option"]>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes["Product"]>, ParentType, ContextType>;
};

export type ProductVariantResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ProductVariant"] = ResolversParentTypes["ProductVariant"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes["Product"]>, ParentType, ContextType>;
  optionValues?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["OptionValue"]>>>,
    ParentType,
    ContextType
  >;
};

export type ProductVariantValueResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ProductVariantValue"] = ResolversParentTypes["ProductVariantValue"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  productVariant?: Resolver<
    Maybe<ResolversTypes["ProductVariant"]>,
    ParentType,
    ContextType
  >;
  optionValue?: Resolver<
    Maybe<ResolversTypes["OptionValue"]>,
    ParentType,
    ContextType
  >;
};

export type QueryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  metric?: Resolver<
    Maybe<ResolversTypes["Metric"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMetricArgs, "id">
  >;
  metrics?: Resolver<
    Maybe<ResolversTypes["MetricPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMetricsArgs, "pageOptions" | "status">
  >;
  metricFilter?: Resolver<
    Maybe<ResolversTypes["MetricFilter"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMetricFilterArgs, "id">
  >;
  metricFilters?: Resolver<
    Maybe<ResolversTypes["MetricFilterPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMetricFiltersArgs, "pageOptions" | "status">
  >;
  executeMetric?: Resolver<
    Maybe<ResolversTypes["MetricExecutionResult"]>,
    ParentType,
    ContextType,
    QueryExecuteMetricArgs
  >;
  executeMetrics?: Resolver<
    Maybe<ResolversTypes["MetricExecutionResultPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryExecuteMetricsArgs, "walkinProducts">
  >;
  webhookEventType?: Resolver<
    Maybe<ResolversTypes["WebhookEvent"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWebhookEventTypeArgs, "organizationId" | "event">
  >;
  webhookEventTypes?: Resolver<
    Maybe<ResolversTypes["WebhookEventPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryWebhookEventTypesArgs,
      "organizationId" | "status" | "pageOptions"
    >
  >;
  webhook?: Resolver<
    Maybe<ResolversTypes["Webhook"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWebhookArgs, "organizationId" | "id">
  >;
  webhooks?: Resolver<
    Maybe<ResolversTypes["WebhookPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryWebhooksArgs,
      "organizationId" | "status" | "pageOptions"
    >
  >;
  webhookEventData?: Resolver<
    Maybe<ResolversTypes["WebhookEventDataPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryWebhookEventDataArgs,
      "organizationId" | "webhookId" | "pageOptions"
    >
  >;
  users?: Resolver<
    Maybe<ResolversTypes["UserPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryUsersArgs, "pageOptions" | "organizationId">
  >;
  user?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, "id" | "organizationId">
  >;
  organizationHierarchies?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["JSON"]>>>,
    ParentType,
    ContextType
  >;
  organizationHierarchy?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOrganizationHierarchyArgs, "rootId">
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOrganizationArgs, "id">
  >;
  organizationRoots?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Organization"]>>>,
    ParentType,
    ContextType
  >;
  subOrganizations?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Organization"]>>>,
    ParentType,
    ContextType,
    RequireFields<QuerySubOrganizationsArgs, "parentId">
  >;
  applications?: Resolver<
    Array<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType,
    RequireFields<QueryApplicationArgs, "id">
  >;
  roles?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Role"]>>>,
    ParentType,
    ContextType
  >;
  role?: Resolver<
    Maybe<ResolversTypes["Role"]>,
    ParentType,
    ContextType,
    RequireFields<QueryRoleArgs, "id">
  >;
  store?: Resolver<
    Maybe<ResolversTypes["Store"]>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreArgs, "id">
  >;
  stores?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Store"]>>>,
    ParentType,
    ContextType
  >;
  storeByCode?: Resolver<
    Maybe<ResolversTypes["Store"]>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreByCodeArgs, "code">
  >;
  storeSearch?: Resolver<
    Maybe<ResolversTypes["StoreSearchOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreSearchArgs, "organizationId" | "pageNumber">
  >;
  storeDefnition?: Resolver<
    Maybe<ResolversTypes["StoreDefnition"]>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreDefnitionArgs, "organizationId">
  >;
  eventById?: Resolver<
    Maybe<ResolversTypes["Event"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEventByIdArgs, "id">
  >;
  eventBySourceEventId?: Resolver<
    Maybe<ResolversTypes["Event"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEventBySourceEventIdArgs, "sourceEventId">
  >;
  eventsByFilters?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Event"]>>>,
    ParentType,
    ContextType,
    QueryEventsByFiltersArgs
  >;
  eventSubscriptionsForEventType?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["EventSubscription"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryEventSubscriptionsForEventTypeArgs, "eventTypeId">
  >;
  eventSubscriptionById?: Resolver<
    Maybe<ResolversTypes["EventSubscription"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEventSubscriptionByIdArgs, "id">
  >;
  eventTypeById?: Resolver<
    Maybe<ResolversTypes["EventType"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEventTypeByIdArgs, "id">
  >;
  eventTypeByCode?: Resolver<
    Maybe<ResolversTypes["EventType"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEventTypeByCodeArgs, "code">
  >;
  eventTypesForApplication?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["EventType"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryEventTypesForApplicationArgs, "appId">
  >;
  ruleEntity?: Resolver<
    Maybe<ResolversTypes["RuleEntity"]>,
    ParentType,
    ContextType,
    RequireFields<QueryRuleEntityArgs, "id">
  >;
  ruleEntities?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["RuleEntity"]>>>,
    ParentType,
    ContextType,
    QueryRuleEntitiesArgs
  >;
  ruleAttribute?: Resolver<
    Maybe<ResolversTypes["RuleAttribute"]>,
    ParentType,
    ContextType,
    RequireFields<QueryRuleAttributeArgs, "id">
  >;
  ruleAttributes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["RuleAttribute"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryRuleAttributesArgs, "input">
  >;
  rule?: Resolver<
    Maybe<ResolversTypes["Rule"]>,
    ParentType,
    ContextType,
    RequireFields<QueryRuleArgs, "id">
  >;
  rules?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Rule"]>>>,
    ParentType,
    ContextType,
    QueryRulesArgs
  >;
  getSQLFromRule?: Resolver<
    Maybe<ResolversTypes["SQL"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetSqlFromRuleArgs, "ruleId">
  >;
  evaluateRule?: Resolver<
    Maybe<ResolversTypes["RuleEvaluatioResult"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEvaluateRuleArgs, "data">
  >;
  businessRules?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["BusinessRule"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryBusinessRulesArgs, "input">
  >;
  businessRule?: Resolver<
    Maybe<ResolversTypes["BusinessRule"]>,
    ParentType,
    ContextType,
    RequireFields<QueryBusinessRuleArgs, "id">
  >;
  businessRuleDetails?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["BusinessRuleDetail"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryBusinessRuleDetailsArgs, "input">
  >;
  businessRuleDetail?: Resolver<
    Maybe<ResolversTypes["BusinessRuleDetail"]>,
    ParentType,
    ContextType,
    RequireFields<QueryBusinessRuleDetailArgs, "id">
  >;
  businessRuleConfiguration?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType,
    RequireFields<QueryBusinessRuleConfigurationArgs, "input">
  >;
  workflow?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowArgs, "id">
  >;
  workflowByName?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowByNameArgs, "name" | "organizationId">
  >;
  workflowDiagram?: Resolver<
    Maybe<ResolversTypes["workflowDiagram"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowDiagramArgs, "id">
  >;
  workflows?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Workflow"]>>>,
    ParentType,
    ContextType
  >;
  orgWorkflows?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Workflow"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryOrgWorkflowsArgs, "orgId">
  >;
  workflowState?: Resolver<
    Maybe<ResolversTypes["WorkflowState"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowStateArgs, "id">
  >;
  workflowStates?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowState"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowStatesArgs, "workflowId">
  >;
  workflowProcess?: Resolver<
    Maybe<ResolversTypes["WorkflowProcess"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowProcessArgs, "id">
  >;
  workflowProcessByName?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowProcessByNameArgs, "name" | "workflowId">
  >;
  workflowProcesses?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowProcess"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowProcessesArgs, "workflowId">
  >;
  workflowProcessTransition?: Resolver<
    Maybe<ResolversTypes["WorkflowProcessTransition"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowProcessTransitionArgs, "id">
  >;
  workflowProcessTransitions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowProcessTransition"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowProcessTransitionsArgs, "workflowProcessId">
  >;
  workflowEntity?: Resolver<
    Maybe<ResolversTypes["WorkflowEntity"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowEntityArgs, "id">
  >;
  workflowEntityByEntityDetails?: Resolver<
    Maybe<ResolversTypes["WorkflowEntity"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryWorkflowEntityByEntityDetailsArgs,
      "entityId" | "entityType"
    >
  >;
  workflowEntityTransition?: Resolver<
    Maybe<ResolversTypes["WorkflowEntityTransition"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowEntityTransitionArgs, "id">
  >;
  workflowEntityTransitionByEntityId?: Resolver<
    Maybe<ResolversTypes["WorkflowEntityTransition"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryWorkflowEntityTransitionByEntityIdArgs,
      "workflowEntityId"
    >
  >;
  workflowEntityTransitionHistory?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowEntityTransitionHistory"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowEntityTransitionHistoryArgs, "workflowEntityId">
  >;
  workflowRoute?: Resolver<
    Maybe<ResolversTypes["WorkflowRoute"]>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowRouteArgs, "id">
  >;
  workflowRoutes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowRoute"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryWorkflowRoutesArgs, "organizationId" | "entityType">
  >;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType,
    QueryCustomerArgs
  >;
  customers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Customer"]>>>,
    ParentType,
    ContextType
  >;
  customerDevice?: Resolver<
    Maybe<ResolversTypes["CustomerDevice"]>,
    ParentType,
    ContextType,
    QueryCustomerDeviceArgs
  >;
  customerDefnition?: Resolver<
    Maybe<ResolversTypes["CustomerDefnition"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCustomerDefnitionArgs, "organization_id">
  >;
  customerDevicesByCustomerId?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerDevice"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCustomerDevicesByCustomerIdArgs, "customerId">
  >;
  customerDevices?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerDevice"]>>>,
    ParentType,
    ContextType
  >;
  customerCount?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  customerSearch?: Resolver<
    Maybe<ResolversTypes["CustomerSearchOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCustomerSearchArgs, "organizationId" | "pageNumber">
  >;
  getSegmentRuleAsText?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    QueryGetSegmentRuleAsTextArgs
  >;
  entities?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["EXTEND_ENTITIES"]>>>,
    ParentType,
    ContextType
  >;
  entityExtend?: Resolver<
    Maybe<ResolversTypes["EntityExtend"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEntityExtendArgs, "id">
  >;
  entityExtendByName?: Resolver<
    Maybe<ResolversTypes["EntityExtend"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEntityExtendByNameArgs, "entityName">
  >;
  entityExtendField?: Resolver<
    Maybe<ResolversTypes["EntityExtendField"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEntityExtendFieldArgs, "id">
  >;
  basicFields?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["BasicField"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryBasicFieldsArgs, "entityName">
  >;
  actionDefinition?: Resolver<
    Maybe<ResolversTypes["ActionDefinition"]>,
    ParentType,
    ContextType,
    RequireFields<QueryActionDefinitionArgs, "id">
  >;
  actionDefinitions?: Resolver<
    Maybe<ResolversTypes["ActionDefinitionPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryActionDefinitionsArgs,
      "status" | "pageOptions" | "sortOptions"
    >
  >;
  action?: Resolver<
    Maybe<ResolversTypes["Action"]>,
    ParentType,
    ContextType,
    RequireFields<QueryActionArgs, "id">
  >;
  actions?: Resolver<
    Maybe<ResolversTypes["ActionPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryActionsArgs, "status" | "pageOptions" | "sortOptions">
  >;
  session?: Resolver<
    Maybe<ResolversTypes["Session"]>,
    ParentType,
    ContextType,
    RequireFields<QuerySessionArgs, "id">
  >;
  activeSession?: Resolver<
    Maybe<ResolversTypes["Session"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryActiveSessionArgs,
      "customer_identifier" | "organization_id"
    >
  >;
  segment?: Resolver<
    Maybe<ResolversTypes["Segment"]>,
    ParentType,
    ContextType,
    RequireFields<QuerySegmentArgs, "id">
  >;
  segments?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Segment"]>>>,
    ParentType,
    ContextType,
    RequireFields<QuerySegmentsArgs, "organization_id" | "status">
  >;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCampaignArgs, "id">
  >;
  campaigns?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Campaign"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCampaignsArgs, "status">
  >;
  audience?: Resolver<
    Maybe<ResolversTypes["Audience"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAudienceArgs, "id">
  >;
  audiences?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Audience"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryAudiencesArgs, "organization_id">
  >;
  campaignControls?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CampaignControl"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCampaignControlsArgs, "organization_id" | "campaign_id">
  >;
  globalControls?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["GlobalControl"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryGlobalControlsArgs, "organization_id">
  >;
  audienceCount?: Resolver<
    Maybe<ResolversTypes["AudienceCountOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAudienceCountArgs, "organizationId">
  >;
  audienceMembers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["AudienceMember"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryAudienceMembersArgs, "audience_id">
  >;
  totalAudienceCountForCampaign?: Resolver<
    Maybe<ResolversTypes["AudienceCountOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryTotalAudienceCountForCampaignArgs, "campaignId">
  >;
  fileSystem?: Resolver<
    Maybe<ResolversTypes["FileSystem"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFileSystemArgs, "id">
  >;
  fileSystems?: Resolver<
    Maybe<ResolversTypes["FileSystemsPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryFileSystemsArgs,
      "organizationId" | "pageOptions" | "sortOptions"
    >
  >;
  file?: Resolver<
    Maybe<ResolversTypes["File"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFileArgs, "id">
  >;
  files?: Resolver<
    Maybe<ResolversTypes["FilesPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryFilesArgs,
      "organizationId" | "pageOptions" | "sortOptions"
    >
  >;
  messageTemplate?: Resolver<
    Maybe<ResolversTypes["MessageTemplate"]>,
    ParentType,
    ContextType,
    RequireFields<QueryMessageTemplateArgs, "id" | "organization_id">
  >;
  messageTemplates?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["MessageTemplate"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryMessageTemplatesArgs, "organization_id">
  >;
  communication?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCommunicationArgs, "id" | "organization_id">
  >;
  communications?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Communication"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCommunicationsArgs, "organization_id">
  >;
  communicationLog?: Resolver<
    Maybe<ResolversTypes["CommunicationLog"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCommunicationLogArgs, "communicationLogId">
  >;
  communicationLogs?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CommunicationLog"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCommunicationLogsArgs, "communicationId">
  >;
  catalog?: Resolver<
    Maybe<ResolversTypes["Catalog"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCatalogArgs, "id">
  >;
  catalogs?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Catalog"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCatalogsArgs, "organizationId">
  >;
  category?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCategoryArgs, "id">
  >;
  categoryByCode?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCategoryByCodeArgs, "catalogId" | "categoryCode">
  >;
  categoriesWithChildren?: Resolver<
    Maybe<ResolversTypes["Category"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCategoriesWithChildrenArgs, "catalogId">
  >;
  categories?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Category"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryCategoriesArgs, "catalogId">
  >;
  optionById?: Resolver<
    Maybe<ResolversTypes["Option"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOptionByIdArgs, "id">
  >;
  options?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Option"]>>>,
    ParentType,
    ContextType
  >;
  optionValuesByOptionId?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["OptionValue"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryOptionValuesByOptionIdArgs, "optionId">
  >;
  products?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Product"]>>>,
    ParentType,
    ContextType,
    QueryProductsArgs
  >;
  productOptionsByProductId?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ProductOption"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryProductOptionsByProductIdArgs, "productId">
  >;
  productVariantsByProductId?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ProductVariant"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryProductVariantsByProductIdArgs, "productId">
  >;
  productVariantValuesByProductVariantId?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ProductVariantValue"]>>>,
    ParentType,
    ContextType,
    RequireFields<
      QueryProductVariantValuesByProductVariantIdArgs,
      "productVariantId"
    >
  >;
  productCategoriesByCategoryId?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ProductCategory"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryProductCategoriesByCategoryIdArgs, "categoryId">
  >;
  productCategoriesByCategoryCode?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ProductCategory"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryProductCategoriesByCategoryCodeArgs, "categoryCode">
  >;
  chargeTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Charge"]>>>,
    ParentType,
    ContextType,
    QueryChargeTypesArgs
  >;
  chargeType?: Resolver<
    Maybe<ResolversTypes["Charge"]>,
    ParentType,
    ContextType,
    QueryChargeTypeArgs
  >;
  channels?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Channel"]>>>,
    ParentType,
    ContextType
  >;
  channel?: Resolver<
    Maybe<ResolversTypes["ChannelPage"]>,
    ParentType,
    ContextType,
    QueryChannelArgs
  >;
  taxType?: Resolver<
    Maybe<ResolversTypes["TaxType"]>,
    ParentType,
    ContextType,
    RequireFields<QueryTaxTypeArgs, "id">
  >;
  taxTypes?: Resolver<
    Maybe<ResolversTypes["TaxTypePage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryTaxTypesArgs, "pageOptions">
  >;
  storeFormat?: Resolver<
    Maybe<ResolversTypes["StoreFormat"]>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreFormatArgs, "id">
  >;
  storeFormats?: Resolver<
    Maybe<ResolversTypes["StoreFormatPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreFormatsArgs, "pageOptions">
  >;
  reportConfig?: Resolver<
    Maybe<ResolversTypes["ReportConfig"]>,
    ParentType,
    ContextType,
    RequireFields<QueryReportConfigArgs, "id" | "organizationId">
  >;
  reportConfigs?: Resolver<
    Maybe<ResolversTypes["ReportConfigPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryReportConfigsArgs, "organizationId" | "pageOptions">
  >;
  report?: Resolver<
    Maybe<ResolversTypes["Report"]>,
    ParentType,
    ContextType,
    RequireFields<QueryReportArgs, "id" | "organizationId">
  >;
  reports?: Resolver<
    Maybe<ResolversTypes["ReportPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryReportsArgs,
      "reportConfigId" | "reportDate" | "organizationId" | "pageOptions"
    >
  >;
  offersForACampaign?: Resolver<
    Maybe<ResolversTypes["CampaignOfferPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryOffersForACampaignArgs,
      "campaignId" | "organizationId" | "pageOptions"
    >
  >;
  campaignsForOffer?: Resolver<
    Maybe<ResolversTypes["CampaignOfferPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryCampaignsForOfferArgs,
      "offerId" | "organizationId" | "pageOptions"
    >
  >;
  customerOffer?: Resolver<
    Maybe<ResolversTypes["CustomerOffersOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCustomerOfferArgs, "id">
  >;
  customerOffers?: Resolver<
    Maybe<ResolversTypes["CustomerOfferPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCustomerOffersArgs, "pageOptions">
  >;
  offer?: Resolver<
    Maybe<ResolversTypes["Offer"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOfferArgs, "id">
  >;
  offers?: Resolver<
    Maybe<ResolversTypes["OfferPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryOffersArgs, "pageOptions">
  >;
  redemption?: Resolver<
    Maybe<ResolversTypes["RedemptionOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryRedemptionArgs, "id">
  >;
  redemptions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["RedemptionOutput"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryRedemptionsArgs, "pageOptions">
  >;
  getHyperX?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["HyperXOutput"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryGetHyperXArgs, "organizationId">
  >;
  viewCampaignsForHyperX?: Resolver<
    Maybe<ResolversTypes["ViewHyperXCampaignsOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryViewCampaignsForHyperXArgs, "page" | "perPage" | "sort">
  >;
  viewCampaignForHyperX?: Resolver<
    Maybe<ResolversTypes["ViewHyperXCampaignOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryViewCampaignForHyperXArgs, "campaignId">
  >;
  getFeedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetFeedbackFormArgs, "feedbackFormId">
  >;
  feedbackForms?: Resolver<
    Maybe<ResolversTypes["FeedbackFormsResponse"]>,
    ParentType,
    ContextType,
    QueryFeedbackFormsArgs
  >;
  feedbackCategory?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedbackCategoryArgs, "id">
  >;
  feedbackCategoryTree?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedbackCategoryTreeArgs, "organizationId">
  >;
  feedbackCategorySubTree?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedbackCategorySubTreeArgs, "id">
  >;
  feedbackCategories?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FeedbackCategory"]>>>,
    ParentType,
    ContextType
  >;
  customerFeedback?: Resolver<
    Maybe<ResolversTypes["CustomerFeedback"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCustomerFeedbackArgs, "id">
  >;
  customerFeedbackForNewCustomer?: Resolver<
    Maybe<ResolversTypes["CustomerFeedback"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryCustomerFeedbackForNewCustomerArgs,
      "customerIdentifier" | "feedbackFormId"
    >
  >;
  customerFeedbackByExternalCustomerId?: Resolver<
    Maybe<ResolversTypes["CustomerFeedbackResponse"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryCustomerFeedbackByExternalCustomerIdArgs,
      "externalCustomerId" | "pageOptions"
    >
  >;
  customerFeedbackByMobileNumber?: Resolver<
    Maybe<ResolversTypes["CustomerFeedbackResponse"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryCustomerFeedbackByMobileNumberArgs,
      "mobileNumber" | "pageOptions"
    >
  >;
  questionHierarchy?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["QuestionTreeData"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryQuestionHierarchyArgs, "questionId">
  >;
  questionnaireRoot?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType,
    RequireFields<QueryQuestionnaireRootArgs, "feedbackFormId">
  >;
  question?: Resolver<
    Maybe<ResolversTypes["Question"]>,
    ParentType,
    ContextType,
    RequireFields<QueryQuestionArgs, "id">
  >;
  choice?: Resolver<
    Maybe<ResolversTypes["Choice"]>,
    ParentType,
    ContextType,
    RequireFields<QueryChoiceArgs, "id">
  >;
  questionTypes?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  response?: Resolver<
    Maybe<ResolversTypes["Response"]>,
    ParentType,
    ContextType,
    RequireFields<QueryResponseArgs, "id">
  >;
  responsesForFeedbackForm?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerFeedback"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryResponsesForFeedbackFormArgs, "feedbackFormId">
  >;
  feedbackTemplateURLs?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FeedbackTemplateUrl"]>>>,
    ParentType,
    ContextType
  >;
  feedbackTemplateURL?: Resolver<
    Maybe<ResolversTypes["FeedbackTemplateUrl"]>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedbackTemplateUrlArgs, "id">
  >;
  feedbackTemplates?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["FeedbackForm"]>>>,
    ParentType,
    ContextType
  >;
  initFeedbackForm?: Resolver<
    Maybe<ResolversTypes["InitFeedbackFormData"]>,
    ParentType,
    ContextType,
    RequireFields<QueryInitFeedbackFormArgs, "feedbackFormId">
  >;
  loyaltyCard?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["LoyaltyCard"]>>>,
    ParentType,
    ContextType
  >;
  loyaltyCardByCode?: Resolver<
    Maybe<ResolversTypes["LoyaltyCard"]>,
    ParentType,
    ContextType,
    RequireFields<QueryLoyaltyCardByCodeArgs, "loyaltyCardCode">
  >;
  loyaltyCards?: Resolver<
    Maybe<ResolversTypes["LoyaltyCardPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryLoyaltyCardsArgs, "pageOptions">
  >;
  getCustomerLoyaltyByExternalCustomerId?: Resolver<
    Maybe<ResolversTypes["CustomerLoyaltyOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetCustomerLoyaltyByExternalCustomerIdArgs, "input">
  >;
  getCustomerLoyalty?: Resolver<
    Maybe<ResolversTypes["CustomerLoyaltyOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetCustomerLoyaltyArgs, "externalCustomerId">
  >;
  currencyByCode?: Resolver<
    Maybe<ResolversTypes["Currency"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCurrencyByCodeArgs, "currencyCode">
  >;
  currencyList?: Resolver<
    Maybe<ResolversTypes["CurrencyPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryCurrencyListArgs, "pageOptions">
  >;
  earnBurnPoints?: Resolver<
    Maybe<ResolversTypes["EarnableBurnableLoyaltyTransactionOutput"]>,
    ParentType,
    ContextType,
    QueryEarnBurnPointsArgs
  >;
  loyaltyTransaction?: Resolver<
    Maybe<ResolversTypes["LoyaltyTransactionPage"]>,
    ParentType,
    ContextType,
    RequireFields<
      QueryLoyaltyTransactionArgs,
      "externalCustomerId" | "pageOptions"
    >
  >;
  getCommunicationQuery?: Resolver<
    Maybe<ResolversTypes["Communication"]>,
    ParentType,
    ContextType,
    QueryGetCommunicationQueryArgs
  >;
  earnableBurnablePoints?: Resolver<
    Maybe<ResolversTypes["EarnableBurnableLoyaltyTransactionOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryEarnableBurnablePointsArgs, "data">
  >;
  loyaltyTransactionStatus?: Resolver<
    Maybe<ResolversTypes["TransactionStatus"]>,
    ParentType,
    ContextType,
    QueryLoyaltyTransactionStatusArgs
  >;
  getLoyaltyProgramsByCode?: Resolver<
    Maybe<ResolversTypes["LoyaltyProgram"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetLoyaltyProgramsByCodeArgs, "input">
  >;
  loyaltyPrograms?: Resolver<
    Maybe<ResolversTypes["LoyaltyProgramPage"]>,
    ParentType,
    ContextType,
    RequireFields<QueryLoyaltyProgramsArgs, "loyaltyCardCode" | "pageOptions">
  >;
  loyaltyLedgerHistory?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["LoyaltyLedgerOutputType"]>>>,
    ParentType,
    ContextType,
    RequireFields<
      QueryLoyaltyLedgerHistoryArgs,
      "externalCustomerId" | "cardCode"
    >
  >;
  getCustomerLedger?: Resolver<
    Maybe<ResolversTypes["LedgerOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetCustomerLedgerArgs, "externalCustomerId">
  >;
};

export type QuestionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Question"] = ResolversParentTypes["Question"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  questionText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  feedbackCategory?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType
  >;
  feedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType
  >;
  choices?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Choice"]>>>,
    ParentType,
    ContextType
  >;
  fromChoice?: Resolver<
    Maybe<ResolversTypes["Choice"]>,
    ParentType,
    ContextType
  >;
  rangeMin?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  rangeMax?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type QuestionTreeDataResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["QuestionTreeData"] = ResolversParentTypes["QuestionTreeData"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  questionText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  feedbackCategory?: Resolver<
    Maybe<ResolversTypes["FeedbackCategory"]>,
    ParentType,
    ContextType
  >;
  feedbackForm?: Resolver<
    Maybe<ResolversTypes["FeedbackForm"]>,
    ParentType,
    ContextType
  >;
  choices?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Choice"]>>>,
    ParentType,
    ContextType
  >;
  fromChoice?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Choice"]>>>,
    ParentType,
    ContextType
  >;
  rangeMin?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  rangeMax?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type RedemptionOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["RedemptionOutput"] = ResolversParentTypes["RedemptionOutput"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  customer?: Resolver<
    Maybe<ResolversTypes["Customer"]>,
    ParentType,
    ContextType
  >;
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  offer?: Resolver<Maybe<ResolversTypes["Offer"]>, ParentType, ContextType>;
  redeemDateTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  transactionDateTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  transactionData?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  organizationId?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type RedemptionPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["RedemptionPage"] = ResolversParentTypes["RedemptionPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["RedemptionOutput"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type RemovedQuestionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["RemovedQuestion"] = ResolversParentTypes["RemovedQuestion"]
> = {
  questionText?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  rangeMin?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  rangeMax?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type RepeatRuleConfigurationOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["RepeatRuleConfigurationOutput"] = ResolversParentTypes["RepeatRuleConfigurationOutput"]
> = {
  frequency?: Resolver<
    Maybe<ResolversTypes["COMMUNICATION_FREQUENCY"]>,
    ParentType,
    ContextType
  >;
  repeatInterval?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  endAfter?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  byWeekDay?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["COMMUNICATION_DAYS"]>>>,
    ParentType,
    ContextType
  >;
  byMonthDate?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  time?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  noOfOccurances?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
};

export type ReportResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Report"] = ResolversParentTypes["Report"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  reportConfig?: Resolver<
    Maybe<ResolversTypes["ReportConfig"]>,
    ParentType,
    ContextType
  >;
  organizationId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  reportDate?: Resolver<Maybe<ResolversTypes["Date"]>, ParentType, ContextType>;
  reportFile?: Resolver<Maybe<ResolversTypes["File"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type ReportConfigResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ReportConfig"] = ResolversParentTypes["ReportConfig"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organizationId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type ReportConfigPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ReportConfigPage"] = ResolversParentTypes["ReportConfigPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["ReportConfig"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type ReportPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ReportPage"] = ResolversParentTypes["ReportPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["Report"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type ResetPasswordResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ResetPasswordResponse"] = ResolversParentTypes["ResetPasswordResponse"]
> = {
  userId?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  sentLink?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
};

export type ResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Response"] = ResolversParentTypes["Response"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  createdTime?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  questionData?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  responseData?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  customerFeedback?: Resolver<
    Maybe<ResolversTypes["CustomerFeedback"]>,
    ParentType,
    ContextType
  >;
  choicesSelected?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Choice"]>>>,
    ParentType,
    ContextType
  >;
};

export type ResponseDepResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ResponseDep"] = ResolversParentTypes["ResponseDep"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  createdTime?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  questionData?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  responseData?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  customerFeedback?: Resolver<
    Maybe<ResolversTypes["CustomerFeedback"]>,
    ParentType,
    ContextType
  >;
  choiceSelected?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Choice"]>>>,
    ParentType,
    ContextType
  >;
};

export type ResponseSubmitResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ResponseSubmit"] = ResolversParentTypes["ResponseSubmit"]
> = {
  savedResponses?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ResponseDep"]>>>,
    ParentType,
    ContextType
  >;
  nextQuestions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Question"]>>>,
    ParentType,
    ContextType
  >;
};

export type RoleResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Role"] = ResolversParentTypes["Role"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  tags?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  policies?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Policy"]>>>,
    ParentType,
    ContextType
  >;
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  createdBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastModifiedBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdTime?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastModifiedTime?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type RuleResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Rule"] = ResolversParentTypes["Rule"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["RULE_TYPE"]>, ParentType, ContextType>;
  ruleConfiguration?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  ruleExpression?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type RuleAttributeResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["RuleAttribute"] = ResolversParentTypes["RuleAttribute"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  attributeName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  attributeValueType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    ResolversTypes["Organization"],
    ParentType,
    ContextType
  >;
  ruleEntity?: Resolver<ResolversTypes["RuleEntity"], ParentType, ContextType>;
};

export type RuleEntityResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["RuleEntity"] = ResolversParentTypes["RuleEntity"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  entityName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  entityCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  ruleAttributes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["RuleAttribute"]>>>,
    ParentType,
    ContextType
  >;
};

export type RuleEvaluatioResultResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["RuleEvaluatioResult"] = ResolversParentTypes["RuleEvaluatioResult"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["RULE_TYPE"]>, ParentType, ContextType>;
  ruleConfiguration?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  ruleExpression?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  evaluationResult?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type S3ResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["S3Response"] = ResolversParentTypes["S3Response"]
> = {
  url?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  expiry?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type SegmentResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Segment"] = ResolversParentTypes["Segment"]
> = {
  createdBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastModifiedBy?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  lastModifiedTime?: Resolver<
    Maybe<ResolversTypes["DateTime"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  segmentType?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  rule?: Resolver<Maybe<ResolversTypes["Rule"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type SessionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Session"] = ResolversParentTypes["Session"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  customer_id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  organization_id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type SignedUrlResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["SignedURL"] = ResolversParentTypes["SignedURL"]
> = {
  s3Response?: Resolver<
    Maybe<ResolversTypes["S3Response"]>,
    ParentType,
    ContextType
  >;
  cloudinaryResponse?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType
  >;
};

export type SqlResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["SQL"] = ResolversParentTypes["SQL"]
> = {
  SQL?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type StoreResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Store"] = ResolversParentTypes["Store"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  STATUS?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  addressLine1?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  addressLine2?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  pinCode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  externalStoreId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  wifi?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  longitude?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  adminLevelId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  storeFormats?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["StoreFormat"]>>>,
    ParentType,
    ContextType
  >;
  catalog?: Resolver<Maybe<ResolversTypes["Catalog"]>, ParentType, ContextType>;
  channels?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Channel"]>>>,
    ParentType,
    ContextType
  >;
};

export type StoreAdminLevelResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["StoreAdminLevel"] = ResolversParentTypes["StoreAdminLevel"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  parent?: Resolver<
    Maybe<ResolversTypes["StoreAdminLevel"]>,
    ParentType,
    ContextType
  >;
  stores?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Store"]>>>,
    ParentType,
    ContextType
  >;
};

export type StoreColumnResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["StoreColumn"] = ResolversParentTypes["StoreColumn"]
> = {
  column_slug?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  column_search_key?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  column_label?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  column_type?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  searchable?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  extended_column?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
};

export type StoreDefnitionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["StoreDefnition"] = ResolversParentTypes["StoreDefnition"]
> = {
  entityName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  searchEntityName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  columns?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["StoreColumn"]>>>,
    ParentType,
    ContextType
  >;
};

export type StoreFormatResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["StoreFormat"] = ResolversParentTypes["StoreFormat"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  storeFormatCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  taxTypes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["TaxType"]>>>,
    ParentType,
    ContextType
  >;
};

export type StoreFormatPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["StoreFormatPage"] = ResolversParentTypes["StoreFormatPage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["StoreFormat"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type StoreSearchOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["StoreSearchOutput"] = ResolversParentTypes["StoreSearchOutput"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["JSON"]>>>,
    ParentType,
    ContextType
  >;
  total?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  page?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
};

export type TaxTypeResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["TaxType"] = ResolversParentTypes["TaxType"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  taxTypeCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
};

export type TaxTypePageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["TaxTypePage"] = ResolversParentTypes["TaxTypePage"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["TaxType"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type TransactionStatusResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["TransactionStatus"] = ResolversParentTypes["TransactionStatus"]
> = {
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type TransactionStatusOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["TransactionStatusOutput"] = ResolversParentTypes["TransactionStatusOutput"]
> = {
  loyaltyReferenceId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  statusCode?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type TypeDeleteEventResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["TypeDeleteEvent"] = ResolversParentTypes["TypeDeleteEvent"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  code?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  application?: Resolver<
    Maybe<ResolversTypes["Application"]>,
    ParentType,
    ContextType
  >;
  eventSubscriptions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["EventSubscription"]>>>,
    ParentType,
    ContextType
  >;
  events?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Event"]>>>,
    ParentType,
    ContextType
  >;
};

export type TypeDeleteEventSubscriptionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["TypeDeleteEventSubscription"] = ResolversParentTypes["TypeDeleteEventSubscription"]
> = {
  triggerAction?: Resolver<
    Maybe<ResolversTypes["TriggerActionEnum"]>,
    ParentType,
    ContextType
  >;
  customAction?: Resolver<
    Maybe<ResolversTypes["Action"]>,
    ParentType,
    ContextType
  >;
  eventType?: Resolver<
    Maybe<ResolversTypes["EventType"]>,
    ParentType,
    ContextType
  >;
  sync?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
};

export type UpdateCustomerResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["UpdateCustomer"] = ResolversParentTypes["UpdateCustomer"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  phoneNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  gender?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  dateOfBirth?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  externalCustomerId?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  customerIdentifier?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  onboard_source?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  customerDevices?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CustomerDevice"]>>>,
    ParentType,
    ContextType
  >;
};

export type UpdateCustomerProfileOutputInSessionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["UpdateCustomerProfileOutputInSession"] = ResolversParentTypes["UpdateCustomerProfileOutputInSession"]
> = {
  id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  phoneNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  gender?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  dateOfBirth?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
};

export type UpdatePasswordResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["UpdatePasswordResponse"] = ResolversParentTypes["UpdatePasswordResponse"]
> = {
  updated?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Upload"], any> {
  name: "Upload";
}

export type UploadFileForCreateBulkCustomerResponseResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["UploadFileForCreateBulkCustomerResponse"] = ResolversParentTypes["UploadFileForCreateBulkCustomerResponse"]
> = {
  rowCount?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  createdCount?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  failedCount?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  createBulkCustomerResponse?: Resolver<
    Maybe<ResolversTypes["CreateBulkCustomerResponse"]>,
    ParentType,
    ContextType
  >;
  segmentResponse?: Resolver<
    Maybe<ResolversTypes["Segment"]>,
    ParentType,
    ContextType
  >;
};

export type UserResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  extend?: Resolver<Maybe<ResolversTypes["JSON"]>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
  members?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Member"]>>>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  createdCampaigns?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Campaign"]>>>,
    ParentType,
    ContextType
  >;
  roles?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Role"]>>>,
    ParentType,
    ContextType
  >;
  permissionMap?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    UserPermissionMapArgs
  >;
};

export type UserPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["UserPage"] = ResolversParentTypes["UserPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["User"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type ValidationErrorResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ValidationError"] = ResolversParentTypes["ValidationError"]
> = {
  phoneNumber?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  errors?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
};

export type ViewHyperXCampaignOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ViewHyperXCampaignOutput"] = ResolversParentTypes["ViewHyperXCampaignOutput"]
> = {
  campaign?: Resolver<
    Maybe<ResolversTypes["Campaign"]>,
    ParentType,
    ContextType
  >;
  audiences?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Audience"]>>>,
    ParentType,
    ContextType
  >;
  offers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Offer"]>>>,
    ParentType,
    ContextType
  >;
  communications?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Communication"]>>>,
    ParentType,
    ContextType
  >;
};

export type ViewHyperXCampaignsOutputResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["ViewHyperXCampaignsOutput"] = ResolversParentTypes["ViewHyperXCampaignsOutput"]
> = {
  data?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["CampaignsOutput"]>>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type WalkinProductResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WalkinProduct"] = ResolversParentTypes["WalkinProduct"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  latest_version?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type WebhookResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Webhook"] = ResolversParentTypes["Webhook"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  organization?: Resolver<
    ResolversTypes["Organization"],
    ParentType,
    ContextType
  >;
  event?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  url?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  headers?: Resolver<ResolversTypes["JSON"], ParentType, ContextType>;
  method?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type WebhookEventResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WebhookEvent"] = ResolversParentTypes["WebhookEvent"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  event?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type WebhookEventDataResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WebhookEventData"] = ResolversParentTypes["WebhookEventData"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  webhook?: Resolver<Maybe<ResolversTypes["Webhook"]>, ParentType, ContextType>;
  data?: Resolver<ResolversTypes["JSON"], ParentType, ContextType>;
  httpStatus?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type WebhookEventDataPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WebhookEventDataPage"] = ResolversParentTypes["WebhookEventDataPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["WebhookEventData"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type WebhookEventPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WebhookEventPage"] = ResolversParentTypes["WebhookEventPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["WebhookEvent"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type WebhookPageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WebhookPage"] = ResolversParentTypes["WebhookPage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["Webhook"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type WebhookTypePageResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WebhookTypePage"] = ResolversParentTypes["WebhookTypePage"]
> = {
  data?: Resolver<
    Maybe<Array<ResolversTypes["WebhookEvent"]>>,
    ParentType,
    ContextType
  >;
  paginationInfo?: Resolver<
    Maybe<ResolversTypes["PaginationInfo"]>,
    ParentType,
    ContextType
  >;
};

export type WorkflowResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["Workflow"] = ResolversParentTypes["Workflow"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  workflowProcesses?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowProcess"]>>>,
    ParentType,
    ContextType
  >;
};

export type WorkflowDiagramResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["workflowDiagram"] = ResolversParentTypes["workflowDiagram"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  diagram?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
};

export type WorkflowEntityResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WorkflowEntity"] = ResolversParentTypes["WorkflowEntity"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  workflow?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType
  >;
  entityId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  entityType?: Resolver<
    Maybe<ResolversTypes["WORKFLOW_ENTITY_TYPE"]>,
    ParentType,
    ContextType
  >;
  currentTransition?: Resolver<
    Maybe<ResolversTypes["WorkflowEntityTransition"]>,
    ParentType,
    ContextType
  >;
  transitionHistory?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowEntityTransitionHistory"]>>>,
    ParentType,
    ContextType
  >;
};

export type WorkflowEntityTransitionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WorkflowEntityTransition"] = ResolversParentTypes["WorkflowEntityTransition"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  workflowEntityId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  workflowProcessTransitionId?: Resolver<
    ResolversTypes["ID"],
    ParentType,
    ContextType
  >;
  workflowProcessTransition?: Resolver<
    Maybe<ResolversTypes["WorkflowProcessTransition"]>,
    ParentType,
    ContextType
  >;
};

export type WorkflowEntityTransitionHistoryResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WorkflowEntityTransitionHistory"] = ResolversParentTypes["WorkflowEntityTransitionHistory"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  workflowEntityId?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  workflowProcessTransitionId?: Resolver<
    ResolversTypes["ID"],
    ParentType,
    ContextType
  >;
  workflowProcessTransition?: Resolver<
    Maybe<ResolversTypes["WorkflowProcessTransition"]>,
    ParentType,
    ContextType
  >;
};

export type WorkflowProcessResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WorkflowProcess"] = ResolversParentTypes["WorkflowProcess"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  workflow?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType
  >;
  workflowProcessTransitions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["WorkflowProcessTransition"]>>>,
    ParentType,
    ContextType
  >;
};

export type WorkflowProcessTransitionResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WorkflowProcessTransition"] = ResolversParentTypes["WorkflowProcessTransition"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  pickupState?: Resolver<
    Maybe<ResolversTypes["WorkflowState"]>,
    ParentType,
    ContextType
  >;
  dropState?: Resolver<
    Maybe<ResolversTypes["WorkflowState"]>,
    ParentType,
    ContextType
  >;
  ruleConfig?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
};

export type WorkflowRouteResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WorkflowRoute"] = ResolversParentTypes["WorkflowRoute"]
> = {
  id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  entityType?: Resolver<
    Maybe<ResolversTypes["WORKFLOW_ENTITY_TYPE"]>,
    ParentType,
    ContextType
  >;
  organization?: Resolver<
    Maybe<ResolversTypes["Organization"]>,
    ParentType,
    ContextType
  >;
  rule?: Resolver<Maybe<ResolversTypes["Rule"]>, ParentType, ContextType>;
  workflow?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["STATUS"]>, ParentType, ContextType>;
};

export type WorkflowStateResolvers<
  ContextType = ModuleContext,
  ParentType extends ResolversParentTypes["WorkflowState"] = ResolversParentTypes["WorkflowState"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  code?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  workflow?: Resolver<
    Maybe<ResolversTypes["Workflow"]>,
    ParentType,
    ContextType
  >;
};

export type Resolvers<ContextType = ModuleContext> = {
  Action?: ActionResolvers<ContextType>;
  ActionDefinition?: ActionDefinitionResolvers<ContextType>;
  ActionDefinitionPage?: ActionDefinitionPageResolvers<ContextType>;
  ActionPage?: ActionPageResolvers<ContextType>;
  APIKey?: ApiKeyResolvers<ContextType>;
  Application?: ApplicationResolvers<ContextType>;
  Audience?: AudienceResolvers<ContextType>;
  AudienceCountOutput?: AudienceCountOutputResolvers<ContextType>;
  AudienceMember?: AudienceMemberResolvers<ContextType>;
  BasicField?: BasicFieldResolvers<ContextType>;
  BusinessRule?: BusinessRuleResolvers<ContextType>;
  BusinessRuleDetail?: BusinessRuleDetailResolvers<ContextType>;
  Campaign?: CampaignResolvers<ContextType>;
  CampaignControl?: CampaignControlResolvers<ContextType>;
  CampaignOfferOutput?: CampaignOfferOutputResolvers<ContextType>;
  CampaignOfferPage?: CampaignOfferPageResolvers<ContextType>;
  CampaignsOutput?: CampaignsOutputResolvers<ContextType>;
  CancelLoyaltyTransactionOutput?: CancelLoyaltyTransactionOutputResolvers<
    ContextType
  >;
  Catalog?: CatalogResolvers<ContextType>;
  CatalogUsage?: CatalogUsageResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Channel?: ChannelResolvers<ContextType>;
  ChannelPage?: ChannelPageResolvers<ContextType>;
  Charge?: ChargeResolvers<ContextType>;
  Choice?: ChoiceResolvers<ContextType>;
  Communication?: CommunicationResolvers<ContextType>;
  CommunicationLog?: CommunicationLogResolvers<ContextType>;
  ConfirmEmailResponse?: ConfirmEmailResponseResolvers<ContextType>;
  CreateBulkCustomerResponse?: CreateBulkCustomerResponseResolvers<ContextType>;
  CreateCustomerSessionOutput?: CreateCustomerSessionOutputResolvers<
    ContextType
  >;
  Currency?: CurrencyResolvers<ContextType>;
  CurrencyPage?: CurrencyPageResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerColumn?: CustomerColumnResolvers<ContextType>;
  CustomerDefnition?: CustomerDefnitionResolvers<ContextType>;
  CustomerDevice?: CustomerDeviceResolvers<ContextType>;
  CustomerFeedback?: CustomerFeedbackResolvers<ContextType>;
  CustomerFeedbackResponse?: CustomerFeedbackResponseResolvers<ContextType>;
  CustomerLedgerOutput?: CustomerLedgerOutputResolvers<ContextType>;
  CustomerLoyalty?: CustomerLoyaltyResolvers<ContextType>;
  CustomerLoyaltyOutput?: CustomerLoyaltyOutputResolvers<ContextType>;
  CustomerLoyaltyTransaction?: CustomerLoyaltyTransactionResolvers<ContextType>;
  CustomerLoyaltyTransactionData?: CustomerLoyaltyTransactionDataResolvers<
    ContextType
  >;
  CustomerOfferPage?: CustomerOfferPageResolvers<ContextType>;
  CustomerOffersOutput?: CustomerOffersOutputResolvers<ContextType>;
  CustomerSearchOutput?: CustomerSearchOutputResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DeletedChoice?: DeletedChoiceResolvers<ContextType>;
  DeletedFeedbackTemplateUrl?: DeletedFeedbackTemplateUrlResolvers<ContextType>;
  DeleteOrganization?: DeleteOrganizationResolvers<ContextType>;
  EarnableBurnableLoyaltyTransactionOutput?: EarnableBurnableLoyaltyTransactionOutputResolvers<
    ContextType
  >;
  EarnableLoyaltyTransactionOutput?: EarnableLoyaltyTransactionOutputResolvers<
    ContextType
  >;
  EntityExtend?: EntityExtendResolvers<ContextType>;
  EntityExtendField?: EntityExtendFieldResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventSubscription?: EventSubscriptionResolvers<ContextType>;
  EventType?: EventTypeResolvers<ContextType>;
  FeedbackCategory?: FeedbackCategoryResolvers<ContextType>;
  FeedbackForm?: FeedbackFormResolvers<ContextType>;
  FeedbackFormsResponse?: FeedbackFormsResponseResolvers<ContextType>;
  FeedbackHandler?: FeedbackHandlerResolvers<ContextType>;
  FeedbackTemplateUrl?: FeedbackTemplateUrlResolvers<ContextType>;
  FeedbackUIConfig?: FeedbackUiConfigResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  FilesPage?: FilesPageResolvers<ContextType>;
  FileSystem?: FileSystemResolvers<ContextType>;
  FileSystemsPage?: FileSystemsPageResolvers<ContextType>;
  FormatMessage?: FormatMessageResolvers<ContextType>;
  FormExpiry?: FormExpiryResolvers<ContextType>;
  GlobalControl?: GlobalControlResolvers<ContextType>;
  HyperXOutput?: HyperXOutputResolvers<ContextType>;
  InitCustomerFeedbackData?: InitCustomerFeedbackDataResolvers<ContextType>;
  InitFeedbackFormData?: InitFeedbackFormDataResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JWT?: JwtResolvers<ContextType>;
  LedgerOutput?: LedgerOutputResolvers<ContextType>;
  LoyaltyCard?: LoyaltyCardResolvers<ContextType>;
  LoyaltyCardPage?: LoyaltyCardPageResolvers<ContextType>;
  LoyaltyLedger?: LoyaltyLedgerResolvers<ContextType>;
  LoyaltyLedgerOutputType?: LoyaltyLedgerOutputTypeResolvers<ContextType>;
  LoyaltyProgram?: LoyaltyProgramResolvers<ContextType>;
  LoyaltyProgramPage?: LoyaltyProgramPageResolvers<ContextType>;
  LoyaltyStatus?: LoyaltyStatusResolvers<ContextType>;
  LoyaltyStatusOutput?: LoyaltyStatusOutputResolvers<ContextType>;
  LoyaltyTransaction?: LoyaltyTransactionResolvers<ContextType>;
  LoyaltyTransactionPage?: LoyaltyTransactionPageResolvers<ContextType>;
  Member?: MemberResolvers<ContextType>;
  MessageTemplate?: MessageTemplateResolvers<ContextType>;
  MessageTemplateVariable?: MessageTemplateVariableResolvers<ContextType>;
  Metric?: MetricResolvers<ContextType>;
  MetricExecutionResult?: MetricExecutionResultResolvers<ContextType>;
  MetricExecutionResultPage?: MetricExecutionResultPageResolvers<ContextType>;
  MetricFilter?: MetricFilterResolvers<ContextType>;
  MetricFilterPage?: MetricFilterPageResolvers<ContextType>;
  MetricPage?: MetricPageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Offer?: OfferResolvers<ContextType>;
  OfferPage?: OfferPageResolvers<ContextType>;
  Option?: OptionResolvers<ContextType>;
  OptionValue?: OptionValueResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  Policy?: PolicyResolvers<ContextType>;
  ProcessLoyaltyOutput?: ProcessLoyaltyOutputResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCategory?: ProductCategoryResolvers<ContextType>;
  ProductOption?: ProductOptionResolvers<ContextType>;
  ProductVariant?: ProductVariantResolvers<ContextType>;
  ProductVariantValue?: ProductVariantValueResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Question?: QuestionResolvers<ContextType>;
  QuestionTreeData?: QuestionTreeDataResolvers<ContextType>;
  RedemptionOutput?: RedemptionOutputResolvers<ContextType>;
  RedemptionPage?: RedemptionPageResolvers<ContextType>;
  RemovedQuestion?: RemovedQuestionResolvers<ContextType>;
  RepeatRuleConfigurationOutput?: RepeatRuleConfigurationOutputResolvers<
    ContextType
  >;
  Report?: ReportResolvers<ContextType>;
  ReportConfig?: ReportConfigResolvers<ContextType>;
  ReportConfigPage?: ReportConfigPageResolvers<ContextType>;
  ReportPage?: ReportPageResolvers<ContextType>;
  ResetPasswordResponse?: ResetPasswordResponseResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  ResponseDep?: ResponseDepResolvers<ContextType>;
  ResponseSubmit?: ResponseSubmitResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  Rule?: RuleResolvers<ContextType>;
  RuleAttribute?: RuleAttributeResolvers<ContextType>;
  RuleEntity?: RuleEntityResolvers<ContextType>;
  RuleEvaluatioResult?: RuleEvaluatioResultResolvers<ContextType>;
  S3Response?: S3ResponseResolvers<ContextType>;
  Segment?: SegmentResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  SignedURL?: SignedUrlResolvers<ContextType>;
  SQL?: SqlResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
  StoreAdminLevel?: StoreAdminLevelResolvers<ContextType>;
  StoreColumn?: StoreColumnResolvers<ContextType>;
  StoreDefnition?: StoreDefnitionResolvers<ContextType>;
  StoreFormat?: StoreFormatResolvers<ContextType>;
  StoreFormatPage?: StoreFormatPageResolvers<ContextType>;
  StoreSearchOutput?: StoreSearchOutputResolvers<ContextType>;
  TaxType?: TaxTypeResolvers<ContextType>;
  TaxTypePage?: TaxTypePageResolvers<ContextType>;
  TransactionStatus?: TransactionStatusResolvers<ContextType>;
  TransactionStatusOutput?: TransactionStatusOutputResolvers<ContextType>;
  TypeDeleteEvent?: TypeDeleteEventResolvers<ContextType>;
  TypeDeleteEventSubscription?: TypeDeleteEventSubscriptionResolvers<
    ContextType
  >;
  UpdateCustomer?: UpdateCustomerResolvers<ContextType>;
  UpdateCustomerProfileOutputInSession?: UpdateCustomerProfileOutputInSessionResolvers<
    ContextType
  >;
  UpdatePasswordResponse?: UpdatePasswordResponseResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadFileForCreateBulkCustomerResponse?: UploadFileForCreateBulkCustomerResponseResolvers<
    ContextType
  >;
  User?: UserResolvers<ContextType>;
  UserPage?: UserPageResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
  ViewHyperXCampaignOutput?: ViewHyperXCampaignOutputResolvers<ContextType>;
  ViewHyperXCampaignsOutput?: ViewHyperXCampaignsOutputResolvers<ContextType>;
  WalkinProduct?: WalkinProductResolvers<ContextType>;
  Webhook?: WebhookResolvers<ContextType>;
  WebhookEvent?: WebhookEventResolvers<ContextType>;
  WebhookEventData?: WebhookEventDataResolvers<ContextType>;
  WebhookEventDataPage?: WebhookEventDataPageResolvers<ContextType>;
  WebhookEventPage?: WebhookEventPageResolvers<ContextType>;
  WebhookPage?: WebhookPageResolvers<ContextType>;
  WebhookTypePage?: WebhookTypePageResolvers<ContextType>;
  Workflow?: WorkflowResolvers<ContextType>;
  workflowDiagram?: WorkflowDiagramResolvers<ContextType>;
  WorkflowEntity?: WorkflowEntityResolvers<ContextType>;
  WorkflowEntityTransition?: WorkflowEntityTransitionResolvers<ContextType>;
  WorkflowEntityTransitionHistory?: WorkflowEntityTransitionHistoryResolvers<
    ContextType
  >;
  WorkflowProcess?: WorkflowProcessResolvers<ContextType>;
  WorkflowProcessTransition?: WorkflowProcessTransitionResolvers<ContextType>;
  WorkflowRoute?: WorkflowRouteResolvers<ContextType>;
  WorkflowState?: WorkflowStateResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = ModuleContext> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = ModuleContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<
  ContextType = ModuleContext
> = DirectiveResolvers<ContextType>;
