import { Inject, Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import {
  STATUS,
  CACHING_KEYS,
  EXPIRY_MODE,
  CACHE_TTL
} from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  StoreFormat,
  Product,
  Channel,
  ProductChargeValue,
  ChargeType,
  ProductDiscountValue
} from "../../../entity";
import { StoreFormatProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/storeformat/storeFormat.providers";
import { ChannelProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.providers";
import {
  getValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { DiscountTypeProvider } from "../discountType/discountType.providers";

@Injectable()
export class ProductDiscountValueProvider {
  constructor(
    @Inject(StoreFormatProvider)
    private storeFormatProvider: StoreFormatProvider,
    @Inject(ChannelProvider)
    private channelProvider: ChannelProvider,
    @Inject(DiscountTypeProvider)
    private discountTypeProvider: DiscountTypeProvider
  ) {}
  public async getproductDiscountValue(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductDiscountValue> {
    const {
      productDiscountValueId,
      productId,
      storeFormat,
      channel,
      discountType
    } = input;
    let whereClause =
      "storeFormat.organization=:organizationId and channel.organization=:organizationId and discountType.status=:status and productDiscountValue.status=:status";
    const filterValues = { organizationId, status: STATUS.ACTIVE };
    if (productId) {
      whereClause = whereClause + " " + "and product.id=:productId";
      filterValues["productId"] = productId;
    }

    if (productDiscountValueId) {
      whereClause =
        whereClause +
        " " +
        "and productDiscountValue.id=:productDiscountValueId";
      filterValues["productDiscountValueId"] = productDiscountValueId;
    }
    if (storeFormat) {
      whereClause = whereClause + " " + "and storeFormat.id=:storeFormat";
      filterValues["storeFormat"] = storeFormat;
    }
    if (channel) {
      whereClause = whereClause + " " + "and channel.id=:channel";
      filterValues["channel"] = channel;
    }

    if (discountType) {
      whereClause = whereClause + " " + "and discountType.id=:discountType";
      filterValues["discountType"] = discountType;
    }

    const productDiscountValue = await entityManager
      .getRepository(ProductDiscountValue)
      .createQueryBuilder("productDiscountValue")
      .leftJoinAndSelect("productDiscountValue.product", "product")
      .leftJoinAndSelect("productDiscountValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productDiscountValue.channel", "channel")
      .leftJoinAndSelect("productDiscountValue.discountType", "discountType")
      .where(whereClause, filterValues)
      .getOne();
    if (!productDiscountValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_DISCOUNT_VALUE_NOT_FOUND);
    }
    return productDiscountValue;
  }

  @addPaginateInfo
  public async getproductDiscountValues(
    entityManager: EntityManager,
    input: any,
    pageOptions: any,
    organizationId: string,
    sortOptions?: any
  ): Promise<[ProductDiscountValue[], number]> {
    const {
      productDiscountValueId,
      storeFormat,
      channel,
      productId,
      discountTypeId
    } = input;
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
      "storeFormat.organization=:organizationId and channel.organization=:organizationId and discountType.status=:status and productDiscountValue.status=:status";
    const filterValues = { organizationId, status: STATUS.ACTIVE };
    if (productDiscountValueId) {
      whereClause =
        whereClause +
        " " +
        "and productDiscountValue.id=:productDiscountValueId";
      filterValues["productDiscountValueId"] = productDiscountValueId;
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

    if (discountTypeId) {
      whereClause = whereClause + " " + "and discountType.id=:discountTypeId";
      filterValues["discountTypeId"] = discountTypeId;
    }

    const productDiscountValue = await entityManager
      .getRepository(ProductDiscountValue)
      .createQueryBuilder("productDiscountValue")
      .leftJoinAndSelect("productDiscountValue.product", "product")
      .leftJoinAndSelect("productDiscountValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productDiscountValue.channel", "channel")
      .leftJoinAndSelect("productDiscountValue.discountType", "discountType")
      .where(whereClause, filterValues)
      .orderBy(order)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    if (!productDiscountValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_DISCOUNT_VALUE_NOT_FOUND);
    }
    return productDiscountValue;
  }

  public async createDiscountValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductDiscountValue> {
    const {
      productId,
      storeFormat,
      channel,
      discountValue,
      discountType,
      discountValueType
    } = input;
    if (discountValue < 0) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_DISCOUNT_INVALID);
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

    const foundDiscountType = await this.discountTypeProvider.getDiscountType(
      entityManager,
      {
        id: discountType
      },
      organizationId
    );

    if (!foundDiscountType) {
      throw new WCoreError(WCORE_ERRORS.DELIVERY_TYPE_NOT_FOUND);
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
     * check if the Discount value exists for the channel and store format for a product
     * more then one value can't exists for a combo of channel,store and product
     */
    const existingDiscountValue = await entityManager.findOne(
      ProductDiscountValue,
      {
        where: {
          channel: foundChannel.id,
          storeFormat: foundstoreFormat.id,
          product: product.id,
          discountType: foundDiscountType.id
        }
      }
    );
    if (existingDiscountValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_DISCOUNT_VALUE_ALREADY_EXISTS);
    }
    const productDiscountValueSchema = {
      channel: foundChannel,
      discountValue,
      storeFormat: foundstoreFormat,
      product,
      discountType: foundDiscountType,
      discountValueType,
      status: STATUS.ACTIVE
    };
    const productDiscountValue = await entityManager.create(
      ProductDiscountValue,
      productDiscountValueSchema
    );
    const savedProductDiscountValue = entityManager.save(productDiscountValue);
    return savedProductDiscountValue;
  }

  public async addDiscountValueForProducts(
    entityManager: EntityManager,
    input: any[],
    organizationId: string
  ): Promise<any> {
    const productDiscountValueInputs = input || [];
    const addedProductDiscountValues = [];
    const errors = [];
    for (const productDiscountValueInput of productDiscountValueInputs) {
      try {
        const addedProductDiscountValue = await this.createDiscountValueForProduct(
          entityManager,
          productDiscountValueInput,
          organizationId
        );
        addedProductDiscountValues.push(addedProductDiscountValue);
      } catch (error) {
        error.message = `${error.message} for product ${productDiscountValueInput.productId}`;
        errors.push(error);
      }
    }
    return { data: addedProductDiscountValues, errors };
  }

  public async removeDiscountValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductDiscountValue> {
    const { id } = input;
    const productDiscountValue = await this.getproductDiscountValue(
      entityManager,
      {
        productDiscountValueId: id
      },
      organizationId
    );
    productDiscountValue.status = STATUS.INACTIVE;
    const updatedDiscountValue = await entityManager.save(productDiscountValue);
    return updatedDiscountValue;
  }

  public async updateDiscountValueForProducts(
    entityManager: EntityManager,
    input: any[],
    organizationId: string
  ): Promise<ProductDiscountValue[]> {
    const productDiscoutValueIds = input.map(
      discountValueInput => discountValueInput.productDiscountValueId
    );
    const foundDiscountValues = await entityManager.find(ProductDiscountValue, {
      where: {
        id: In(productDiscoutValueIds)
      }
    });
    const updatedProductDiscountValues = [];
    for (const foundDiscountValue of foundDiscountValues) {
      const updatedDiscountValueInput = input.find(
        discountValueInput =>
          discountValueInput.productDiscountValueId === foundDiscountValue.id
      );
      foundDiscountValue.discountValue =
        updatedDiscountValueInput.discountValue;
      const updatedDiscountValue = await entityManager.save(foundDiscountValue);
      updatedProductDiscountValues.push(updatedDiscountValue);
    }
    return updatedProductDiscountValues;
  }

  public async updateDiscountValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductDiscountValue> {
    const {
      productDiscountValueId,
      storeFormat,
      channel,
      discountValue
    } = input;
    const updateSchema = {};
    if (discountValue !== undefined) {
      if (discountValue < 0) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_DISCOUNT_INVALID);
      }
      updateSchema["discountValue"] = discountValue;
    }

    const productDiscountValue = await this.getproductDiscountValue(
      entityManager,
      {
        productDiscountValueId
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

    const updateProductDiscountValueEntity = updateEntity(
      productDiscountValue,
      updateSchema
    );

    const saveUpdateProductDiscountValueEntity = await entityManager.save(
      updateProductDiscountValueEntity
    );
    return saveUpdateProductDiscountValueEntity;
  }
}
