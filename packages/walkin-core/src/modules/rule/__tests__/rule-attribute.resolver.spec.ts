import { ruleModule } from "../rule.module";
import {
  createUnitTestConnection,
  getAdminUser,
  closeUnitTestConnection
} from "../../../../__tests__/utils/unit";
import { getConnection } from "typeorm";
import * as CoreEntities from "../../../entity";
import { ruleAttributeResolvers } from "../resolvers/rule-attribute.resolver";

let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

describe("RuleAttribute Resolver", () => {
  test("Query - ruleAttributes", async () => {
    /* Steps to test rules resolver
          1. As part of org setup, basic rules attributes to be present
          2. Query Resolver to check if exists
        */

    const ruleAttributesBasicNewlyAdded = [
      "email",
      "phoneNumber",
      "externalCustomerId",
      "customerIdentifier"
    ];
    const ruleAttributesForExtendNewlyAdded = [
      "extend_recency",
      "extend_frequency",
      "extend_monetary"
    ];

    // Check for Customer

    const ruleAttributesForCustomer = await ruleAttributeResolvers.Query.ruleAttributes(
      { user },
      {
        input: { organizationId: user.organization.id, entityName: "Customer" }
      },
      { injector: ruleModule.injector }
    );

    for (const ruleAttribute of ruleAttributesForCustomer) {
      expect(ruleAttribute.organization.id).toBe(user.organization.id);
    }
    const ruleAttributesExtractedForCustomer = ruleAttributesForCustomer
      .filter(ruleAttribute => {
        if (
          ruleAttributesBasicNewlyAdded.indexOf(ruleAttribute.attributeName) >
          -1
        ) {
          return true;
        }
      })
      .map(ruleAttribute => ruleAttribute.attributeName);

    const ruleAttributesExtendExtractedForCustomer = ruleAttributesForCustomer
      .filter(ruleAttribute => {
        if (
          ruleAttributesForExtendNewlyAdded.indexOf(
            ruleAttribute.attributeName
          ) > -1
        ) {
          return true;
        }
      })
      .map(ruleAttribute => ruleAttribute.attributeName);

    expect(ruleAttributesBasicNewlyAdded).toMatchObject(
      ruleAttributesExtractedForCustomer
    );
    expect(ruleAttributesForExtendNewlyAdded).toMatchObject(
      ruleAttributesExtendExtractedForCustomer
    );

    // Check for CustomerSearch

    const ruleAttributesForCustomerSearch = await ruleAttributeResolvers.Query.ruleAttributes(
      { user },
      {
        input: {
          organizationId: user.organization.id,
          entityName: "CustomerSearch"
        }
      },
      { injector: ruleModule.injector }
    );

    for (const ruleAttribute of ruleAttributesForCustomerSearch) {
      expect(ruleAttribute.organization.id).toBe(user.organization.id);
    }
    const ruleAttributesExtractedForCustomerSearch = ruleAttributesForCustomerSearch
      .filter(ruleAttribute => {
        if (
          ruleAttributesBasicNewlyAdded.indexOf(ruleAttribute.attributeName) >
          -1
        ) {
          return true;
        }
      })
      .map(ruleAttribute => ruleAttribute.attributeName);

    const ruleAttributesExtendExtractedForCustomerSearch = ruleAttributesForCustomerSearch
      .filter(ruleAttribute => {
        if (
          ruleAttributesForExtendNewlyAdded.indexOf(
            ruleAttribute.attributeName
          ) > -1
        ) {
          return true;
        }
      })
      .map(ruleAttribute => ruleAttribute.attributeName);

    expect(ruleAttributesBasicNewlyAdded).toMatchObject(
      ruleAttributesExtractedForCustomerSearch
    );
    expect(ruleAttributesForExtendNewlyAdded).toMatchObject(
      ruleAttributesExtendExtractedForCustomerSearch
    );
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
