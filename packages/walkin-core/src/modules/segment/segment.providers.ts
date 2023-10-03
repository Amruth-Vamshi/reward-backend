import { Injectable, Injector } from "@graphql-modules/di";
import { EntityManager, getConnection, getManager } from "typeorm";
import { WalkinError } from "../../../src/modules/common/exceptions/walkin-platform-error";
import {
  Application,
  Organization,
  Rule,
  Segment,
  Customer,
  User,
  CustomerTag
} from "../../entity";
import {
  ACTION_RESULT,
  STATUS,
  SEGMENT_TYPE,
  RULE_TYPE,
  EXPRESSION_TYPE
} from "../common/constants/constants";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions/index";
import { CustomerProvider } from "../customer/customer.providers";
import { RuleProvider } from "../rule/providers/rule.provider";

@Injectable()
export class SegmentProvider {
  public async getSegment(
    transactionalEntityManager: EntityManager,
    id: string
  ) {
    const x = await transactionalEntityManager.findOne(Segment, id, {
      relations: ["organization", "application", "rule"]
    });
    return x;
  }

  public async getSegments(
    transactionalEntityManager: EntityManager,
    organizationId: string,
    applicationId: string,
    name: string,
    segmentType: string,
    status: string
  ): Promise<Segment[]> {
    const query: any = {};
    if (organizationId) {
      query.organization = organizationId;
    }
    if (applicationId) {
      query.application = applicationId;
    }
    if (segmentType) {
      query.segmentType = segmentType;
    }
    if (status) {
      query.status = status;
    }
    if (name) {
      query.name = name;
    }

    const sort = {
      id: "DESC"
    };

    const options: any = {};
    options.where = query;
    options.order = sort;
    options.relations = ["organization", "application", "rule"];
    return transactionalEntityManager.find(Segment, options);
  }

  public async createSegment(
    entityManager: EntityManager,
    name: string,
    description: string,
    segmentType: any,
    organization: Organization,
    application: Application,
    rule: string,
    status: string
  ): Promise<Segment> {
    const foundSegmentName = await entityManager.findOne(Segment, name);
    if (foundSegmentName) {
      throw new WCoreError(WCORE_ERRORS.DUPLICATE_SEGMENT_NAMR);
    }
    const segmentSchema: any = {
      name,
      description,
      organization,
      application,
      segmentType,
      rule,
      status
    };
    let e = await entityManager.create(Segment, segmentSchema);
    e = await entityManager.save(e);
    const x = await entityManager.findOne(
      Segment,
      { id: e.id },
      { relations: ["organization", "application", "rule"] }
    );
    return x;
  }

  public async createSegmentWithCustomerPhonenumbers(
    injector: Injector,
    entityManager: EntityManager,
    user: User,
    customerPhoneNumbers: string[],
    segmentName?: string
  ): Promise<Segment> {
    /*
           --------- Create Customer Segments--------
           1. Check if mobile number exists in customer table
           2. Create Customer tag in customer_tag table and make sure tag name is unique
           3. Create Rule which says customer_tag contains the tag name
           4. Create Segment with that rule
        */
    const customer: any = {};
    const organizationId = user.organization.id;

    const customers = [];

    // 1. Check if mobile number exists in customer table
    for (const phoneNumber of customerPhoneNumbers) {
      customer.phoneNumber = phoneNumber;
      const customersFound = await injector
        .get(CustomerProvider)
        .getCustomer(entityManager, customer, organizationId);
      if (
        customersFound === undefined ||
        customersFound.status === STATUS.INACTIVE
      ) {
        throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
      }
      customers.push(customersFound);
    }
    if (segmentName === undefined) {
      segmentName = `Bulk_create_${new Date().getTime()}`;
    } else {
      segmentName = `${segmentName}_${new Date().getTime()}`;
    }

    // 2. Create Customer tag in customer_tag table
    // const customerTagInput: Partial<CustomerTag> = {
    //   name: segmentName,
    //   organization: user.organization,
    //   status: STATUS.ACTIVE,
    //   customers
    // };
    const customerTagInput: Partial<CustomerTag> = {
      name: segmentName,
      organization: user.organization,
      status: STATUS.ACTIVE
    };
    const customerTag = await injector
      .get(CustomerProvider)
      .createCustomerTag(entityManager, customerTagInput);

    // 3. Create Rule which says customer_tag contains the tag name

    const ruleInput = {
      name: customerTagInput.name,
      description: customerTagInput.name,
      status: STATUS.ACTIVE,
      organizationId,
      type: RULE_TYPE.SIMPLE,
      ruleConfiguration: {
        rules: [
          {
            attributeName: "customer_tags",
            attributeValue: [customerTag.name],
            expressionType: EXPRESSION_TYPE.IN
          }
        ],
        combinator: "and"
      }
    };
    const rule = await injector
      .get(RuleProvider)
      .createRule(entityManager, injector, ruleInput);

    if (rule === undefined || rule.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.INVALID_QUERY_PARAMS);
    }

    const segmentInput = {
      name: customerTag.name,
      description: customerTag.name,
      segmentType: SEGMENT_TYPE.CUSTOM,
      organization: customerTag.organization,
      application: customerTag.organization.applications[0],
      ruleId: rule.id,
      status: STATUS.ACTIVE
    };
    return this.createSegment(
      entityManager,
      segmentInput.name,
      segmentInput.description,
      segmentInput.segmentType,
      segmentInput.organization,
      segmentInput.application,
      segmentInput.ruleId,
      segmentInput.status
    );
  }

  public async updateSegment(
    entityManager: EntityManager,
    id: string,
    name: string,
    description: string,
    segmentType: string,
    rule: string,
    status: string
  ): Promise<Segment> {
    let e = await entityManager.findOne(Segment, id);
    if (!e) {
      throw new WCoreError(WCORE_ERRORS.SEGMENT_NOT_FOUND);
    }
    if (segmentType != null) {
      e.segmentType = segmentType;
    }
    if (name != null) {
      const segmentNameFound = await entityManager.findOne(Segment, name);
      if (segmentNameFound) {
        throw new WCoreError(WCORE_ERRORS.DUPLICATE_SEGMENT_NAMR);
      }
      e.name = name;
    }
    if (description != null) {
      e.description = description;
    }
    if (rule != null) {
      const foundRUle = await entityManager.findOne(Rule, {
        where: {
          id: rule
        }
      });
      if (!foundRUle) {
        throw new WCoreError(WCORE_ERRORS.RULE_NOT_FOUND);
      }
      e.rule = foundRUle;
    }
    if (status != null) {
      e.status = status;
    }
    e = await entityManager.save(e);
    const x = await entityManager.findOne(Segment, id, {
      relations: ["organization", "application", "rule"]
    });
    return x;
  }
}
