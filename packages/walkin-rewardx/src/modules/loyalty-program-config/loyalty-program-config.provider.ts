import { EntityManager } from "typeorm";
import { Injectable, Injector } from "@graphql-modules/di";
import { Organization } from "@walkinserver/walkin-core/src/entity";
import { RuleSet } from "../../../../walkin-core/src/entity/RuleSet";
import { Campaign, LoyaltyCard, LoyaltyProgramDetail } from "../../entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import { LoyaltyProgramConfig } from "../../entity/loyalty-program-config";
import { validationDecorator } from "@walkinserver/walkin-core/src/modules/common/validations/Validations";
import {
  formatLoyaltyProgramCode,
  isValidString
} from "../../../../walkin-core/src/modules/common/utils/utils";

@Injectable()
export class LoyaltyProgramConfigProvider {
  public async createLoyaltyProgramConfig(manager, injector, input) {
    const {
      organizationId,
      campaignId,
      loyaltyCardId,
      name,
      description,
      loyaltyBurnRuleSetId,
      cancelTransactionRules,
      extend,
      expiryUnit,
      expiryValue,
      applicableEvents
    } = input;
    let { code } = input;

    if (!isValidString(code)) {
      throw new WCoreError(WCORE_ERRORS.INVALID_CODE);
    }

    code = formatLoyaltyProgramCode(code);

    const validationPromises = [];
    validationPromises.push(
      await Organization.availableById(manager, organizationId)
    );

    validationPromises.push(
      await LoyaltyCard.availableById(manager, loyaltyCardId)
    );

    if (loyaltyBurnRuleSetId)
      validationPromises.push(
        await RuleSet.availableById(manager, loyaltyBurnRuleSetId)
      );

    if (campaignId) {
      validationPromises.push(
        await Campaign.availableByIdForOrganization(
          manager,
          campaignId,
          organizationId
        )
      );
    }

    const isNotUnique = await manager
      .createQueryBuilder(LoyaltyProgramConfig, "config")
      .where("config.code = :code and config.organization = :organizationId", {
        code,
        organizationId
      })
      .getOne();

    if (!isNotUnique) {
      validationPromises.push(true);
    } else {
      validationPromises.push({
        HTTP_CODE: 404,
        MESSAGE: `Loyalty Program Config with the code: ${code} already exists`,
        CODE: "LPCCAE"
      });
    }

    const createLoyaltyProgramConfigPromise = async () => {
      let lpConfigInput: any = {
        code,
        name,
        organization: organizationId,
        loyaltyCard: loyaltyCardId,
        loyaltyBurnRuleSet: loyaltyBurnRuleSetId
      };

      lpConfigInput.description = description ? description : null;
      lpConfigInput.cancelTransactionRules = cancelTransactionRules
        ? cancelTransactionRules
        : null;
      lpConfigInput.extend = extend ? extend : null;
      lpConfigInput.expiryUnit = expiryUnit ? expiryUnit : null;
      lpConfigInput.expiryValue = expiryValue ? expiryValue : null;
      lpConfigInput.applicableEvents = applicableEvents
        ? applicableEvents
        : null;
      lpConfigInput.cancelTransactionRules = {
        allowCancellation: true,
        allowCancelForCompleted: true,
        trackNegativePoints: true
      };

      const lpConfigSchema = await manager.create(
        LoyaltyProgramConfig,
        lpConfigInput
      );
      const savedConfig = await manager.save(lpConfigSchema);
      const created = await manager
        .createQueryBuilder(LoyaltyProgramConfig, "config")
        .where("config.id = :id", { id: savedConfig.id })
        .getOne();

      let inputTwo = { configId: created.id, organizationId };
      const createdConfig = await this.getLoyaltyProgramConfigsById(
        manager,
        injector,
        inputTwo
      );

      return createdConfig;
    };

    return validationDecorator(
      createLoyaltyProgramConfigPromise,
      validationPromises
    );
  }

