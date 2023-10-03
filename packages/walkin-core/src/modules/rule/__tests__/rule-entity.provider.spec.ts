// import { getConnection } from "typeorm";

import { getManager, getConnection, EntityManager } from "typeorm";
import { RuleEntityProvider } from "../providers/rule-entity.provider";
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
const chance = new Chance();

jest.mock("i18n");

const ruleEntityInput = {
  entityName: "Unit Test rule",
  entityCode: "Unit test rule description.",
  status: STATUS.ACTIVE,
  organizationId: 1
};

const ruleInputs2 = {
  entityName: "Unit Test rule update",
  entityCode: "Unit test rule description update.",
  status: STATUS.INACTIVE,
  organizationId: 1
};

const ruleEntityService: RuleEntityProvider = ruleModule.injector.get(
  RuleEntityProvider
);

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
  const manager = getManager();
});

describe("Rule Entity Provider", () => {
  test("createRuleEntity - Should throw error when rule with the given organizationId is not available", async () => {
    const manager = getManager();
    const rulePromise = ruleEntityService.createRuleEntity(manager, {
      ...ruleEntityInput,
      organizationId: 20
    });
    await expect(rulePromise).rejects.toThrowError(
      "Invalid OrganizationId provided."
    );
  });

  test("createRuleEntity - should createRuleEntity given correct inputs and be able to disableRuleEntity", async () => {
    const manager = getManager();
    const ruleEntity = await ruleEntityService.createRuleEntity(manager, {
      ...ruleEntityInput,
      organizationId: user.organization.id
    });
    // console.log("rule is:-", rule);
    expect(ruleEntity).toBeTruthy();
    expect(ruleEntity.entityName).toBe(ruleEntityInput.entityName);
    expect(ruleEntity.entityCode).toBe(ruleEntityInput.entityCode);
    expect(ruleEntity.status).toBe(ruleEntityInput.status);
    expect(ruleEntity.organization.id).toBe(user.organization.id);

    const gotRuleEntity = await ruleEntityService.ruleEntity(
      manager,
      ruleEntity.id
    );
    expect(gotRuleEntity).toBeDefined();
    expect(gotRuleEntity.id).toBe(ruleEntity.id);

    const updatedRule = await ruleEntityService.disableRuleEntity(
      manager,
      ruleEntity.id
    );
    expect(updatedRule).toBeDefined();
    expect(updatedRule.entityName).toBe(ruleEntityInput.entityName);
    expect(updatedRule.entityCode).toBe(ruleEntityInput.entityCode);
    expect(updatedRule.status).toBe(STATUS.INACTIVE);
    expect(updatedRule.organization.id).toBe(user.organization.id);
  });

  test("disableRuleEntity -Should throw error when updating the rule entity with the given id is not available", async () => {
    const manager = getManager();
    const updatedRule = ruleEntityService.disableRuleEntity(manager, "100");
    await expect(updatedRule).rejects.toThrowError("ruleEntity not found");
  });

  test("disableRuleEntity - Trying to read all the rule entities for given search:-", async () => {
    const manager = getManager();
    const ruleEntities = await ruleEntityService.ruleEntities(manager, {
      entityName: ruleEntityInput.entityName
    });
    expect(ruleEntities).toBeDefined();
    for (const ruleEntity of ruleEntities) {
      expect(ruleEntity.entityName).toBe(ruleEntityInput.entityName);
    }
  });

  test("ruleEntities - Should default load ruleAttributes", async () => {
    const manager = getManager();
    const ruleEntities = await ruleEntityService.ruleEntities(manager, {
      organizationId: user.organization.id
    });

    expect(ruleEntities).toBeDefined();
    for (const ruleEntity of ruleEntities) {
      expect(ruleEntity.ruleAttributes).toBeDefined();
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
