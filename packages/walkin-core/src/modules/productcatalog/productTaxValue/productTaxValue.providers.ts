import { Inject, Injectable } from "@graphql-modules/di";
import { EntityManager, In } from "typeorm";
import { updateEntity, addPaginateInfo } from "../../common/utils/utils";
import { STATUS } from "../../common/constants";
import { WCoreError } from "../../common/exceptions";
import { WCORE_ERRORS } from "../../common/constants/errors";
import {
  Product,
  Channel,
  TaxType,
  ProductTaxValue,
  StoreFormat,
  ProductCategory,
  Catalog
} from "../../../entity";
import { ProductProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/product/product.providers";
import { StoreFormatProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/storeformat/storeFormat.providers";
import { ChannelProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/channel/channel.providers";
import { TaxTypeProvider } from "@walkinserver/walkin-core/src/modules/productcatalog/taxtype/taxtype.providers";

interface IProductTaxValueUpdateCatalog {
  catalogId: string;
  storeFormat: string;
  channel: string;
  taxLevel: string;
  taxValue: number;
}

interface IRemoveProductTaxValues {
  storeFormat: string;
  channel: string;
  taxLevel: string;
}

interface IProductTaxValuesForProduct {
  productId: string;
}

@Injectable()
export class ProductTaxValueProvider {
  constructor(
    @Inject(ProductProvider)
    private productProvider: ProductProvider,
    @Inject(StoreFormatProvider)
    private storeFormatProvider: StoreFormatProvider,
    @Inject(ChannelProvider)
    private channelProvider: ChannelProvider,
    @Inject(TaxTypeProvider)
    private taxTypeProvider: TaxTypeProvider
  ) { }
  public async getproductTaxTypeValue(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductTaxValue> {
    const { productTaxValueId, productId, storeFormat, channel, taxLevel } = input;
    let whereClause =
      "storeFormat.organization=:organizationId and channel.organization=:organizationId and productTaxValue.status=:status";
    const filterValues = { organizationId, status: STATUS.ACTIVE };
    if (productTaxValueId) {
      whereClause =
        whereClause + " " + "and productTaxValue.id=:productTaxValueId";
      filterValues["productTaxValueId"] = productTaxValueId;
    } else {
      if (!(productId && storeFormat && channel && taxLevel)) {
        throw new WCoreError(WCORE_ERRORS.INVALID_TAX_TYPE_VALUE_INPUT)
      }
      whereClause = whereClause + " " + "and product.id=:productId";
      filterValues["productId"] = productId;

      whereClause = whereClause + " " + "and storeFormat.id=:storeFormat";
      filterValues["storeFormat"] = storeFormat;

      whereClause = whereClause + " " + "and channel.id=:channel";
      filterValues["channel"] = channel;

      whereClause = whereClause + " " + "and productTaxValue.taxLevel=:taxLevel";
      filterValues["taxLevel"] = taxLevel;
    }

    const productTaxValue = await entityManager
      .getRepository(ProductTaxValue)
      .createQueryBuilder("productTaxValue")
      .leftJoinAndSelect("productTaxValue.product", "product")
      .leftJoinAndSelect("productTaxValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productTaxValue.channel", "channel")
      .leftJoinAndSelect("productTaxValue.taxLevel", "taxLevel")
      .where(whereClause, filterValues)
      .getOne();
    if (!productTaxValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_NOT_FOUND);
    }
    return productTaxValue;
  }
  @addPaginateInfo
  public async getproductTaxTypeValues(
    entityManager: EntityManager,
    input: any,
    pageOptions: any,
    organizationId: string,
    sortOptions?: any
  ): Promise<[ProductTaxValue[], number]> {
    const {
      productTaxValueId,
      storeFormat,
      channel,
      productId,
      taxLevel
    } = input;
    let page: number;
    let pageSize: number;
    let order;
    let whereClause =
      "storeFormat.organization=:organizationId and channel.organization=:organizationId and productTaxValue.status=:status";
    const filterValues = { organizationId, status: STATUS.ACTIVE };
    if (productTaxValueId) {
      whereClause =
        whereClause + " " + "and productTaxValue.id=:productTaxValueId";
      filterValues["productTaxValueId"] = productTaxValueId;
    }
    if (taxLevel) {
      whereClause = whereClause + " " + "and taxLevel.id=:taxLevel";
      filterValues["taxLevel"] = taxLevel;
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

    if (!pageOptions) {
      pageSize = 10;
      page = 1;
    } else {
      pageSize = pageOptions.pageSize;
      page = pageOptions.page || 1;
    }

    if (sortOptions) {
      order = {
        [sortOptions.sortBy]: sortOptions.sortOrder
      };
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const productTaxValue = await entityManager
      .getRepository(ProductTaxValue)
      .createQueryBuilder("productTaxValue")
      .leftJoinAndSelect("productTaxValue.product", "product")
      .leftJoinAndSelect("productTaxValue.storeFormat", "storeFormat")
      .leftJoinAndSelect("productTaxValue.channel", "channel")
      .leftJoinAndSelect("productTaxValue.taxLevel", "taxLevel")
      .where(whereClause, filterValues)
      .orderBy(order)
      .skip(skip)
      .take(take)
      .getManyAndCount();
    if (!productTaxValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_NOT_FOUND);
    }
    return productTaxValue;
  }

  public async addProductTaxValuesForProduct(
    entityManager: EntityManager,
    input: IProductTaxValuesForProduct,
    organizationId: string
  ): Promise<ProductTaxValue[]> {
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

    // find all tax types in database for this organization and all the same value for this product if it exists in product_tax_value table

    const allTaxTypesForOrganization = await entityManager.find(TaxType, {
      where: {
        organization: organizationId
      }
    });
    const productTaxValues = [];
    for (const taxType of allTaxTypesForOrganization) {
      for (const channelStoreFormatCombo of channelStoreFormatCombos) {
        const findExistingValueForProduct = await entityManager.findOne(
          ProductTaxValue,
          {
            where: {
              channel: channelStoreFormatCombo.channel.id,
              storeFormat: channelStoreFormatCombo.storeFormat.id,
              taxLevel: taxType.id,
              product: productId,
              status: STATUS.ACTIVE
            }
          }
        );
        if (!findExistingValueForProduct) {
          const foundTaxTypeValue = await entityManager.findOne(
            ProductTaxValue,
            {
              where: {
                channel: channelStoreFormatCombo.channel.id,
                storeFormat: channelStoreFormatCombo.storeFormat.id,
                taxLevel: taxType.id,
                status: STATUS.ACTIVE
              }
            }
          );
          if (foundTaxTypeValue) {
            const product = await entityManager.findOne(Product, {
              where: {
                id: productId,
                organization: organizationId
              }
            });

            if (!product) {
              throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
            }
            const productTaxValueSchema = {
              taxLevel: taxType,
              channel: channelStoreFormatCombo.channel,
              taxValue: foundTaxTypeValue.taxValue,
              storeFormat: channelStoreFormatCombo.storeFormat,
              product
            };
            const productTaxValue = await entityManager.create(
              ProductTaxValue,
              productTaxValueSchema
            );
            const createdProductTaxValue = await entityManager.save(
              productTaxValue
            );
            productTaxValues.push(createdProductTaxValue);
          }
        }
      }
    }
    return productTaxValues;
  }

  public async updateProductTaxValueForCatalog(
    entityManager: EntityManager,
    input: IProductTaxValueUpdateCatalog,
    organizationId: string
  ): Promise<ProductTaxValue[]> {
    const { catalogId, channel, storeFormat, taxLevel, taxValue } = input;
    await this.productTaxValueValidations(entityManager, input, organizationId);
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

    const fondExistingTaxValues = await entityManager.find(ProductTaxValue, {
      where: {
        taxLevel,
        storeFormat,
        channel,
        product: In(productIds),
        status: STATUS.ACTIVE
      },
      relations: ["taxLevel", "product"]
    });
    for (const foundExistingTaxValue of fondExistingTaxValues) {
      foundExistingTaxValue.taxValue = taxValue;
    }
    const savedTaxValues = await entityManager.save(fondExistingTaxValues);
    return savedTaxValues;
  }

  public async productTaxValueValidations(
    entityManager: EntityManager,
    input: IProductTaxValueUpdateCatalog,
    organizationId: string
  ): Promise<boolean> {
    const { catalogId, channel, storeFormat, taxLevel, taxValue } = input;
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
    const foundCatalog = await entityManager.findOne(Catalog, {
      where: {
        id: catalogId,
        organization: organizationId
      }
    });
    if (!foundCatalog) {
      throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
    }
    const foundtaxLevel = await entityManager.findOne(TaxType, {
      where: {
        id: taxLevel,
        organization: organizationId
      }
    });

    if (!foundtaxLevel) {
      throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
    }
    return true;
  }

  public async createProductTaxValueForCatalog(
    entityManager: EntityManager,
    input: IProductTaxValueUpdateCatalog,
    organizationId: string
  ): Promise<ProductTaxValue[]> {
    const { catalogId, channel, storeFormat, taxLevel, taxValue } = input;
    await this.productTaxValueValidations(entityManager, input, organizationId);
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
    const savedTaxValues = [];
    for (const productCategory of productCategories) {
      const { product } = productCategory;
      /**
       * check if the tax value exists for the channel,tax type and store format for a product
       * more then one value can't exists for a combo of channel,tax type,store and product
       */
      const existingTaxValue = await entityManager.findOne(ProductTaxValue, {
        where: {
          channel,
          storeFormat,
          product: product.id,
          taxLevel,
          status: STATUS.ACTIVE
        }
      });
      if (!existingTaxValue) {
        const savedTaxValue = await this.createTaxValueForProduct(
          entityManager,
          {
            productId: product.id,
            channel,
            storeFormat,
            taxLevel,
            taxValue
          },
          organizationId
        );
        savedTaxValues.push(savedTaxValue);
      }
    }
    return savedTaxValues;
  }
  public async createTaxValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductTaxValue> {
    const { productId, storeFormat, channel, taxLevel, taxValue } = input;
    if (taxValue < 0) {
      throw new WCoreError(WCORE_ERRORS.TAX_VALUE_INVALID);
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

    const foundtaxLevel = await this.taxTypeProvider.getTaxTypeById(
      entityManager,
      taxLevel,
      organizationId
    );

    if (!foundtaxLevel) {
      throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
    }
    /**
     * check if the tax value exists for the channel,tax type and store format for a product
     * more then one value can't exists for a combo of channel,tax type,store and product
     */
    const existingTaxValue = await entityManager.findOne(ProductTaxValue, {
      where: {
        channel: foundChannel.id,
        storeFormat: foundstoreFormat.id,
        product: product.id,
        taxLevel: foundtaxLevel.id,
        status: STATUS.ACTIVE
      }
    });
    if (existingTaxValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_ALREADY_EXISTS);
    }
    const productTaxValueSchema = {
      taxLevel: foundtaxLevel,
      channel: foundChannel,
      taxValue,
      storeFormat: foundstoreFormat,
      product,
      status: STATUS.ACTIVE
    };
    const productTaxValue = await entityManager.create(
      ProductTaxValue,
      productTaxValueSchema
    );
    const savedProductTaxValue = entityManager.save(productTaxValue);
    return savedProductTaxValue;
  }
  public async updateTaxValueForProduct(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductTaxValue> {
    const {
      productTaxValueId,
      storeFormat,
      channel,
      taxLevel,
      taxValue
    } = input;
    const updateSchema = {};
    if (taxValue !== undefined) {
      if (taxValue < 0) {
        throw new WCoreError(WCORE_ERRORS.TAX_VALUE_INVALID);
      }
      updateSchema["taxValue"] = taxValue;
    }

    const productTaxValue = await this.getproductTaxTypeValue(
      entityManager,
      {
        productTaxValueId
      },
      organizationId
    );

    if (!productTaxValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_NOT_FOUND);
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
    if (taxLevel) {
      const foundtaxLevel = await this.taxTypeProvider.getTaxTypeById(
        entityManager,
        taxLevel,
        organizationId
      );

      if (!foundtaxLevel) {
        throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
      }
      updateSchema["taxLevel"] = foundtaxLevel;
    }

    const updateProductTaxValueEntity = updateEntity(
      productTaxValue,
      updateSchema
    );
    const saveUpdateProductTaxValueEntity = await entityManager.save(
      updateProductTaxValueEntity
    );
    return saveUpdateProductTaxValueEntity;
  }

  public async removeProductTaxValues(
    entityManager: EntityManager,
    input: IRemoveProductTaxValues,
    organizationId: string
  ): Promise<ProductTaxValue[]> {
    const { channel, taxLevel, storeFormat } = input;
    const foundtaxLevel = await entityManager.findOne(TaxType, {
      where: {
        id: taxLevel,
        organization: organizationId
      }
    });

    if (!foundtaxLevel) {
      throw new WCoreError(WCORE_ERRORS.TAX_TYPE_NOT_FOUND);
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

    const foundTaxValues = await entityManager.find(ProductTaxValue, {
      where: {
        channel: foundChannel.id,
        storeFormat: foundstoreFormat.id,
        status: STATUS.ACTIVE,
        taxLevel: foundtaxLevel.id
      }
    });

    for (const taxValue of foundTaxValues) {
      const updateValue = {
        status: STATUS.INACTIVE
      };
      const updatedEntity = updateEntity(taxValue, updateValue);
    }
    const savedTaxValues = await entityManager.save(foundTaxValues);
    return savedTaxValues;
  }

  public async removeProductTaxValue(
    entityManager: EntityManager,
    input: any,
    organizationId: string
  ): Promise<ProductTaxValue> {
    const { id } = input;
    const productTaxValue = await this.getproductTaxTypeValue(
      entityManager,
      {
        productTaxValueId: id
      },
      organizationId
    );
    if (!productTaxValue) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_TAX_VALUE_NOT_FOUND);
    }
    const updateValue = {
      status: STATUS.INACTIVE
    };
    const updatedEntity = updateEntity(productTaxValue, updateValue);
    const savedUpdatedValue = await entityManager.save(updatedEntity);
    return savedUpdatedValue;
  }
}
