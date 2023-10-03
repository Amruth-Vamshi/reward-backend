import { businessRuleResolvers } from "../resolvers/business_rule.resolver";
import { RULE_TYPE, EXPRESSION_TYPE } from "../../common/constants/constants";

import { getManager, getConnection } from "typeorm";
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

describe("BusinessRule Resolvers tests", () => {
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
    const businessRule: any = await businessRuleResolvers.Mutation.createBusinessRule(
      {},
      { input: businessRuleInput },
      { injector: ruleModule.injector }
    );

    expect(businessRule).toBeDefined();
    expect(businessRule.ruleLevel).toEqual(businessRuleInput.ruleLevel);
    expect(businessRule.ruleType).toEqual(businessRuleInput.ruleType);

    const businessRuleById = await businessRuleResolvers.Query.businessRule(
      {},
      { id: businessRule.id },
      { injector: ruleModule.injector }
    );
    expect(businessRuleById).toBeDefined();
  });

  test("Update Business Rule ", async () => {
    const manager = getManager();
    const businessRule: any = await businessRuleResolvers.Mutation.createBusinessRule(
      {},
      { input: businessRuleInput2 },
      { injector: ruleModule.injector }
    );

    expect(businessRule).toBeDefined();
    expect(businessRule.ruleLevel).toEqual(businessRuleInput2.ruleLevel);
    expect(businessRule.ruleType).toEqual(businessRuleInput2.ruleType);

    const businessRuleById = await businessRuleResolvers.Query.businessRule(
      {},
      { id: businessRule.id },
      { injector: ruleModule.injector }
    );
    expect(businessRuleById).toBeDefined();

    businessRuleInput2.ruleLevel = BUSINESS_RULE_LEVELS.APPLICATION;
    let updatedRule = await businessRuleResolvers.Mutation.updateBusinessRule(
      {},
      { id: businessRule.id, input: businessRuleInput2 },
      { injector: ruleModule.injector }
    );

    expect(updatedRule).toBeDefined();
    expect(updatedRule.ruleLevel).toEqual(BUSINESS_RULE_LEVELS.APPLICATION);
  });

  test("createBusinessRuleDetail ", async () => {
    const manager = getManager();
    const businesRuleDetail = await businessRuleResolvers.Mutation.createBusinessRuleDetail(
      {},
      {
        input: {
          ...businessRuleDetailInput,
          ruleLevelId: user.organization.id,
          organization: user.organization.id
        }
      },
      { injector: ruleModule.injector }
    );
    expect(businesRuleDetail).toBeDefined();

    let businessRuleDetailById = await businessRuleResolvers.Query.businessRuleDetail(
      {},
      { id: businesRuleDetail.id },
      { injector: ruleModule.injector }
    );

    expect(businessRuleDetailById).toBeDefined();
    expect(businessRuleDetailById.ruleLevel).toEqual(
      BUSINESS_RULE_LEVELS.ORGANIZATION
    );
    expect(businessRuleDetailById.organizationId).toEqual(user.organization.id);
  });

  test("updateBusinessRuleDetail ", async () => {
    const manager = getManager();
    const businesRuleDetail = await businessRuleResolvers.Mutation.createBusinessRuleDetail(
      {},
      {
        input: {
          ...businessRuleDetailInput2,
          ruleLevelId: user.organization.id,
          organization: user.organization.id
        }
      },
      { injector: ruleModule.injector }
    );
    expect(businesRuleDetail).toBeDefined();

    let businessRuleDetailById = await businessRuleResolvers.Query.businessRuleDetail(
      {},
      { id: businesRuleDetail.id },
      { injector: ruleModule.injector }
    );

    expect(businessRuleDetailById).toBeDefined();
    expect(businessRuleDetailById.ruleLevel).toEqual(
      BUSINESS_RULE_LEVELS.APPLICATION
    );
    expect(businessRuleDetailById.organizationId).toEqual(user.organization.id);

    businesRuleDetail.ruleLevel = BUSINESS_RULE_LEVELS.STORE;
    let updatedBusinessRuleDetail = await businessRuleResolvers.Mutation.updateBusinessRuleDetail(
      manager,
      { id: businesRuleDetail.id, input: businesRuleDetail },
      { injector: ruleModule.injector }
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
