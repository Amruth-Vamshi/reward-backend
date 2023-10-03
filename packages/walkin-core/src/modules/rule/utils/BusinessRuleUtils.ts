import { BusinessRule, BusinessRuleDetail } from "../../../entity";

export async function getBusinessRuleConfiguration(
  ruleLevel: string,
  ruleType: string,
  organizationId: string
): Promise<any> {
  const businessRule = await BusinessRule.findOne({
    where: {
      ruleLevel,
      ruleType
    },
    select: ["id", "ruleLevel", "ruleType", "ruleDefaultValue"]
  });
  if (!businessRule) {
    throw new Error(
      `Business rule with ${ruleLevel} and ${ruleType} does not exists.`
    );
  }

  const businessRuleDetail = await BusinessRuleDetail.findOne({
    where: {
      ruleLevel,
      ruleLevelId: businessRule.id,
      ruleType,
      organizationId
    },
    select: ["id", "ruleLevel", "ruleLevelId", "ruleType", "ruleValue"]
  });
  if (!businessRuleDetail) {
    return businessRule.ruleDefaultValue;
  } else {
    return businessRuleDetail.ruleValue;
  }
}

export async function getBusinessRuleDetailValues(
  businessRules: [BusinessRule],
  organizationId: string
): Promise<object> {
  for (let index in businessRules) {
    businessRules[index].ruleDefaultValue = await getBusinessRuleConfiguration(
      businessRules[index].ruleLevel,
      businessRules[index].ruleType,
      organizationId
    );
  }
  return businessRules;
}
