import { Inject, Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import { STATUS, TYPEORM_CACHE_TTL } from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  StoreFormat,
  Product,
  Channel,
  ProductChargeValue,
  ChargeType,
  ProductPriceValue
} from "../../../entity";
import { StoreFormatProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/storeformat/storeFormat.providers";
import { ChannelProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.providers";
import { CACHING_KEYS } from "../../common/constants";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { EXPIRY_MODE } from "../../common/constants";
import { CACHE_TTL } from "../../common/constants";
import _ from "lodash";

interface IRemoveProductPriceValues {
  storeFormat: string;
  channel: string;
}

@Injectable()
export class ProductPriceValueProvider {
  constructor(
    @Inject(StoreFormatProvider)
    private storeFormatProvider: StoreFormatProvider,
    @Inject(ChannelProvider)
    private channelProvider: ChannelProvider
  ) {}
  public async getproductPriceValue(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductPriceValue> {
    const { productPriceValueId, productId, storeFormat, channel } = input;
    let whereClause =
      "storeFormat.organization=:organizationId and channel.organization=:organizationId";
    const filterValues = { organizationId };
    if (productId) {
      whereClause = whereClause + " " + "and product.id=:productId";
      filterValues["productId"] = productId;
    }

    if (productPriceValueId) {
      whereClause =
        whereClause + " " + "and productPriceValue.id=:productPriceValueId";
      filterValues["productPriceValueId"] = productPriceValueId;
    }
    if (storeFormat) {
      whereClause = whereClause + " " + "and storeFormat.id=:storeFormat";
      filterValues["storeFormat"] = storeFormat;
    }
    if (channel) {
      whereClause = whereClause + " " + "and channel.id=:channel";
      filterValues["channel"] = channel;
    }

    const productPriceValue = await entityManager
      .getRepository(ProductPriceValue)
      .createQueryBuilder("productPriceValue")
      .leftJoinAndSelect("productPriceValue.product", "product")
      .leftJoinAndSelect("productPriceValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productPriceValue.channel", "channel")
      .where(whereClause, filterValues)
      .getOne();
    if (!productPriceValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_NOT_FOUND);
    }
    return productPriceValue;
  }

  @addPaginateInfo
  public async getproductPriceValues(
    entityManager: EntityManager,
    input: any,
    pageOptions: any,
    organizationId: string,
    sortOptions?: any
  ): Promise<[ProductPriceValue[], number]> {
    const { productPriceValueId, storeFormat, channel, productId } = input;
    let order;
    let page: number;
    let pageSize: number;
    if (sortOptions) {
      order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    if (!pageOptions) {
      pageSize = 10;
      page = 1;
    } else {
      pageSize = pageOptions.pageSize || 10;
      page = pageOptions.page || 1;
    }

    const skip = (page - 1) * (pageSize || 10);
    const take = pageSize || 1;
    let whereClause =
      "storeFormat.organization=:organizationId and channel.organization=:organizationId";
    const filterValues = { organizationId };
    if (productPriceValueId) {
      whereClause =
        whereClause + " " + "and productPriceValue.id=:productPriceValueId";
      filterValues["productPriceValueId"] = productPriceValueId;
    }
    if (storeFormat) {
      whereClause = whereClause + " " + "and storeFormat.id=:storeFormat";
      filterValues["storeFormat"] = storeFormat;
    }
    if (channel) {
      whereClause = whereClause + " " + "and channel.id=:channel";
      filterValues["channel"] = channel;
    }

    if (productId && productId.length > 0) {
      whereClause = whereClause + " " + "and product.id in (:...productId)";
      filterValues["productId"] = productId;
    }

    const productPriceValue = await entityManager
      .getRepository(ProductPriceValue)
      .createQueryBuilder("productPriceValue")
      .leftJoinAndSelect("productPriceValue.product", "product")
      .leftJoinAndSelect("productPriceValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productPriceValue.channel", "channel")
      .where(whereClause, filterValues)
      .orderBy(order)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    if (!productPriceValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_NOT_FOUND);
    }
    return productPriceValue;
  }

  public async removeProductPriceValues(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductPriceValue[]> {
    const { ids } = input;
    const priceValues = [];

    for (const id of ids) {
      const productPriceValue = await entityManager.findOne(ProductPriceValue, {
        where: {
          id
        }
      });

      if (!productPriceValue) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_NOT_FOUND);
      }
      priceValues.push(Object.assign({}, productPriceValue));
      await entityManager.remove(ProductPriceValue, productPriceValue);
    }
    return priceValues;
  }

  public async removeProductPriceValuesByFilter(
    entityManager: EntityManager,
    input: IRemoveProductPriceValues,
    organizationId: string
  ): Promise<ProductPriceValue[] | any> {
    const { channel, storeFormat } = input;

    const foundstoreFormat = await entityManager.findOne(StoreFormat, {
      where: {
        id: storeFormat,
        organization: organizationId
      }
    });

    if (!foundstoreFormat) {
      throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
    }

    const foundChannel = await entityManager.findOne(Channel, {
      where: {
        id: channel,
        organization: organizationId
      }
    });

    if (!foundChannel) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
    }

    const foundPriceValues = await entityManager.find(ProductPriceValue, {
      where: {
        channel: foundChannel.id,
        storeFormat: foundstoreFormat.id
      }
    });

    if (foundPriceValues.length == 0) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUES_NOT_FOUND);
    }

    const priceValues = _.cloneDeep(foundPriceValues);
    await entityManager.remove(ProductPriceValue, foundPriceValues);

    return priceValues;
  }

  public async createPriceValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductPriceValue> {
    const { productId, storeFormat, channel, productPrice } = input;
    if (productPrice < 0) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_INVALID);
    }
    const key = `${CACHING_KEYS.PRODUCT}_${productId}`;
    let product: any = await getValueFromCache(key);
    if (!product) {
      product = await entityManager.findOne(Product, {
        where: {
          id: productId,
          organization: organizationId
        }
      });
      if (product) {
        console.log("value fetched from database", product);
        await setValueToCache(key, product, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
    }
    if (!product) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }

    const foundstoreFormat = await this.storeFormatProvider.getStoreFormatById(
      entityManager,
      storeFormat,
      organizationId
    );

    if (!foundstoreFormat) {
      throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
    }
    const foundChannel = await this.channelProvider.getChannelById(
      entityManager,
      channel,
      organizationId
    );

    if (!foundChannel) {
      throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
    }

    /**
     * check if the price value exists for the channel and store format for a product
     * more then one value can't exists for a combo of channel,store and product
     */
    const existingPriceValue = await entityManager.findOne(ProductPriceValue, {
      where: {
        channel: foundChannel.id,
        storeFormat: foundstoreFormat.id,
        product: product.id
      }
    });
    if (existingPriceValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_ALREADY_EXISTS);
    }
    const productPriceValueSchema = {
      channel: foundChannel,
      priceValue: productPrice,
      storeFormat: foundstoreFormat,
      product
    };
    const productPriceValue = await entityManager.create(
      ProductPriceValue,
      productPriceValueSchema
    );

    const keys = [`${CACHING_KEYS.PRODUCT}_${product.id}`];
    removeValueFromCache(keys);

    const savedProductPriceValue = entityManager.save(productPriceValue);
    return savedProductPriceValue;
  }

  public async createPriceValueForProducts(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ) {
    const productPriceValues = [];
    for (const inputValue of input) {
      const { productId, storeFormat, channel, productPrice } = inputValue;
      if (productPrice < 0) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_INVALID);
      }
      const key = `${CACHING_KEYS.PRODUCT}_${productId}`;
      let product: any = await getValueFromCache(key);
      if (!product) {
        product = await entityManager.findOne(Product, {
          where: {
            id: productId,
            organization: organizationId
          }
        });
        if (product) {
          console.log("value fetched from database", product);
          await setValueToCache(key, product, EXPIRY_MODE.EXPIRE, CACHE_TTL);
        }
      }
      if (!product) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
      }
      const foundstoreFormat = await this.storeFormatProvider.getStoreFormatById(
        entityManager,
        storeFormat,
        organizationId
      );

      if (!foundstoreFormat) {
        throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
      }
      const foundChannel = await this.channelProvider.getChannelById(
        entityManager,
        channel,
        organizationId
      );

      if (!foundChannel) {
        throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
      }

      /**
       * check if the price value exists for the channel and store format for a product
       * more then one value can't exists for a combo of channel,store and product
       */
      const existingPriceValue = await entityManager.findOne(
        ProductPriceValue,
        {
          where: {
            channel: foundChannel.id,
            storeFormat: foundstoreFormat.id,
            product: product.id
          }
        }
      );
      if (existingPriceValue) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_VALUE_ALREADY_EXISTS);
      }
      const productPriceValueSchema = {
        channel: foundChannel,
        priceValue: productPrice,
        storeFormat: foundstoreFormat,
        product
      };
      const productPriceValue = await entityManager.create(
        ProductPriceValue,
        productPriceValueSchema
      );
      const keys = [`${CACHING_KEYS.PRODUCT}_${product.id}`];
      removeValueFromCache(keys);
      productPriceValues.push(productPriceValue);
    }
    const saveCreateProductPriceValueEntity = await entityManager.save(
      productPriceValues
    );
    return saveCreateProductPriceValueEntity;
  }

  public async updatePriceValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductPriceValue> {
    const { productPriceValueId, storeFormat, channel, productPrice } = input;
    const updateSchema = {};
    if (productPrice !== undefined) {
      if (productPrice < 0) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_INVALID);
      }
      updateSchema["priceValue"] = productPrice;
    }

    const productPriceValue = await this.getproductPriceValue(
      entityManager,
      {
        productPriceValueId
      },
      organizationId
    );

    if (storeFormat) {
      const foundstoreFormat = await this.storeFormatProvider.getStoreFormatById(
        entityManager,
        storeFormat,
        organizationId
      );
      if (!foundstoreFormat) {
        throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
      }
      updateSchema["storeFormat"] = foundstoreFormat;
    }
    if (channel) {
      const foundChannel = await this.channelProvider.getChannelById(
        entityManager,
        channel,
        organizationId
      );

      if (!foundChannel) {
        throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
      }

      updateSchema["channel"] = foundChannel;
    }

    const updateProductPriceValueEntity = updateEntity(
      productPriceValue,
      updateSchema
    );
    const keys = [`${CACHING_KEYS.PRODUCT}_${productPriceValue.product.id}`];
    removeValueFromCache(keys);

    const saveUpdateProductPriceValueEntity = await entityManager.save(
      updateProductPriceValueEntity
    );
    return saveUpdateProductPriceValueEntity;
  }

  public async productAvailability(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductPriceValue> {
    const { productPriceValueId, available } = input;
    const productPriceValue = await this.getproductPriceValue(
      entityManager,
      {
        productPriceValueId
      },
      organizationId
    );
    const updateSchema = {
      inventoryAvailable: available
    };
    const updatedProductPriceValue = updateEntity(
      productPriceValue,
      updateSchema
    );
    const markAvailability = await entityManager.save(updatedProductPriceValue);
    return markAvailability;
  }
  public async updatePriceValueForProducts(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ) {
    const updatePriceSchema = [];
    const productPriceValueIds = [];
    for (const inputValue of input) {
      const {
        productPriceValueId,
        storeFormat,
        channel,
        productPrice
      } = inputValue;
      const updateSchema = {};
      if (productPrice !== undefined) {
        if (productPrice < 0) {
          throw new WCoreError(WCORE_ERRORS.PRODUCT_PRICE_INVALID);
        }
        updateSchema["priceValue"] = productPrice;
      }

      const productPriceValue = await this.getproductPriceValue(
        entityManager,
        {
          productPriceValueId
        },
        organizationId
      );

      if (storeFormat) {
        const foundstoreFormat = await this.storeFormatProvider.getStoreFormatById(
          entityManager,
          storeFormat,
          organizationId
        );
        if (!foundstoreFormat) {
          throw new WCoreError(WCORE_ERRORS.STORE_FORMAT_NOT_FOUND);
        }
        updateSchema["storeFormat"] = foundstoreFormat;
      }
      if (channel) {
        const foundChannel = await this.channelProvider.getChannelById(
          entityManager,
          channel,
          organizationId
        );

        if (!foundChannel) {
          throw new WCoreError(WCORE_ERRORS.CHANNEL_NOT_FOUND);
        }

        updateSchema["channel"] = foundChannel;
      }

      const updateProductPriceValueEntity = updateEntity(
        productPriceValue,
        updateSchema
      );

      const keys = [`${CACHING_KEYS.PRODUCT}_${productPriceValue.product.id}`];
      removeValueFromCache(keys);

      updatePriceSchema.push(updateProductPriceValueEntity);
      productPriceValueIds.push(productPriceValueId);
    }

    const saveUpdateProductPriceValueEntity = await entityManager.save(
      updatePriceSchema
    );
    const saveUpdateProductPriceValue = await entityManager.find(
      ProductPriceValue,
      {
        where: {
          id: In(productPriceValueIds)
        },
        relations: ["channel", "storeFormat", "product"]
      }
    );
    console.log("productPriceValueIds", saveUpdateProductPriceValue);
    return saveUpdateProductPriceValue;
  }
}
