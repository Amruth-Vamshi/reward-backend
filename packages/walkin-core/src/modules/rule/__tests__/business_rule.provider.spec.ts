// import { getConnection } from "typeorm";

import { getManager, getConnection } from "typeorm";
import { BusinessRuleProvider } from "../providers/business_rule.provider";
import { ruleModule } from "../rule.module";
import * as CoreEntities from "../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { BUSINESS_RULE_LEVELS } from "../../common/constants/constants";
let user: CoreEntities.User;
const chance = new Chance();

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const businessRuleProvider: BusinessRuleProvider = ruleModule.injector.get(
  BusinessRuleProvider
);

describe("BusinessRule provider tests", () => {
  const businessRuleInput: any = {
    ruleLevel: BUSINESS_RULE_LEVELS.ORGANIZATION,
    ruleType: "RULE1",
    ruleDefaultValue: chance.string({ length: 5 })
  };

  const businessRuleInput2: any = {
    ruleLevel: BUSINESS_RULE_LEVELS.ORGANIZATION,
    ruleType: "RULE2",
    ruleDefaultValue: chance.string({ length: 5 })
  };

  const businessRuleDetailInput: any = {
    ruleLevel: BUSINESS_RULE_LEVELS.ORGANIZATION,
    ruleType: "RULE1",
    ruleValue: chance.string({ length: 5 })
  };

  const businessRuleDetailInput2: any = {
    ruleLevel: BUSINESS_RULE_LEVELS.APPLICATION,
    ruleType: "RULE2",
    ruleValue: chance.string({ length: 5 })
  };
  test("Create Business Rule ", async () => {
    const manager = getManager();
    const businessRule: any = await businessRuleProvider.createBusinessRule(
      manager,
      businessRuleInput
    );

    expect(businessRule).toBeDefined();
    expect(businessRule.ruleLevel).toEqual(businessRuleInput.ruleLevel);
    expect(businessRule.ruleType).toEqual(businessRuleInput.ruleType);

    const businessRuleById = await businessRuleProvider.getRule(
      manager,
      businessRule.id
    );
    expect(businessRuleById).toBeDefined();
  });

  test("Update Business Rule ", async () => {
    const manager = getManager();
    const businessRule: any = await businessRuleProvider.createBusinessRule(
      manager,
      businessRuleInput2
    );

    expect(businessRule).toBeDefined();
    expect(businessRule.ruleLevel).toEqual(businessRuleInput2.ruleLevel);
    expect(businessRule.ruleType).toEqual(businessRuleInput2.ruleType);

    const businessRuleById = await businessRuleProvider.getRule(
      manager,
      businessRule.id
    );
    expect(businessRuleById).toBeDefined();

    businessRuleInput2.ruleLevel = BUSINESS_RULE_LEVELS.APPLICATION;
    let updatedRule = await businessRuleProvider.updateBusinessRule(
      manager,
      businessRule.id,
      businessRuleInput2
    );

    expect(updatedRule).toBeDefined();
    expect(updatedRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.APPLICATION);
  });

  test("createBusinessRuleDetail ", async () => {
    const manager = getManager();
    const businesRuleDetail = await businessRuleProvider.createBusinessRuleDetail(
      manager,
      {
        ...businessRuleDetailInput,
        ruleLevelId: user.organization.id,
        organization: user.organization.id
      }
    );
    expect(businesRuleDetail).toBeDefined();

    let businessRuleDetailById = await businessRuleProvider.getRuleDetail(
      manager,
      businesRuleDetail.id
    );

    expect(businessRuleDetailById).toBeDefined();
    expect(businessRuleDetailById.ruleLevel).toEqual(
      BUSINESS_RULE_LEVELS.ORGANIZATION
    );
    expect(businessRuleDetailById.organizationId).toEqual(user.organization.id);
  });

  test("updateBusinessRuleDetail ", async () => {
    const manager = getManager();
    const businesRuleDetail = await businessRuleProvider.createBusinessRuleDetail(
      manager,
      {
        ...businessRuleDetailInput2,
        ruleLevelId: user.organization.id,
        organization: user.organization.id
      }
    );
    expect(businesRuleDetail).toBeDefined();

    let businessRuleDetailById = await businessRuleProvider.getRuleDetail(
      manager,
      businesRuleDetail.id
    );

    expect(businessRuleDetailById).toBeDefined();
    expect(businessRuleDetailById.ruleLevel).toEqual(
      BUSINESS_RULE_LEVELS.APPLICATION
    );
    expect(businessRuleDetailById.organizationId).toEqual(user.organization.id);

    businesRuleDetail.ruleLevel = BUSINESS_RULE_LEVELS.STORE;
    let updatedBusinessRuleDetail = await businessRuleProvider.updateBusinessRuleDetail(
      manager,
      businesRuleDetail.id,
      businesRuleDetail
    );

    expect(updatedBusinessRuleDetail).toBeDefined();
    expect(updatedBusinessRuleDetail.ruleLevel).toEqual(
      BUSINESS_RULE_LEVELS.STORE
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
