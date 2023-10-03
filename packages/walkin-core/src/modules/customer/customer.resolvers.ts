import { Injector } from "@graphql-modules/di";
// import { segmentModule } from "../segment/segment.module";
import {
  EntityManager,
  getManager,
  TransactionManager,
  getConnection
} from "typeorm";
import { WCoreError } from "../common/exceptions/index";
import { WCORE_ERRORS } from "../common/constants/errors";
import {
  SLUGTYPE,
  EXTEND_ENTITIES,
  CORE_WEBHOOK_EVENTS,
  STATUS,
  ENTITY_SEARCH_SYNC_TYPE
} from "../common/constants/constants";
import { sendToWehbookSubscribers } from "../common/utils/webhookUtils";
import { CustomerProvider } from "./customer.providers";
import { Organizations } from "../account/organization/organization.providers";
import { EntityExtendProvider } from "../entityExtend/entityExtend.providers";
import { SegmentProvider } from "../segment/segment.providers";
import { RuleProvider } from "../rule/providers";
import {
  combineExpressions,
  frameFinalQueries,
  executeQuery,
  findOrganizationOrThrowError,
  checkUserPartOfInputOrganizationElseThrowError,
  setOrganizationToInput,
  setOrganizationToInputV2
} from "../common/utils/utils";
import { startEntityClickhouseSyncJob } from "../common/utils/digdagJobsUtil";

import segmentResolvers from "../segment/segment.resolvers";

import * as csv from "fast-csv";
import _ from "lodash";
import { IAuthResolverArgs } from "../account/auth-guard/auth-guard.interface";