  public async updateLoyaltyProgramConfig(manager, injector, input) {
    let orgValid = await Organization.availableById(
      manager,
      input.organizationId
    );
    if (!orgValid) {
      throw new WCoreError(WCORE_ERRORS.CANNOT_ACCESS_OTHER_ORGANIZATION);
    }

    let inputTwo = { configId: input.id, organizationId: input.organizationId };
    const config = await this.getLoyaltyProgramConfigsById(
      manager,
      injector,
      inputTwo
    );

    let updateObj: any = {};

    updateObj.description = input.description
      ? input.description
      : config.description
      ? config.description
      : null;
    updateObj.expiryValue = input.expiryValue
      ? input.expiryValue
      : config.expiryValue
      ? config.expiryValue
      : null;
    updateObj.expiryUnit = input.expiryUnit
      ? input.expiryUnit
      : config.expiryUnit
      ? config.expiryUnit
      : null;
    updateObj.extended = input.extended
      ? input.extended
      : config.extended
      ? config.extended
      : null;
    if (input.loyaltyBurnRuleSetId) {
      let tf = await RuleSet.availableById(manager, input.loyaltyBurnRuleSetId);
      if (tf == true) {
        updateObj.loyaltyBurnRuleSet = input.loyaltyBurnRuleSetId;
      } else {
        throw new WCoreError({
          HTTP_CODE: 500,
          MESSAGE: `Rule set with id: ${input.loyaltyBurnRuleSetId} doesn't exists`,
          CODE: "RSIDE"
        });
      }
    }
    updateObj.cancelTransactionRules = input.cancelTransactionRules
      ? input.cancelTransactionRules
      : config.cancelTransactionRules
      ? config.cancelTransactionRules
      : null;
    updateObj.applicableEvents = input.applicableEvents
      ? input.applicableEvents
      : config.applicableEvents
      ? config.applicableEvents
      : null;

    console.log(updateObj);

    await manager
      .createQueryBuilder()
      .update(LoyaltyProgramConfig)
      .set(updateObj)
      .where("id = :id", { id: inputTwo.configId })
      .execute();

    const updatedConfig = await this.getLoyaltyProgramConfigsById(
      manager,
      injector,
      inputTwo
    );
    return updatedConfig;
  }

  public async deleteLoyaltyProgramConfig(manager, injector, input) {
    let lpConfig = await this.getLoyaltyProgramConfigsById(
      manager,
      injector,
      input
    );
    if (!lpConfig) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_NOT_FOUND);
    }
    const depended = await manager
      .createQueryBuilder(LoyaltyProgramDetail, "detail")
      .leftJoinAndSelect("detail.loyaltyEarnRuleSet", "loyaltyEarnRuleSet")
      .where("detail.loyaltyProgramConfig= :id", { id: lpConfig.id })
      .getMany();

    if (depended.length != 0) {
      throw new WCoreError({
        HTTP_CODE: 500,
        MESSAGE: `This Loyalty Program Config cannot be deleted as it has one or more Loyalty Program Details are under it.`,
        CODE: "RSIDE"
      });
    }
    return manager.remove(lpConfig);
  }

  public async getLoyaltyProgramConfigs(manager, injector, input) {
    const orgValid = await Organization.availableById(
      manager,
      input.organizationId
    );

    if (!orgValid) {
      throw new WCoreError(WCORE_ERRORS.CANNOT_ACCESS_OTHER_ORGANIZATION);
    }

    let whereCondition = "config.organization = :orgId";
    const whereConditionObject = { orgId: input.organizationId };

    if (input.loyaltyCardCode) {
      whereCondition =
        whereCondition + " and loyaltyCard.code = :loyaltyCardCode";
      whereConditionObject["loyaltyCardCode"] = input.loyaltyCardCode;
    }

    const lpConfigs = await manager
      .getRepository(LoyaltyProgramConfig)
      .createQueryBuilder("config")
      .leftJoinAndSelect("config.organization", "organization")
      .leftJoinAndSelect("config.campaign", "campaign")
      .leftJoinAndSelect("config.loyaltyCard", "loyaltyCard")
      .leftJoinAndSelect("config.loyaltyBurnRuleSet", "loyaltyBurnRuleSet")
      .where(whereCondition, whereConditionObject)
      .getMany();

    if (!lpConfigs) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_NOT_FOUND);
    }

    return lpConfigs;
  }

  public async getLoyaltyProgramConfigsByIdSpecificFields(
    manager,
    injector,
    input
  ) {
    const lpConfig = await manager
      .getRepository(LoyaltyProgramConfig)
      .createQueryBuilder("config")
      .where("config.organization = :orgId", { orgId: input.organizationId })
      .andWhere("config.id = :id", { id: input.configId })
      .select(["config.id", "config.cancelTransactionRules"])
      .getOne();

    if (!lpConfig) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_NOT_FOUND);
    }
    return lpConfig;
  }

  public async getLoyaltyProgramConfigsById(manager, injector, input) {
    const lpConfig = await manager
      .getRepository(LoyaltyProgramConfig)
      .createQueryBuilder("config")
      .leftJoinAndSelect("config.organization", "organization")
      // .leftJoinAndSelect("config.campaign", "campaign")
      .leftJoinAndSelect("config.loyaltyCard", "loyaltyCard")
      .leftJoinAndSelect("config.loyaltyBurnRuleSet", "loyaltyBurnRuleSet")
      .where("config.organization = :orgId", { orgId: input.organizationId })
      .andWhere("config.id = :id", { id: input.configId })
      .getOne();

    if (!lpConfig) {
      throw new WCoreError(WCORE_ERRORS.LOYALTY_PROGRAM_CONFIG_NOT_FOUND);
    }
    return lpConfig;
  }
}
