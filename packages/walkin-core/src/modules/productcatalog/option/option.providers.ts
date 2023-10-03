import { Inject, Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import { CategoryProductOption, Option, OptionValue } from "../../../entity";
import { ProductOptionValue } from "../../../entity/ProductOptionValue";
import {
  CACHING_KEYS,
  EXPIRY_MODE,
  SHORT_CACHE_TTL
} from "../../common/constants";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import {
  clearEntityCache,
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { sortOptionBySeq, updateEntity } from "../../common/utils/utils";
import { validationDecorator } from "../../common/validations/Validations";
@Injectable()
export class OptionProvider {
  public async getOptionById(transactionManager, input) {
    const options: any = {};

    if (input.id) {
      options.id = input.id;
    }

    if (input.organizationId) {
      options.organization = {
        id: input.organizationId
      };
    }

    return transactionManager.findOne(Option, {
      where: {
        ...options
      },
      relations: ["organization"]
    });
  }

  public getAllOptions(transactionManager, input) {
    const options: any = {};

    if (input.organizationId) {
      options.organization = {
        id: input.organizationId
      };
    }

    return transactionManager.find(Option, {
      where: {
        ...options
      },
      order: {
        sortSeq: "ASC"
      },
      relations: ["organization"]
    });
  }

  public async createOption(transactionManager, input) {
    if (input.organizationId) {
      input.organization = {
        id: input.organizationId
      };
      delete input.organizationId;
    }

    const newOption = transactionManager.create(Option, input);
    const savedOption = await transactionManager.save(newOption);
    if (input.optionValues) {
      for (const optionValue of input.optionValues) {
        const optionValueEntity = transactionManager.create(
          OptionValue,
          optionValue
        );
        optionValueEntity.option = savedOption;
        await transactionManager.save(optionValueEntity);
      }
    }

    return savedOption;
  }

  public updateOption(transactionManager, input) {
    const validationPromises = [];
    if (input.id) {
      validationPromises.push(
        Option.availableByIdForOrganization(
          transactionManager,
          input.id,
          input.organizationId
        )
      );
    }

    if (input.organizationId) {
      input.organization = {
        id: input.organizationId
      };
      delete input.organizationId;
    }

    const updateOptionPromise = async () => {
      const mergedOption = await transactionManager.preload(Option, {
        ...input,
        id: Number(input.id)
      });
      const keys = [`${CACHING_KEYS.OPTION}_${input.id}`];
      removeValueFromCache(keys);

      await clearEntityCache("productOptionValue", () => {
        console.log("ProductOptionValue Cache removed");
      });
      await clearEntityCache("optionValue", () => {
        console.log("optionValue Cache removed");
      });
      return transactionManager.save(Option, mergedOption);
    };
    return validationDecorator(updateOptionPromise, validationPromises);
  }

  public async updateOptionSortSeq(transactionManager, input) {
    const { optionSeq, organizationId } = input;

    if (optionSeq.length === 0) {
      throw new WCoreError(WCORE_ERRORS.OPTION_DETAILS_EMPTY);
    }

    const optionCacheKey = [];
    const updateOptionSchema = [];

    for (const option of optionSeq) {
      const optionId = option.id;
      const optionDetails = await transactionManager.findOne(Option, {
        where: {
          id: optionId,
          organization: organizationId
        }
      });

      if (!optionDetails) {
        const optionNotFoundError = Object.assign(
          {},
          WCORE_ERRORS.OPTION_NOT_FOUND
        );
        optionNotFoundError.MESSAGE = `Option ${optionId} not found`;
        throw new WCoreError(optionNotFoundError);
      }

      updateEntity(optionDetails, option);
      updateOptionSchema.push(optionDetails);
      optionCacheKey.push(`${CACHING_KEYS.OPTION}_${optionId}`);
    }

    // Clear option cache
    removeValueFromCache(optionCacheKey);

    // Clear option and optionValue entity cache
    await clearEntityCache("productOptionValue", () => {
      console.log("ProductOptionValue Cache removed");
    });
    await clearEntityCache("optionValue", () => {
      console.log("optionValue Cache removed");
    });

    const savedOptionDetails = await transactionManager.save(
      updateOptionSchema
    );
    return savedOptionDetails;
  }

  public async getOptionByOptionId(transactionManager, input) {
    const options: any = {};
    if (input.optionId) {
      options.id = input.optionId;
    }

    if (input.organizationId) {
      options.organization = {
        id: input.organizationId
      };
    }

    return transactionManager.findOne(Option, {
      where: {
        ...options
      },
      relations: ["organization"]
    });
  }

  public async getOptionsByProductId(transactionManager, productId) {
    const productOptions = await transactionManager
      .getRepository(CategoryProductOption)
      .createQueryBuilder("categoryProductOption")
      .leftJoinAndSelect("categoryProductOption.product", "product")
      .leftJoinAndSelect("categoryProductOption.option", "option")
      .where("product.id=  :productId", {
        productId
      })
      .orderBy("option.sortSeq", "ASC")
      .getMany();

    const optionIds = [];
    const resultedArray = [];
    for (const optionDetail of productOptions) {
      if (!optionIds.includes(optionDetail.optionId)) {
        optionIds.push(optionDetail.optionId);
      }
    }
    if (optionIds.length > 0) {
      const options = await this.getOptionByIds(transactionManager, optionIds);

      const optionValues = await transactionManager.find(OptionValue, {
        where: {
          option: {
            id: In(optionIds)
          },
          order: {
            sortSeq: "ASC"
          },
          relations: ["option", "option.organization"]
        }
      });

      for (const option of options) {
        const optionValueArray = [];
        for (const optionValue of optionValues) {
          if (option.id == optionValue.optionId) {
            optionValueArray.push(optionValue);
            option["optionValues"] = optionValueArray;
          }
        }
        resultedArray.push(option);
      }
    }
    return resultedArray;
  }
  public async optionValueByProductId(
    transactionManager,
    productId,
    toWebhooks = false
  ) {
    const productOptions = await transactionManager.find(
      CategoryProductOption,
      {
        where: {
          product: {
            id: productId
          }
        }
      }
    );

    var productOptionIds = [];
    var optionIds = [];
    if (productOptions) {
      for (const optionDetail of productOptions) {
        productOptionIds.push(optionDetail.id);
        if (!optionIds.includes(optionDetail.optionId)) {
          optionIds.push(optionDetail.optionId);
        }
      }
    }

    if (productOptionIds.length > 0) {
      var productOptionValues = await this.getProductOptionValueByOptionIds(
        transactionManager,
        productOptionIds
      );
    }

    var optionValueIds = [];
    if (productOptionValues) {
      for (const optionValues of productOptionValues) {
        if (!optionValueIds.includes(optionValues.optionValueId)) {
          optionValueIds.push(optionValues.optionValueId);
        }
      }
    }
    var resultedArray = [];
    if (optionValueIds.length > 0) {
      var optionValues = await this.getOptionValueByIds(
        transactionManager,
        optionValueIds
      );

      var resultedObject = {};
      for (const optionValue of optionValues) {
        resultedObject = optionValue.option;
        if (!resultedObject.hasOwnProperty("optionValues")) {
          resultedObject["optionValues"] = [];
        }
        resultedObject["optionValues"].push(optionValue);
        if (!resultedArray.includes(resultedObject)) {
          resultedArray.push(resultedObject);
        }
      }
    }

    if (toWebhooks) {
      for (const newOption of resultedArray) {
        const newOptionValues = newOption.optionValues;
        for (const newOptionValue of newOptionValues) {
          delete newOptionValue.option;
        }
      }
    }

    return resultedArray;
  }

  public async getProductOptionValueByOptionIds(
    entityManager: EntityManager,
    productOptionIds
  ) {
    const productOptionIdsTobeFetched: any = [];
    const foundProductOptionValueData = [];
    for (const productOptionId of productOptionIds) {
      const key = `${CACHING_KEYS.PRODUCT_OPTION_VALUE}_${productOptionId}`;
      let foundProductOptionValue: any = await getValueFromCache(key);
      if (foundProductOptionValue) {
        foundProductOptionValueData.push(foundProductOptionValue);
      } else {
        productOptionIdsTobeFetched.push(productOptionId);
      }
    }

    let productOptionValueArray = [];
    if (productOptionIdsTobeFetched.length > 0) {
      productOptionValueArray = await entityManager.find(ProductOptionValue, {
        where: {
          productOption: {
            id: In(productOptionIdsTobeFetched)
          }
        }
      });
      for (const productOptionValue of productOptionValueArray) {
        const key = `${CACHING_KEYS.PRODUCT_OPTION_VALUE}_${productOptionValue.productOptionId}`;
        await setValueToCache(
          key,
          productOptionValue,
          EXPIRY_MODE.EXPIRE,
          SHORT_CACHE_TTL
        );
      }
    }
    productOptionValueArray = [
      ...foundProductOptionValueData,
      ...productOptionValueArray
    ];

    return productOptionValueArray;
  }
  public async getOptionValueByIds(
    entityManager: EntityManager,
    optionValueIds
  ) {
    const optionValueIdsTobeFetched: any = [];
    const foundOptionValueData = [];
    for (const optionValueId of optionValueIds) {
      const key = `${CACHING_KEYS.OPTION_VALUE}_${optionValueId}`;
      let foundOptionValue: any = await getValueFromCache(key);
      if (foundOptionValue) {
        foundOptionValueData.push(foundOptionValue);
      } else {
        optionValueIdsTobeFetched.push(optionValueId);
      }
    }

    let optionValueArray = [];
    if (optionValueIdsTobeFetched.length > 0) {
      optionValueArray = await entityManager.find(OptionValue, {
        where: {
          id: In(optionValueIdsTobeFetched)
        },
        order: {
          sortSeq: "ASC"
        },
        relations: ["option", "option.organization"]
      });

      for (const optionValue of optionValueArray) {
        const key = `${CACHING_KEYS.OPTION_VALUE}_${optionValue.id}`;
        await setValueToCache(
          key,
          optionValue,
          EXPIRY_MODE.EXPIRE,
          SHORT_CACHE_TTL
        );
      }
    }

    optionValueArray = [...foundOptionValueData, ...optionValueArray];

    /**
     * OptionValueArray is formed using data stored in memory and data fetched from DB.
     * In memory, Options data is not sorted as independent objects are stored against optionValueId and later combined in foundOptionValueData.
     * so it needs to be sorted wrt Option sortSeq
     */
    sortOptionBySeq(optionValueArray);

    return optionValueArray;
  }

  public async getOptionByIds(entityManager: EntityManager, optionIds) {
    const optionIdsTobeFetched: any = [];
    const foundOptionData = [];
    for (const optionId of optionIds) {
      const key = `${CACHING_KEYS.OPTION}_${optionId}`;
      let foundOption: any = await getValueFromCache(key);
      if (foundOption) {
        foundOptionData.push(foundOption);
      } else {
        if (!optionIdsTobeFetched.includes(optionId)) {
          optionIdsTobeFetched.push(optionId);
        }
      }
    }

    let optionArray = [];
    if (optionIdsTobeFetched.length > 0) {
      optionArray = await entityManager.find(Option, {
        where: {
          id: In(optionIdsTobeFetched)
        },
        order: {
          sortSeq: "ASC"
        },
        relations: ["organization"]
      });

      for (const option of optionArray) {
        const key = `${CACHING_KEYS.OPTION}_${option.id}`;
        await setValueToCache(key, option, EXPIRY_MODE.EXPIRE, SHORT_CACHE_TTL);
      }
    }
    optionArray = [...foundOptionData, ...optionArray];
    return optionArray;
  }
  public async removeOptionsForProduct(transactionManager, productId) {
    const productOptions = await transactionManager
      .getRepository(CategoryProductOption)
      .createQueryBuilder("categoryProductOption")
      .leftJoinAndSelect("categoryProductOption.product", "product")
      .leftJoinAndSelect("categoryProductOption.option", "option")
      .where("product.id=  :productId", {
        productId
      })
      .orderBy("option.sortSeq", "ASC")
      .getMany();

    if (productOptions.length > 0) {
      const removeProductOption = await transactionManager.remove(
        productOptions
      );
      return removeProductOption;
    }
    return;
  }
}
@Injectable()
export class OptionValueProvider {
  public getOptionalValueById(transactionManager, id) {
    return OptionValue.findOne(transactionManager, id);
  }

  public getOptionValuesByOptionId(transactionManager, optionId) {
    return transactionManager.find(OptionValue, {
      where: {
        option: {
          id: optionId
        }
      },
      order: {
        sortSeq: "ASC"
      },
      relations: ["option"]
    });
  }

  public createOptionValue(transactionManager, optionValue) {
    const validationPromises = [];
    if (optionValue.optionId) {
      validationPromises.push(
        Option.availableById(transactionManager, optionValue.optionId)
      );
    }

    const createOptionValuePromise = () => {
      const newOptionValue = transactionManager.create(
        OptionValue,
        optionValue
      );
      newOptionValue.option = transactionManager.create(Option, {
        id: optionValue.optionId
      });
      return transactionManager.save(newOptionValue);
    };

    return validationDecorator(createOptionValuePromise, validationPromises);
  }

  public updateOptionValue(transactionManager, optionValue) {
    const validationPromises = [];
    if (optionValue.optionId) {
      validationPromises.push(
        Option.availableById(transactionManager, optionValue.optionId)
      );
    }

    const updateOptionValuePromise = async () => {
      const mergedOptionValue = await transactionManager.preload(OptionValue, {
        ...optionValue,
        id: Number(optionValue.id)
      });
      mergedOptionValue.option = transactionManager.create(Option, {
        id: optionValue.optionId
      });
      const keys = [`${CACHING_KEYS.OPTION_VALUE}_${optionValue.id}`];
      removeValueFromCache(keys);
      await clearEntityCache("productOptionValue", () => {
        console.log("ProductOptionValue Cache removed");
      });
      return transactionManager.save(OptionValue, mergedOptionValue);
    };

    return validationDecorator(updateOptionValuePromise, validationPromises);
  }

  public async updateOptionValueSortSeq(transactionManager, input) {
    const { optionValueSeq } = input;
    if (optionValueSeq.length == 0) {
      throw new WCoreError(WCORE_ERRORS.OPTION_VALUE_DETAILS_EMPTY);
    }

    const optionValueCacheKey = [];
    const updateOptionValueSchema = [];

    for (const optionValue of optionValueSeq) {
      const optionValueId = optionValue.id;
      const optionValueDetails = await transactionManager.findOne(OptionValue, {
        where: {
          id: optionValueId
        }
      });

      if (!optionValueDetails) {
        const optionValueNotFoundError = Object.assign(
          {},
          WCORE_ERRORS.OPTION_VALUE_NOT_FOUND
        );
        optionValueNotFoundError.MESSAGE = `optionValue ${optionValueId} not found`;
        throw new WCoreError(optionValueNotFoundError);
      }

      updateEntity(optionValueDetails, optionValue);
      updateOptionValueSchema.push(optionValueDetails);
      optionValueCacheKey.push(`${CACHING_KEYS.OPTION}_${optionValueId}`);
    }

    // Remove cache for option value ids
    removeValueFromCache(optionValueCacheKey);

    // Clear option value entity cache
    await clearEntityCache("productOptionValue", () => {
      console.log("ProductOptionValue Cache removed");
    });

    const savedOptionValueDetails = await transactionManager.save(
      updateOptionValueSchema
    );
    return savedOptionValueDetails;
  }

  public getOptionValuesDetails(transactionManager, values, optionId) {
    return transactionManager.find(OptionValue, {
      where: {
        value: In(values),
        option: {
          id: optionId
        }
      },
      relations: ["option"]
    });
  }

  public getOptionValueById(transactionManager, optionValueId) {
    return transactionManager.findOne(OptionValue, {
      where: {
        id: optionValueId
      },
      relations: ["option"]
    });
  }
}
