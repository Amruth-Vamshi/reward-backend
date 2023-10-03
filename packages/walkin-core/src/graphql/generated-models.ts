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
};

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

export type CreateFileSystemInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  accessType: Access_Type;
  fileSystemType: File_System_Type;
  configuration: Scalars["JSON"];
  enabled: Scalars["Boolean"];
  organizationId: Scalars["ID"];
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
  externalTemplateId: Scalars["String"];
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

export type Jwt = {
  __typename?: "JWT";
  jwt: Scalars["String"];
};

export type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
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
};

export type MutationCreateMetricArgs = {
  input?: Maybe<MetricAddInput>;
};

export type MutationUpdateMetricArgs = {
  input?: Maybe<MetricUpdateInput>;
};

export type MutationCreateMetricFilterArgs = {
  input?: Maybe<MetricFilterAddInput>;
};

export type MutationUpdateMetricFilterArgs = {
  input?: Maybe<MetricFilterUpdateInput>;
};

export type MutationCreateWebhookEventTypeArgs = {
  input?: Maybe<WebhookEventTypeAddInput>;
};

export type MutationUpdateWebhookEventTypeArgs = {
  input?: Maybe<WebhookEventTypeUpdateInput>;
};

export type MutationCreateWebhookArgs = {
  input?: Maybe<WebhookAddInput>;
};

export type MutationUpdateWebhookArgs = {
  input?: Maybe<WebhookUpdateInput>;
};

export type MutationCreateWebhookEventDataArgs = {
  input?: Maybe<WebhookEventDataAddInput>;
};

export type MutationUpdateWebhookEventDataArgs = {
  input?: Maybe<WebhookEventDataUpdateInput>;
};

export type MutationCreateUserArgs = {
  input: UserCreateInput;
  createOrganization?: Maybe<CreateOrganizationInput>;
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
};

export type MutationUpdateUserArgs = {
  input?: Maybe<UserUpdateInput>;
};

export type MutationDeleteUserByIdArgs = {
  id?: Maybe<Scalars["String"]>;
};

export type MutationLinkApplicationToUserArgs = {
  userId?: Maybe<Scalars["String"]>;
  applicationID?: Maybe<Scalars["String"]>;
};

export type MutationAddUserToOrganizationArgs = {
  userData: UserCreateInput;
  organization_id: Scalars["ID"];
  role_id?: Maybe<Scalars["ID"]>;
};

export type MutationUpdatePasswordArgs = {
  oldPassword?: Maybe<Scalars["String"]>;
  newPassword?: Maybe<Scalars["String"]>;
};

export type MutationConfirmEmailArgs = {
  email?: Maybe<Scalars["String"]>;
  emailToken?: Maybe<Scalars["String"]>;
};

export type MutationSendPasswordResetLinkArgs = {
  email?: Maybe<Scalars["String"]>;
};

export type MutationCreateOrganizationArgs = {
  organizationInput: CreateOrganizationInput;
  parentId?: Maybe<Scalars["ID"]>;
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
  adminUserInput?: Maybe<UserCreateInput>;
};

export type MutationDeleteOrganizationArgs = {
  id: Scalars["ID"];
};

export type MutationUpdateOrganizationArgs = {
  organization: UpdateOrganizationInput;
};

export type MutationDeleteOrganizationHierarchyArgs = {
  id: Scalars["ID"];
};

