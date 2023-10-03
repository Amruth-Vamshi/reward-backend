import { Organizations } from "../../../../../walkin-core/src/modules/account/organization/organization.providers";
import { ApplicationProvider } from "../../../../../walkin-core/src/modules/account/application/application.providers";
import { RuleProvider } from "../../../../../walkin-core/src/modules/rule/providers/rule.provider";

import {
  CAMPAIGN_SCHEDULE_NAME,
  CAMPAIGN_STATUS,
  CAMPAIGN_TRIGGER_TYPE,
  CAMPAIGN_TYPE,
  STATUS
} from "../../../../../walkin-core/src/modules/common/constants/constants";
import { WalkinPlatformError } from "../../../../../walkin-core/src/modules/common/exceptions/walkin-platform-error";
import { WCORE_ERRORS } from "../../../../../walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "../../../../../walkin-core/src/modules/common/exceptions";
import { isValidString } from "../../../../../walkin-core/src/modules/common/utils/utils";
import { APPLICATION_METHOD } from "../../../../../walkin-rewardx/src/modules/common/constants/constant";
import Container from "typedi";
import { EventTypeRepository } from "../../../../../walkin-core/src/modules/eventFramework/eventType/eventType.repository";
import { LoyaltyProgramDetailRepository } from "../../loyalty-program-detail/loyalty-program-detail.repository";
import cron from "cron-validate";
import moment from "moment";

export function validateCronExpression(cronExpression: string) {
  const cronResult = cron(cronExpression);
  if (!cronResult.isValid()) {
    throw new WCoreError(WCORE_ERRORS.INVALID_CRON_EXPRESSION);
  }
  /**
    * To get value of cron expression
      const validValue = cronResult.getValue();
      console.log("validValue", validValue);
  */
  return {
    cronResult
  };
}