export default {
  Query: {
    customerSearch: async (
      root,
      args,
      { injector }: { injector: Injector },
      info
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const organization = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organizationId);

        if (
          organization === undefined ||
          organization.status === STATUS.INACTIVE
        ) {
          throw new WCoreError(WCORE_ERRORS.ORGANIZATION_NOT_FOUND);
        }

        const inputSearchFields = args.filterValues.rules.map(rule => {
          return rule.attributeName;
        });

        const orgCode = organization.code;
        const customerDefinition = await info.schema
          .getType("Query")
          .getFields().customerDefnition;
        const customerDefintionOutput = await customerDefinition.resolve(
          root,
          { organization_id: args.organization_id },
          { injector },
          info
        );

        if (customerDefintionOutput) {
          const customerDefintionOutputFields = customerDefintionOutput.columns;

          const searchKeys = customerDefintionOutputFields.map(field => {
            return field.column_search_key;
          });
          inputSearchFields.forEach(fieldName => {
            if (!searchKeys.includes(fieldName)) {
              throw new WCoreError(WCORE_ERRORS.INVALID_JSON_SCHEMA);
            }
          });
        }

        return injector
          .get(CustomerProvider)
          .customerSearch(
            orgCode,
            args.filterValues,
            args.pageNumber,
            args.sort
          );
      });
    },

    getSegmentRuleAsText: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const rule = await injector
          .get(RuleProvider)
          .rule(transactionalEntityManager, args.ruleId);

        if (rule === undefined) {
          throw new WCoreError(WCORE_ERRORS.RULE_NOT_FOUND);
        }

        return injector
          .get(CustomerProvider)
          .getSegmentRuleAsText(rule.ruleConfiguration);
      });
    },

    person: async (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        let input = args.input;

        input = setOrganizationToInput(input, user, application);

        return injector
          .get(CustomerProvider)
          .getPerson(transactionalEntityManager, input);
      });
    },

    personWithCustomerId: async (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        let input = args.input;
        input = await setOrganizationToInput(input, user, application);
        return injector
          .get(CustomerProvider)
          .getPersonWithCustomerId(transactionalEntityManager, args.input);
      });
    },

    customer: async (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(async transactionalEntityManager => {
        const input = args.input;
        const { organizationId } = await setOrganizationToInput(
          input,
          user,
          application
        );
        return injector
          .get(CustomerProvider)
          .getCustomer(transactionalEntityManager, args.input, organizationId);
      });
    },
    customers: async (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      const { input = {} } = args;
      await setOrganizationToInputV2(input, user, application);
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CustomerProvider)
          .getAllCustomers(
            transactionalEntityManager,
            input,
            input.pageOptions
          );
      });
    },
    customerDevice: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CustomerProvider)
          .getCustomerDevice(transactionalEntityManager, args.input);
      });
    },
    customerDevicesByCustomerId: (
      _,
      args: { customerId: string },
      { injector }: { injector: Injector }
    ) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CustomerProvider)
          .getCustomerDevicesByCustomerID(
            transactionalEntityManager,
            args.customerId
          );
      });
    },
    customerDevices: (_, __, { injector }: { injector: Injector }) => {
      return getManager().transaction(transactionalEntityManager => {
        return injector
          .get(CustomerProvider)
          .getAllCustomerDevices(transactionalEntityManager);
      });
    },
    customerDefnition: (_, args, { injector }: { injector: Injector }) => {
      return getManager().transaction(async transactionalEntityManager => {
        const org = await injector
          .get(Organizations)
          .getOrganization(transactionalEntityManager, args.organization_id);
        const columns = [];
        // FIX: at somepoint we can get these from backend using entity defnition and user Language preference
        columns.push({
          column_slug: "id",
          column_search_key: "id",
          column_label: "ID",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "firstName",
          column_search_key: "firstName",
          column_label: "First Name",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "lastName",
          column_search_key: "lastName",
          column_label: "Last Name",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "email",
          column_search_key: "email",
          column_label: "email",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "phoneNumber",
          column_search_key: "phoneNumber",
          column_label: "Phone Number",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "gender",
          column_search_key: "gender",
          column_label: "Gender",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "dateOfBirth",
          column_search_key: "dateOfBirth",
          column_label: "Date of Birth",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "externalCustomerId",
          column_search_key: "externalCustomerId",
          column_label: "External Customer Id",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "customerIdentifier",
          column_search_key: "customerIdentifier",
          column_label: "Customer Identifier",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        // columns.push({
        //   column_slug: "onboard_source",
        //   column_search_key: "onboard_source",
        //   column_label: "Onboard Source",
        //   column_type: SLUGTYPE.SHORT_TEXT,
        //   searchable: true,
        //   extended_column: false
        // });
        columns.push({
          column_slug: "status",
          column_search_key: "status",
          column_label: "Status",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "organization_id",
          column_search_key: "organization_id",
          column_label: "Organization Id",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "createdBy",
          column_search_key: "createdBy",
          column_label: "Created By",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "last_modified_by",
          column_search_key: "last_modified_by",
          column_label: "Last Modified By",
          column_type: SLUGTYPE.SHORT_TEXT,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "created_time",
          column_search_key: "created_time",
          column_label: "Create Timestamp",
          column_type: SLUGTYPE.TIMESTAMP,
          searchable: true,
          extended_column: false
        });
        columns.push({
          column_slug: "last_modified_time",
          column_search_key: "last_modified_time",
          column_label: "Last Modified Timestamp",
          column_type: SLUGTYPE.TIMESTAMP,
          searchable: true,
          extended_column: false
        });

        const extendedEntity = await injector
          .get(EntityExtendProvider)
          .getEntityExtendByEntityName(
            transactionalEntityManager,
            org.id,
            EXTEND_ENTITIES.customer
          );
        console.log("extendedEntity", extendedEntity);
        if (extendedEntity) {
          if (extendedEntity.fields) {
            extendedEntity.fields.forEach(c => {
              columns.push({
                column_slug: c.slug,
                column_search_key: c.slug,
                column_label: c.label,
                column_type: c.type,
                searchable: true,
                extended_column: true
              });
            });
          }
        }

        const customerDefnition = {};
        customerDefnition["columns"] = columns;
        customerDefnition["entityName"] = "customer";
        const searchEntityName = "search_customer_" + org["code"];
        customerDefnition["searchEntityName"] = searchEntityName;
        return customerDefnition;
      });
    },
    getAddresses: async (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(transactionEntityManager => {
        return injector
          .get(CustomerProvider)
          .getAddresses(transactionEntityManager, args.customerId);
      });
    }
  },
  Mutation: {
    createPerson: async (
      { application, user },
      args,
      { injector }: { injector: Injector }
    ) => {
      let person = args.person;

      person = setOrganizationToInput(person, user, application);

      return getConnection().transaction(async transactionManager => {
        return await injector
          .get(CustomerProvider)
          .createPerson(transactionManager, person);
      });
    },

    updatePerson: async (_, args, { injector }: { injector: Injector }) => {
      const person = args.person;

      return getConnection().transaction(async transactionManager => {
        return await injector
          .get(CustomerProvider)
          .updatePerson(transactionManager, person);
      });
    },

    disablePerson: async (_, args, { injector }: { injector: Injector }) => {
      const personId = args.personId;

      return getConnection().transaction(async transactionManager => {
        return injector
          .get(CustomerProvider)
          .disablePerson(transactionManager, personId);
      });
    },

    linkPersonWithOrganization: async (
      { application, user },
      args,
      { injector }: { injector: Injector }
    ) => {
      const personId = args.personId;
      const { organizationId } = setOrganizationToInput(
        args,
        user,
        application
      );
      return getConnection().transaction(async transactionManager => {
        return injector
          .get(CustomerProvider)
          .linkPersonWithOrganization(transactionManager, {
            personId,
            organizationId
          });
      });
    },

    createCustomer: async (
      { user, application },
      args,
      { injector }: { injector: Injector }
    ) => {
      let customer = args.customer;
      customer = setOrganizationToInput(customer, user, application);
      customer.organization = customer.organizationId;
      return getConnection().transaction(async transactionManager => {
        const result = await injector
          .get(CustomerProvider)
          .createOrUpdateCustomer(transactionManager, customer);

        // uncomment and move everything to async webhook.
        // if (result !== undefined) {
        //   // tslint:disable-next-line:no-console
        //   console.log(
        //     "Pushing to webhook",
        //     CORE_WEBHOOK_EVENTS.CREATE_CUSTOMER
        //   );
        //   let organizationId;
        //   if (result.organization) {
        //     organizationId = result.organization.id;
        //   }

        //   // FIXME: The data should be formatted as per the defnition
        //   const customerWebhookData: any = {};
        //   customerWebhookData.firstName = result.firstName;
        //   customerWebhookData.lastName = result.lastName;
        //   customerWebhookData.email = result.email;
        //   customerWebhookData.phoneNumber = result.lastName;
        //   customerWebhookData.gender = result.gender;
        //   customerWebhookData.dateOfBirth = result.dateOfBirth;
        //   customerWebhookData.externalCustomerId = result.externalCustomerId;
        //   customerWebhookData.customerIdentifier = result.customerIdentifier;
        //   customerWebhookData.organization = result.organization;
        //   customerWebhookData.onboard_source = result.onboard_source;
        //   customerWebhookData.customerDevices = result.customerDevices;
        //   const webhookdata = await sendToWehbookSubscribers(
        //     transactionManager,
        //     CORE_WEBHOOK_EVENTS.CREATE_CUSTOMER,
        //     customerWebhookData,
        //     organizationId,
        //     injector
        //   );
        //   // tslint:disable-next-line:no-console
        //   console.log("webhookData", webhookdata);
        //   try {
        //     await startEntityClickhouseSyncJob(
        //       organizationId,
        //       EXTEND_ENTITIES.customer,
        //       ENTITY_SEARCH_SYNC_TYPE.DELTA
        //     );
        //   } catch (error) {
        //     // TODO; Pager needs to be sent
        //     console.log(
        //       "Error while calling digdag startEntityClickhouseSyncJob"
        //     );
        //     console.log(error);
        //   }
        // }
        return result;
      });
    },
    createBulkCustomer: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(async transactionManager => {
        const result = await injector
          .get(CustomerProvider)
          .createBulkCustomer(transactionManager, args.customers);
        return result;
      });
    },
    uploadFileForCreateBulkCustomer: async (
      { user },
      args,
      { injector }: { injector: Injector }
    ) => {
      const userOrganization: any = user.organization;

      // validations for organization id
      const organization = await findOrganizationOrThrowError(
        args.input.organizationId
      );

      await checkUserPartOfInputOrganizationElseThrowError(
        userOrganization,
        organization
      );

      // read stream
      const { createReadStream, filename, mimetype, encoding } = await args
        .input.file;
      const name = filename;

      const stream = createReadStream();

      const response = {
        rowCount: 0,
        rows: []
      };

      let skipFirstRow = true;
      let extendColumnNames = [];
      const result = await new Promise((resolve, reject) => {
        csv
          .parseStream(stream)
          .on("error", error => {
            console.log("CSV Error:", error);
            reject(error);
          })
          .on("data", row => {
            if (skipFirstRow) {
              extendColumnNames = _.slice([...row], 10);
              skipFirstRow = false;
            } else {
              response.rows.push(row);
              console.log("Row Data", row);
            }
          })
          .on("end", rowCount => {
            response.rowCount = rowCount;
            console.log("RowCount", rowCount);
            resolve(response);
          });
      });

      console.log("CSV Rows:", response.rows);
      const bulkCustomers = [];
      for (const row of response.rows) {
        const customer = {};
        customer["firstName"] = row[0];
        customer["lastName"] = row[1];
        customer["email"] = row[2];
        customer["phoneNumber"] = row[3];
        customer["gender"] = row[4];
        customer["dateOfBirth"] = row[5];
        customer["externalCustomerId"] = row[6];
        customer["customerIdentifier"] = row[7];
        customer["onboard_source"] = row[8];
        customer["organization"] = row[9];
        customer["status"] = STATUS.ACTIVE;
        customer["extend"] = {};
        const extendRows = _.slice(row, 10);
        for (const extendRowIndex in extendRows) {
          customer["extend"][extendColumnNames[extendRowIndex]] =
            extendRows[extendRowIndex];
        }
        console.log("Customer: ", customer);
        bulkCustomers.push(customer);
      }

      await getManager().transaction(async transactionManager => {
        // create bulk customers
        const bulkCustomerResponse = await injector
          .get(CustomerProvider)
          .createBulkCustomer(transactionManager, bulkCustomers);
        const savedCustomerPhonenumbers = _.uniq(
          _.map(bulkCustomerResponse.savedCustomers, "phoneNumber")
        );

        // create segment with phone numbers
        const segmentResponse = await injector
          .get(SegmentProvider)
          .createSegmentWithCustomerPhonenumbers(
            injector,
            transactionManager,
            user,
            savedCustomerPhonenumbers,
            args.segmentName
          );
        result["createBulkCustomerResponse"] = bulkCustomerResponse;
        result["segmentResponse"] = segmentResponse;
      });
      console.log("Result: ", JSON.stringify(result));
      return result;
    },
    createCustomerDevice: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      const customerDevice = args.customerDevice;
      return getConnection().transaction(async transactionManager => {
        const result = await injector
          .get(CustomerProvider)
          .createOrUpdateCustomerDevice(transactionManager, customerDevice);
        if (result !== undefined) {
          let customerObj: any = {};
          customerObj.id = result.customer.id;
          customerObj = await injector
            .get(CustomerProvider)
            .getCustomer(transactionManager, customerObj);
          let organizationId;
          if (result.customer.organization) {
            organizationId = result.customer.organization.id;
          }
          const customerDeviceWebhookData: any = {};
          customerDeviceWebhookData.fcmToken = result.fcmToken;
          customerDeviceWebhookData.deviceId = result.deviceId;
          customerDeviceWebhookData.modelNumber = result.modelNumber;
          customerDeviceWebhookData.osVersion = result.osVersion;
          customerDeviceWebhookData.status = result.status;
          customerDeviceWebhookData.customer_id = result.customer.id;
          await sendToWehbookSubscribers(
            transactionManager,
            CORE_WEBHOOK_EVENTS.CREATE_CUSTOMER_DEVICE,
            customerDeviceWebhookData,
            organizationId,
            injector
          );
        }
        return result;
      });
    },

    updateCustomerDevice: async (
      _,
      args,
      { injector }: { injector: Injector }
    ) => {
      const customerDevice = args.customerDevice;

      return getConnection().transaction(async transactionManager => {
        const result = await injector
          .get(CustomerProvider)
          .createOrUpdateCustomerDevice(transactionManager, customerDevice);
        if (result !== undefined) {
          let customerObj: any = {};
          customerObj.id = result.customer.id;
          customerObj = await injector
            .get(CustomerProvider)
            .getCustomer(transactionManager, customerObj);
          // tslint:disable-next-line:no-console
          console.log("customer object", customerObj);
          let organizationId;
          if (result.customer.organization) {
            organizationId = result.customer.organization.id;
          }
          const customerDeviceWebhookData: any = {};
          customerDeviceWebhookData.fcmToken = result.fcmToken;
          customerDeviceWebhookData.deviceId = result.deviceId;
          customerDeviceWebhookData.modelNumber = result.modelNumber;
          customerDeviceWebhookData.osVersion = result.osVersion;
          customerDeviceWebhookData.status = result.status;
          customerDeviceWebhookData.customer_id = result.customer.id;
          await sendToWehbookSubscribers(
            transactionManager,
            CORE_WEBHOOK_EVENTS.UPDATE_CUSTOMER_DEVICE,
            customerDeviceWebhookData,
            organizationId,
            injector
          );
        }
        return result;
      });
    },

    updateCustomer: async (_, args, { injector }) => {
      const customer = args.customer;

      return getConnection().transaction(async transactionManager => {
        const result = await injector
          .get(CustomerProvider)
          .createOrUpdateCustomer(transactionManager, customer);
        if (result !== undefined) {
          // tslint:disable-next-line:no-console
          console.log("update.customer: Pushing to webhook");
          let organizationId;
          if (result.Organization) {
            organizationId = result.organization.id;
          }
          // FIXME: The data should be formatted as per the defnition
          const customerWebhookData: any = {};
          customerWebhookData.firstName = result.firstName;
          customerWebhookData.lastName = result.lastName;
          customerWebhookData.email = result.email;
          customerWebhookData.phoneNumber = result.lastName;
          customerWebhookData.gender = result.gender;
          customerWebhookData.dateOfBirth = result.dateOfBirth;
          customerWebhookData.externalCustomerId = result.externalCustomerId;
          customerWebhookData.customerIdentifier = result.customerIdentifier;
          customerWebhookData.organization = result.organization;
          // customerWebhookData.onboard_source = result.onboard_source;
          // customerWebhookData.customerDevices = result.customerDevices;
          await sendToWehbookSubscribers(
            transactionManager,
            CORE_WEBHOOK_EVENTS.UPDATE_CUSTOMER,
            customerWebhookData,
            organizationId,
            injector
          );
        }
        return result;
      });
    },

    disableCustomer: async ({user, application},args, { injector }) => {
      return getConnection().transaction(async transactionManager => {
        
        const { organizationId } = setOrganizationToInput(
          {},
          user,
          application
        ); 
        args.organizationId = organizationId;

        const result = await injector
          .get(CustomerProvider)
          .disableCustomer(transactionManager, args);
        if (result !== undefined) {
          // tslint:disable-next-line:no-console
          console.log("disable.customer: Pushing to webhook");
          let organizationId;
          if (result.Organization) {
            organizationId = result.organization.id;
          }
          // FIXME: The data should be formatted as per the defnition
          const customerWebhookData: any = {};
          customerWebhookData.firstName = result.firstName;
          customerWebhookData.lastName = result.lastName;
          customerWebhookData.email = result.email;
          customerWebhookData.phoneNumber = result.lastName;
          customerWebhookData.gender = result.gender;
          customerWebhookData.dateOfBirth = result.dateOfBirth;
          customerWebhookData.externalCustomerId = result.externalCustomerId;
          customerWebhookData.customerIdentifier = result.customerIdentifier;
          customerWebhookData.organization = result.organization;
          customerWebhookData.onboard_source = result.onboard_source;
          customerWebhookData.customerDevices = result.customerDevices;
          await sendToWehbookSubscribers(
            transactionManager,
            CORE_WEBHOOK_EVENTS.DISABLE_CUSTOMER,
            customerWebhookData,
            organizationId,
            injector
          );
        }
        return result;
      });
    },

    disableCustomerDevice: async (_, args, { injector }) => {
      const customerDevice = args.customerDevice;

      return getConnection().transaction(async transactionManager => {
        const result = await injector
          .get(CustomerProvider)
          .disableCustomerDevice(transactionManager, customerDevice);
        if (result !== undefined) {
          // tslint:disable-next-line:no-console
          console.log("disable.customer.device: Pushing to webhook");
          let customerObj: any = {};
          customerObj.id = args.customerDevice.customer_id;
          customerObj = await injector
            .get(CustomerProvider)
            .getCustomer(customerObj);
          let organizationId;
          if (result.Organization) {
            organizationId = customerObj.organization.id;
          }
          const customerDeviceWebhookData: any = {};
          customerDeviceWebhookData.fcmToken = result.fcmToken;
          customerDeviceWebhookData.deviceId = result.deviceId;
          customerDeviceWebhookData.modelNumber = result.modelNumber;
          customerDeviceWebhookData.osVersion = result.osVersion;
          customerDeviceWebhookData.status = result.status;
          customerDeviceWebhookData.customer_id = result.customer_id;
          const webhookdata = await sendToWehbookSubscribers(
            transactionManager,
            CORE_WEBHOOK_EVENTS.DISABLE_CUSTOMER_DEVICE,
            customerDeviceWebhookData,
            organizationId,
            injector
          );
        }
        return result;
      });
    },
    addAddressToCustomer: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          args,
          user,
          application
        );
        return injector
          .get(CustomerProvider)
          .addAddressToCustomer(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    removeAddressFromCustomer: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          args,
          user,
          application
        );
        return injector
          .get(CustomerProvider)
          .removeAddressFromCustomer(
            transactionEntityManager,
            args.input,
            organizationId
          );
      });
    },
    updateAddress: (
      { application, user }: IAuthResolverArgs,
      args,
      { injector }: { injector: Injector }
    ) => {
      return getConnection().transaction(transactionEntityManager => {
        const { organizationId } = setOrganizationToInput(
          args,
          user,
          application
        );
        return injector
          .get(CustomerProvider)
          .updateAddress(transactionEntityManager, args.input, organizationId);
      });
    }
  }
};
