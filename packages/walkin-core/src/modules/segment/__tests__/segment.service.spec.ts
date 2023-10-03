// import { getConnection } from "typeorm";
import * as CoreEntities from "../../../entity";
import {
  createUnitTestConnection,
  closeUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { ApplicationModule } from "../../account/application/application.module";
import { getManager, getConnection, EntityManager } from "typeorm";
import { ApplicationProvider } from "../../account/application/application.providers";
import { Chance } from "chance";
import { segmentModule } from "../segment.module";
import { ruleModule } from "../../rule/rule.module";
import { SegmentProvider } from "../segment.providers";
import { RuleProvider } from "../../rule/providers/rule.provider";
import {
  RULE_TYPE,
  SEGMENT_TYPE,
  STATUS
} from "../../common/constants/constants";
let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});
const applicationService: ApplicationProvider = ApplicationModule.injector.get(
  ApplicationProvider
);
const segmentService: SegmentProvider = segmentModule.injector.get(
  SegmentProvider
);

const ruleService: RuleProvider = ruleModule.injector.get(RuleProvider);

const chance = new Chance();

describe("getSegment", () => {
  test("should get getSegment ", async () => {
    /* Test getSegment by creating a segment,rule & application
       1. CREATE APPLICATION
       2. CREATE RULE
       3. CREATE SEGMENT
       4. GET SEGMENT
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

    const segmentFoundById = await segmentService.getSegment(
      entityManager,
      segment.id
    );
    //@ts-ignore
    expect(segmentFoundById.id).toBe(segment.id);
  });
});

describe("getSegments", () => {
  test("should get getSegments ", async () => {
    /* Test getSegments by creating a segment,rule & application
       1. CREATE APPLICATION
       2. CREATE RULE
       3. CREATE SEGMENT
       4. GET SEGMENTS
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

    const segmentsFoundByName = await segmentService.getSegments(
      entityManager,
      user.organization.id,
      application.id,
      segment.name,
      SEGMENT_TYPE.CUSTOM,
      STATUS.ACTIVE
    );
    const segmentNames = segmentsFoundByName.map(segm => {
      return segm.name;
    });
    expect(segmentNames).toContain(segment.name);
  });
});

describe("createSegment", () => {
  test("should get createSegment ", async () => {
    /* Test createSegment by creating a segment,rule & application
       1. CREATE APPLICATION
       2. CREATE RULE
       3. CREATE SEGMENT
       4. GET SEGMENT
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

    const segmentFoundById = await segmentService.getSegment(
      entityManager,
      segment.id
    );
    //@ts-ignore
    expect(segmentFoundById.id).toBe(segment.id);
    //@ts-ignore
    expect(segmentFoundById.name).toBe(segment.name);
    //@ts-ignore
    expect(segmentFoundById.description).toBe(segment.description);
    //@ts-ignore
    expect(segmentFoundById.organization).toMatchObject(segment.organization);
    //@ts-ignore
    expect(segmentFoundById.application).toMatchObject(segment.application);
    //@ts-ignore
    expect(segmentFoundById.rule).toMatchObject(segment.rule);
    //@ts-ignore
    expect(segmentFoundById.status).toBe(STATUS.ACTIVE);
  });
});

describe("updateSegment", () => {
  test("should get updateSegment ", async () => {
    /* Test updateSegment by creating a segment,rule & application
       1. CREATE APPLICATION
       2. CREATE RULE
       3. CREATE SEGMENT
       4. GET SEGMENT
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

    const updatedSegment = {
      id: segment.id,
      name: segment.name,
      description: segment.description,
      segmentType: SEGMENT_TYPE.CUSTOM,
      rule,
      status: STATUS.INACTIVE,
      organization: user.organization,
      application
    };

    const segmentFoundById = await segmentService.updateSegment(
      entityManager,
      updatedSegment.id,
      updatedSegment.name,
      updatedSegment.description,
      updatedSegment.segmentType,
      updatedSegment.rule.id,
      updatedSegment.status
    );

    expect(segmentFoundById.id).toBe(segment.id);
    expect(segmentFoundById.name).toBe(segment.name);
    expect(segmentFoundById.description).toBe(segment.description);
    expect(segmentFoundById.organization).toMatchObject(segment.organization);
    expect(segmentFoundById.application).toMatchObject(segment.application);
    expect(segmentFoundById.rule).toMatchObject(segment.rule);
    expect(segmentFoundById.status).toBe(STATUS.INACTIVE);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
