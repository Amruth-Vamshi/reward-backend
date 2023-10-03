import { EntityManager, FindManyOptions } from "typeorm";
import { Injectable } from "@graphql-modules/di";
import { Organization } from "@walkinserver/walkin-core/src/entity";
import { RuleSet } from "../../../../walkin-core/src/entity/RuleSet";
import {
  Collections,
  CustomerLoyaltyProgram,
  LoyaltyProgramDetail
} from "../../entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { LoyaltyProgramConfig } from "../../entity/loyalty-program-config";
import { validationDecorator } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import { STATUS } from "@walkinserver/walkin-core/src/modules/common/constants";
import { REWARDX_ERRORS } from "../common/constants/errors";
import { CustomerLoyaltyProvider } from "../customer-loyalty/customer-loyalty.provider";
import Container from "typedi";
import { LoyaltyProgramDetailRepository } from "./loyalty-program-detail.repository";
import {
  addPaginateInfo,
  formatLoyaltyProgramCode,
  isValidString
} from "../../../../walkin-core/src/modules/common/utils/utils";
import { PageOptions } from "@walkinserver/walkin-core/src/graphql/generated-models";

@Injectable()
export class LoyaltyProgramDetailProvider {
  public async createLoyaltyProgramDetail(manager, injector, input) {
    const {
      organizationId,
      experimentName,
      description,
      loyaltyEarnRuleSetId,
      loyaltyProgramConfigId,
      extend,
      collectionIds
    } = input;
    let { experimentCode } = input;
    let createdCustomerLoyaltyPrograms = {};

    if (!isValidString(experimentCode)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_CODE);
    }

    experimentCode = formatLoyaltyProgramCode(experimentCode);

    const validationPromises = [];
    validationPromises.push(
      Organization.availableById(manager, organizationId)
    );

    if (loyaltyProgramConfigId)
      validationPromises.push(
        LoyaltyProgramConfig.availableByIdForOrganization(
          manager,
          loyaltyProgramConfigId,
          organizationId
        )
      );

    if (loyaltyEarnRuleSetId)
      validationPromises.push(
        RuleSet.availableById(manager, loyaltyEarnRuleSetId)
      );

    const isNotUnique = await manager
      .createQueryBuilder(LoyaltyProgramDetail, "detail")
      .where(
        "detail.experimentCode = :code and detail.organization = :organizationId",
        { code: experimentCode, organizationId }
      )
      .getOne();

    if (!isNotUnique) {
      validationPromises.push(true);
    } else {
      validationPromises.push({
        HTTP_CODE: 404,
        MESSAGE: `Loyalty Program Detail with the code: "${experimentCode}" already exists`,
        CODE: "LPDCAE"
      });
    }

    const createLoyaltyProgramDetailPromise = async () => {
      // Check if the LP Config already has any detail associated with it
      const existingLpDetailForConfig = await manager
        .createQueryBuilder(LoyaltyProgramDetail, "detail")
        .where(
          "detail.loyaltyProgramConfig = :loyaltyProgramConfigId and detail.organization = :organizationId",
          { loyaltyProgramConfigId, organizationId }
        )
        .getOne();
      if (existingLpDetailForConfig) {
        throw new WCoreError(
          WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_ID_ALREADY_LINKED
        );
      }

      let lpDetailInput = {
        experimentCode,
        experimentName,
        organization: organizationId,
        loyaltyProgramConfig: loyaltyProgramConfigId,
        loyaltyEarnRuleSet: loyaltyEarnRuleSetId,
        status: STATUS.ACTIVE
      };
      if (description) {
        lpDetailInput["description"] = description;
      }
      if (extend) {
        lpDetailInput["extend"] = extend;
      }
      if (collectionIds) {
        for (let index in collectionIds) {
          const tf = await Collections.availableById(
            manager,
            collectionIds[index]
          );
          if (tf != true) {
            throw new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND);
          }
        }
        for (let index in collectionIds) {
          let customerCollection = await manager.findOne(Collections, {
            where: { id: collectionIds[index], entity: "CUSTOMER" }
          });
          if (customerCollection) {
            let input2 = {
              experimentCode,
              loyaltyProgramConfigId,
              collectionsId: collectionIds[index],
              organizationId
            };
            createdCustomerLoyaltyPrograms = await this.createCustomerLoyaltyPrograms(
              manager,
              injector,
              input2
            );
          }
        }
        lpDetailInput["collectionIds"] = collectionIds;
      }

      const lpDetailSchema = await manager.create(
        LoyaltyProgramDetail,
        lpDetailInput
      );
      const savedConfig = await manager.save(lpDetailSchema);