export type MutationLinkUserToOrganizationArgs = {
  organizationId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationLinkOrganizationToparentArgs = {
  organizationId: Scalars["ID"];
  parentId: Scalars["ID"];
};

export type MutationLinkOrganizationToWalkinProductsArgs = {
  organizationId: Scalars["ID"];
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
};

export type MutationLinkOrganizationToMetricsArgs = {
  organizationId: Scalars["ID"];
  walkinProducts?: Maybe<Array<Maybe<WalkinProducts>>>;
};

export type MutationGenerateApiKeyArgs = {
  id: Scalars["ID"];
  environment?: Maybe<Scalars["String"]>;
};

export type MutationDeleteApplicationArgs = {
  id: Scalars["ID"];
};

export type MutationUpdateApplicationArgs = {
  input: ApplicationUpdateInput;
};

export type MutationUpdateApiKeyArgs = {
  input?: Maybe<ApiKeyInput>;
};

export type MutationCreateApplicationArgs = {
  organizationId: Scalars["ID"];
  input: ApplicationInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationLogoutArgs = {
  input?: Maybe<Scalars["Boolean"]>;
};

export type MutationRefreshTokenArgs = {
  jwt: Scalars["String"];
};

export type MutationAddRoleArgs = {
  input: RoleInput;
};

export type MutationEditRoleArgs = {
  input: RoleEditInput;
};

export type MutationDeleteRoleArgs = {
  id: Scalars["ID"];
};

export type MutationAddPolicyToRoleArgs = {
  roleId: Scalars["ID"];
  input: PolicyInput;
};

export type MutationAddPoliciesToRoleArgs = {
  roleId: Scalars["ID"];
  inputs: Array<Maybe<PolicyInput>>;
};

export type MutationRemovePolicyFromRoleArgs = {
  roleId: Scalars["ID"];
  policyId: Scalars["ID"];
};

export type MutationRemovePoliciesFromRoleArgs = {
  roleId: Scalars["ID"];
  policyIds: Array<Scalars["ID"]>;
};

export type MutationEditPolicyArgs = {
  input: PolicyEditInput;
};

export type MutationLinkUserToRoleArgs = {
  roleId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationLinkUsersToRoleArgs = {
  roleId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type MutationLinkRolesToUserArgs = {
  roleIds: Array<Scalars["ID"]>;
  userId: Scalars["ID"];
};

export type MutationUnlinkUserToRoleArgs = {
  roleId: Scalars["ID"];
  userId: Scalars["ID"];
};

export type MutationUnlinkUsersFromRoleArgs = {
  roleId: Scalars["ID"];
  userIds: Array<Scalars["ID"]>;
};

export type MutationUnlinkRolesFromUserArgs = {
  roleIds: Array<Scalars["ID"]>;
  userId: Scalars["ID"];
};

export type MutationCreateStoreAdminLevelArgs = {
  input: CreateStoreAdminLevel;
};

export type MutationUpdateStoreAdminLevelArgs = {
  input: UpdateStoreAdminLevel;
};

export type MutationUpdateStoreArgs = {
  input: UpdateStoreInput;
};

export type MutationCreateStoreArgs = {
  input: CreateStoreInput;
};

export type MutationUpdateStoreByCodeArgs = {
  input: CreateStoreInput;
};

export type MutationPushEventsArgs = {
  events: Array<Maybe<EventInput>>;
};

export type MutationProcessEventByIdArgs = {
  id: Scalars["ID"];
};

export type MutationCreateEventSubscriptionArgs = {
  eventTypeId: Scalars["ID"];
  triggerAction: TriggerActionEnum;
  customActionId?: Maybe<Scalars["ID"]>;
};

export type MutationDeleteEventSubscriptionArgs = {
  id: Scalars["ID"];
};

export type MutationCreateEventTypeArgs = {
  code: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  applicationId: Scalars["ID"];
  organizationId: Scalars["String"];
};

export type MutationUpdateEventTypeArgs = {
  id: Scalars["ID"];
  code?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["String"]>;
  application?: Maybe<Scalars["JSON"]>;
};

export type MutationDeleteEventTypeArgs = {
  id: Scalars["ID"];
};

export type MutationCreateRuleEntityArgs = {
  input: CreateRuleEntityInput;
};

export type MutationDisableRuleEntityArgs = {
  id: Scalars["ID"];
};

export type MutationCreateRuleAttributeArgs = {
  input: CreateRuleAttributeInput;
};

export type MutationDisableRuleAttributeArgs = {
  id: Scalars["ID"];
};

export type MutationCreateRuleArgs = {
  input: CreateRuleInput;
};

export type MutationUpdateRuleArgs = {
  id: Scalars["ID"];
  input: UpdateRuleInput;
};

export type MutationDisableRuleArgs = {
  id: Scalars["ID"];
};

export type MutationCreateBusinessRuleArgs = {
  input?: Maybe<CreateBusinessRuleInput>;
};

export type MutationUpdateBusinessRuleArgs = {
  id: Scalars["ID"];
  input?: Maybe<UpdateBusinessRuleInput>;
};

export type MutationDeleteBusinessRuleArgs = {
  id: Scalars["ID"];
};

export type MutationCreateBusinessRuleDetailArgs = {
  input?: Maybe<CreateBusinessRuleDetailInput>;
};

export type MutationUpdateBusinessRuleDetailArgs = {
  id: Scalars["ID"];
  input?: Maybe<UpdateBusinessRuleDetailInput>;
};

export type MutationDeleteBusinessRuleDetailArgs = {
  id: Scalars["ID"];
};

export type MutationUpdateBusinessRuleByRuleTypeArgs = {
  input?: Maybe<CreateBusinessRuleInput>;
};

export type MutationCreateWorkflowArgs = {
  input?: Maybe<WorkflowInput>;
};

export type MutationCreateWorkflowWithChildrenArgs = {
  input?: Maybe<WorkflowWithChildrenInput>;
};

export type MutationUpdateWorkflowArgs = {
  input?: Maybe<UpdateWorkflowInput>;
};

export type MutationCreateWorkflowProcessArgs = {
  input?: Maybe<WorkflowProcessInput>;
};

export type MutationUpdateWorkflowProcessArgs = {
  input?: Maybe<UpdateWorkflowProcessInput>;
};

export type MutationCreateWorkflowProcessTransitionArgs = {
  input?: Maybe<WorkflowProcessTransitionInput>;
};

export type MutationUpdateWorkflowProcessTransitionArgs = {
  input?: Maybe<UpdateWorkflowProcessTransitionInput>;
};

export type MutationCreateWorkflowStateArgs = {
  input?: Maybe<WorkflowStateInput>;
};

export type MutationUpdateWorkflowStateArgs = {
  input?: Maybe<UpdateWorkflowStateInput>;
};

export type MutationCreateWorkflowEntityArgs = {
  input?: Maybe<WorkflowEntityInput>;
};

export type MutationUpdateWorkflowEntityArgs = {
  input?: Maybe<UpdateWorkflowEntityInput>;
};

export type MutationAddWorkflowEnityTransitionStatusArgs = {
  input?: Maybe<WorkflowEntityTransitionInput>;
};

export type MutationCreateWorkflowRouteArgs = {
  input?: Maybe<WorkflowRouteInput>;
};

export type MutationUpdateWorkflowRouteArgs = {
  input?: Maybe<UpdateWorkflowRouteInput>;
};

export type MutationCreateCustomerArgs = {
  customer: CustomerInput;
};

export type MutationCreateBulkCustomerArgs = {
  customers: Array<Maybe<CustomerInput>>;
};

export type MutationUpdateCustomerArgs = {
  customer?: Maybe<UpdateCustomerInput>;
};

export type MutationCreateCustomerDeviceArgs = {
  customerDevice: CustomerDeviceInput;
};

export type MutationUpdateCustomerDeviceArgs = {
  customerDevice: UpdateCustomerDeviceInput;
};

export type MutationDisableCustomerArgs = {
  customer: CustomerInput;
};

export type MutationDisableCustomerDeviceArgs = {
  customerDevice: CustomerDeviceInput;
};

export type MutationUploadFileForCreateBulkCustomerArgs = {
  input?: Maybe<CustomerFileUploadInput>;
};

export type MutationAddEntityExtendArgs = {
  input: AddEntityExtend;
};

export type MutationAddEntityExtendFieldArgs = {
  input: AddEntityExtendField;
};

export type MutationCreateActionDefinitionArgs = {
  input?: Maybe<CreateActionDefinitionInput>;
};

export type MutationUpdateActionDefinitionArgs = {
  input?: Maybe<UpdateActionDefinitionInput>;
};

export type MutationDisableActionDefinitionArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type MutationExecuteActionArgs = {
  actionDefinitionName: Scalars["String"];
  request?: Maybe<Scalars["JSON"]>;
};

export type MutationStartSessionArgs = {
  input?: Maybe<StartSessionInput>;
};

export type MutationEndSessionArgs = {
  input?: Maybe<EndSessionInput>;
};

export type MutationCreateSegmentForCustomersArgs = {
  customerPhoneNumbers?: Maybe<Array<Maybe<Scalars["String"]>>>;
  segmentName?: Maybe<Scalars["String"]>;
};

export type MutationCreateSegmentArgs = {
  input?: Maybe<SegmentAddInput>;
};

export type MutationUpdateSegmentArgs = {
  input?: Maybe<SegmentUpdateInput>;
};

export type MutationDisableSegmentArgs = {
  id: Scalars["ID"];
};

export type MutationCreateCampaignArgs = {
  input?: Maybe<CampaignAddInput>;
};

export type MutationUpdateCampaignArgs = {
  id: Scalars["ID"];
  input?: Maybe<CampaignUpdateInput>;
};

export type MutationLaunchCampaignArgs = {
  id: Scalars["ID"];
};

export type MutationPreprocessLaunchCampaignArgs = {
  id: Scalars["ID"];
};

export type MutationPauseCampaignArgs = {
  id: Scalars["ID"];
};

export type MutationUnpauseCampaignArgs = {
  id: Scalars["ID"];
};

export type MutationCompleteCampaignArgs = {
  id: Scalars["ID"];
};

export type MutationAbandonCampaignArgs = {
  id: Scalars["ID"];
};

export type MutationDisableCampaignArgs = {
  id: Scalars["ID"];
};

export type MutationLinkCampaignToApplicationArgs = {
  campaignId: Scalars["ID"];
  applicationId: Scalars["ID"];
};

export type MutationUnlinkCampaignFromApplicationArgs = {
  campaignId: Scalars["ID"];
  applicationId: Scalars["ID"];
};

export type MutationCreateAudienceArgs = {
  input?: Maybe<CreateAudienceInput>;
};

export type MutationUpdateAudienceArgs = {
  input?: Maybe<UpdateAudienceInput>;
};

export type MutationCreateAudienceForCampaignArgs = {
  campaignId?: Maybe<Scalars["ID"]>;
  segments: Array<Maybe<Scalars["ID"]>>;
};

export type MutationCreateCampaignControlArgs = {
  input?: Maybe<AddCampaignControl>;
};

export type MutationUpdateCampaignControlArgs = {
  input?: Maybe<UpdateCampaignControl>;
};

export type MutationCreateGlobalControlArgs = {
  input?: Maybe<AddGlobalControl>;
};

export type MutationDeactivateGlobalControlArgs = {
  id: Scalars["ID"];
};

export type MutationCreateAudienceMemberArgs = {
  input?: Maybe<AddAudienceMemberInput>;
};

export type MutationUpdateAudienceMemberArgs = {
  input?: Maybe<UpdateAudienceMemberInput>;
};

export type MutationCreateFileSystemArgs = {
  input: CreateFileSystemInput;
};

export type MutationUpdateFileSystemArgs = {
  input: UpdateFileSystemInput;
};

export type MutationDeleteFileSystemArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type MutationGenerateSignedUploadUrlArgs = {
  input: SignedUploadUrlInput;
};

export type MutationUploadFileArgs = {
  input: FileUploadInput;
};

export type MutationUpdateFileArgs = {
  file: Scalars["Upload"];
  input: UpdateUploadFileInput;
};

export type MutationDeleteFileArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type MutationCreateMessageTemplateArgs = {
  input: CreateMessageTemplateInput;
};

export type MutationUpdateMessageTemplateArgs = {
  input: UpdateMessageTemplateInput;
};

export type MutationCreateMessageTemplateVariableArgs = {
  input: CreateMessageTemplateVariableInput;
};

export type MutationUpdateMessageTemplateVariableArgs = {
  input: UpdateMessageTemplateVariableInput;
};

export type MutationAddVariableToMessageTemplateArgs = {
  input: AddVariableToMessageTemplateInput;
};

export type MutationRemoveVariableFromMessageTemplateArgs = {
  input: RemoveVariableFromMessageTemplateInput;
};

export type MutationFormatMessageArgs = {
  input: FormatMessageInput;
};

export type MutationSendMessageArgs = {
  input: SendMessageInput;
};

export type MutationCreateCommunicationWithMessageTempateArgs = {
  communicationInput: CreateCommunicationWithoutMessageTemplateInput;
  messageTemplateInput?: Maybe<CreateMessageTemplateInput>;
};

export type MutationUpdateCommunicationWithMessageTempateArgs = {
  communicationInput: UpdateCommunicationInput;
  messageTemplateInput?: Maybe<UpdateMessageTemplateInput>;
};

export type MutationCreateCommunicationArgs = {
  input: CreateCommunicationInput;
};

export type MutationUpdateCommunicationArgs = {
  input: UpdateCommunicationInput;
};

export type MutationDisableCommunicationArgs = {
  id: Scalars["ID"];
  organization: Scalars["ID"];
};

export type MutationAddCommunicationLogArgs = {
  input: CommunicationLogInput;
};

export type MutationUpdateCommunicationLogArgs = {
  input: CommunicationLogUpdateInput;
};

export type MutationCreateCatalogArgs = {
  input: CatalogInput;
};

export type MutationUpdateCatalogArgs = {
  input: UpdateCatalogInput;
};

export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};

export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};

export type MutationDisableCategoryArgs = {
  id: Scalars["ID"];
};

export type MutationCreateOptionArgs = {
  input?: Maybe<OptionInput>;
};

export type MutationUpdateOptionArgs = {
  input?: Maybe<UpdateOptionInput>;
};

export type MutationCreateOptionValueArgs = {
  input?: Maybe<OptionValueInput>;
};

export type MutationUpdateOptionValueArgs = {
  input?: Maybe<UpdateOptionValueInput>;
};

export type MutationCreateProductArgs = {
  input: CreateProductInput;
};

export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};

export type MutationDisableProductArgs = {
  productName: Scalars["String"];
};

export type MutationCreateProductOptionArgs = {
  input?: Maybe<ProductOptionInput>;
};

export type MutationUpdateProductOptionArgs = {
  input?: Maybe<UpdateProductOptionInput>;
};

export type MutationCreateProductVariantArgs = {
  input?: Maybe<ProductVariantInput>;
};

export type MutationUpdateProductVariantArgs = {
  input?: Maybe<UpdateProductVariantInput>;
};

export type MutationCreateProductVariantValueArgs = {
  input?: Maybe<ProductVariantValueInput>;
};

export type MutationUpdateProductVariantValueArgs = {
  input?: Maybe<UpdateProductVariantValueInput>;
};

export type MutationCreateProductCategoryArgs = {
  input?: Maybe<ProductCategoryInput>;
};

export type MutationUpdateProductCategoryArgs = {
  input?: Maybe<UpdateProductCategoryInput>;
};

export type MutationCreateChargeTypeArgs = {
  input?: Maybe<ChargeTypeCreateInput>;
};

export type MutationUpdateChargeTypeArgs = {
  input?: Maybe<ChargeTypeUpdateInput>;
};

export type MutationDeleteChargeTypeArgs = {
  id: Scalars["ID"];
};

export type MutationCreateChannelArgs = {
  input?: Maybe<ChannelTypeInput>;
};

export type MutationUpdateChannelArgs = {
  input?: Maybe<ChannelTypeUpdateInput>;
};

export type MutationDeleteChannelArgs = {
  id: Scalars["ID"];
};

export type MutationCreateTaxTypeArgs = {
  input?: Maybe<TaxTypeInput>;
};

export type MutationUpdateTaxTypeArgs = {
  id: Scalars["ID"];
  input?: Maybe<TaxTypeInput>;
};

export type MutationCreateStoreFormatArgs = {
  input?: Maybe<StoreFormatInput>;
};

export type MutationUpdateStoreFormatArgs = {
  id: Scalars["ID"];
  input?: Maybe<StoreFormatInput>;
};

export type MutationAddReportConfigArgs = {
  name: Scalars["String"];
  description: Scalars["String"];
  organizationId: Scalars["ID"];
};

export type MutationDeactivateReportConfigArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type MutationAddReportArgs = {
  reportConfigId: Scalars["ID"];
  reportFileId: Scalars["ID"];
  reportDate: Scalars["Date"];
  organizationId: Scalars["ID"];
};

export type MutationDeleteReportArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
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
  totalPages?: Maybe<Scalars["Int"]>;
  totalItems?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  perPage?: Maybe<Scalars["Int"]>;
  hasNextPage?: Maybe<Scalars["Boolean"]>;
  hasPreviousPage?: Maybe<Scalars["Boolean"]>;
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
};

