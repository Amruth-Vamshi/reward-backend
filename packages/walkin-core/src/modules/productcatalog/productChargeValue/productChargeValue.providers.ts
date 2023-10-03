import { Inject, Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import { STATUS } from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  StoreFormat,
  Product,
  Channel,
  ProductChargeValue,
  ChargeType,
  ProductCategory,
  Catalog
} from "../../../entity";
import { ProductProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/product/product.providers";
import { StoreFormatProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/storeformat/storeFormat.providers";
import { ChannelProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.providers";
import { ChargeTypeProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/chargeType/chargeType.providers";

interface IProductChargeValueUpdateCatalog {
  catalogId: string;
  storeFormat: string;
  channel: string;
  chargeType: string;
  chargeValue: number;
}

interface IRemoveProductChargeValues {
  storeFormat: string;
  channel: string;
  chargeType: string;
}

interface IProductChargeValuesForProduct {
  productId: string;
}
@Injectable()
export class ProductChargeValueProvider {
  constructor(
    @Inject(ProductProvider)
    private productProvider: ProductProvider,
    @Inject(StoreFormatProvider)
    private storeFormatProvider: StoreFormatProvider,
    @Inject(ChannelProvider)
    private channelProvider: ChannelProvider,
    @Inject(ChargeTypeProvider)
    private chargeTypeProvider: ChargeTypeProvider
  ) { }
  public async getproductChargeValue(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductChargeValue> {
    const {
      productChargeValueId,
      productId,
      storeFormat,
      channel,
      chargeType
    } = input;
    let whereClause =
      "storeFormat.organization=:organizationId and channel.organization=:organizationId and productChargeValue.status=:status";
    const filterValues = { organizationId, status: STATUS.ACTIVE };
    if (productChargeValueId) {
      whereClause =
        whereClause + " " + "and productChargeValue.id=:productChargeValueId";
      filterValues["productChargeValueId"] = productChargeValueId;
    } else {
      if (!(productId && storeFormat && channel && chargeType)) {
        throw new WCoreError(WCORE_ERRORS.INVALID_CHARGE_TYPE_VALUE_INPUT);
      }
      whereClause = whereClause + " " + "and product.id=:productId";
      filterValues["productId"] = productId;

      whereClause = whereClause + " " + "and storeFormat.id=:storeFormat";
      filterValues["storeFormat"] = storeFormat;

      whereClause = whereClause + " " + "and channel.id=:channel";
      filterValues["channel"] = channel;

      whereClause =
        whereClause + " " + "and productChargeValue.chargeType=:chargeType";
      filterValues["chargeType"] = chargeType;
    }

    const productChargeValue = await entityManager
      .getRepository(ProductChargeValue)
      .createQueryBuilder("productChargeValue")
      .leftJoinAndSelect("productChargeValue.product", "product")
      .leftJoinAndSelect("productChargeValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productChargeValue.channel", "channel")
      .leftJoinAndSelect("productChargeValue.chargeType", "chargeType")
      .where(whereClause, filterValues)
      .getOne();

    if (!productChargeValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND);
    }
    return productChargeValue;
  }

  @addPaginateInfo
  public async getproductChargeValues(
    entityManager: EntityManager,
    input: any,
    pageOptions: any,
    organizationId: string,
    sortOptions?: any
  ): Promise<[ProductChargeValue[], number]> {
    const {
      productChargeValueId,
      storeFormat,
      channel,
      productId,
      chargeType
    } = input;
    let order;
    if (sortOptions) {
      order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }
    const skip = (pageOptions.page - 1) * pageOptions.pageSize;
    const take = pageOptions.pageSize;
    let whereClause =
      "storeFormat.organization=:organizationId and channel.organization=:organizationId and productChargeValue.status=:status";
    const filterValues = { organizationId, status: STATUS.ACTIVE };
    if (productChargeValueId) {
      whereClause =
        whereClause + " " + "and productChargeValue.id=:productChargeValueId";
      filterValues["productChargeValueId"] = productChargeValueId;
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
    if (chargeType) {
      whereClause = whereClause + " " + "and chargeType.id=:chargeType";
      filterValues["chargeType"] = chargeType;
    }

    const productChargeValue = await entityManager
      .getRepository(ProductChargeValue)
      .createQueryBuilder("productChargeValue")
      .leftJoinAndSelect("productChargeValue.product", "product")
      .leftJoinAndSelect("productChargeValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productChargeValue.channel", "channel")
      .leftJoinAndSelect("productChargeValue.chargeType", "chargeType")
      .where(whereClause, filterValues)
      .orderBy(order)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    if (!productChargeValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND);
    }
    return productChargeValue;
  }

  public async addProductChargeValuesForProduct(
    entityManager: EntityManager,
    input: IProductChargeValuesForProduct,
    organizationId: string
  ): Promise<ProductChargeValue[]> {
    const { productId } = input;
    const allStoreFormatsForOrganization = await entityManager.find(
      StoreFormat,
      {
        where: {
          organization: organizationId
        }
      }
    );
    const allChannelsForOrganization = await entityManager.find(Channel, {
      where: {
        organization: organizationId
      }
    });
    // find all the combination of storeFormat-channel
    const channelStoreFormatCombos = [];
    for (const storeFormat of allStoreFormatsForOrganization) {
      for (const channel of allChannelsForOrganization) {
        const channelStoreFormatCombo = {
          storeFormat,
          channel
        };
        channelStoreFormatCombos.push(channelStoreFormatCombo);
      }
    }

    // find all charge types in database for this organization and all the same value for this product if it exists in product_charge_value table

    const allChargeTypesForOrganization = await entityManager.find(ChargeType, {
      where: {
        organization: organizationId
      }
    });

    const productChargeValues = [];
    for (const chargeType of allChargeTypesForOrganization) {
      for (const channelStoreFormatCombo of channelStoreFormatCombos) {
        const findExistingValueForProduct = await entityManager.findOne(
          ProductChargeValue,
          {
            where: {
              channel: channelStoreFormatCombo.channel.id,
              storeFormat: channelStoreFormatCombo.storeFormat.id,
              chargeType: chargeType.id,
              product: productId,
              status: STATUS.ACTIVE
            }
          }
        );
        if (!findExistingValueForProduct) {
          const foundChargeTypeValue = await entityManager.findOne(
            ProductChargeValue,
            {
              where: {
                channel: channelStoreFormatCombo.channel.id,
                storeFormat: channelStoreFormatCombo.storeFormat.id,
                chargeType: chargeType.id,
                status: STATUS.ACTIVE
              }
            }
          );
          if (foundChargeTypeValue) {
            const product = await entityManager.findOne(Product, {
              where: {
                id: productId,
                organization: organizationId
              }
            });

            if (!product) {
              throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
            }
            const productChargeValueSchema = {
              chargeType,
              channel: channelStoreFormatCombo.channel,
              chargeValue: foundChargeTypeValue.chargeValue,
              storeFormat: channelStoreFormatCombo.storeFormat,
              product
            };
            const productChargeValue = await entityManager.create(
              ProductChargeValue,
              productChargeValueSchema
            );
            const createdProductChargeValue = await entityManager.save(
              productChargeValue
            );
            productChargeValues.push(createdProductChargeValue);
          }
        }
      }
    }
    return productChargeValues;
  }

  public async productChargeValueValidations(
    entityManager: EntityManager,
    input: IProductChargeValueUpdateCatalog,
    organizationId: string
  ): Promise<boolean> {
    const { catalogId, channel, storeFormat, chargeType, chargeValue } = input;
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

    const foundChargeType = await entityManager.findOne(ChargeType, {
      where: {
        id: chargeType,
        organization: organizationId
      }
    });

    if (!foundChargeType) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
    }

    const foundCatalog = await entityManager.findOne(Catalog, {
      where: {
        id: catalogId,
        organization: organizationId
      }
    });
    if (!foundCatalog) {
      throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
    }
    return true;
  }

  public async createProductChargeValueForCatalog(
    entityManager: EntityManager,
    input: IProductChargeValueUpdateCatalog,
    organizationId: string
  ): Promise<ProductChargeValue[]> {
    const { catalogId, channel, storeFormat, chargeType, chargeValue } = input;
    await this.productChargeValueValidations(
      entityManager,
      input,
      organizationId
    );
    const productCategories = await entityManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("productCategory.category", "category")
      .leftJoinAndSelect("category.catalog", "catalog")
      .where(
        "catalog.id=:catalogId and catalog.organization_id=:organizationId",
        {
          catalogId,
          organizationId
        }
      )
      .getMany();
    const savedChargeValues = [];
    for (const productCategory of productCategories) {
      const { product } = productCategory;
      /**
       * check if the charge value exists for the channel,charge type and store format for a product
       * more then one value can't exists for a combo of channel,charge,store and product
       */
      const existingChargeValue = await entityManager.findOne(
        ProductChargeValue,
        {
          where: {
            channel,
            chargeType,
            storeFormat,
            product: product.id,
            status: STATUS.ACTIVE
          }
        }
      );
      if (!existingChargeValue) {
        const addedChargeValue = await this.createChargeValueForProduct(
          entityManager,
          {
            productId: product.id,
            storeFormat,
            channel,
            chargeType,
            chargeValue
          },
          organizationId
        );
        savedChargeValues.push(addedChargeValue);
      }
    }
    return savedChargeValues;
  }

  public async updateProductChargeForCatalog(
    entityManager: EntityManager,
    input: IProductChargeValueUpdateCatalog,
    organizationId: string
  ): Promise<ProductChargeValue[]> {
    const { catalogId, channel, storeFormat, chargeType, chargeValue } = input;
    await this.productChargeValueValidations(
      entityManager,
      input,
      organizationId
    );
    const productCategories = await entityManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("productCategory.category", "category")
      .leftJoinAndSelect("category.catalog", "catalog")
      .where(
        "catalog.id=:catalogId and catalog.organization_id=:organizationId",
        {
          catalogId,
          organizationId
        }
      )
      .getMany();
    const productIds = productCategories.map(
      productCategory => productCategory.product.id
    );
    const productChargeValues = await entityManager.find(ProductChargeValue, {
      where: {
        channel,
        storeFormat,
        chargeType,
        product: In(productIds),
        status: STATUS.ACTIVE
      },
      relations: ["product", "chargeType"]
    });
    for (const productChargeValue of productChargeValues) {
      productChargeValue.chargeValue = chargeValue;
    }
    const savedChargeValues = await entityManager.save(productChargeValues);
    return savedChargeValues;
  }

  public async createChargeValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductChargeValue> {
    const { productId, storeFormat, channel, chargeType, chargeValue } = input;
    if (chargeValue < 0) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_VALUE_INVALID);
    }
    const product = await this.productProvider.getProductById(
      entityManager,
      productId,
      organizationId
    );

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

    const foundChargeType = await this.chargeTypeProvider.getChargeTypeById(
      entityManager,
      chargeType,
      organizationId
    );

    if (!foundChargeType) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
    }

    /**
     * check if the charge value exists for the channel,charge type and store format for a product
     * more then one value can't exists for a combo of channel,charge,store and product
     */
    const existingChargeValue = await entityManager.findOne(
      ProductChargeValue,
      {
        where: {
          channel: foundChannel.id,
          chargeType: foundChargeType.id,
          storeFormat: foundstoreFormat.id,
          product: product.id,
          status: STATUS.ACTIVE
        }
      }
    );
    if (existingChargeValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_ALREADY_EXISTS);
    }
    const productchargeValueSchema = {
      chargeType: foundChargeType,
      channel: foundChannel,
      chargeValue,
      storeFormat: foundstoreFormat,
      product,
      status: STATUS.ACTIVE
    };
    console.log(productchargeValueSchema);
    const productChargeValue = await entityManager.create(
      ProductChargeValue,
      productchargeValueSchema
    );
    const savedProductChargeValue = await entityManager.save(
      productChargeValue
    );
    return entityManager.findOne(ProductChargeValue, {
      where: {
        id: savedProductChargeValue.id
      },
      relations: ["product", "storeFormat", "channel", "chargeType"]
    });
  }

  public async createChargeValueForProducts(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ) {
    const savedProductChargeValueSchema = [];
    for (const inputValue of input) {
      const {
        productId,
        storeFormat,
        channel,
        chargeType,
        chargeValue
      } = inputValue;
      if (chargeValue < 0) {
        const invalidChargeValueError = Object.assign(
          {},
          WCORE_ERRORS.CHARGE_VALUE_INVALID
        );
        invalidChargeValueError.MESSAGE = `Charge Value cannot be less than 0 for Product: ${productId}`;
        throw new WCoreError(invalidChargeValueError);
      }
      const product = await this.productProvider.getProductById(
        entityManager,
        productId,
        organizationId
      );

      if (!product) {
        const productNotFoundError = Object.assign(
          {},
          WCORE_ERRORS.PRODUCT_NOT_FOUND
        );
        productNotFoundError.MESSAGE = `Product: ${productId} not found`;
        throw new WCoreError(productNotFoundError);
      }
      const foundstoreFormat = await this.storeFormatProvider.getStoreFormatById(
        entityManager,
        storeFormat,
        organizationId
      );

      if (!foundstoreFormat) {
        const invalidStoreFormatError = Object.assign(
          {},
          WCORE_ERRORS.STORE_FORMAT_NOT_FOUND
        );
        invalidStoreFormatError.MESSAGE = `Store Format: ${storeFormat} not found`;
        throw new WCoreError(invalidStoreFormatError);
      }
      const foundChannel = await this.channelProvider.getChannelById(
        entityManager,
        channel,
        organizationId
      );

      if (!foundChannel) {
        const invalidChannelError = Object.assign(
          {},
          WCORE_ERRORS.CHANNEL_NOT_FOUND
        );
        invalidChannelError.MESSAGE = `Channel: ${channel} not found`;
        throw new WCoreError(invalidChannelError);
      }

      const foundChargeType = await this.chargeTypeProvider.getChargeTypeById(
        entityManager,
        chargeType,
        organizationId
      );

      if (!foundChargeType) {
        const invalidChargeTypeError = Object.assign(
          {},
          WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND
        );
        invalidChargeTypeError.MESSAGE = `Charge Type: ${chargeType} not found`;
        throw new WCoreError(invalidChargeTypeError);
      }

      /**
       * check if the charge value exists for the channel,charge type and store format for a product
       * more then one value can't exists for a combo of channel,charge,store and product
       */
      const existingChargeValue = await entityManager.findOne(
        ProductChargeValue,
        {
          where: {
            channel: foundChannel.id,
            chargeType: foundChargeType.id,
            storeFormat: foundstoreFormat.id,
            product: productId,
            status: STATUS.ACTIVE
          }
        }
      );
      if (existingChargeValue) {
        const existingChargeValueError = Object.assign(
          {},
          WCORE_ERRORS.PRODUCT_CHARGE_VALUE_ALREADY_EXISTS
        );
        existingChargeValueError.MESSAGE = `Charge value already exists for Product: ${productId}`;
        throw new WCoreError(existingChargeValueError);
      }
      const productchargeValueSchema = {
        chargeType: foundChargeType,
        channel: foundChannel,
        chargeValue,
        storeFormat: foundstoreFormat,
        product,
        status: STATUS.ACTIVE
      };
      const productChargeValue = await entityManager.create(
        ProductChargeValue,
        productchargeValueSchema
      );
      savedProductChargeValueSchema.push(productChargeValue);
    }
    const savedProductChargeValueEntity = await entityManager.save(
      savedProductChargeValueSchema
    );
    return savedProductChargeValueEntity;
  }

  public async updateChargeValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductChargeValue> {
    const {
      productChargeValueId,
      storeFormat,
      channel,
      chargeType,
      chargeValue
    } = input;
    const updateSchema = {};

    const productChargeValue = await this.getproductChargeValue(
      entityManager,
      {
        productChargeValueId
      },
      organizationId
    );
    if (chargeValue !== undefined) {
      if (chargeValue < 0) {
        throw new WCoreError(WCORE_ERRORS.CHARGE_VALUE_INVALID);
      }
      updateSchema["chargeValue"] = chargeValue;
    }
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
    if (chargeType) {
      const foundChargeType = await this.chargeTypeProvider.getChargeTypeById(
        entityManager,
        chargeType,
        organizationId
      );

      if (!foundChargeType) {
        throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
      }
      updateSchema["chargeType"] = foundChargeType;
    }

    const updateProductChargeValueEntity = updateEntity(
      productChargeValue,
      updateSchema
    );
    const saveUpdateProductChargeValueEntity = await entityManager.save(
      updateProductChargeValueEntity
    );
    return entityManager.findOne(ProductChargeValue, {
      where: {
        id: saveUpdateProductChargeValueEntity.id
      },
      relations: ["storeFormat", "channel", "chargeType"]
    });
  }

  public async removeProductChargeValues(
    entityManager: EntityManager,
    input: IRemoveProductChargeValues,
    organizationId: string
  ): Promise<ProductChargeValue[] | any> {
    const { channel, chargeType, storeFormat } = input;
    const foundChargeType = await entityManager.findOne(ChargeType, {
      where: {
        id: chargeType,
        organization: organizationId
      }
    });

    if (!foundChargeType) {
      throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
    }

    const foundstoreFormat = await entityManager.findOne(StoreFormat, {
      where: {
        id: storeFormat
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

    const foundChargeValues = await entityManager.find(ProductChargeValue, {
      where: {
        channel: foundChannel.id,
        chargeType: foundChargeType.id,
        storeFormat: foundstoreFormat.id,
        status: STATUS.ACTIVE
      }
    });

    for (const chargeValue of foundChargeValues) {
      const updateValue = {
        status: STATUS.INACTIVE
      };
      const updatedEntity = updateEntity(chargeValue, updateValue);
    }
    const savedChargeValues = await entityManager.save(foundChargeValues);
    return savedChargeValues;
  }

  public async removeProductChargeValue(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductChargeValue> {
    const { id } = input;
    const productChargeValue = await this.getproductChargeValue(
      entityManager,
      {
        productChargeValueId: id
      },
      organizationId
    );
    if (!productChargeValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_CHARGE_VALUE_NOT_FOUND);
    }
    const updateValue = {
      status: STATUS.INACTIVE
    };
    const updatedEntity = updateEntity(productChargeValue, updateValue);
    const savedUpdatedValue = await entityManager.save(updatedEntity);
    return savedUpdatedValue;
  }
  public async updateChargeValueForProducts(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ) {
    const updateChargeValueSchema = [];
    const productChargeValueIdArray = [];

    for (const inputValue of input) {
      const {
        productChargeValueId,
        storeFormat,
        channel,
        chargeType,
        chargeValue
      } = inputValue;
      const updateSchema = {};
      const productChargeValue = await this.getproductChargeValue(
        entityManager,
        {
          productChargeValueId
        },
        organizationId
      );
      if (chargeValue !== undefined) {
        if (chargeValue < 0) {
          throw new WCoreError(WCORE_ERRORS.CHARGE_VALUE_INVALID);
        }
        updateSchema["chargeValue"] = chargeValue;
      }
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
      if (chargeType) {
        const foundChargeType = await this.chargeTypeProvider.getChargeTypeById(
          entityManager,
          chargeType,
          organizationId
        );

        if (!foundChargeType) {
          throw new WCoreError(WCORE_ERRORS.CHARGE_TYPE_NOT_FOUND);
        }
        updateSchema["chargeType"] = foundChargeType;
      }

      const updateProductChargeValueEntity = updateEntity(
        productChargeValue,
        updateSchema
      );
      updateChargeValueSchema.push(updateProductChargeValueEntity);
      productChargeValueIdArray.push(productChargeValueId);
    }
    const saveUpdateProductChargeValueEntity = await entityManager.save(
      updateChargeValueSchema
    );
    return entityManager.find(ProductChargeValue, {
      where: {
        id: In(productChargeValueIdArray)
      },
      relations: ["storeFormat", "channel", "chargeType", "product"]
    });
  }
  public async getProductByChargeValue(transactionManager, chargeValueId): Promise<Product | any> {

    const productChargeValue = await transactionManager
      .getRepository(ProductChargeValue)
      .createQueryBuilder("productChargeValue")
      .leftJoinAndSelect("productChargeValue.product","product")
      .where(
        "productChargeValue.id=:chargeValueId",
        {
          chargeValueId
        }
      )
      .getOne()
      const products = productChargeValue.product
      return products
  }
}