      let inputTwo = { detailId: savedConfig.id, organizationId };
      const createdDetail = await Container.get(
        LoyaltyProgramDetailRepository
      ).getLoyaltyProgramDetailById(manager, injector, inputTwo);

      return { createdDetail, createdCustomerLoyaltyPrograms };
    };

    return validationDecorator(
      createLoyaltyProgramDetailPromise,
      validationPromises
    );
  }

  public async updateLoyaltyProgramDetail(manager, injector, input) {
    let createdCustomerLoyaltyPrograms = {};
    let disabledCustomerLoyaltyPrograms = {};
    let orgValid = await Organization.availableById(
      manager,
      input.organizationId
    );
    if (!orgValid) {
      throw new WCoreError(WCORE_ERRORS.CANNOT_ACCESS_OTHER_ORGANIZATION);
    }

    let inputTwo = {
      detailId: input.detailId,
      organizationId: input.organizationId
    };

    const detail = await Container.get(
      LoyaltyProgramDetailRepository
    ).getLoyaltyProgramDetailById(manager, injector, inputTwo);
    let existingCollections = detail.collectionIds;
    let updateObj: any = {};

    updateObj.description = input.description
      ? input.description
      : detail.description;
    if (input.loyaltyEarnRuleSetId) {
      const tf = await RuleSet.availableById(
        manager,
        input.loyaltyEarnRuleSetId
      );
      if (tf != true) {
        throw new WCoreError({
          HTTP_CODE: 500,
          MESSAGE: `Rule set with id: ${input.loyaltyEarnRuleSetId} doesn't exists`,
          CODE: "RSIDE"
        });
      } else {
        updateObj.loyaltyEarnRuleSet = input.loyaltyEarnRuleSetId;
      }
    }

    if (input.removeCollectionIds && input.removeCollectionIds.length > 0) {
      for (let i = 0; i < input.removeCollectionIds.length; i++) {
        const collectionId = input.removeCollectionIds[i];
        const isExists = await Collections.availableById(manager, collectionId);
        if (isExists != true) {
          throw new WCoreError(isExists);
        }
        const collectionToRemove = existingCollections.indexOf(collectionId);
        if (collectionToRemove != -1) {
          existingCollections.splice(collectionToRemove, 1);

          let customerCollection = await manager.findOne(Collections, {
            where: { id: collectionId, entity: "CUSTOMER" }
          });

          if (customerCollection) {
            disabledCustomerLoyaltyPrograms = await this.disableCustomerLoyaltyPrograms(
              manager,
              collectionId,
              detail.id
            );
          }
        }
      }
    }
    if (input.addCollectionIds && input.addCollectionIds.length > 0) {
      for (let i = 0; i < input.addCollectionIds.length; i++) {
        const collectionId = input.addCollectionIds[i];
        const isExists = await Collections.availableById(manager, collectionId);
        if (isExists != true) {
          throw new WCoreError(isExists);
        }
        if (existingCollections.indexOf(collectionId) == -1) {
          existingCollections.push(collectionId);
          inputTwo["collectionsId"] = collectionId;

          let customerCollection = await manager.findOne(Collections, {
            where: { id: collectionId, entity: "CUSTOMER" }
          });

          if (customerCollection) {
            createdCustomerLoyaltyPrograms = await this.createCustomerLoyaltyPrograms(
              manager,
              injector,
              inputTwo
            );
          }
        }
      }
    }

    if (input.addCollectionIds || input.removeCollectionIds) {
      updateObj.collectionIds = existingCollections;
    }

    await manager
      .createQueryBuilder()
      .update(LoyaltyProgramDetail)
      .set(updateObj)
      .where("id = :id", { id: inputTwo.detailId })
      .execute();

    const updatedDetail = await Container.get(
      LoyaltyProgramDetailRepository
    ).getLoyaltyProgramDetailById(manager, injector, inputTwo);
    return {
      updatedDetail,
      disabledCustomerLoyaltyPrograms,
      createdCustomerLoyaltyPrograms
    };
  }

  public async deleteLoyaltyProgramDetail(manager, injector, input) {
    let lpDetail = await this.getLoyaltyProgramDetailByCode(
      manager,
      injector,
      input
    );
    if (!lpDetail) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_DETAIL_NOT_FOUND);
    }
    const queryRunner = await manager.connection.createQueryRunner();
    for (let index in lpDetail.collectionIds) {
      let collectionEntity = await queryRunner.manager.query(
        `SELECT entity FROM collections WHERE id = '${lpDetail.collectionIds[index]}'`
      );
      if (collectionEntity[0].entity == "CUSTOMER") {
        await this.disableCustomerLoyaltyPrograms(
          manager,
          lpDetail.collectionIds[index],
          lpDetail.id
        );
      }
    }
    await queryRunner.release();
    return manager.remove(lpDetail);
  }

  public async getLoyaltyProgramDetails(manager, injector, organizationId) {
    let orgValid = await Organization.availableById(manager, organizationId);
    if (!orgValid) {
      throw new WCoreError(WCORE_ERRORS.CANNOT_ACCESS_OTHER_ORGANIZATION);
    }
    const lpDetails = await manager
      .getRepository(LoyaltyProgramDetail)
      .createQueryBuilder("detail")
      .leftJoinAndSelect("detail.organization", "organization")
      .leftJoinAndSelect("detail.loyaltyProgramConfig", "loyaltyProgramConfig")
      .leftJoinAndSelect("detail.loyaltyEarnRuleSet", "loyaltyEarnRuleSet")
      .where("detail.organization = :orgId", { orgId: organizationId })
      .getMany();

    if (!lpDetails) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_NOT_FOUND);
    }
    return lpDetails;
  }

  public async getLoyaltyProgramDetailByCodeSpecificFields(
    manager,
    injector,
    input
  ) {
    input.detailCode = formatLoyaltyProgramCode(input.detailCode);
    const lpDetail = await manager
      .getRepository(LoyaltyProgramDetail)
      .createQueryBuilder("detail")
      .leftJoin("detail.loyaltyProgramConfig", "loyaltyProgramConfig")
      .where("detail.organization = :orgId", { orgId: input.organizationId })
      .andWhere("detail.experimentCode = :code", { code: input.detailCode })
      .select(["detail.id", "loyaltyProgramConfig.id"])
      .getOne();

    if (!lpDetail) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_DETAIL_NOT_FOUND);
    }
    return lpDetail;
  }

  public async getLoyaltyProgramDetailByCode(manager, injector, input) {
    input.detailCode = formatLoyaltyProgramCode(input.detailCode);
    const lpDetail = await manager
      .getRepository(LoyaltyProgramDetail)
      .createQueryBuilder("detail")
      .leftJoinAndSelect("detail.organization", "organization")
      .leftJoinAndSelect("detail.loyaltyProgramConfig", "loyaltyProgramConfig")
      .leftJoinAndSelect("detail.loyaltyEarnRuleSet", "loyaltyEarnRuleSet")
      .where("detail.organization = :orgId", { orgId: input.organizationId })
      .andWhere("detail.experimentCode = :code", { code: input.detailCode })
      .getOne();

    if (!lpDetail) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_DETAIL_NOT_FOUND);
    }
    return lpDetail;
  }

  @addPaginateInfo
  public async getLoyaltyProgramDetailByConfigId(
    entityManager: EntityManager,
    {
      applicationId,
      organizationId,
      configId
    }: {
      applicationId?: string;
      organizationId?: string;
      configId?: Number;
    },
    pageOptions: PageOptions
  ): Promise<any> {
    const query: any = {
      organization: organizationId
    };
    if (applicationId) {
      query.application = applicationId;
    }

    if (configId) {
      query.loyaltyProgramConfig = configId;
    } else {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_ID_MANDATORY);
    }

    pageOptions = pageOptions || {};

    const options: FindManyOptions<any> = {};
    options.where = query;

    const page = Math.abs(pageOptions.page) || 1;
    const pageSize = Math.abs(pageOptions.pageSize) || 10;

    options.skip = (page - 1) * pageSize;
    options.take = pageSize;

    options.order = {
      id: "DESC"
    };
    options.relations = [
      "organization",
      "loyaltyProgramConfig",
      "loyaltyEarnRuleSet"
    ];

    const lpConfigDetail = await entityManager.findAndCount(
      LoyaltyProgramDetail,
      options
    );

    return lpConfigDetail;
  }

  public async createCustomerLoyaltyPrograms(manager, injector, input) {
    let {
      collectionsId,
      organizationId,
      detailId,
      experimentCode,
      loyaltyProgramConfigId
    } = input;
    let createdCustomerLoyaltyPrograms: string[] = [];
    let clpInput;
    let lpConfig;

    const queryRunner = await manager.connection.createQueryRunner();

    let collectionItems = await queryRunner.manager.query(
      `SELECT * FROM collections_items WHERE collections_id = '${collectionsId}'`
    );

    if (experimentCode && loyaltyProgramConfigId) {
      lpConfig = await queryRunner.manager.query(
        `SELECT * FROM loyalty_program_config WHERE id = '${loyaltyProgramConfigId}' and organization_id='${organizationId}' `
      );
      clpInput = {
        loyaltyProgramCode: lpConfig[0].code,
        loyaltyExperimentCode: experimentCode
      };
    } else {
      lpConfig = await queryRunner.manager.query(
        `SELECT * FROM loyalty_program_detail 
        INNER JOIN loyalty_program_config ON loyalty_program_detail.loyalty_program_config_id = loyalty_program_config.id 
        WHERE  loyalty_program_detail.id= '${detailId}' AND loyalty_program_detail.organization_id = '${organizationId}'`
      );
      clpInput = {
        loyaltyProgramCode: lpConfig[0].code,
        loyaltyExperimentCode: lpConfig[0].experiment_code
      };
    }

    for (let index in collectionItems) {
      let customer = await queryRunner.manager.query(
        `SELECT * FROM customer WHERE id = '${collectionItems[index].item_id}'`
      );
      let customerLoyalty = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty WHERE customer_id= '${collectionItems[index].item_id}'`
      );
      if (customerLoyalty.length < 1) {
        let loyaltyCard = await queryRunner.manager.query(
          `SELECT * FROM loyalty_card WHERE id= '${lpConfig[0].loyalty_card_id}'`
        );
        if (loyaltyCard.length < 1) {
          throw new WCoreError(REWARDX_ERRORS.LOYALTY_CARD_NOT_FOUND);
        }
        customerLoyalty = await injector
          .get(CustomerLoyaltyProvider)
          .createCustomerLoyalty(manager, injector, {
            loyaltyCardCode: loyaltyCard[0].code,
            externalCustomerId: customer[0].externalCustomerId,
            phoneNumber: customer[0].phoneNumber,
            customerIdentifier: customer[0].customerIdentifier,
            organizationId
          });
        clpInput["customerLoyalty"] = customerLoyalty.id;
      } else {
        clpInput["customerLoyalty"] = customerLoyalty[0].id;
      }

      let alreadyExists = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty_program WHERE loyalty_program_code = '${clpInput.loyaltyProgramCode}' AND loyalty_experiment_code = '${clpInput.loyaltyExperimentCode}' AND customer_loyalty_id = '${clpInput.customerLoyalty}'`
      );
      if (alreadyExists[0] != null || alreadyExists[0] != undefined) {
        await queryRunner.manager.query(
          `UPDATE customer_loyalty_program SET status = 'ACTIVE' WHERE id = '${alreadyExists[0].id}'`
        );
        createdCustomerLoyaltyPrograms.push(alreadyExists[0].id);
        continue;
      }

      let customerLoyaltyProgramSchema = await manager.create(
        CustomerLoyaltyProgram,
        clpInput
      );
      let customerLoyaltyProgram = await manager.save(
        customerLoyaltyProgramSchema
      );
      createdCustomerLoyaltyPrograms.push(customerLoyaltyProgram.id);
    }
    await queryRunner.release();
    return createdCustomerLoyaltyPrograms;
  }

  public async disableCustomerLoyaltyPrograms(
    manager,
    collectionsId,
    detailId
  ) {
    let disabledCustomerLoyaltyPrograms: string[] = [];
    const queryRunner = await manager.connection.createQueryRunner();
    const collectionItems = await queryRunner.manager.query(
      `SELECT * FROM collections_items WHERE collections_id = '${collectionsId}'`
    );
    const lpDetail = await queryRunner.manager.query(
      `SELECT * FROM loyalty_program_detail WHERE id = '${detailId}'`
    );
    const lpConfig = await queryRunner.manager.query(
      `SELECT * FROM loyalty_program_config WHERE id = '${lpDetail[0].loyalty_program_config_id}'`
    );
    for (let index in collectionItems) {
      let customerLoyalty = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty WHERE customer_id= '${collectionItems[index].item_id}'`
      );
      const customerLoyaltyProgram = await queryRunner.manager.query(
        `SELECT * FROM customer_loyalty_program WHERE customer_loyalty_id = '${customerLoyalty[0].id}' AND loyalty_experiment_code = '${lpDetail[0].experiment_code}' AND loyalty_program_code = '${lpConfig[0].code}'`
      );
      if (
        customerLoyaltyProgram[0] != null ||
        customerLoyaltyProgram[0] != undefined
      ) {
        await queryRunner.manager.query(
          `UPDATE customer_loyalty_program SET status = 'INACTIVE' WHERE id = '${customerLoyaltyProgram[0].id}'`
        );
        disabledCustomerLoyaltyPrograms.push(customerLoyaltyProgram[0].id);
      }
    }
    await queryRunner.release();
    return disabledCustomerLoyaltyPrograms;
  }
}