export type QueryMetricArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryMetricsArgs = {
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
  organizationId?: Maybe<Scalars["ID"]>;
  status: Status;
};

export type QueryMetricFilterArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryMetricFiltersArgs = {
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
  status: Status;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryExecuteMetricArgs = {
  name?: Maybe<Scalars["String"]>;
  organizationId?: Maybe<Scalars["ID"]>;
  filterValues?: Maybe<Scalars["JSON"]>;
};

export type QueryExecuteMetricsArgs = {
  names?: Maybe<Array<Maybe<Scalars["String"]>>>;
  organizationId?: Maybe<Scalars["ID"]>;
  walkinProducts: Walkin_Products;
  filterValues?: Maybe<Scalars["JSON"]>;
};

export type QueryWebhookEventTypeArgs = {
  organizationId: Scalars["ID"];
  event: Scalars["String"];
};

export type QueryWebhookEventTypesArgs = {
  organizationId: Scalars["ID"];
  status: Status;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryWebhookArgs = {
  organizationId: Scalars["ID"];
  id: Scalars["ID"];
};

export type QueryWebhooksArgs = {
  organizationId: Scalars["ID"];
  event?: Maybe<Scalars["String"]>;
  status: Status;
  enabled?: Maybe<Scalars["Boolean"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryWebhookEventDataArgs = {
  organizationId: Scalars["ID"];
  webhookId: Scalars["ID"];
  httpStatus?: Maybe<Scalars["String"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryUsersArgs = {
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
  organizationId: Scalars["String"];
};

export type QueryUserArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["String"];
};

export type QueryOrganizationHierarchyArgs = {
  rootId: Scalars["ID"];
};

export type QueryOrganizationArgs = {
  id: Scalars["ID"];
};

export type QuerySubOrganizationsArgs = {
  parentId: Scalars["ID"];
  type?: Maybe<OrganizationTypeEnum>;
  status?: Maybe<Status>;
};

export type QueryApplicationArgs = {
  id: Scalars["ID"];
};

export type QueryRoleArgs = {
  id: Scalars["ID"];
};

export type QueryStoreArgs = {
  id: Scalars["ID"];
};

export type QueryStoreByCodeArgs = {
  code: Scalars["String"];
};

export type QueryStoreSearchArgs = {
  organizationId: Scalars["ID"];
  filterValues?: Maybe<StoreSearchFilters>;
  pageNumber: Scalars["Int"];
  sort?: Maybe<Sort>;
};

export type QueryStoreDefnitionArgs = {
  organizationId: Scalars["ID"];
};

export type QueryEventByIdArgs = {
  id: Scalars["ID"];
};

export type QueryEventBySourceEventIdArgs = {
  sourceEventId: Scalars["String"];
  eventTypeId?: Maybe<Scalars["ID"]>;
};

export type QueryEventsByFiltersArgs = {
  sourceName?: Maybe<Scalars["String"]>;
  eventTypeCode?: Maybe<Scalars["String"]>;
};

export type QueryEventSubscriptionsForEventTypeArgs = {
  eventTypeId: Scalars["ID"];
};

export type QueryEventSubscriptionByIdArgs = {
  id: Scalars["ID"];
};

export type QueryEventTypeByIdArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type QueryEventTypeByCodeArgs = {
  code: Scalars["String"];
};

export type QueryEventTypesForApplicationArgs = {
  appId: Scalars["ID"];
};

export type QueryRuleEntityArgs = {
  id: Scalars["ID"];
};

export type QueryRuleEntitiesArgs = {
  input?: Maybe<SearchRuleEntityInput>;
};

export type QueryRuleAttributeArgs = {
  id: Scalars["ID"];
};

export type QueryRuleAttributesArgs = {
  input: SearchRuleAttributeInput;
};

export type QueryRuleArgs = {
  id: Scalars["ID"];
};

export type QueryRulesArgs = {
  input?: Maybe<SearchRuleInput>;
};

export type QueryGetSqlFromRuleArgs = {
  ruleId: Scalars["ID"];
};

export type QueryEvaluateRuleArgs = {
  ruleName?: Maybe<Scalars["String"]>;
  data: Scalars["JSON"];
  ruleId?: Maybe<Scalars["ID"]>;
};

export type QueryBusinessRulesArgs = {
  input: SearchBusinessRulesInput;
};

export type QueryBusinessRuleArgs = {
  id: Scalars["ID"];
};

export type QueryBusinessRuleDetailsArgs = {
  input: SearchBusinessRuleDetailsInput;
};

export type QueryBusinessRuleDetailArgs = {
  id: Scalars["ID"];
};

export type QueryBusinessRuleConfigurationArgs = {
  input: BusinessRuleConfigurationInput;
};

export type QueryWorkflowArgs = {
  id: Scalars["ID"];
};

export type QueryWorkflowByNameArgs = {
  name: Scalars["String"];
  organizationId: Scalars["String"];
};

export type QueryWorkflowDiagramArgs = {
  id: Scalars["ID"];
};

export type QueryOrgWorkflowsArgs = {
  orgId: Scalars["ID"];
};

export type QueryWorkflowStateArgs = {
  id: Scalars["ID"];
};

export type QueryWorkflowStatesArgs = {
  workflowId: Scalars["ID"];
};

export type QueryWorkflowProcessArgs = {
  id: Scalars["ID"];
};

export type QueryWorkflowProcessByNameArgs = {
  name: Scalars["String"];
  workflowId: Scalars["String"];
};

export type QueryWorkflowProcessesArgs = {
  workflowId: Scalars["ID"];
};

export type QueryWorkflowProcessTransitionArgs = {
  id: Scalars["ID"];
};

export type QueryWorkflowProcessTransitionsArgs = {
  workflowProcessId: Scalars["ID"];
};

export type QueryWorkflowEntityArgs = {
  id: Scalars["ID"];
};

export type QueryWorkflowEntityByEntityDetailsArgs = {
  entityId: Scalars["String"];
  entityType: Workflow_Entity_Type;
};

export type QueryWorkflowEntityTransitionArgs = {
  id: Scalars["ID"];
};

export type QueryWorkflowEntityTransitionByEntityIdArgs = {
  workflowEntityId: Scalars["ID"];
};

export type QueryWorkflowEntityTransitionHistoryArgs = {
  workflowEntityId: Scalars["ID"];
};

export type QueryWorkflowRouteArgs = {
  id: Scalars["ID"];
};

export type QueryWorkflowRoutesArgs = {
  organizationId: Scalars["ID"];
  entityType: Workflow_Entity_Type;
};

export type QueryCustomerArgs = {
  input?: Maybe<SearchCustomerInput>;
};

export type QueryCustomerDeviceArgs = {
  input?: Maybe<SearchCustomerDeviceInput>;
};

export type QueryCustomerDefnitionArgs = {
  organization_id: Scalars["ID"];
};

export type QueryCustomerDevicesByCustomerIdArgs = {
  customerId: Scalars["String"];
};

export type QueryCustomerSearchArgs = {
  organizationId: Scalars["ID"];
  filterValues?: Maybe<CustomerSearchFilters>;
  pageNumber: Scalars["Int"];
  sort?: Maybe<Sort>;
};

export type QueryGetSegmentRuleAsTextArgs = {
  ruleId?: Maybe<Scalars["ID"]>;
};

export type QueryEntityExtendArgs = {
  id: Scalars["ID"];
};

export type QueryEntityExtendByNameArgs = {
  entityName: Extend_Entities;
};

export type QueryEntityExtendFieldArgs = {
  id: Scalars["ID"];
};

export type QueryBasicFieldsArgs = {
  entityName: Extend_Entities;
};

export type QueryActionDefinitionArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryActionDefinitionsArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  type?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryActionArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryActionsArgs = {
  organizationId?: Maybe<Scalars["ID"]>;
  actionDefinitionName?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QuerySessionArgs = {
  id: Scalars["ID"];
};

export type QueryActiveSessionArgs = {
  customer_identifier: Scalars["String"];
  organization_id: Scalars["ID"];
};

export type QuerySegmentArgs = {
  id: Scalars["ID"];
};

export type QuerySegmentsArgs = {
  name?: Maybe<Scalars["String"]>;
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  segmentType?: Maybe<Scalars["String"]>;
  status: Status;
};

export type QueryCampaignArgs = {
  id: Scalars["ID"];
};

export type QueryCampaignsArgs = {
  organization_id?: Maybe<Scalars["ID"]>;
  application_id?: Maybe<Scalars["ID"]>;
  campaignType?: Maybe<Array<Maybe<Scalars["String"]>>>;
  status: Status;
};

export type QueryAudienceArgs = {
  id: Scalars["ID"];
};

export type QueryAudiencesArgs = {
  organization_id: Scalars["ID"];
  application_id?: Maybe<Scalars["ID"]>;
  campaign_id?: Maybe<Scalars["ID"]>;
  segment_id?: Maybe<Scalars["ID"]>;
  status?: Maybe<Status>;
};

export type QueryCampaignControlsArgs = {
  organization_id: Scalars["ID"];
  campaign_id: Scalars["ID"];
  customer_id?: Maybe<Scalars["ID"]>;
};

export type QueryGlobalControlsArgs = {
  organization_id: Scalars["ID"];
  customer_id?: Maybe<Scalars["ID"]>;
};

export type QueryAudienceCountArgs = {
  segments?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  organizationId: Scalars["ID"];
};

export type QueryAudienceMembersArgs = {
  audience_id: Scalars["ID"];
  customer_id?: Maybe<Scalars["ID"]>;
};

export type QueryTotalAudienceCountForCampaignArgs = {
  campaignId: Scalars["ID"];
};

export type QueryFileSystemArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryFileSystemsArgs = {
  name?: Maybe<Scalars["String"]>;
  accessType?: Maybe<Scalars["String"]>;
  fileSystemType?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryFileArgs = {
  id: Scalars["ID"];
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryFilesArgs = {
  fileSystemId?: Maybe<Scalars["ID"]>;
  name?: Maybe<Scalars["String"]>;
  status?: Maybe<Scalars["String"]>;
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryMessageTemplateArgs = {
  id: Scalars["ID"];
  organization_id: Scalars["ID"];
};

export type QueryMessageTemplatesArgs = {
  organization_id: Scalars["ID"];
  messageFormat?: Maybe<Message_Format>;
  status?: Maybe<Status>;
};

export type QueryCommunicationArgs = {
  id: Scalars["ID"];
  organization_id: Scalars["ID"];
};

export type QueryCommunicationsArgs = {
  entityId?: Maybe<Scalars["ID"]>;
  entityType?: Maybe<Communication_Entity_Type>;
  organization_id: Scalars["ID"];
  status?: Maybe<Status>;
  campaignId?: Maybe<Scalars["ID"]>;
};

export type QueryCommunicationLogArgs = {
  communicationLogId: Scalars["ID"];
};

export type QueryCommunicationLogsArgs = {
  communicationId: Scalars["ID"];
};

export type QueryCatalogArgs = {
  id: Scalars["ID"];
};

export type QueryCatalogsArgs = {
  organizationId: Scalars["ID"];
};

export type QueryCategoryArgs = {
  id: Scalars["ID"];
};

export type QueryCategoryByCodeArgs = {
  catalogId: Scalars["ID"];
  categoryCode: Scalars["String"];
};

export type QueryCategoriesWithChildrenArgs = {
  catalogId: Scalars["ID"];
  categoryCode?: Maybe<Scalars["String"]>;
};

export type QueryCategoriesArgs = {
  catalogId: Scalars["ID"];
  parentCategoryId?: Maybe<Scalars["ID"]>;
};

export type QueryOptionByIdArgs = {
  id: Scalars["ID"];
};

export type QueryOptionValuesByOptionIdArgs = {
  optionId: Scalars["ID"];
};

export type QueryProductsArgs = {
  input?: Maybe<ProductSearchInput>;
};

export type QueryProductOptionsByProductIdArgs = {
  productId: Scalars["ID"];
};

export type QueryProductVariantsByProductIdArgs = {
  productId: Scalars["ID"];
};

export type QueryProductVariantValuesByProductVariantIdArgs = {
  productVariantId: Scalars["ID"];
};

export type QueryProductCategoriesByCategoryIdArgs = {
  categoryId: Scalars["ID"];
};

export type QueryProductCategoriesByCategoryCodeArgs = {
  categoryCode: Scalars["String"];
};

export type QueryChargeTypesArgs = {
  input?: Maybe<ChargeTypesInput>;
};

export type QueryChargeTypeArgs = {
  input?: Maybe<ChargeTypeInput>;
};

export type QueryChannelArgs = {
  input?: Maybe<ChannelFilterInput>;
};

export type QueryTaxTypeArgs = {
  id: Scalars["ID"];
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryTaxTypesArgs = {
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryStoreFormatArgs = {
  id: Scalars["ID"];
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
};

export type QueryStoreFormatsArgs = {
  status?: Maybe<Status>;
  organizationId?: Maybe<Scalars["ID"]>;
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryReportConfigArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type QueryReportConfigsArgs = {
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
};

export type QueryReportArgs = {
  id: Scalars["ID"];
  organizationId: Scalars["ID"];
};

export type QueryReportsArgs = {
  reportConfigId: Scalars["ID"];
  reportDate: Scalars["Date"];
  organizationId: Scalars["ID"];
  pageOptions?: Maybe<PageOptions>;
  sortOptions?: Maybe<SortOptions>;
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

export type SortOptions = {};

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
  ORDER: Order;
  StoreSearchOutput: ResolverTypeWrapper<StoreSearchOutput>;
  StoreDefnition: ResolverTypeWrapper<StoreDefnition>;
  StoreColumn: ResolverTypeWrapper<StoreColumn>;
  Event: ResolverTypeWrapper<Event>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  EventType: ResolverTypeWrapper<EventType>;
  EventSubscription: ResolverTypeWrapper<EventSubscription>;
  TriggerActionEnum: TriggerActionEnum;
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
  Customer: ResolverTypeWrapper<Customer>;
  CustomerDevice: ResolverTypeWrapper<CustomerDevice>;
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
  ORDER: Order;
  StoreSearchOutput: StoreSearchOutput;
  StoreDefnition: StoreDefnition;
  StoreColumn: StoreColumn;
  Event: Event;
  Date: Scalars["Date"];
  EventType: EventType;
  EventSubscription: EventSubscription;
  TriggerActionEnum: TriggerActionEnum;
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
  Customer: Customer;
  CustomerDevice: CustomerDevice;
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
  totalPages?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  totalItems?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  page?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  perPage?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  hasNextPage?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  hasPreviousPage?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
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
  Catalog?: CatalogResolvers<ContextType>;
  CatalogUsage?: CatalogUsageResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Channel?: ChannelResolvers<ContextType>;
  ChannelPage?: ChannelPageResolvers<ContextType>;
  Charge?: ChargeResolvers<ContextType>;
  Communication?: CommunicationResolvers<ContextType>;
  CommunicationLog?: CommunicationLogResolvers<ContextType>;
  ConfirmEmailResponse?: ConfirmEmailResponseResolvers<ContextType>;
  CreateBulkCustomerResponse?: CreateBulkCustomerResponseResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerColumn?: CustomerColumnResolvers<ContextType>;
  CustomerDefnition?: CustomerDefnitionResolvers<ContextType>;
  CustomerDevice?: CustomerDeviceResolvers<ContextType>;
  CustomerSearchOutput?: CustomerSearchOutputResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DeleteOrganization?: DeleteOrganizationResolvers<ContextType>;
  EntityExtend?: EntityExtendResolvers<ContextType>;
  EntityExtendField?: EntityExtendFieldResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventSubscription?: EventSubscriptionResolvers<ContextType>;
  EventType?: EventTypeResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  FilesPage?: FilesPageResolvers<ContextType>;
  FileSystem?: FileSystemResolvers<ContextType>;
  FileSystemsPage?: FileSystemsPageResolvers<ContextType>;
  FormatMessage?: FormatMessageResolvers<ContextType>;
  GlobalControl?: GlobalControlResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JWT?: JwtResolvers<ContextType>;
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
  Option?: OptionResolvers<ContextType>;
  OptionValue?: OptionValueResolvers<ContextType>;
  Organization?: OrganizationResolvers<ContextType>;
  PaginationInfo?: PaginationInfoResolvers<ContextType>;
  Policy?: PolicyResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCategory?: ProductCategoryResolvers<ContextType>;
  ProductOption?: ProductOptionResolvers<ContextType>;
  ProductVariant?: ProductVariantResolvers<ContextType>;
  ProductVariantValue?: ProductVariantValueResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RepeatRuleConfigurationOutput?: RepeatRuleConfigurationOutputResolvers<
    ContextType
  >;
  Report?: ReportResolvers<ContextType>;
  ReportConfig?: ReportConfigResolvers<ContextType>;
  ReportConfigPage?: ReportConfigPageResolvers<ContextType>;
  ReportPage?: ReportPageResolvers<ContextType>;
  ResetPasswordResponse?: ResetPasswordResponseResolvers<ContextType>;
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
  TypeDeleteEvent?: TypeDeleteEventResolvers<ContextType>;
  TypeDeleteEventSubscription?: TypeDeleteEventSubscriptionResolvers<
    ContextType
  >;
  UpdateCustomer?: UpdateCustomerResolvers<ContextType>;
  UpdatePasswordResponse?: UpdatePasswordResponseResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  UploadFileForCreateBulkCustomerResponse?: UploadFileForCreateBulkCustomerResponseResolvers<
    ContextType
  >;
  User?: UserResolvers<ContextType>;
  UserPage?: UserPageResolvers<ContextType>;
  ValidationError?: ValidationErrorResolvers<ContextType>;
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