export async function validateAndGetCampaignInputs(
  transactionalEntityManager,
  injector,
  input
) {
  const name = input.name !== undefined ? input.name : null;
  const description =
    input.description !== undefined ? input.description : null;
  const campaignType =
    input.campaignType !== undefined ? input.campaignType : null;
  const priority = input.priority !== undefined ? input.priority : 0;
  const campaignTriggerType =
    input.campaignTriggerType !== undefined ? input.campaignTriggerType : null;
  const triggerRuleId =
    input.triggerRule !== undefined ? input.triggerRule : null;
  let triggerRule: any = null;
  let audienceFilterRule: any = null;
  let cronExpression = input.cronExpression;

  const isCampaignControlEnabled =
    input.isCampaignControlEnabled !== undefined
      ? input.isCampaignControlEnabled
      : false;
  const campaignControlPercent =
    input.campaignControlPercent !== undefined
      ? input.campaignControlPercent
      : 0;
  const isGlobalControlEnabled =
    input.isGlobalControlEnabled !== undefined
      ? input.isGlobalControlEnabled
      : true;
  let startTime = input.startTime !== undefined ? input.startTime : null;
  let endTime = input.endTime !== undefined ? input.endTime : null;
  const audienceFilterRuleId =
    input.audienceFilterRule !== undefined ? input.audienceFilterRule : null;
  const organizationId =
    input.organization_id !== undefined ? input.organization_id : null;
  let org = null;
  const applicationId =
    input.application_id !== undefined ? input.application_id : null;
  let app = null;
  const campaignStatus = input.campaignStatus ? input.campaignStatus : "ACTIVE";
  const loyaltyTotals = input.loyaltyTotals ? input.loyaltyTotals : {};
  const couponTotals = input.couponTotals ? input.couponTotals : {};
  const referralTotals = input.referralTotals ? input.referralTotals : {};
  const discountTotals = input.discountTotals ? input.discountTotals : {};
  const group = input.group;
  const extend = input.extend ? input.extend : {};
  const loyaltyProgramDetailId = input.loyaltyProgramDetailId;
  const applicationMethod = input.applicationMethod;
  const metaData = input.metaData;
  const eventTypeId = input.eventTypeId;
  const campaignScheduleName = input.campaignScheduleName;

  const allowedApplicationMethods = Object.values(APPLICATION_METHOD);
  if (!allowedApplicationMethods.includes(applicationMethod)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_APPLICATION_METHOD);
  }

  const allowedCampaignTypes = Object.values(CAMPAIGN_TYPE);
  if (!allowedCampaignTypes.includes(campaignType)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_CAMPAIGN_TYPE);
  }

  const allowedCampaignTriggerTypes = Object.values(CAMPAIGN_TRIGGER_TYPE);
  if (!allowedCampaignTriggerTypes.includes(campaignTriggerType)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_CAMPAIGN_TRIGGER_TYPE);
  }

  let eventType;
  if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.EVENT) {
    const relations = [];
    eventType = await Container.get(EventTypeRepository).getEventTypeById(
      transactionalEntityManager,
      eventTypeId,
      organizationId,
      relations
    );
    if (!eventType) {
      throw new WCoreError(WCORE_ERRORS.EVENT_TYPE_NOT_FOUND);
    }
  } else if (campaignTriggerType === CAMPAIGN_TRIGGER_TYPE.SCHEDULED) {
    if (!isValidString(cronExpression)) {
      throw new WCoreError(WCORE_ERRORS.CRON_EXPRESSION_MANDATORY);
    }

    const { cronResult } = validateCronExpression(cronExpression);

    if (!isValidString(campaignScheduleName)) {
      throw new WCoreError(WCORE_ERRORS.CAMPAIGN_SCHEDULE_NAME_MANDATORY);
    }

    const allowedCampaignScheduleName = Object.values(CAMPAIGN_SCHEDULE_NAME);
    if (!allowedCampaignScheduleName.includes(campaignScheduleName)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_CAMPAIGN_SCHEDULE_NAME);
    }
  }

  const allowedCampaignStatus = Object.values(CAMPAIGN_STATUS);
  if (!allowedCampaignStatus.includes(campaignStatus)) {
    throw new WCoreError(WCORE_ERRORS.INVALID_CAMPAIGN_STATUS);
  }

  if (campaignStatus === CAMPAIGN_STATUS.ENDED) {
    throw new WCoreError(WCORE_ERRORS.INVALID_CAMPAIGN_STATUS_WHILE_CREATING);
  }

  const validStartTime = isValidString(startTime);
  if (!validStartTime || !moment(startTime).isValid()) {
    throw new WCoreError(WCORE_ERRORS.INVALID_START_TIME);
  }

  const validEndTime = isValidString(endTime);
  if (!validEndTime || !moment(endTime).isValid()) {
    throw new WCoreError(WCORE_ERRORS.INVALID_END_TIME);
  }

  if (new Date(startTime) > new Date(endTime)) {
    throw new WalkinPlatformError(
      "END_TIME_SHOULD_BE_LATER_THAN_START_TIME",
      "End time should be greater than start time.",
      endTime,
      400,
      "End time should be greater than start time."
    );
  }
  org = await injector
    .get(Organizations)
    .getOrganizationById(transactionalEntityManager, input.organization_id);

  if (org !== undefined && org.status === STATUS.ACTIVE) {
    // pass
  } else {
    throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
  }

  if (loyaltyProgramDetailId) {
    const input = {
      detailId: loyaltyProgramDetailId,
      organizationId
    };

    await Container.get(
      LoyaltyProgramDetailRepository
    ).getLoyaltyProgramDetailById(transactionalEntityManager, injector, input);
  }

  if (applicationId) {
    app = await injector
      .get(ApplicationProvider)
      .getApplicationById(transactionalEntityManager, applicationId);
    if (app !== undefined) {
      // pass
    } else {
      throw new WalkinPlatformError(
        "APPLICATION_INVALID",
        "Not a valid Application",
        input.application_id,
        400,
        "Invalid application_id or application is inactive."
      );
    }
  }

  if (triggerRuleId == null) {
    // pass
  } else {
    triggerRule = await injector
      .get(RuleProvider)
      .rule(transactionalEntityManager, { id: triggerRuleId });
    if (triggerRule !== undefined && triggerRule.status === STATUS.ACTIVE) {
      // pass
      triggerRule = triggerRule.id;
    } else {
      throw new WalkinPlatformError(
        "RULE_INVALID",
        "Not a valid Rule",
        triggerRuleId,
        400,
        "Invalid triggerRuleId or Rule is inactive."
      );
    }
  }

  if (audienceFilterRuleId == null) {
    // pass
  } else {
    audienceFilterRule = await injector
      .get(RuleProvider)
      .rule(transactionalEntityManager, { id: audienceFilterRuleId });
    console.log(audienceFilterRule);
    if (
      audienceFilterRule !== undefined &&
      audienceFilterRule.status === STATUS.ACTIVE
    ) {
      audienceFilterRule = audienceFilterRule.id;
      // pass
    } else {
      throw new WalkinPlatformError(
        "RULE_INVALID",
        "Not a valid Rule",
        audienceFilterRuleId,
        400,
        "Invalid audienceFilterRuleId or Rule is inactive."
      );
    }
  }

  startTime = new Date(startTime);
  endTime = new Date(endTime);
  return {
    name,
    description,
    campaignType,
    priority,
    campaignStatus,
    campaignTriggerType,
    triggerRule,
    isCampaignControlEnabled,
    campaignControlPercent,
    isGlobalControlEnabled,
    startTime,
    endTime,
    audienceFilterRule,
    organization: org,
    application: app,
    applicationMethod,
    loyaltyTotals,
    couponTotals,
    referralTotals,
    discountTotals,
    group,
    extend,
    loyaltyProgramDetailId,
    metaData,
    eventType,
    cronExpression,
    campaignScheduleName
  };
}

