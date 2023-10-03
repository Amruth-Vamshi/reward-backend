// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { RuleAttributeProvider } from "../providers/rule-attribute.provider";
import { ruleModule } from "../rule.module";
import * as CoreEntities from "../../../entity";
import Chance from "chance";

import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { STATUS, RULE_TYPE } from "../../common/constants";
let user: CoreEntities.User;
let customerForCustomerDeviceTests: CoreEntities.Organization;
var chance = new Chance();

jest.mock("i18n");

let ruleAttributeInput = {
  attributeName: "Unit Test rule",
  attributeValueType: "Unit test rule description.",
  status: STATUS.ACTIVE,
  organizationId: 1,
  description: "Rule attribute description.",
  ruleEntityId: 1
};

let ruleAttributeInputs2 = {
  attributeName: "Unit Test rule update",
  attributeValueType: "Unit test rule description update.",
  description: "Rule attribute description.",
  status: STATUS.INACTIVE,
  organizationId: 1,
  ruleEntityId: 1
};

const ruleAtrributeService: RuleAttributeProvider = ruleModule.injector.get(
  RuleAttributeProvider
);

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
});

describe("Testing the rule Attribute Creation and Updation:-", () => {
  test("should throw error when organization with the given organizationId is not available", async () => {
    const manager = getManager();
    let ruleAttribute = ruleAtrributeService.createRuleAttribute(manager, {
      ...ruleAttributeInput,
      organizationId: 20
    });
    await expect(ruleAttribute).rejects.toThrowError(
      "Invalid OrganizationId provided."
    );
  });

  test("should throw error when rule entity with the given entityId is not available", async () => {
    const manager = getManager();
    let ruleAttribute = ruleAtrributeService.createRuleAttribute(manager, {
      ...ruleAttributeInput,
      ruleEntityId: 1000
    });
    await expect(ruleAttribute).rejects.toThrowError(
      "Invalid OrganizationId provided."
    );
  });

  test("should createRuleEntity given correct inputs", async () => {
    const manager = getManager();
    const ruleAttribute = await ruleAtrributeService.createRuleAttribute(
      manager,
      {
        ...ruleAttributeInput,
        organizationId: user.organization.id
      }
    );
    // console.log("rule is:-", rule);
    expect(ruleAttribute).toBeTruthy();
    expect(ruleAttribute.attributeName).toBe(ruleAttributeInput.attributeName);
    expect(ruleAttribute.attributeValueType).toBe(
      ruleAttributeInput.attributeValueType
    );
    expect(ruleAttribute.status).toBe(ruleAttributeInput.status);
    expect(ruleAttribute.organization.id).toBe(user.organization.id);
    expect(ruleAttribute.ruleEntity.id).toBe(ruleAttributeInput.ruleEntityId);
  });

  test("disable a rule attribute", async () => {
    let ruleAttributeInputDisable = {
      attributeName: "Unit Test rule to disable",
      attributeValueType: "Unit test rule description.",
      status: STATUS.ACTIVE,
      organizationId: 1,
      description: "Rule attribute description.",
      ruleEntityId: 1
    };

    const manager = getManager();
    const ruleAttribute = await ruleAtrributeService.createRuleAttribute(
      manager,
      {
        ...ruleAttributeInputDisable,
        organizationId: user.organization.id
      }
    );
    // console.log("rule is:-", rule);
    expect(ruleAttribute).toBeTruthy();
    expect(ruleAttribute.attributeName).toBe(
      ruleAttributeInputDisable.attributeName
    );
    expect(ruleAttribute.attributeValueType).toBe(
      ruleAttributeInputDisable.attributeValueType
    );
    expect(ruleAttribute.status).toBe(ruleAttributeInputDisable.status);
    expect(ruleAttribute.organization.id).toBe(user.organization.id);
    expect(ruleAttribute.ruleEntity.id).toBe(
      ruleAttributeInputDisable.ruleEntityId
    );

    const updatedRuleAttribute = await ruleAtrributeService.disableRuleAttribute(
      manager,
      ruleAttribute.id
    );

    expect(updatedRuleAttribute.attributeName).toBe(
      ruleAttribute.attributeName
    );
    expect(updatedRuleAttribute.id).toBe(ruleAttribute.id);
    expect(updatedRuleAttribute.status).toBe(STATUS.INACTIVE);
  });

  test("should throw error when updating the rule attribute with the given id is not available", async () => {
    const manager = getManager();
    const updatedRule = ruleAtrributeService.disableRuleAttribute(
      manager,
      "19867857547686"
    );
    await expect(updatedRule).rejects.toThrowError();
  });

  test("Trying to read the rule Attribute", async () => {
    const manager = getManager();
    let rule = await ruleAtrributeService.ruleAttribute(manager, "20");
    expect(rule).toBeTruthy();
  });

  test("Should fail when there is no ruleAttribute of specified for a given id:-", async () => {
    const manager = getManager();
    let rule = await ruleAtrributeService.ruleAttribute(
      manager,
      "20001092809876"
    );
    await expect(rule).toBeUndefined();
  });

  test("Trying to read all the rule Attributes for given search:-", async () => {
    const manager = getManager();
    let rule = await ruleAtrributeService.ruleAttributes(manager, {
      attributeName: ruleAttributeInput.attributeName
    });
    expect(rule).toBeTruthy();
  });

  test("Should fail when there are no rule entities of specified for a given search criteria:-", async () => {
    const manager = getManager();
    let rules = await ruleAtrributeService.ruleAttributes(manager, {
      organization: "dtyfugjb6785787"
    });
    await expect(rules.length).toBe(0);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
