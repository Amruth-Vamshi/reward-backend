import { Injectable } from "@graphql-modules/di";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import {
  CustomerLoyalty,
  CustomerLoyaltyProgram,
  LoyaltyProgramConfig,
  LoyaltyProgramDetail
} from "../../entity";
import { formatLoyaltyProgramCode, validateStatus } from "../../../../walkin-core/src/modules/common/utils/utils";
import { validationDecorator } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";

@Injectable()
export class CustomerLoyaltyProgramProvider {
  public async createCustomerLoyaltyProgram(manager, input) {
    let {
      customerLoyaltyId,
      loyaltyExperimentCode: experimentCode,
      loyaltyProgramCode: configCode
    } = input;

    experimentCode = formatLoyaltyProgramCode(experimentCode);
    let alreadyExists = await this.getCustomerLoyaltyProgramsByFilters(
      manager,
      input
    );
    if (alreadyExists.length == 1) {
      return this.enableCustomerLoyaltyProgram(manager, alreadyExists[0].id);
    }

    const validationPromises = [];
    validationPromises.push(
      CustomerLoyalty.availableById(manager, customerLoyaltyId)
    );

    async function validateDetailCode(manager, experimentCode) {
      const detail = await manager.findOne(LoyaltyProgramDetail, {
        where: { experimentCode: experimentCode }
      });
      if (detail != null || detail != undefined) {
        return true;
      }
      return WCORE_ERRORS.LOYALTY_PROGRAM_DETAIL_NOT_FOUND;
    }
    validationPromises.push(validateDetailCode(manager, experimentCode));

    async function validateConfigCode(manager, configCode) {
      const config = await manager.findOne(LoyaltyProgramConfig, {
        where: { code: configCode }
      });
      if (config != null || config != undefined) {
        return true;
      }
      return WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_NOT_FOUND;
    }
    validationPromises.push(validateConfigCode(manager, configCode));

    let createCustomerLoyaltyProgramPromise = async () => {
      if (input.status) {
        const validStatus = await validateStatus(input.status);
        if (!validStatus) {
          throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
        }
      }
      let input2 = {
        customerLoyalty: customerLoyaltyId,
        loyaltyExperimentCode: experimentCode,
        loyaltyProgramCode: configCode
      };
      const newCustomerLoyaltyProgram = await manager.create(
        CustomerLoyaltyProgram,
        input2
      );
      const newSavedCustomerLoyaltyProgram = await manager.save(
        newCustomerLoyaltyProgram
      );
      return manager.findOne(CustomerLoyaltyProgram, {
        where: { id: newSavedCustomerLoyaltyProgram.id },
        relation: ["customerLoyalty"]
      });
    };
    return validationDecorator(
      createCustomerLoyaltyProgramPromise,
      validationPromises
    );
  }

  public async enableCustomerLoyaltyProgram(manager, customerLoyaltyProgramId) {
    const queryRunner = await manager.connection.createQueryRunner();
    const customerLoyaltyProgram = await queryRunner.manager.query(
      `SELECT * FROM customer_loyalty_program WHERE id = '${customerLoyaltyProgramId}'`
    );
    if (
      customerLoyaltyProgram[0] == null ||
      customerLoyaltyProgram[0] == undefined
    ) {
      throw new WCoreError(WCORE_ERRORS.CUSTOMER_LOYALTY_PROGRAM_NOT_FOUND);
    }
    await queryRunner.manager.query(
      `UPDATE customer_loyalty_program SET status = 'ACTIVE' WHERE id = '${customerLoyaltyProgramId}'`
    );
    await queryRunner.release();
    return manager.findOne(CustomerLoyaltyProgram, {
      where: { id: customerLoyaltyProgramId },
      relations: ["customerLoyalty"]
    });
  }

