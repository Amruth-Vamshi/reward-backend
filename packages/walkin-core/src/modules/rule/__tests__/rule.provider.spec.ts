// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { RuleProvider } from "../providers/rule.provider";
import { ruleModule } from "../rule.module";
import * as CoreEntities from "../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { STATUS, RULE_TYPE } from "../../common/constants";
import { EXPRESSION_TYPE } from "../../common/constants/constants";
let user: CoreEntities.User;
const chance = new Chance();
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { addTypenameToDocument } from "apollo-utilities";

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const ruleService: RuleProvider = ruleModule.injector.get(RuleProvider);

describe("Rule provider", () => {
  const ruleInput = {
    name: chance.string({ length: 5 }),
    description: chance.string({ length: 3 }),
    status: STATUS.ACTIVE,
    type: RULE_TYPE.SIMPLE,
    ruleConfiguration: {
      name: chance.string({ length: 3 }),
      description: chance.string({ length: 3 })
    },
    ruleExpression: EXPRESSION_TYPE.EQUALS
  };

  const ruleInputs2 = {
    name: chance.string({ length: 5 }),
    description: chance.string({ length: 3 }),
    type: RULE_TYPE.CUSTOM,
    ruleConfiguration: {
      name: chance.string({ length: 3 }),
      description: chance.string({ length: 3 })
    },
    ruleExpression: EXPRESSION_TYPE.NOT_EQUALS
  };

  test("CreateRule and updateRule", async () => {
    const manager = getManager();
    const rule = await ruleService.createRule(manager, ruleModule.injector, {
      ...ruleInput,
      organizationId: user.organization.id
    });
    expect(rule).toBeTruthy();
    expect(rule.name).toBe(ruleInput.name);
    expect(rule.description).toBe(ruleInput.description);
    expect(rule.status).toBe(ruleInput.status);
    expect(rule.type).toBe(ruleInput.type);
    expect(rule.ruleConfiguration).toBe(ruleInput.ruleConfiguration);
    // expect(rule.ruleExpression).toBe(ruleInput.ruleExpression);
    expect(rule.organization.id).toBe(user.organization.id);

    const rulesFromId = await ruleService.rule(manager, rule.id);
    expect(rule).toBeTruthy();

    const updatedRule = await ruleService.updateRule(manager, rule.id, {
      ...ruleInputs2
    });
    expect(updatedRule).toBeTruthy();
    expect(updatedRule).toBeTruthy();
    expect(updatedRule.name).toBe(ruleInputs2.name);
    expect(updatedRule.description).toBe(ruleInputs2.description);
    expect(updatedRule.type).toBe(ruleInputs2.type);
    //for RULE_TYPE.CUSTOM ruleConfiguration will be forced set to ""
    //only ruleExpression is required.
    expect(updatedRule.ruleConfiguration).toBe("");
    expect(JSON.stringify(updatedRule.ruleExpression)).toBe(
      JSON.stringify({ expressions: ["NOT_EQUALS"] })
    );
  });

  test("createRule -  When organizationId is not available", async () => {
    const manager = getManager();
    const customerPromise = ruleService.createRule(
      manager,
      ruleModule.injector,
      {
        ...ruleInput,
        organizationId: "987689"
      }
    );
    await expect(customerPromise).rejects.toThrowError();
  });

  test("createRule -  Create a custom rule", async () => {
    const manager = getManager();
    const ruleInputComplexRule = {
      name: "CUSTOM_RULE_1",
      description: "CUSTOM_RULE_DESCRIPTION_1",
      status: STATUS.ACTIVE,
      type: RULE_TYPE.CUSTOM,
      ruleExpression: 'Customer.Gender == "Male" && Customer.last == "Pam"'
    };

    const rule = await ruleService.createRule(manager, ruleModule.injector, {
      ...ruleInputComplexRule,
      organizationId: user.organization.id
    });
    expect(rule).toBeTruthy();
    expect(rule.name).toBe(ruleInputComplexRule.name);
    expect(rule.description).toBe(ruleInputComplexRule.description);
    expect(rule.status).toBe(ruleInputComplexRule.status);
    expect(rule.type).toBe(ruleInputComplexRule.type);
    expect(rule.ruleExpression).toStrictEqual({
      expressions: ['Customer.Gender == "Male" && Customer.last == "Pam"']
    });
    expect(rule.organization.id).toBe(user.organization.id);
  });

  test.skip("should throw error when there is not rule availbale with the given name", async () => {
    const manager = getManager();
    const customerPromise = ruleService.createRule(
      manager,
      ruleModule.injector,
      {
        ...ruleInput,
        ruleConfiguration: {
          ...ruleInput.ruleConfiguration,
          name: chance.string({ length: 5 })
        }
      }
    );
    await expect(customerPromise).rejects.toThrowError();
  });

  test("updateRule - should throw an error when updating the rule with the given id is not available", async () => {
    const manager = getManager();
    const updatedRule = ruleService.updateRule(manager, "20", {
      ...ruleInputs2
    });
    await expect(updatedRule).rejects.toThrowError("Invalid ruleId provided.");
  });

  test("rule - Should fail when there is no rule with given ruleId", async () => {
    const manager = getManager();
    let id = chance.string({ length: 6 });
    const rule = ruleService.rule(manager, id);
    await expect(rule).rejects.toThrowError(
      `Could not find any entity of type "Rule" matching: "` + id + `"`
    );
  });

  test("rules - Get rules for a good search criteria", async () => {
    const entityManager = getManager();
    const rules = await ruleService.rules(
      entityManager,
      STATUS.ACTIVE,
      user.organization.id
    );
    expect(rules).toBeDefined();
    expect(rules.length).toBeGreaterThan(0);
    for (let rule of rules) {
      expect(rule.status).toBe(STATUS.ACTIVE);
      expect(rule.organization.id).toBe(user.organization.id);
    }
  });

  test("rules - Get rules for an invalid search criteria", async () => {
    const entityManager = getManager();
    //send wrong organizationId
    const rules = await ruleService.rules(
      entityManager,
      STATUS.ACTIVE,
      "6e8 762e87  628e"
    );
    expect(rules).toBeDefined();
    expect(rules.length).toBe(0);
  });

  test("evaluateRule - Trying to evaluate all the rules for given input", async () => {
    const manager = getManager();

    const validRule = {
      name: "EVALUATE_A_CUSTOM_RULE_1",
      description: "Evaluate a custom rule",
      type: RULE_TYPE.CUSTOM,
      ruleExpression:
        "( Customer['Gender'] == 'Male'  &&  Customer['Format'] == 'Square'  && Customer['Total'] > 100)"
    };

    const customerRule = await ruleService.createRule(
      manager,
      ruleModule.injector,
      {
        ...validRule,
        organizationId: user.organization.id
      }
    );

    const evaluateRuleInput = {
      ruleName: "EVALUATE_A_CUSTOM_RULE_1",
      data: {
        Customer: {
          Gender: "Male",
          Format: "Square",
          Total: 1001
        }
      }
    };
    const rule = await ruleService.evaluateRule(manager, {
      ...evaluateRuleInput,
      organizationId: user.organization.id
    });

    expect(rule.evaluationResult).toBe(true);
  });

  test("evaluateRule - Evaluate rule throw exception when the rule name is wrong", async () => {
    const manager = getManager();
    const evaluateRuleInput = {
      ruleName: chance.string({ length: 4 }),
      data: {
        name: chance.string({ length: 4 }),
        product: {
          name: "sample",
          price: 50
        }
      }
    };

    try {
      const rule = await ruleService.evaluateRule(manager, {
        ...evaluateRuleInput,
        organizationId: user.organization.id
      });
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundError);
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