export async function validateAndGetCampaignInputsForUpdate(
  entityManager,
  injector,
  input
) {
  const campaignDataToBeUpdated = {};
  const {
    name,
    description,
    group,
    campaignStatus,
    priority,
    startTime,
    endTime,
    applicationMethod,
    loyaltyProgramDetailId,
    organizationId,
    eventTypeId
  } = input;

  if (name) {
    campaignDataToBeUpdated["name"] = name;
  }

  if (description) {
    campaignDataToBeUpdated["description"] = description;
  }

  if (group) {
    campaignDataToBeUpdated["group"] = group;
  }

  if (campaignStatus) {
    const allowedCampaignStatus = Object.values(CAMPAIGN_STATUS);
    if (!allowedCampaignStatus.includes(campaignStatus)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_CAMPAIGN_STATUS);
    }
    campaignDataToBeUpdated["campaignStatus"] = campaignStatus;
  }

  if (startTime && endTime) {
    const validStartTime = isValidString(startTime);
    if (!validStartTime || !moment(startTime).isValid()) {
      throw new WCoreError(WCORE_ERRORS.INVALID_START_TIME);
    }

    const validEndTime = isValidString(endTime);
    if (!validEndTime || !moment(endTime).isValid()) {
      throw new WCoreError(WCORE_ERRORS.INVALID_END_TIME);
    }

    if (new Date(startTime) > new Date(endTime)) {
      throw new WalkinPlatformError(
        "END_TIME_SHOULD_BE_LATER_THAN_START_TIME",
        "End time should be greater than start time.",
        endTime,
        400,
        "End time should be greater than start time."
      );
    }
    campaignDataToBeUpdated["startTime"] = startTime;
    campaignDataToBeUpdated["endTime"] = endTime;
  }

  if (priority && typeof priority === "number") {
    campaignDataToBeUpdated["priority"] = priority;
  }

  if (applicationMethod) {
    const allowedApplicationMethods = Object.values(APPLICATION_METHOD);
    if (!allowedApplicationMethods.includes(applicationMethod)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_APPLICATION_METHOD);
    }
    campaignDataToBeUpdated["applicationMethod"] = applicationMethod;
  }

  if (loyaltyProgramDetailId) {
    const input = {
      detailId: loyaltyProgramDetailId,
      organizationId
    };
    await Container.get(
      LoyaltyProgramDetailRepository
    ).getLoyaltyProgramDetailById(entityManager, injector, input);
    campaignDataToBeUpdated["loyaltyProgramDetailId"] = loyaltyProgramDetailId;
  }

  if (eventTypeId) {
    campaignDataToBeUpdated["eventTypeId"] = eventTypeId;
  }
  return campaignDataToBeUpdated;
}
