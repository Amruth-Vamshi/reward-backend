import { ruleModule } from "../rule.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { getConnection } from "typeorm";
import * as CoreEntities from "../../../entity";
import { Chance } from "chance";
import { ruleResolvers } from "../resolvers/rule.resolver";
import { ruleEntityResolvers } from "../resolvers/rule-entity.resolver";
import { RuleProvider } from "../providers/rule.provider";
import { STATUS } from "../../common/constants";
import { RULE_TYPE, EXPRESSION_TYPE } from "../../common/constants/constants";
import { BASIC_RULE_ENTITY_DATA } from "../../common/constants/orgLevelSeedData";
import { Status, Rule_Type } from "../../../graphql/generated-models";

let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const ruleProvider: RuleProvider = ruleModule.injector.get(RuleProvider);

const chance = new Chance();

describe("Rule Resolver", () => {
  test("Query - rules ", async () => {
    /* Steps to test rules resolver
          1. As part of org setup, basic rules needs to be present
          2. Query Resolver to check if exists
        */

    const rules = await ruleResolvers.Query.rules(
      { user },
      {
        input: { status: STATUS.ACTIVE, organizationId: user.organization.id }
      },
      { injector: ruleModule.injector }
    );

    for (const rule of rules) {
      expect(rule.organization.id).toBe(user.organization.id);
    }
  });

  test("Mutation Create Rule", async () => {
    /* Steps to test rules resolver
          1. Frame a dummy rule
          2. Mutate Resolver to check if created per expected
        */

    const ruleInput = {
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      status: STATUS.ACTIVE,
      type: RULE_TYPE.SIMPLE,
      ruleConfiguration: {
        rules: [
          {
            attributeName: "gender",
            attributeValue: "female",
            expressionType: EXPRESSION_TYPE.EQUALS
          }
        ],
        combinator: "and"
      }
    };

    const createdRule = await ruleResolvers.Mutation.createRule(
      { user },
      {
        input: {
          name: ruleInput.name,
          description: ruleInput.description,
          status: Status[ruleInput.status],
          type: Rule_Type[ruleInput.type],
          ruleConfiguration: ruleInput.ruleConfiguration,
          organizationId: user.organization.id
        }
      },
      { injector: ruleModule.injector }
    );

    const rule = await ruleResolvers.Query.rule(
      { user },
      { id: createdRule.id },
      { injector: ruleModule.injector }
    );

    expect(createdRule.id).toBe(rule.id);
    expect(createdRule.organization.id).toBe(user.organization.id);
    expect(createdRule.ruleConfiguration).toMatchObject(rule.ruleConfiguration);
    expect(createdRule.ruleConfiguration.rules[0].expressionType).toBe(
      ruleInput.ruleConfiguration.rules[0].expressionType
    );
    expect(createdRule.ruleConfiguration.rules[0].attributeName).toBe(
      ruleInput.ruleConfiguration.rules[0].attributeName
    );
  });

  test("Query - ruleEntities", async () => {
    /* Steps to test rules resolver
          1. As part of org setup, basic rules entities to be present
          2. Query Resolver to check if exists
        */

    const ruleEntities = await ruleEntityResolvers.Query.ruleEntities(
      { user },
      { input: { organizationId: user.organization.id } },
      { injector: ruleModule.injector }
    );

    for (const ruleEntity of ruleEntities) {
      expect(ruleEntity.organization.id).toBe(user.organization.id);
    }
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
