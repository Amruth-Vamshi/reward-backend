import { Injectable } from "@graphql-modules/di";
import { EntityManager, getRepository, FindConditions, Not } from "typeorm";
import { Organization, Address } from "../../entity";
import { WalkinError } from "../common/exceptions/walkin-platform-error";
import {
  updateEntity,
  executeQuery,
  frameFinalQueries,
  combineExpressions,
  frameDynamicSQLFromJexl,
  frameTextFromSQLExpresion,
  getCountForEntity,
  checkIfPersonAndCustomersPersonAreSame,
  isValidString,
  formatLoyaltyProgramCode,
  addPaginateInfo,
  getPageOptions
} from "../common/utils/utils";
import {
  isValidPhone,
  isValidDateOfBirth,
  isValidEmail,
  isEmojiPresent
} from "../common/validations/Validations";
import { validateAndReturnEntityExtendedData } from "../entityExtend/utils/EntityExtension";
import { Customer, CustomerDevice, CustomerTag } from "./../../entity";
import { WalkinPlatformError } from "./../common/exceptions/walkin-platform-error";
import { validateUniqueness } from "./../common/validations/UniquenessValidation";
import {
  STATUS,
  GET_ALL,
  GET_COUNT,
  ENTITY_TYPE,
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  DATE_OF_BIRTH_REGEX,
  GENDER,
  DEFAULT_PAGE_OPTIONS
} from "../common/constants/constants";
import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";

import _ from "lodash";
import { logger } from "../common/utils/loggerUtil";
import {
  getValueFromCache,
  setValueToCache,
  removeValueFromCache
} from "../common/utils/redisUtils";
import { Person } from "../../entity/Person";
import moment from "moment";
import Container from "typedi";
import { TierRepository } from "../tier/tier.repository";
interface AddressByIdInput {
  addressId: string;
}

@Injectable()
export class CustomerProvider {
  /**
   * Returns custom object - Person details along with customerId and organizationId
   * Checks if person is found
   * Checks if person is a customer of any organization
   * @param transactionalEntityManager
   * @param input
   * @returns
   */

  public async getPersonWithCustomerId(transactionalEntityManager, input) {
    let searchObj;
    let { personId, personIdentifier, phoneNumber, organizationId } = input;

    if (personId || personIdentifier || phoneNumber) {
      // do nothing
    } else {
      throw new WCoreError(WCORE_ERRORS.INVALID_PERSON_SEARCH_INPUT);
    }

    if (personId) {
      searchObj = {
        id: personId,
        ...input
      };
    } else {
      searchObj = {
        ...input
      };
    }
    let person = await transactionalEntityManager.findOne(Person, {
      where: {
        ...searchObj
      }
    });

    if (!person) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    }

    let customer = await transactionalEntityManager.findOne(Customer, {
      where: {
        person: person.id,
        organization: organizationId
      }
    });

