import { segmentModule } from "../segment.module";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { getConnection, getManager } from "typeorm";
import * as CoreEntities from "../../../entity";
import { Chance } from "chance";
import { resolvers } from "../segment.resolvers";
import { ApplicationProvider } from "../../account/application/application.providers";
import { SegmentProvider } from "../segment.providers";
import { RuleProvider } from "../../rule/providers";
import { ruleModule } from "../../rule/rule.module";
import { customerModule } from "../../customer/customer.module";
import { ApplicationModule } from "../../account/application/application.module";
import { RULE_TYPE, SEGMENT_TYPE, STATUS } from "../../common/constants";
import { CustomerProvider } from "../../customer/customer.providers";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";

let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const customerService: CustomerProvider = customerModule.injector.get(
  CustomerProvider
);
const segmentService: SegmentProvider = segmentModule.injector.get(
  SegmentProvider
);

const ruleService: RuleProvider = ruleModule.injector.get(RuleProvider);

const chance = new Chance();

describe("segment", () => {
  test("should check segment resolver", async () => {
    /* Steps to test segment resolver
      1. Create dummy segment with new app & rule
      2. Query Resolver with the newly created segment to check if exists
    */

    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );

    const rule = await ruleService.createRule(
      entityManager,
      ruleModule.injector,
      {
        organizationId: user.organization.id,
        name: chance.string({ length: 4 }),
        type: RULE_TYPE.SIMPLE,
        ruleConfiguration: {},
        ruleExpression: {}
      }
    );

    const segment = await segmentService.createSegment(
      entityManager,
      chance.string({ length: 5 }),
      chance.string({ length: 5 }),
      SEGMENT_TYPE.CUSTOM,
      user.organization,
      application,
      rule.id,
      STATUS.ACTIVE
    );

    const segmentFoundById = await resolvers.Query.segment(
      { user },
      { id: segment.id },
      { injector: segmentModule.injector }
    );
    //@ts-ignore
    expect(segmentFoundById.id).toBe(segment.id);
  });
});

describe("segments", () => {
  test.skip("should check segments resolver", async () => {
    /* Steps to test segment resolver
      1. Create 2 dummy segments with same app & rule but different names
      2. Query Resolver with the newly created segments to check if exists
    */
    const entityManager = getManager();
    const segementArrayLength = 2;
    let loop = 0;
    const segmentArray = [];
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );

    const rule = await ruleService.createRule(
      entityManager,
      ruleModule.injector,
      {
        organizationId: user.organization.id,
        name: chance.string({ length: 4 }),
        type: RULE_TYPE.SIMPLE,
        ruleConfiguration: {},
        ruleExpression: {}
      }
    );

    while (loop < segementArrayLength) {
      const segment = await segmentService.createSegment(
        entityManager,
        chance.string({ length: 5 }),
        chance.string({ length: 5 }),
        SEGMENT_TYPE.CUSTOM,
        user.organization,
        application,
        rule.id,
        STATUS.ACTIVE
      );
      //@ts-ignore
      segmentArray.push(segment);
      loop++;
    }

    const segmentsFound = await resolvers.Query.segments(
      { user },
      {
        organization_id: user.organization.id,
        application_id: application.id
      },
      { injector: segmentModule.injector }
    );

    for (const segment of segmentsFound.reverse()) {
      expect(segmentArray).toContainEqual(segment);
    }
  });
});

describe("createSegment", () => {
  test.skip("should check createSegment resolver", async () => {
    /* Steps to test segment resolver
      1. Create an app & rule but with different names
      2. Query Resolver with the newly created app & rule to check if it creates
    */
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );

    const rule = await ruleService.createRule(
      entityManager,
      ruleModule.injector,
      {
        organizationId: user.organization.id,
        name: chance.string({ length: 4 }),
        type: RULE_TYPE.SIMPLE,
        ruleConfiguration: {},
        ruleExpression: {}
      }
    );

    const segmentCreated: any = await resolvers.Mutation.createSegment(
      { user },
      {
        input: {
          name: chance.string({ length: 5 }),
          description: chance.string({ length: 5 }),
          segmentType: SEGMENT_TYPE.CUSTOM,
          organization_id: user.organization.id,
          application_id: application.id,
          rule_id: rule.id,
          status: STATUS.ACTIVE
        }
      },
      { injector: segmentModule.injector }
    );

    const segmentFoundById = await segmentService.getSegment(
      entityManager,
      segmentCreated.id
    );
    //@ts-ignore
    expect(segmentCreated.id).toBe(segmentFoundById.id);
  });
});