  public async getCustomerLoyaltyProgramById(
    manager,
    customerLoyaltyProgramId
  ) {
    const queryRunner = await manager.connection.createQueryRunner();
    const customerLoyaltyProgram = await queryRunner.manager.query(
      `SELECT customer_loyalty_program.id AS id, customer_loyalty_program.loyalty_program_code AS loyaltyProgramCode, 
            customer_loyalty_program.loyalty_experiment_code AS loyaltyExperimentCode, customer_loyalty_program.redeemed_transactions AS redeemedTransactions,
            customer_loyalty_program.issued_transactions AS issuedTransactions, customer_loyalty_program.customer_loyalty_id AS customerLoyaltyId, customer_loyalty_program.status AS status 
            FROM customer_loyalty_program WHERE id = '${customerLoyaltyProgramId}'`
    );
    if (
      customerLoyaltyProgram[0] == null ||
      customerLoyaltyProgram[0] == undefined
    ) {
      throw new WCoreError(WCORE_ERRORS.CUSTOMER_LOYALTY_PROGRAM_NOT_FOUND);
    }
    await queryRunner.release();
    return customerLoyaltyProgram[0];
  }

  public async getCustomerLoyaltyProgramsByFilters(manager, input) {
    let {
      customerLoyaltyId,
      loyaltyProgramCode,
      loyaltyExperimentCode,
      status
    } = input;
    const queryRunner = await manager.connection.createQueryRunner();
    if (
      (customerLoyaltyId == undefined || customerLoyaltyId == null) &&
      (loyaltyProgramCode == undefined || loyaltyProgramCode == null) &&
      (loyaltyExperimentCode == undefined || loyaltyExperimentCode == null) &&
      (status == undefined || status == null)
    ) {
      throw new WCoreError({
        HTTP_CODE: 400,
        MESSAGE: "Specify at least one filter to get Customer Loyalty Programs",
        CODE: "CCNS"
      });
    }
    let query = `SELECT customer_loyalty_program.id AS id, customer_loyalty_program.loyalty_program_code AS loyaltyProgramCode, 
            customer_loyalty_program.loyalty_experiment_code AS loyaltyExperimentCode, customer_loyalty_program.redeemed_transactions AS redeemedTransactions,
            customer_loyalty_program.issued_transactions AS issuedTransactions, customer_loyalty_program.customer_loyalty_id AS customerLoyaltyId, customer_loyalty_program.status AS status 
            FROM customer_loyalty_program`;

    let whereOptions = {};
    if (customerLoyaltyId) {
      whereOptions["customer_loyalty_id"] = customerLoyaltyId;
    }
    if (loyaltyProgramCode) {
      whereOptions["loyalty_program_code"] = loyaltyProgramCode;
    }
    if (loyaltyExperimentCode) {
      whereOptions["loyalty_experiment_code"] = loyaltyExperimentCode;
    }
    if (status == "ACTIVE" || status == "INACTIVE") {
      whereOptions["status"] = status;
    }
    let i = 0;
    for (const key in whereOptions) {
      const value = whereOptions[`${key}`];
      if (i == 0)
        query += ` WHERE ${key}=${typeof value == "string" ? `'${value}'` : value
          }`;
      else
        query += ` AND ${key}=${typeof value == "string" ? `'${value}'` : value
          }`;
      i++;
    }
    const customerLoyaltyPrograms = await queryRunner.manager.query(query);
    await queryRunner.release();
    return customerLoyaltyPrograms;
  }

  public async disableCustomerLoyatlyProgramById(
    manager,
    customerLoyaltyProgramId
  ) {
    const queryRunner = await manager.connection.createQueryRunner();
    await queryRunner.manager.query(
      `UPDATE customer_loyalty_program SET status = 'INACTIVE' WHERE id = '${customerLoyaltyProgramId}'`
    );
    let query = `SELECT customer_loyalty_program.id AS id, customer_loyalty_program.loyalty_program_code AS loyaltyProgramCode, 
            customer_loyalty_program.loyalty_experiment_code AS loyaltyExperimentCode, customer_loyalty_program.redeemed_transactions AS redeemedTransactions,
            customer_loyalty_program.issued_transactions AS issuedTransactions, customer_loyalty_program.customer_loyalty_id AS customerLoyaltyId, customer_loyalty_program.status AS status 
            FROM customer_loyalty_program WHERE id = '${customerLoyaltyProgramId}'`;
    const customerLoyaltyProgram = await queryRunner.manager.query(query);
    await queryRunner.release();
    return customerLoyaltyProgram[0];
  }
}