    if (!customer) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_LINKED_WITH_ORG);
    }

    let personWithCustomerId = {
      person,
      customerId: customer.id,
      organizationId
    };

    return personWithCustomerId;
  }

  public async linkPersonWithOrganization(
    transactionalEntityManager,
    { personId, organizationId }
  ) {
    let person = await this.getPerson(transactionalEntityManager, { personId });
    // create or update corresponding customer with person details - phoneNumber & identifier
    let customerInput = {
      organization: organizationId,
      personId: person.id,
      customerIdentifier: person.personIdentifier,
      phoneNumber: person.phoneNumber
    };

    let customer = await this.createOrUpdateCustomerWithOrganization(
      transactionalEntityManager,
      customerInput
    );
    if (customer) {
      customer.person = person;
    }
    return customer;
  }

  /**
   * Returns Person details
   * @param transactionalEntityManager
   * @param input person, personIdentifier
   * @returns person
   */

  public async getPerson(transactionalEntityManager, input) {
    let searchObj;
    let { personId, personIdentifier, phoneNumber } = input;

    if (personId || personIdentifier || phoneNumber) {
      // do nothing
    } else {
      throw new WCoreError(WCORE_ERRORS.INVALID_PERSON_SEARCH_INPUT);
    }

    if (personId) {
      searchObj = {
        id: personId,
        ...input
      };
    } else {
      searchObj = {
        ...input
      };
    }

    let person = await transactionalEntityManager.findOne(Person, {
      where: {
        ...searchObj,
        status: STATUS.ACTIVE
      },
      relations: ["customers"]
    });

    if (!person) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    }
    return person;
  }

  /**
   * Marks the status as INACTIVE for a person
   * @param transactionalEntityManager
   * @param personId
   * @returns Person
   */

  public async disablePerson(transactionalEntityManager, personId) {
    let person = await transactionalEntityManager.findOne(Person, {
      where: {
        id: personId
      }
    });
    if (!person) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    }

    if (person.status === STATUS.INACTIVE) {
      throw new WCoreError(WCORE_ERRORS.PERSON_ALREADY_INACTIVE);
    }

    let personData = {
      status: STATUS.INACTIVE
    };
    personData = updateEntity(person, personData);
    return transactionalEntityManager.save(personData);
  }

  /**
   * Creates Person. Creates Customer with organization
   * @param transactionalEntityManager
   * @param person
   * @returns
   */

  public async createPerson(transactionalEntityManager, person) {
    let customerId;
    let { phoneNumber, organizationId, personIdentifier } = person;

    let {
      getPersonIdentifier,
      getPhoneNumber
    } = await this.getPersonIdentifierAndPhoneNumberOfPerson(
      transactionalEntityManager,
      personIdentifier,
      phoneNumber
    );

    if (getPersonIdentifier) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_UNIQUE);
    } else if (getPhoneNumber) {
      throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_NOT_UNIQUE);
    }

    await this.validateBasicInput(phoneNumber);

    person.status = STATUS.ACTIVE;
    person.personIdentifier = person.personIdentifier
      ? person.personIdentifier
      : person.phoneNumber;

    let personData = await transactionalEntityManager.create(Person, person);
    personData = await transactionalEntityManager.save(personData);

    let customerInput = {
      phoneNumber: personData.phoneNumber,
      customerIdentifier: personData.personIdentifier,
      person: personData.id,
      organization: organizationId,
      status: STATUS.ACTIVE
    };

    /**
     *
     * creates customer for the organization
     * i.e., if there is a duplicate customer for the organization it is internally handled and customerId
     *
     * */
    let customer = await this.createCustomer(
      transactionalEntityManager,
      customerInput
    );

    if (customer) {
      customerId = customer.id;
    }

    return {
      person: personData,
      customerId,
      organizationId
    };
  }

  public async createCustomer(transactionalEntityManager, customerInput) {
    let customer;
    if (customerInput.organization) {
      // check if its valid organization
      let organization = await transactionalEntityManager.findOne(
        Organization,
        {
          where: {
            id: customerInput.organization
          }
        }
      );

      if (!organization) {
        throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
      }

      customer = await transactionalEntityManager.findOne(Customer, {
        where: {
          person: customerInput.person,
          organization: customerInput.organization
        },
        relations: ["person", "organization"]
      });
      if (!customer) {
        customer = await transactionalEntityManager.create(
          Customer,
          customerInput
        );
        return transactionalEntityManager.save(customer);
      }
    }
    return customer;
  }

  public async updatePerson(transactionalEntityManager, person) {
    let { id, personIdentifier, phoneNumber } = person;

    if (
      phoneNumber ||
      (phoneNumber !== undefined &&
        phoneNumber !== null &&
        phoneNumber.trim().length === 0)
    ) {
      await this.validateBasicInput(phoneNumber);
    }

    let {
      getPersonIdentifier,
      getPhoneNumber
    } = await this.getPersonIdentifierAndPhoneNumberOfPerson(
      transactionalEntityManager,
      personIdentifier,
      phoneNumber
    );

    if (
      (getPhoneNumber &&
        getPhoneNumber.id === id &&
        getPhoneNumber.phoneNumber === phoneNumber) ||
      (getPersonIdentifier &&
        getPersonIdentifier.id === id &&
        getPersonIdentifier.personIdentifier === personIdentifier)
    ) {
      // do nothing
    } else if (getPersonIdentifier) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_UNIQUE);
    } else if (getPhoneNumber) {
      throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_NOT_UNIQUE);
    }

    let { isPersonIdPresent, personData } = await this.checkIfPersonIsPresent(
      transactionalEntityManager,
      person.id
    );

    if (!isPersonIdPresent) {
      throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    }

    if (phoneNumber && !personIdentifier) {
      personData.personIdentifier = phoneNumber;
    }

    personData = await updateEntity(personData, person);

    await transactionalEntityManager.save(personData);

    /**
     * If a persons phoneNumber or identifier is a getting updated, update corresponding customers with same values
     */

    if (phoneNumber || personIdentifier) {
      let customerSearchObj;

      // Frame search object for customer

      if (
        phoneNumber &&
        personIdentifier &&
        phoneNumber.trim().length !== 0 &&
        personIdentifier.trim().length !== 0
      ) {
        customerSearchObj = {
          phoneNumber,
          customerIdentifier: personIdentifier
        };
      } else if (phoneNumber && phoneNumber.trim().length !== 0) {
        customerSearchObj = {
          phoneNumber
        };
      } else if (personIdentifier && personIdentifier.trim().length !== 0) {
        customerSearchObj = {
          customerIdentifier: personIdentifier
        };
      }

      let customer = await transactionalEntityManager.findOne(Customer, {
        where: {
          ...customerSearchObj
        },
        relations: ["person"]
      });

      if (customer && customer.phoneNumber !== customer.person.phoneNumber) {
        throw new WCoreError(WCORE_ERRORS.CUSTOMER_IDENTIFIER_NOT_UNIQUE);
      }

      // get all customers of that person
      let customers = await transactionalEntityManager.find(Customer, {
        where: {
          person: personData.id
        },
        relations: ["person"]
      });

      //update all customers personIdentifier and phoneNumber with new phoneNumber/personIdentifier from person
      if (customers.length > 0) {
        for (let customer of customers) {
          let updateCustomerInput = {
            phoneNumber: personData.phoneNumber,
            customerIdentifier: personData.personIdentifier
          };
          let customerData = updateEntity(customer, updateCustomerInput);
          await transactionalEntityManager.save(customerData);
        }
      }
    }

    return transactionalEntityManager.findOne(Person, {
      where: {
        id: personData.id
      },
      relations: ["customers"]
    });
  }

  public async checkIfPersonIsPresent(transactionalEntityManager, personId) {
    let isPersonIdPresent = true;

    let personData = await transactionalEntityManager.findOne(Person, {
      where: {
        id: personId
      },
      relations: ["customers"]
    });
    if (!personData) {
      isPersonIdPresent = false;
    }
    return { isPersonIdPresent, personData };
  }

  public async getSegmentRuleAsText(ruleConfiguration) {
    const attributeEntityNames = [];
    ruleConfiguration.rules.forEach(rule => {
      attributeEntityNames.push(rule.attributeEntityName);
    });

    // TO DO:
    // 1. To check whether attributeEntityNames would differ for each combinator
    // 2. Ways to handle multiple combinators

    const sqlExpression = await frameDynamicSQLFromJexl(ruleConfiguration);
    const ruleExpressionText = frameTextFromSQLExpresion(
      sqlExpression,
      attributeEntityNames[0]
    );
    return ruleExpressionText;
  }

  public async customerSearch(
    orgCode: string,
    filterValues: JSON,
    pageNumber,
    sort
  ) {
    const finalExpression = await combineExpressions(filterValues);
    const { finalTotalResultQuery, finalBaseQuery } = await frameFinalQueries(
      finalExpression,
      orgCode,
      pageNumber,
      sort
    );
    console.log(finalTotalResultQuery);
    console.log(finalBaseQuery);
    const totalResult: any = await executeQuery(finalTotalResultQuery);
    console.log("totalResult - ", totalResult);
    const data = await executeQuery(finalBaseQuery);

    return {
      data,
      total: totalResult[0].count,
      page: pageNumber
    };
  }
  public async getCustomer(
    transactionalEntityManager: EntityManager,
    customerObj: {
      id?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      gender?: string;
      dateOfBirth?: string;
      externalCustomerId?: string;
      customerIdentifier?: string;
      onboard_source?: string;
      tier?: string;
    },
    organization_id?: string
  ): Promise<Customer> {
    // TODO entityExtend relation is not working
    const where: any = {
      ...customerObj,
      status: STATUS.ACTIVE
    };

    if (organization_id) {
      const organization = await transactionalEntityManager.findOne(
        Organization,
        organization_id,
        {
          cache: true
        }
      );
      if (!organization) {
        throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
      }
      where.organization = organization;
    }

    const customerResult = await transactionalEntityManager.findOne(Customer, {
      where,
      relations: ["organization", "address", "tier"],
      cache: true
    });
    if (!customerResult) {
      throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
    }
    return customerResult;
  }

  public async getCustomerDevice(
    transactionalEntityManager: EntityManager,
    customerDeviceObject: {
      fcmToken?: string;
      deviceId?: string;
      osVersion?: string;
      modelNumber?: string;
    }
  ): Promise<CustomerDevice> {
    const customerDeviceResult = await transactionalEntityManager.findOne(
      CustomerDevice,
      {
        where: {
          ...customerDeviceObject,
          status: STATUS.ACTIVE
        },
        relations: ["customer"]
      }
    );
    return customerDeviceResult;
  }

  public async getCustomerDevicesByCustomerID(
    transactionalEntityManager: EntityManager,
    customerId: string
  ): Promise<CustomerDevice[]> {
    const customerDeviceResult = await transactionalEntityManager.find(
      CustomerDevice,
      {
        where: {
          customer: customerId,
          status: STATUS.ACTIVE
        },
        relations: ["customer"]
      }
    );
    return customerDeviceResult;
  }

  @addPaginateInfo
  public async getAllCustomers(
    transactionalEntityManager: EntityManager,
    input,
    pageOptions
  ) {
    const { page, pageSize } = getPageOptions(pageOptions || {});
    pageOptions.page = page;
    pageOptions.pageSize = pageSize;

    // TODO entityExtend relation is not working
    const {
      organizationId,
      email,
      firstName,
      lastName,
      phoneNumber,
      city,
      state,
      dateOfBirth,
      externalMembershipId,
      externalCustomerId,
      status
    } = input;
    let options: any = {};
    let whereCondition = {
      organization: organizationId
    };

    if (email) {
      whereCondition["email"] = email;
    }
    if (firstName) {
      whereCondition["firstName"] = firstName;
    }
    if (lastName) {
      whereCondition["lastName"] = lastName;
    }
    if (phoneNumber) {
      whereCondition["phoneNumber"] = phoneNumber;
    }
    if (dateOfBirth) {
      whereCondition["dateOfBirth"] = dateOfBirth;
    }
    if (externalMembershipId) {
      whereCondition["externalMembershipId"] = externalMembershipId;
    }
    if (externalCustomerId) {
      whereCondition["externalCustomerId"] = externalCustomerId;
    }
    if (status) {
      whereCondition["status"] = status;
    }

    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;

    options.where = whereCondition;

    options.relations = ["organization", "address", "tier"];

    if (city || state) {
      options.join = {
        alias: "customer",
        leftJoinAndSelect: { address: "customer.address" }
      };
      options.where = qb => {
        qb.where(whereCondition);
        if (city) {
          qb.andWhere("address.city = :addCity", { addCity: city });
        }
        if (state) {
          qb.andWhere("address.state = :addState", { addState: state });
        }
      };
    }

    const customers = await transactionalEntityManager.findAndCount(
      Customer,
      options
    );


    return customers;
  }

  public async getAllCustomersCelebratingBirthdayToday(
    transactionalEntityManager: EntityManager,
    organizationId
  ): Promise<Customer[]> {
    const customer = await transactionalEntityManager
      .getRepository(Customer)
      .createQueryBuilder("customer")
      .where(
        "customer.organization.id =:organizationId AND DATE_FORMAT(customer.dateOfBirth,'%m-%d') = DATE_FORMAT(CURRENT_DATE(),'%m-%d')",
        {
          organizationId
        }
      )
      .getMany();
    return customer;
  }

  public async getAllCustomerDevices(
    transactionalEntityManager: EntityManager
  ): Promise<CustomerDevice[]> {
    const customerDevice = await transactionalEntityManager.find(
      CustomerDevice,
      {
        where: {
          status: STATUS.ACTIVE
        },
        relations: ["customer"]
      }
    );
    return customerDevice;
  }

  public async disableCustomer(
    transactionalEntityManager: EntityManager,
    customerInput: any
  ): Promise<Customer> {
    const { customerId: id } = customerInput;
    if (id) {
      const customer = await transactionalEntityManager.findOne(Customer, id, {
        where: {
          organization: {
            id: customerInput.organizationId
          }
        },
        relations: ["organization"]
      });
      if (customer) {
        customer.status = STATUS.INACTIVE;
        const keys = [
          `${CACHING_KEYS.CUSTOMER}_${customer.organization.id}_${customer.externalCustomerId}`
        ];
        removeValueFromCache(keys);
        return transactionalEntityManager.save(customer);
      } else {
        throw new WalkinPlatformError(
          "cust003",
          "Customer does not exist",
          customerInput,
          400,
          ""
        );
      }
    } else {
      throw new WalkinPlatformError(
        "cust004",
        "Id is mandatory",
        customerInput,
        400,
        ""
      );
    }
  }

  public async createCustomerTag(
    transactionalEntityManager: EntityManager,
    customerTagInput: Partial<CustomerTag>
  ): Promise<CustomerTag> {
    const { name, organization } = customerTagInput;
    const entityManager = transactionalEntityManager;
    const customerTagFound = await transactionalEntityManager.findOne(
      CustomerTag,
      {
        where: {
          name,
          organization
        }
      }
    );
    if (customerTagFound) {
      throw new WCoreError(WCORE_ERRORS.CUSTOMER_TAG_EXISTS);
    }

    const customerTag = await entityManager.create(
      CustomerTag,
      customerTagInput
    );
    const ee = await entityManager.save(customerTag);
    return entityManager.findOne(CustomerTag, {
      where: {
        id: ee.id
      },
      relations: ["organization", "customers"]
    });
  }

  public async disableCustomerDevice(
    transactionalEntityManager: EntityManager,
    customerDeviceInput: any
  ): Promise<CustomerDevice> {
    const { customer_id, id } = customerDeviceInput;
    if (customer_id && id) {
      const customerDevice = await transactionalEntityManager.findOne(
        CustomerDevice,
        {
          where: {
            customer_id,
            id
          }
        }
      );
      if (customerDevice) {
        customerDevice.status = STATUS.INACTIVE;
        return transactionalEntityManager.save(customerDevice);
      } else {
        throw new WalkinPlatformError(
          "cust003",
          "Customer does not exist",
          customerDeviceInput,
          400,
          ""
        );
      }
    } else {
      throw new WalkinPlatformError(
        "cust004",
        "Id is mandatory",
        customerDeviceInput,
        400,
        ""
      );
    }
  }

  public async getColumnData(
    colName: string,
    organizationId: string,
    columnValue: any
  ): Promise<any> {
    const whereClause = `organization_id = :id and ${colName} = :value`;
    const filterValues = {
      id: organizationId,
      value: columnValue
    };
    console.log("whereClause", whereClause, filterValues);
    const columnData = await getRepository(Customer)
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.organization", "organization_id")
      .where(whereClause, filterValues)
      .select([`customer.${colName}`])
      .getOne();
    return columnData;
  }

  public async createOrUpdateCustomerDevice(
    transactionalEntityManager: EntityManager,
    customerDeviceInput: {
      customer_id?: string;
      fcmToken?: string;
      deviceId?: string;
      osVersion?: string;
      modelNumber?: string;
      status?: string;
      extend?: any;
      id?: any;
    }
  ): Promise<CustomerDevice> {
    if (customerDeviceInput.customer_id) {
      const customerDeviceData = await transactionalEntityManager.findOne(
        Customer,
        {
          where: {
            id: customerDeviceInput.customer_id
          }
        }
      );
      if (customerDeviceData) {
        let device = new CustomerDevice();
        device = updateEntity(device, customerDeviceInput);
        if (customerDeviceInput.id) {
          device.id = customerDeviceInput.id;
        }
        device.modelNumber = customerDeviceInput.modelNumber
          ? customerDeviceInput.modelNumber
          : "UNKNOWN";
        device = await transactionalEntityManager.save(device);
        device.customer = customerDeviceData;
        device.status = STATUS.ACTIVE;
        // Handle Entity Extensions
        const { extend } = customerDeviceInput;
        if (extend !== undefined) {
          try {
            const extendData = await validateAndReturnEntityExtendedData(
              transactionalEntityManager,
              extend,
              customerDeviceData.organization.id,
              "customerdevice"
            );
            device.extend = extendData;
          } catch (e) {
            throw new WalkinPlatformError(
              "cust005",
              "entity extended data is invalid",
              e,
              400,
              ""
            );
          }
        }
        // Handle Entity Extensions
        return transactionalEntityManager.save(device);
      } else {
        throw new WalkinPlatformError(
          "cust005",
          "Customer Device does not exist",
          customerDeviceInput,
          400,
          ""
        );
      }
    }
  }

  public async validateDateOfBirth(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const d: Date = new Date();
    const dateOfBirthRegex = DATE_OF_BIRTH_REGEX;

    if (d < dob || !moment(dateOfBirth).isValid()) {
      throw new WCoreError(WCORE_ERRORS.INVALID_DATE_OF_BIRTH);
    }

    if (!dateOfBirth.match(dateOfBirthRegex)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_DATE_OF_BIRTH_FORMAT);
    }
  }

  public async validateBasicInput(phoneNumber, dateOfBirth?) {
    // if (!phoneNumber) {
    //   throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_REQUIRED);
    // }
    if (phoneNumber) {
      const isPhoneNumberValid = isValidPhone(phoneNumber);
      if (!isPhoneNumberValid) {
        throw new WCoreError(WCORE_ERRORS.INVALID_PHONE_NUMBER);
      }
    }
    if (dateOfBirth) {
      await this.validateDateOfBirth(dateOfBirth);
    }
  }

  /**
   * check if the customer identifier is entered by the user
   * - if it is empty, add the phone number (which is mandatory) as a default value to this field
   * - if it is not empty, validate its uniqueness across the table
   * @param customerIdentifier
   * @returns Bolean
   */

  public async getPersonIdentifierAndPhoneNumberOfPerson(
    entityManager,
    personIdentifier,
    phoneNumber,
    id?
  ) {
    let getPersonIdentifier;
    let getPhoneNumber;

    if (personIdentifier === undefined || personIdentifier === null) {
      personIdentifier = phoneNumber;
    }

    if (personIdentifier && personIdentifier.trim().length !== 0) {
      getPersonIdentifier = await entityManager.findOne(Person, {
        where: {
          personIdentifier
        }
      });
    }

    if (phoneNumber && phoneNumber.trim().length !== 0) {
      getPhoneNumber = await entityManager.findOne(Person, {
        where: {
          phoneNumber
        }
      });
    }

    return {
      getPersonIdentifier,
      getPhoneNumber
    };
  }

  /**
   * creates or updates customer with organization given in the input
   * @param transactionalEntityManager
   * @param organization
   * @param customerInput
   * @param personId
   */

  public async validateCreateCustomerInput(
    transactionalEntityManager,
    customerInput
  ) {
    const {
      phoneNumber,
      customerIdentifier,
      dateOfBirth,
      externalCustomerId,
      externalMembershipId,
      organization
    } = customerInput;

    await this.validateBasicInput(phoneNumber, dateOfBirth);

    if (!isValidString(externalCustomerId)) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMERID);
    }

    if (customerIdentifier && !isValidString(customerIdentifier)) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMER_IDENTIFIER);
    }

    // validate externalMembershipId
    if (isValidString(externalMembershipId)) {
      if (isEmojiPresent(externalMembershipId)) {
        throw new WCoreError(WCORE_ERRORS.INVALID_EXTERNAL_MEMBERSHIP_ID);
      }

      const existingExternalMembershipId = await transactionalEntityManager.findOne(
        Customer,
        {
          where: {
            organization: {
              id: organization
            },
            externalMembershipId
          }
        }
      );
      if (existingExternalMembershipId) {
        throw new WCoreError(WCORE_ERRORS.EXTERNAL_MEMBERSHIP_ID_NOT_UNIQUE);
      }
    }
    return;
  }

  public async validateUpdateCustomerInput(
    transactionalEntityManager,
    customerInput
  ) {
    const {
      phoneNumber,
      customerIdentifier,
      dateOfBirth,
      externalCustomerId,
      externalMembershipId,
      organization
    } = customerInput;
    if (phoneNumber) {
      const isPhoneNumberValid = isValidPhone(phoneNumber);
      if (!isPhoneNumberValid) {
        throw new WCoreError(WCORE_ERRORS.INVALID_PHONE_NUMBER);
      }
    }

    if (dateOfBirth) {
      await this.validateDateOfBirth(dateOfBirth);
    }

    if (externalCustomerId) {
      if (!isValidString(externalCustomerId)) {
        throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMERID);
      }
    }

    if (customerIdentifier) {
      if (!isValidString(customerIdentifier)) {
        throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMER_IDENTIFIER);
      }
    }
    return;
  }

  public async createOrUpdateCustomerWithOrganization(
    transactionalEntityManager,
    customerInput
  ) {
    let customerData;
    const organizationId = customerInput.organization;
    customerInput.extendedDataInput = customerInput.extend;
    const organizationObject: Organization = await transactionalEntityManager.findOne(
      Organization,
      {
        where: {
          id: organizationId
        },
        cache: true
      }
    );

    if (customerInput.gender) {
      const allowedGender = Object.values(GENDER);
      if (!allowedGender.includes(customerInput.gender)) {
        throw new WCoreError(WCORE_ERRORS.INVALID_GENDER);
      }
    }

    if (customerInput.email) {
      const isEmailValid = await isValidEmail(customerInput.email);
      if (!isEmailValid) {
        throw new WCoreError(WCORE_ERRORS.INVALID_EMAIL);
      }
    }

    if (customerInput.id) {
      // Update existing customer entity

      await this.validateUpdateCustomerInput(
        transactionalEntityManager,
        customerInput
      );

      customerData = await transactionalEntityManager.findOne(Customer, {
        where: {
          id: customerInput.id,
          organization: {
            id: organizationId
          }
        }
      });
      if (!customerData) {
        throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
      }

      // validate externalMembershipId
      if (isValidString(customerInput.externalMembershipId)) {
        if (isEmojiPresent(customerInput.externalMembershipId)) {
          throw new WCoreError(WCORE_ERRORS.INVALID_EXTERNAL_MEMBERSHIP_ID);
        }

        const existingExternalMembershipId = await transactionalEntityManager.findOne(
          Customer,
          {
            where: {
              id: Not(customerInput.id),
              organization: {
                id: organizationId
              },
              externalMembershipId: customerInput.externalMembershipId
            }
          }
        );
        if (existingExternalMembershipId) {
          throw new WCoreError(WCORE_ERRORS.EXTERNAL_MEMBERSHIP_ID_NOT_UNIQUE);
        }
      }

      customerData = updateEntity(customerData, customerInput);
      customerData.organization = organizationObject;
    } else {
      // Create new customer

      await this.validateCreateCustomerInput(
        transactionalEntityManager,
        customerInput
      );
      customerInput.status = STATUS.ACTIVE;
      customerData = transactionalEntityManager.create(Customer, customerInput);
      customerData.organization = organizationObject;
    }
    if (
      customerData.organization != null ||
      customerData.organization !== undefined
    ) {
      // validate uniqueness of phone number field against organization_id
      if (customerInput.phoneNumber !== undefined) {
        if (organizationId !== undefined) {
          const searchObj = {
            organizationId,
            phoneNumber: customerInput.phoneNumber,
            customerId: customerInput.id
          };
          const whereCondition = `customer.organization = :organizationId and customer.phoneNumber = :phoneNumber and customer.id != :customerId`;
          const phoneNumberFound = await getCountForEntity(
            Customer,
            whereCondition,
            searchObj
          );
          // if the array is empty, it is the first record in the database
          if (phoneNumberFound > 0) {
            throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_NOT_UNIQUE);
          }
        } else {
          throw new WCoreError(WCORE_ERRORS.CUSTOMER_PHONE_NUMBER_ORG_REQUIRED);
        }
      }
      // else {
      //   if (!customerInput.id) {
      //     throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_NOT_FOUND);
      //   }
      // }
      // Check if the customer identifier is entered by the user
      // If it is empty, add the phone number (which is mandatory) as a default value to this field
      // If it is not empty, validate its uniqueness across the organization_id
      if (customerInput.customerIdentifier !== undefined) {
        if (organizationId !== undefined) {
          const searchObj = {
            organizationId,
            customerIdentifier: customerInput.customerIdentifier,
            customerId: customerInput.id
          };
          const whereCondition = `customer.organization = :organizationId and customer.customerIdentifier = :customerIdentifier and customer.id != :customerId`;
          const getCustomerIdentifierFound = await getCountForEntity(
            Customer,
            whereCondition,
            searchObj
          );

          // if the array is empty, it is the first record in the database
          if (getCustomerIdentifierFound > 0) {
            throw new WCoreError(WCORE_ERRORS.CUSTOMER_IDENTIFIER_NOT_UNIQUE);
          }
        } else {
          throw new WCoreError(WCORE_ERRORS.CUSTOMER_IDENTIIFER_ORG_REQUIRED);
        }
      }
      // else {
      //   if (!customerInput.id) {
      //     throw new WCoreError(WCORE_ERRORS.CUSTOMER_IDENTIFIER_NOT_FOUND);
      //   }
      // }

      if (customerInput.externalCustomerId !== undefined) {
        if (organizationId !== undefined) {
          if (isEmojiPresent(customerInput.externalCustomerId)) {
            throw new WCoreError(WCORE_ERRORS.INVALID_EXTERNAL_CUSTOMER_ID);
          }

          const searchObj = {
            organizationId,
            externalCustomerId: customerInput.externalCustomerId,
            customerId: customerInput.id
          };
          const whereCondition = `customer.organization = :organizationId and customer.externalCustomerId = :externalCustomerId  and customer.id != :customerId`;
          const getExternalCustomerIdFound = await getCountForEntity(
            Customer,
            whereCondition,
            searchObj
          );
          if (getExternalCustomerIdFound > 0) {
            throw new WCoreError(WCORE_ERRORS.EXTERNAL_CUSTOMER_NOT_UNIQUE);
          }
        } else {
          throw new WCoreError(WCORE_ERRORS.EXTERNAL_CUSTOMER_ID_ORG_REQUIRED);
        }
      }

      if (customerInput.tier) {
        let availableTiers = await Container.get(TierRepository).getTiers(
          transactionalEntityManager,
          {
            organizationId
          }
        );
        if (availableTiers.length == 0) {
          throw new WCoreError(WCORE_ERRORS.TIERS_NOT_DEFINED_FOR_ORGANIZATION);
        } else {
          let matchFound: Boolean = false;
          for (let i in availableTiers) {
            if (customerInput.tier == availableTiers[i].code) matchFound = true;
          }
          if (!matchFound) {
            throw new WCoreError(WCORE_ERRORS.PROVIDE_PRE_DEFINED_TIER);
          } else {
            customerData.tier = customerInput.tier;
          }
        }
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }

    // Handle Entity Extensions
    if (customerInput.extendedDataInput !== undefined) {
      try {
        const extendData = await validateAndReturnEntityExtendedData(
          transactionalEntityManager,
          customerInput.extendedDataInput,
          customerData.organization.id,
          "customer"
        );
        customerData.extend = { ...customerData.extend, ...extendData };
      } catch (e) {
        throw new WalkinPlatformError(
          "cust005",
          "entity extended data is invalid",
          e,
          400,
          ""
        );
      }
    }

    const customer = await transactionalEntityManager.save(customerData);
    if (customerInput.address) {
      customerInput.address["customerId"] = customer.id;
      await this.addAddressToCustomer(
        transactionalEntityManager,
        customerInput.address,
        organizationId
      );
    }
    return transactionalEntityManager.findOne(Customer, {
      where: {
        id: customer.id
      },
      relations: ["organization", "address", "tier"]
    });
  }

  public async createOrUpdateCustomer(
    transactionalEntityManager: EntityManager,
    customerInputArg
  ): Promise<Customer> {
    const {
      phoneNumber,
      customerIdentifier,
      dateOfBirth,
      externalCustomerId,
      address = {},
      organization
    } = customerInputArg;
    // if (address) {
    //   const addressSchema = await transactionalEntityManager.create(Address, address);
    // }

    // let person = await this.getPerson(transactionalEntityManager, {
    //   personId: customerInputArg.personId
    // });

    // if (person.phoneNumber !== customerInputArg.phoneNumber) {
    //   throw new WCoreError(
    //     WCORE_ERRORS.CUSTOMER_PHONE_NUMBER_DOES_NOT_MATCH_WITH_PERSON
    //   );
    // }

    let customerData = await this.createOrUpdateCustomerWithOrganization(
      transactionalEntityManager,
      customerInputArg
    );
    const keys = [
      `${CACHING_KEYS.CUSTOMER}_${organization}_${customerData.externalCustomerId}`
    ];
    removeValueFromCache(keys);
    // Handle Entity Extensions
    return customerData;
  }

  public async createBulkCustomer(
    transactionalEntityManager: EntityManager,
    customers: Array<{
      firstName: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      gender?: string;
      dateOfBirth?: string;
      externalCustomerId?: string;
      customerIdentifier?: string;
      onboard_source?: string;
      extend?: any;
      organization?: string;
      status?: string;
    }>
  ): Promise<any> {
    const customerChunks = _.chunk(customers, 100);
    // prepare organizations map
    const uniqueOrganizationIds = _.uniq(_.map(customers, "organization"));
    const uniqueOrganizations: any = await transactionalEntityManager.findByIds(
      Organization,
      uniqueOrganizationIds
    );
    let organizationsMap: any = _.keyBy(uniqueOrganizations, "id");

    let validationErrors = [];

    let savedCustomers = [];

    for (let customerChunkIndex in customerChunks) {
      let customerChunk = customerChunks[customerChunkIndex];
      let customersToSave = [];
      for (let customerIndex in customerChunk) {
        let customer = customerChunk[customerIndex];
        const customerToSave = new Customer();

        let errors = [];
        let validationError = {
          phoneNumber: customer.phoneNumber,
          errors: errors
        };
        // validations start
        let phoneValid = isValidPhone(customer.phoneNumber);
        if (!phoneValid) {
          validationError.errors.push("Phone number is not valid");
        }
        let dobValid = isValidDateOfBirth(customer.dateOfBirth);
        if (!dobValid) {
          validationError.errors.push("Date of birth is not valid");
        }
        // validations ends
        Object.assign(customerToSave, customer);
        customerToSave.status = STATUS.ACTIVE;
        // get orgobject from organizationsMap
        customerToSave.organization = organizationsMap[customer.organization];
        let extendedDataInput = customer.extend;
        if (extendedDataInput) {
          try {
            const extendData = await validateAndReturnEntityExtendedData(
              transactionalEntityManager,
              extendedDataInput,
              customerToSave.organization.id,
              "customer"
            );
            customerToSave.extend = { ...customerToSave.extend, ...extendData };
          } catch (e) {
            logger.error("Error while validation extend data", e);
            validationError.errors.push("Entity extended data is invalid");
          }
        }

        // if errors are there then add to validationErrors else add to save list
        if (validationError.errors.length > 0) {
          validationErrors.push(validationError);
        } else {
          customersToSave.push(customerToSave);
        }
      }
      // save customer batch
      if (customersToSave.length > 0) {
        let insertResult = await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(Customer)
          .values(customersToSave)
          .execute();
        let savedChunk = await transactionalEntityManager.findByIds(
          Customer,
          _.map(insertResult.identifiers, "id")
        );
        savedCustomers.push(...savedChunk);
      }
    }

    // prepare response- Saved customers and error customer ids with errors.
    let response = {
      savedCustomers: savedCustomers,
      validationErrors: validationErrors
    };
    logger.debug("Response:", response);

    return response;
  }

  /**
   * findOrCreateCustomer
   */
  public async findOrCreateCustomer(
    entityManager: EntityManager,
    customerIdentifier: string,
    organizationId: string
  ): Promise<Customer> {
    const organization = await entityManager.findOne(Organization, {
      where: {
        id: organizationId
      },
      cache: true
    });
    if (!organization) {
      throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
    }
    let customer = await entityManager.findOne(Customer, {
      where: {
        customerIdentifier
      }
    });
    if (customer) {
      return customer;
    }
    customer = new Customer();
    customer.customerIdentifier = customerIdentifier;
    customer.organization = organization;
    customer.status = STATUS.ACTIVE;
    return entityManager.save(customer);
  }

  public async getCustomerById(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<Customer> {
    return entityManager.findOne(Customer, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
  }

  /**
   * TODO: Provider Name to be changed from addAddressToCustomer to addAddressToPerson
   * */
  public async addAddressToCustomer(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ) {
    const { customerId } = input;

    let foundCustomer;

    if (customerId) {
      foundCustomer = await entityManager.findOne(Customer, {
        where: {
          id: customerId,
          organization: {
            id: organizationId
          }
        },
        relations: ["organization", "address"]
      });
      if (!foundCustomer) {
        throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
      }
    }

    const { addressLine1, city, state } = input;
    if (!addressLine1) {
      throw new WCoreError(WCORE_ERRORS.ADDRESS_LINE_MANDATORY);
    }

    if (!city) {
      throw new WCoreError(WCORE_ERRORS.CITY_IS_MANDATORY);
    }

    if (!state) {
      throw new WCoreError(WCORE_ERRORS.STATE_IS_MANDATORY);
    }

    // Form searchObj based on input
    // if (addressId) {
    //   searchObj = {
    //     id: addressId
    //   };
    // } else {
    //   searchObj = {
    //     id: foundCustomer.person.id
    //   };
    // }

    // const foundPerson = await entityManager.findOne(Person, {
    //   where: searchObj
    // });

    // if (!foundPerson) {
    //   throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    // }

    //If person is found, but not associated with the customer, throw error

    // checkIfPersonAndCustomersPersonAreSame(foundCustomer, foundPerson);

    if (foundCustomer.address != null) {
      const duplicateAddress = await entityManager.findOne(Address, {
        where: {
          id: foundCustomer.address.id
        }
      });

      if (duplicateAddress) {
        throw new WCoreError(WCORE_ERRORS.DUPLICATE_ADDRESS);
      }
    }

    if (input.latitude && input.longitude) {
      input["geoLocation"] = `POINT(${input.latitude} ${input.longitude})`;
    }
    input.status = "ACTIVE";

    const createAddressSchema = {
      ...input
    };
    // CATCH ANY ERRORS THROWN FROM THE DATABASE
    try {
      const createdAddress = entityManager.create(Address, {
        ...createAddressSchema
      });
      const savedCreatedAddress = await entityManager.save(createdAddress);
      const foundCustomerAddress = await entityManager.findOne(Address, {
        where: {
          id: savedCreatedAddress.id
        }
      });
      await entityManager.update(
        Customer,
        { id: foundCustomer.id },
        { address: foundCustomerAddress }
      );
      const keys = [
        `${CACHING_KEYS.CUSTOMER}_${customerId}`,
        `${CACHING_KEYS.CUSTOMER}_${organizationId}_${foundCustomer.externalCustomerId}`
      ];
      removeValueFromCache(keys);
      return foundCustomerAddress;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.ADDRESS_INPUT_NOT_VALID);
    }
  }

  public async removeAddressFromCustomer(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<Address> {
    let { customerId, addressId } = input;
    let foundCustomer;

    if (customerId) {
      foundCustomer = await entityManager.findOne(Customer, {
        where: {
          id: customerId,
          organization: {
            id: organizationId
          }
        },
        relations: ["organization", "address"]
      });
      if (!foundCustomer) {
        throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
      }
    }

    // if (personId) {
    //   searchObj = {
    //     id: personId
    //   };
    // } else {
    //   searchObj = {
    //     id: foundCustomer.person.id
    //   };
    // }

    // const person = await entityManager.findOne(Person, {
    //   where: searchObj
    // });

    // if (!person) {
    //   throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    // }

    // //If person is found, but not associated with the customer, throw error

    // checkIfPersonAndCustomersPersonAreSame(foundCustomer, person);

    // console.log(foundCustomer);
    if (foundCustomer.address.id != addressId) {
      throw new WCoreError(WCORE_ERRORS.ADDRESS_MISMATCH);
    }

    const addressFound = await entityManager.findOne(Address, {
      where: {
        id: addressId,
        status: STATUS.ACTIVE
      }
    });

    if (!addressFound) {
      throw new WCoreError(WCORE_ERRORS.ADDRESS_NOT_FOUND);
    }
    try {
      const removeAddress = entityManager.remove(addressFound);
      await entityManager.update(
        Customer,
        { id: foundCustomer.id },
        { address: null }
      );
      const keys = [
        `${CACHING_KEYS.CUSTOMER}_${customerId}`,
        `${CACHING_KEYS.CUSTOMER}_${organizationId}_${foundCustomer.externalCustomerId}`
      ];
      removeValueFromCache(keys);
      return removeAddress;
    } catch (error) {
      throw new WCoreError(WCORE_ERRORS.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateAddress(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<Address> {
    let { addressId, customerId } = input;
    let foundCustomer;

    if (customerId) {
      foundCustomer = await entityManager.findOne(Customer, {
        where: {
          id: customerId,
          organization: {
            id: organizationId
          }
        },
        relations: ["organization", "address"]
      });
      if (!foundCustomer) {
        throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
      }
    }

    // if (personId) {
    //   searchObj = {
    //     id: personId
    //   };
    // } else {
    //   searchObj = {
    //     id: foundCustomer.person.id
    //   };
    // }

    // const person = await entityManager.findOne(Person, {
    //   where: searchObj
    // });

    // if (!person) {
    //   throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    // }

    // //If person is found, but not associated with the customer, throw error

    // checkIfPersonAndCustomersPersonAreSame(foundCustomer, person);

    let addressFound;
    if (addressId == foundCustomer.address.id) {
      addressFound = await entityManager.findOne(Address, {
        where: {
          id: addressId,
          status: STATUS.ACTIVE
        }
      });

      if (!addressFound) {
        throw new WCoreError(WCORE_ERRORS.ADDRESS_NOT_FOUND);
      }
    } else {
      throw new WCoreError(WCORE_ERRORS.ADDRESS_NOT_FOUND_FOR_CUSTOMER);
    }

    if (input.latitude && input.longitude) {
      input["geoLocation"] = `POINT(${input.latitude} ${input.longitude})`;
    }
    const updatedAddress: Address = updateEntity(addressFound, input);
    const savedUpdatedAddress = await entityManager.save(updatedAddress);
    const keys = [
      `${CACHING_KEYS.CUSTOMER}_${customerId}`,
      `${CACHING_KEYS.CUSTOMER}_${organizationId}_${foundCustomer.externalCustomerId}`
    ];
    removeValueFromCache(keys);
    return savedUpdatedAddress;
  }

  public async getAddresses(
    entityManager: EntityManager,
    customerId: string
  ): Promise<Address[]> {
    let foundCustomer;

    if (customerId) {
      foundCustomer = await entityManager.findOne(Customer, {
        where: {
          id: customerId
        }
      });
      if (!foundCustomer) {
        throw new WCoreError(WCORE_ERRORS.CUSTOMER_NOT_FOUND);
      }
      // personId = personId ? personId : foundCustomer.person.id;
    }

    // const person = await entityManager.findOne(Person, {
    //   where: {
    //     id: personId,
    //     status: STATUS.ACTIVE
    //   }
    // });

    // if (!person) {
    //   throw new WCoreError(WCORE_ERRORS.PERSON_NOT_FOUND);
    // }

    //If person is found, but not associated with the customer, throw error

    // checkIfPersonAndCustomersPersonAreSame(foundCustomer, person);

    const foundAddress = await entityManager.find(Address, {
      where: {
        id: foundCustomer.address.id,
        status: STATUS.ACTIVE
      }
    });

    return foundAddress;
  }

  public async CustomerById(
    entityManager: EntityManager,
    id: string,
    organizationId: string
  ) {
    const key = `${CACHING_KEYS.CUSTOMER}_${id}`;
    let customer: any = await getValueFromCache(key);
    if (!customer) {
      customer = await entityManager.findOne(Customer, {
        where: {
          id,
          organization: {
            id: organizationId
          }
        },
        relations: ["address", "organization"]
      });
      if (customer) {
        await setValueToCache(key, customer, EXPIRY_MODE.EXPIRE, CACHE_TTL);
        console.log("Fetched from database and Added to Cache with key: ", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return customer;
  }

  public async getAddressById(
    entityManager: EntityManager,
    input: AddressByIdInput
  ): Promise<Address | any> {
    const { addressId } = input;
    const foundAddress = await entityManager.findOne(Address, {
      where: {
        id: addressId
      }
    });
    return foundAddress;
  }
}