describe("updateSegment", () => {
  test.skip("should check updateSegment resolver", async () => {
    /* Steps to test segment resolver
      1. Create an app & rule but with different names
      2. Query Resolver with the newly created app & rule to check if it creates
    */
    const entityManager = getManager();
    const application = await applicationService.createApplication(
      entityManager,
      user.organization.id,
      {
        name: chance.string({ length: 5 })
      }
    );

    const rule = await ruleService.createRule(
      entityManager,
      ruleModule.injector,
      {
        organizationId: user.organization.id,
        name: chance.string({ length: 4 }),
        type: RULE_TYPE.SIMPLE,
        ruleConfiguration: {},
        ruleExpression: {}
      }
    );

    const segment = await segmentService.createSegment(
      entityManager,
      chance.string({ length: 5 }),
      chance.string({ length: 5 }),
      SEGMENT_TYPE.CUSTOM,
      user.organization,
      application,
      rule.id,
      STATUS.ACTIVE
    );

    const updateSegment: any = {
      id: segment.id,
      name: chance.string({ length: 5 }),
      description: chance.string({ length: 5 }),
      segmentType: segment.segmentType,
      rule_id: segment.rule.id,
      status: STATUS.INACTIVE
    };

    const segmentUpdated: any = await resolvers.Mutation.updateSegment(
      { user },
      {
        input: {
          name: updateSegment.name,
          description: updateSegment.description,
          segmentType: updateSegment.segmentType,
          organization_id: user.organization.id,
          rule_id: updateSegment.rule_id,
          status: updateSegment.status
        }
      },
      { injector: segmentModule.injector }
    );

    expect(segmentUpdated.id).toBe(segment.id);
    expect(segmentUpdated.name).toBe(updateSegment.name);
    expect(segmentUpdated.description).toBe(updateSegment.description);
    expect(segmentUpdated.status).toBe(updateSegment.status);
    expect(segmentUpdated.segmentType).toBe(updateSegment.segmentType);
    expect(segmentUpdated.rule.id).toBe(updateSegment.rule.id);
  });
});

describe("createSegmentForCustomers", () => {
  test("should check createSegmentForCustomers resolver - Pass", async () => {
    /* Steps to test segment resolver
      1. Create customer
      2. Give a phoneNumber of the created customer which is present
    */
    const entityManager = getManager();
    let personId;
    const { person } = await customerService.createPerson(entityManager, {
      firstName: "Test",
      phoneNumber: `+91${chance.phone({ formatted: false })}`
    });

    if (person) {
      personId = person.id;
    }

    const customerInput: any = {
      firstName: chance.string({ length: 5 }),
      lastName: chance.string({ length: 5 }),
      email: `${chance.string({ length: 6 })}@${chance.string({ length: 3 })}`,
      phoneNumber: person.phoneNumber,
      gender: "Female",
      dateOfBirth: chance.string({ length: 5 }),
      organization: user.organization.id,
      personId
    };
    customerInput.customerIdentifier = customerInput.phoneNumber;
    customerInput.externalCustomerId = customerInput.phoneNumber;

    const createCustomer: any = await customerService.createOrUpdateCustomer(
      entityManager,
      customerInput
    );
    const segmentCreated: any = await resolvers.Mutation.createSegmentForCustomers(
      { user },
      {
        customerPhoneNumbers: [createCustomer.phoneNumber]
      },
      { injector: segmentModule.injector }
    );

    expect(segmentCreated.id).toBeDefined();
    expect(segmentCreated.rule).toBeDefined();
    expect(segmentCreated.rule.ruleConfiguration.rules[0].attributeName).toBe(
      "customer_tags"
    );
    expect(segmentCreated.rule.ruleConfiguration.rules[0].expressionType).toBe(
      "IN"
    );
  });

  test("should check createSegmentForCustomers resolver - Fail", async () => {
    /* Steps to test segment resolver
      1. Give a phoneNumber of the created customer which is not present
    */

    try {
      const segmentCreated: any = await resolvers.Mutation.createSegmentForCustomers(
        { user },
        {
          customerPhoneNumbers: ["000000000"]
        },
        { injector: segmentModule.injector }
      );
    } catch (error) {
      expect(error).toBeInstanceOf(WCoreError);
      expect(error).toMatchObject(
        new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND)
      );
    }
    expect.assertions(2);
  });
});
afterAll(async () => {
  await closeUnitTestConnection();
});
