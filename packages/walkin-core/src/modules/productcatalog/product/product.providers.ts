import { Injectable, Inject } from "@graphql-modules/di";
import {
  Category,
  Option,
  OptionValue,
  Organization,
  Product,
  ProductCategory,
  CategoryProductOption,
  ProductVariant,
  ProductVariantValue,
  ProductPriceValue,
  ProductTaxValue,
  ProductChargeValue,
  ProductRelationship,
  Catalog,
  ProductTag,
  ProductDiscountValue,
  ProductOptionValue
} from "../../../entity";
import {
  STATUS,
  PRODUCT_TYPE,
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE,
  DISCOUNT_VALUE_TYPE,
  PRODUCT_RELATIONSHIP,
  SHORT_CACHE_TTL
} from "../../common/constants";
import {
  WalkinError,
  WalkinPlatformError
} from "../../common/exceptions/walkin-platform-error";
import { validationDecorator } from "../../common/validations/Validations";
import { validateAndReturnEntityExtendedData } from "../../entityExtend/utils/EntityExtension";
import {
  updateEntity,
  capitalizeFirstLetter,
  emptyStringCheck,
  getAllCombination,
  formatProductCode,
  isValidString,
  validateStatus
} from "../../common/utils/utils";
import { isArray, toNumber } from "lodash";
import { WCORE_ERRORS } from "../../common/constants/errors";
import { WCoreError } from "../../common/exceptions";
import { EntityManager, In, Not } from "typeorm";
import { ProductPriceValueProvider } from "../productPriceValue/productPriceValue.providers";
import { performance } from "perf_hooks";
import { StoreInventoryProvider } from "../storeInventory/storeInventory.providers";
import { OptionProvider } from "../option/option.providers";
import { OptionValueProvider } from "../option/option.providers";
import {
  getValueFromCache,
  removeValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import moment = require("moment");
import { ProductRelationshipProvider } from "../productRelationship/productRelationship.providers";
// import { ORDERX_ERRORS } from "@walkinserver/walkin-orderx/src/common/constants/errors";
import { MenuTimingProvider } from "../menuTiming/menuTiming.providers";
import { logger } from "../../common/utils/loggerUtil";
import { ProductModule } from "./product.module";

interface IProductCategorySeq {
  id: string;
  sortSeq: number;
}

interface IUpdateProductCategorySortSeq {
  organizationId: string;
  productCategory: IProductCategorySeq[];
}

@Injectable()
export class ProductProvider {
  constructor(
    @Inject(ProductPriceValueProvider)
    private productPriceValueProvider: ProductPriceValueProvider,

    @Inject(StoreInventoryProvider)
    private storeInventoryProvider: StoreInventoryProvider,

    @Inject(OptionProvider)
    private optionProvider: OptionProvider,

    @Inject(OptionValueProvider)
    private optionValueProvider: OptionValueProvider,

    @Inject(ProductRelationshipProvider)
    private productRelationshipProvider: ProductRelationshipProvider,

    @Inject(MenuTimingProvider)
    private menuTimingService: MenuTimingProvider
  ) {}

  public async getProductValuesMany(
    entityManager: EntityManager,
    productIds,
    store
  ) {
    const { catalog, storeFormats, channels } = store;
    let productValues;
    const productChargeValuesObjects: any = {};
    const productTaxValuesObjects: any = {};
    const productPriceValuesObjects: any = {};
    const productDiscountValuesObjects: any = {};
    if (
      storeFormats &&
      channels &&
      storeFormats.length > 0 &&
      channels.length > 0
    ) {
      const storeFormatIds = storeFormats.map(storeFormat => storeFormat.id);
      const validChannelIds = channels.map(channel => channel.id);

      const productPriceValues = await entityManager.find(ProductPriceValue, {
        where: {
          channel: In(validChannelIds),
          storeFormat: In(storeFormatIds),
          product: In(productIds)
        },
        relations: ["channel", "storeFormat", "product"]
      });

      const productTaxValues = await entityManager.find(ProductTaxValue, {
        where: {
          channel: In(validChannelIds),
          storeFormat: In(storeFormatIds),
          product: In(productIds),
          status: STATUS.ACTIVE
        },
        relations: ["channel", "storeFormat", "product"]
      });

      const productChargeValues = await entityManager.find(ProductChargeValue, {
        where: {
          channel: In(validChannelIds),
          storeFormat: In(storeFormatIds),
          product: In(productIds),
          status: STATUS.ACTIVE
        },
        relations: ["channel", "storeFormat", "product"]
      });

      const productDiscountValues = await entityManager.find(
        ProductDiscountValue,
        {
          where: {
            channel: In(validChannelIds),
            storeFormat: In(storeFormatIds),
            product: In(productIds),
            status: STATUS.ACTIVE
          },
          relations: ["channel", "storeFormat", "product", "discountType"]
        }
      );

      for (const productChargeValue of productChargeValues) {
        if (productChargeValuesObjects[productChargeValue.product.id]) {
          productChargeValuesObjects[productChargeValue.product.id].push(
            productChargeValue
          );
        } else {
          productChargeValuesObjects[productChargeValue.product.id] = [
            productChargeValue
          ];
        }
      }

      for (const productTaxValue of productTaxValues) {
        if (productTaxValuesObjects[productTaxValue.product.id]) {
          productTaxValuesObjects[productTaxValue.product.id].push(
            productTaxValue
          );
        } else {
          productTaxValuesObjects[productTaxValue.product.id] = [
            productTaxValue
          ];
        }
      }

      for (const productPriceValue of productPriceValues) {
        const foundProductDiscountValue = productDiscountValues.find(
          productDiscountValue => {
            return (
              productDiscountValue.channel.id ===
                productPriceValue.channel.id &&
              productDiscountValue.storeFormat.id ===
                productPriceValue.storeFormat.id &&
              productDiscountValue.product.id === productPriceValue.product.id
            );
          }
        );
        const priceValue = productPriceValue.priceValue;
        productPriceValue["basePrice"] = priceValue;
        if (foundProductDiscountValue) {
          if (
            foundProductDiscountValue.discountValueType ===
            DISCOUNT_VALUE_TYPE.ABSOLUTE
          ) {
            productPriceValue.priceValue =
              priceValue - foundProductDiscountValue.discountValue;
          } else {
            let discountValue =
              (foundProductDiscountValue.discountValue / 100) * priceValue;
            discountValue = toNumber(discountValue.toFixed(2));
            productPriceValue.priceValue = priceValue - discountValue;
          }
        }
        if (productPriceValuesObjects[productPriceValue.product.id]) {
          productPriceValuesObjects[productPriceValue.product.id].push(
            productPriceValue
          );
        } else {
          productPriceValuesObjects[productPriceValue.product.id] = [
            productPriceValue
          ];
        }
      }

      for (const productDiscountValue of productDiscountValues) {
        if (productDiscountValuesObjects[productDiscountValue.product.id]) {
          productDiscountValuesObjects[productDiscountValue.product.id].push(
            productDiscountValue
          );
        } else {
          productDiscountValuesObjects[productDiscountValue.product.id] = [
            productDiscountValue
          ];
        }
      }

      productValues = {
        productChargeValuesObjects,
        productTaxValuesObjects,
        productPriceValuesObjects,
        productDiscountValuesObjects
      };
    }
    return productValues;
  }

  public async getProductValues(entityManager, product, store) {
    const { catalog, storeFormats, channels } = store;
    let productValues;
    if (
      storeFormats &&
      channels &&
      storeFormats.length > 0 &&
      channels.length > 0
    ) {
      const storeFormatIds = storeFormats.map(storeFormat => storeFormat.id);
      const validChannelIds = channels.map(channel => channel.id);
      const productPriceValues = await entityManager.find(ProductPriceValue, {
        where: {
          channel: In(validChannelIds),
          storeFormat: In(storeFormatIds),
          product: product.id
        },
        relations: ["channel", "storeFormat", "product", "product.organization"]
      });

      const productTaxValues = await entityManager.find(ProductTaxValue, {
        where: {
          channel: In(validChannelIds),
          storeFormat: In(storeFormatIds),
          product: product.id,
          status: STATUS.ACTIVE
        },
        relations: ["channel", "storeFormat", "product", "product.organization"]
      });

      const productChargeValues = await entityManager.find(ProductChargeValue, {
        where: {
          channel: In(validChannelIds),
          storeFormat: In(storeFormatIds),
          product: product.id,
          status: STATUS.ACTIVE
        },
        relations: ["channel", "storeFormat", "product", "product.organization"]
      });

      const productDiscountValues = await entityManager.find(
        ProductDiscountValue,
        {
          where: {
            channel: In(validChannelIds),
            storeFormat: In(storeFormatIds),
            product: product.id,
            status: STATUS.ACTIVE
          },
          relations: ["channel", "storeFormat", "product", "discountType"]
        }
      );

      productValues = {
        productChargeValues,
        productTaxValues,
        productPriceValues,
        productDiscountValues
      };
    }
    return productValues;
  }

  public async findProductsForCategoryWithChildren(
    entityManager,
    category,
    store
  ) {
    // const productCategories = await entityManager.find(ProductCategory, {
    //   where: {
    //     category: {
    //       id: category.id,
    //     },
    //   },
    //   relations: ["category", "product", "product.variants"],
    // });

    const productCategories = await entityManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.category", "category")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("product.organization", "organization")
      .where("category.id=  :id and product.listable= :listable", {
        id: category.id,
        listable: true
      })
      .orderBy("productCategory.sortSeq", "ASC")
      .cache(true)
      .getMany();

    const products = productCategories.map(productCategory => {
      return productCategory.product;
    });

    if (products.length > 0) {
      const productIds: any[] = new Array();
      products.forEach(element => {
        productIds.push(element.id);
      });

      const storeProductInventoryMap: any = {};
      const storeInventoryData: any = await this.storeInventoryProvider.getStoreProductInventory(
        entityManager,
        {
          productIds: productIds,
          storeId: store.id
        }
      );
      storeInventoryData.map(inventoryData => {
        storeProductInventoryMap[inventoryData.product.id] =
          inventoryData.inventoryAvailable;
      });

      for (const product of products) {
        let inventoryAvailable = false;
        if (storeProductInventoryMap.hasOwnProperty(product.id)) {
          inventoryAvailable = storeProductInventoryMap[product.id];
        }
        product.inventoryAvailable = inventoryAvailable;
        product.store = store;
      }
    }

    category.products = products;
    if (category.children) {
      if (category.children.length > 0) {
        for (const child of category.children) {
          await this.findProductsForCategoryWithChildren(
            entityManager,
            child,
            store
          );
        }
      }
    }
    return category;
  }

  public async updateProductCategorySortSeq(
    entityManager: EntityManager,
    input: IUpdateProductCategorySortSeq
  ) {
    const productCategoryIds = input.productCategory.map(
      productCategoryInput => productCategoryInput.id
    );

    const foundProductCategories = await entityManager.find(ProductCategory, {
      where: {
        id: In(productCategoryIds)
      },
      relations: ["category"]
    });

    for (const productCategory of foundProductCategories) {
      const foundProductCategoryInput = input.productCategory.find(
        productCategoryInput => productCategoryInput.id == productCategory.id
      );
      productCategory.sortSeq = foundProductCategoryInput.sortSeq;
      const category = productCategory.category;
      const keys = [`${CACHING_KEYS.PRODUCT_CATEGORY}_${category.id}`];
      removeValueFromCache(keys);
    }

    const updatedProductCategory = await entityManager.save(
      foundProductCategories
    );
    return updatedProductCategory;
  }

  public async getProductByProductCode(
    entityManager: EntityManager,
    input: any
  ) {
    const { organizationId } = input;
    if (!input.code) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }
    const product = await entityManager.findOne(Product, {
      where: {
        code: input.code,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (!product) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }

    // const productId = product.id;
    // const addons = [];
    // const variants = [];

    // const addonRelationship = await entityManager.find(ProductRelationship, {
    //   where: {
    //     relationship: PRODUCT_TYPE.ADDON,
    //     childType: PRODUCT_TYPE.ADDON,
    //     parentId: productId
    //   }
    // });

    // if (addonRelationship.length > 0) {
    //   for (const addon of addonRelationship) {
    //     const addonProduct = await this.getProductById(
    //       entityManager,
    //       addon.childId,
    //       organizationId
    //     );
    //     addons.push(addonProduct);
    //   }
    // }

    // const variantsRelationship = await entityManager.find(ProductRelationship, {
    //   where: {
    //     relationship: PRODUCT_TYPE.VARIANT,
    //     childType: PRODUCT_TYPE.VARIANT,
    //     parentId: productId
    //   }
    // });

    // if (variantsRelationship.length > 0) {
    //   for (const variant of variantsRelationship) {
    //     const variantProduct = await this.getProductById(
    //       entityManager,
    //       variant.childId,
    //       organizationId
    //     );
    //     variants.push(variantProduct);
    //   }
    // }

    // const price = await this.productPriceValueProvider.getproductPriceValue(
    //   entityManager,
    //   { productId },
    //   organizationId
    // );

    // const tags = await entityManager.find(ProductTag, {
    //   where: {
    //     product: {
    //       id: productId,
    //       organization: organizationId
    //     },
    //     relations: ["product"]
    //   }
    // });

    return product;
  }

  public async createProduct(transactionManager, productDetails) {
    const validName = isValidString(productDetails.name);
    if (!validName) {
      throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
    }

    const validCode = isValidString(productDetails.code);
    if (!validCode) {
      throw new WCoreError(WCORE_ERRORS.INVALID_CODE);
    }

    if (productDetails.categoryCode) {
      const validCategoryCode = isValidString(productDetails.categoryCode);
      if (!validCategoryCode) {
        throw new WCoreError(WCORE_ERRORS.INVALID_CATEGORY_CODE);
      }
    }

    if (productDetails.status) {
      const isValidStatus = validateStatus(productDetails.status);
      if (!isValidStatus) {
        throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
      }
    }

    productDetails.status = productDetails.status || STATUS.ACTIVE;
    const formattedProductName = capitalizeFirstLetter(productDetails.name);
    productDetails.name = formattedProductName;
    productDetails.externalProductId = emptyStringCheck(
      productDetails.externalProductId
    );
    if (!productDetails.externalProductId) {
      throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_EXTERNAL_PRODUCT_ID);
    }

    const organization = await transactionManager.findOne(Organization, {
      id: productDetails.organizationId,
      status:STATUS.ACTIVE
    });

    if(!organization) {
      throw new WCoreError(WCORE_ERRORS.INVALID_ORG_ID);
    }
    
    const validationPromises = [];
    if (productDetails.organizationId) {
      validationPromises.push(
        Organization.availableById(
          transactionManager,
          productDetails.organizationId
        )
      );
    } else {
      throw new WalkinError(
        "Attribute organizationId is madatory to create product"
      );
    }
    if (productDetails.categoryIds) {
      for (const categoryId of productDetails.categoryIds) {
        validationPromises.push(
          Category.availableById(transactionManager, categoryId)
        );
      }
    }
    // console.log("~~~~~~~ Starting Option Validation");
    // if (productDetails.optionIds) {
    //   for (const optionId of productDetails.optionIds) {
    //     validationPromises.push(
    //       Option.availableById(transactionManager, optionId)
    //     );
    //   }
    // }
    // console.log("~~~~~~~ Starting Variant Validation");
    // if (productDetails.variants) {
    //   console.log("~~~~ Variant1");
    //   for (const variant of productDetails.variants) {
    //     console.log("~~~~ Variant2");
    //     for (const optionValueId of variant.optionValueIds) {
    //       console.log("~~~~ Variant3");
    //       validationPromises.push(
    //         OptionValue.availableById(transactionManager, optionValueId)
    //       );
    //     }
    //   }
    // }

    const createProductPromise = async () => {
      const isProductUnique = productDetails.isProductUnique;
      if (isProductUnique) {
        const uniqueProductName = await transactionManager.findOne(Product, {
          where: {
            name: productDetails.name,
            organization: organization.id
          }
        });
        if (uniqueProductName) {
          throw new WCoreError(WCORE_ERRORS.PRODUCT_NAME_NOT_UNIQUE);
        }
      }
      const product = await transactionManager.create(Product, productDetails);
      product.organization = organization;
      // Handle Entity Extensions
      const { extend } = productDetails;
      if (extend !== undefined) {
        try {
          const extendData = await validateAndReturnEntityExtendedData(
            transactionManager,
            extend,
            product.organization.id,
            "product"
          );
          product.extend = extendData;
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
      const savedProduct = await transactionManager.save(product);

      // Product category creation
      // if (productDetails.categoryIds) {
      //   for (const categoryId of productDetails.categoryIds) {
      //     const newProductCategory = transactionManager.create(
      //       ProductCategory,
      //       {}
      //     );
      //     newProductCategory.product = product;
      //     newProductCategory.category = transactionManager.create(Category, {
      //       id: categoryId
      //     });
      //     await transactionManager.save(ProductCategory, newProductCategory);
      //   }
      // }

      // Product options
      // if (productDetails.optionIds) {
      //   var optionValuesArray = [];
      //   var allOptionValues = [];
      //   for (const optionId of productDetails.optionIds) {
      //     var optionDetailsArray = [];
      //     const optionValue = await this.optionValueProvider.getOptionValuesByOptionId(
      //       transactionManager,
      //       optionId
      //     );
      //     allOptionValues.push(optionValue);
      //     for (const optionDetail of optionValue) {
      //       optionDetailsArray.push(optionDetail.value);
      //     }
      //     optionValuesArray.push(optionDetailsArray);
      //   }

      //   if (optionValuesArray.length > 0) {
      //     var combinationArray = getAllCombination(optionValuesArray, "+");
      //   }
      //   for (const combinationName of combinationArray) {
      //     const productName = savedProduct.name + "+" + combinationName;
      //     let productSku;
      //     if (productDetails.sku) {
      //       productSku = productDetails.sku;
      //     }
      //     const productDetail = {
      //       code: productName.replace(/\s+/g, ""),
      //       name: productName,
      //       description: savedProduct.description,
      //       productType: PRODUCT_TYPE.VARIANT,
      //       organization: organization,
      //       sku: productSku,
      //       status: savedProduct.status,
      //       // categoryId: savedProduct.category,
      //       listable: savedProduct.listable
      //     };
      //     const createProductVariant = await transactionManager.create(
      //       Product,
      //       productDetail
      //     );
      //     const savedOptionProduct = await transactionManager.save(
      //       createProductVariant
      //     );
      //     if (productDetails.categoryIds) {
      //       for (const categoryId of productDetails.categoryIds) {
      //         const newProductCategory = transactionManager.create(
      //           ProductCategory,
      //           {}
      //         );
      //         newProductCategory.product = createProductVariant;
      //         newProductCategory.category = transactionManager.create(
      //           Category,
      //           {
      //             id: categoryId
      //           }
      //         );
      //         await transactionManager.save(
      //           ProductCategory,
      //           newProductCategory
      //         );
      //       }
      //     }
      //     try {
      //       const values = combinationName.split("+");
      //       for (const optionId of productDetails.optionIds) {
      //         const newCategoryProductOption = transactionManager.create(
      //           CategoryProductOption,
      //           {}
      //         );
      //         newCategoryProductOption.option = transactionManager.create(
      //           Option,
      //           {
      //             id: optionId
      //           }
      //         );
      //         newCategoryProductOption.product = createProductVariant;
      //         await transactionManager.save(newCategoryProductOption);

      //         const optionValues = await this.optionValueProvider.getOptionValuesDetails(
      //           transactionManager,
      //           values,
      //           optionId
      //         );
      //         if (optionValues) {
      //           for (const optionValue of optionValues) {
      //             const newProductOptionValue = transactionManager.create(
      //               ProductOptionValue,
      //               {
      //                 optionValue: optionValue,
      //                 productOption: newCategoryProductOption
      //               }
      //             );
      //             await transactionManager.save(newProductOptionValue);
      //           }
      //         }
      //       }
      //       const productRelationShipObject = {
      //         parentId: savedProduct.id,
      //         childId: createProductVariant.id,
      //         parentType: savedProduct.productType,
      //         childType: PRODUCT_TYPE.VARIANT,
      //         relationship: PRODUCT_RELATIONSHIP.PRODUCT_VARIANT
      //       };
      //       const createproductRelationShip = await transactionManager.create(
      //         ProductRelationship,
      //         productRelationShipObject
      //       );
      //       const saveProductRelation = transactionManager.save(
      //         createproductRelationShip
      //       );
      //     } catch (error) {
      //       console.log("ERROR IN CREATING PRODUCT WITH OPTION", error);
      //     }
      //   }
      //   for (const optionId of productDetails.optionIds) {
      //     const newCategoryProductOption = transactionManager.create(
      //       CategoryProductOption,
      //       {}
      //     );
      //     newCategoryProductOption.option = transactionManager.create(Option, {
      //       id: optionId
      //     });
      //     newCategoryProductOption.product = product;
      //     await transactionManager.save(newCategoryProductOption);

      //     const optionValues = await this.optionValueProvider.getOptionValuesByOptionId(
      //       transactionManager,
      //       optionId
      //     );
      //     if (optionValues) {
      //       for (const optionValue of optionValues) {
      //         const newProductOptionValue = transactionManager.create(
      //           ProductOptionValue,
      //           {
      //             optionValue: optionValue,
      //             productOption: newCategoryProductOption
      //           }
      //         );
      //         await transactionManager.save(newProductOptionValue);
      //       }
      //     }
      //   }
      // }
      // if (productDetails.optionValueIds) {
      //   await this.createVariantByOptionValue(
      //     transactionManager,
      //     productDetails,
      //     organization,
      //     savedProduct
      //   );
      // }

      // console.log("~~~~~~~ Creating Product Variant");
      // Prouct variants
      // if (productDetails.variants) {
      //   for (const variant of productDetails.variants) {
      //     const newProductVariant = transactionManager.create(ProductVariant, {
      //       ...variant
      //     });
      //     newProductVariant.product = product;
      //     const savedProductVariant = await transactionManager.save(
      //       newProductVariant
      //     );
      //     for (const variantValueId of variant.optionValueIds) {
      //       const newProductVariantValue = transactionManager.create(
      //         ProductVariantValue,
      //         {}
      //       );
      //       newProductVariantValue.productVariant = savedProductVariant;
      //       newProductVariantValue.optionValue = transactionManager.create(
      //         OptionValue,
      //         {
      //           id: variantValueId
      //         }
      //       );
      //       await transactionManager.save(newProductVariantValue);
      //     }
      //   }
      // }
      return transactionManager.findOne(Product, {
        where: { id: savedProduct.id },
        relations: ["organization"]
      });
    };

    return validationDecorator(createProductPromise, validationPromises);
  }

  public async updateProduct(transactionManager, productDetails) {
    if (productDetails.name) {
      const formattedProductName = capitalizeFirstLetter(productDetails.name);
      productDetails.name = formattedProductName;
    }
    const validationPromises = [];
    if (productDetails.organizationId) {
      validationPromises.push(
        Organization.availableById(
          transactionManager,
          productDetails.organizationId
        )
      );
    } else {
      throw new WalkinError(
        "Attribute organizationId is madatory to update product"
      );
    }
    if (productDetails.categoryIds) {
      for (const categoryId of productDetails.categoryIds) {
        validationPromises.push(
          Category.availableById(transactionManager, categoryId)
        );
      }
    }
    const organization = await transactionManager.findOne(Organization, {
      id: productDetails.organizationId,
      status:STATUS.ACTIVE
    });

    if(!organization) {
      throw new WCoreError(WCORE_ERRORS.INVALID_ORG_ID);
    }
    // if (productDetails.optionIds) {
    //   for (const optionId of productDetails.optionIds) {
    //     validationPromises.push(
    //       Option.availableById(transactionManager, optionId)
    //     );
    //   }
    // }
    // if (productDetails.variants) {
    //   for (const variant of productDetails.variants) {
    //     for (const optionValueId of variant.optionValueIds) {
    //       validationPromises.push(
    //         OptionValue.availableById(transactionManager, optionValueId)
    //       );
    //     }
    //   }
    // }

    const updateProductPromise = async () => {
      const product = await transactionManager.findOne(Product, {
        where: {
          id: productDetails.id,
          organization:{
            id: productDetails.organizationId
          }
        }
      });
      if (!product) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
      }

      if(Object.prototype.hasOwnProperty.call(productDetails,"name") )
      {
        const validName = isValidString(productDetails.name);
        if (!validName) {
          throw new WCoreError(WCORE_ERRORS.INVALID_INPUT);
        }
      }
     

      if (Object.prototype.hasOwnProperty.call(productDetails,"status")){
        const isValidStatus = validateStatus(productDetails.status);
        if (!isValidStatus) {
          throw new WCoreError(WCORE_ERRORS.INVALID_STATUS);
        }
      }
      
      productDetails.externalProductId =
        emptyStringCheck(productDetails.externalProductId) == null
          ? product.externalProductId
          : productDetails.externalProductId;

      updateEntity(product, productDetails);

      product.organization = organization;
      const isProductUnique = productDetails.isProductUnique;
      if (isProductUnique) {
        const uniqueProductName = await transactionManager.findOne(Product, {
          where: {
            id: Not(product.id),
            name: productDetails.name,
            organization: organization.id
          }
        });
        if (uniqueProductName) {
          throw new WCoreError(WCORE_ERRORS.PRODUCT_NAME_NOT_UNIQUE);
        }
      }
      // Handle Entity Extensions
      const { extend } = productDetails;
      if (extend !== undefined) {
        try {
          const extendData = await validateAndReturnEntityExtendedData(
            transactionManager,
            extend,
            product.organization.id,
            "product"
          );
          product.extend = extendData;
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
      const productRelationShips = await transactionManager.find(
        ProductRelationship,
        {
          where: {
            parentId: product.id,
            childType: PRODUCT_TYPE.VARIANT
          }
        }
      );
      let productIds = [];
      let childIds = [];
      productIds.push(product.id);
      if (productRelationShips) {
        for (const productRelationShip of productRelationShips) {
          productIds.push(productRelationShip.childId);
          childIds.push(productRelationShip.childId);
        }
      }
      // if (childIds.length > 0) {
      //   for (const childId of childIds) {
      //     let childProduct = await transactionManager.findOne(Product, {
      //       where: {
      //         id: childId
      //       }
      //     });
      //     let nameSplitted = childProduct.name.split("+");
      //     let productName;
      //     if (productDetails.name) {
      //       productName = productDetails.name;
      //     } else {
      //       productName = product.name;
      //     }
      //     nameSplitted[0] = productName;
      //     childProduct.name = nameSplitted.join("+");
      //     await transactionManager.save(childProduct);
      //     const keys = [`${CACHING_KEYS.PRODUCT}_${childProduct.id}`];
      //     removeValueFromCache(keys);
      //   }
      // }
      const productCategoriesDetails = await transactionManager.find(
        ProductCategory,
        {
          where: {
            product: {
              id: In(productIds)
            },
            relations: ["category"]
          }
        }
      );
      let productCategoriesArray = [];
      if (productDetails.categoryIds) {
        const removedProductCategory = await transactionManager.remove(
          productCategoriesDetails
        );
        for (const categoryId of productDetails.categoryIds) {
          for (const productId of productIds) {
            const newProductCategory = transactionManager.create(
              ProductCategory,
              {}
            );
            newProductCategory.product = transactionManager.create(Product, {
              id: productId
            });
            newProductCategory.category = transactionManager.create(Category, {
              id: categoryId
            });
            const productCategories = await transactionManager.save(
              ProductCategory,
              newProductCategory
            );
            productCategoriesArray.push(productCategories);
          }
        }
      } else {
        productCategoriesArray = productCategoriesDetails;
      }
      // Handle Entity Extensions
      const savedProduct = await transactionManager.save(product);
      // if (productDetails.optionIds) {
      //   var optionValuesArray = [];
      //   var allOptionValues = [];
      //   for (const optionId of productDetails.optionIds) {
      //     var optionDetailsArray = [];
      //     const optionValue = await this.optionValueProvider.getOptionValuesByOptionId(
      //       transactionManager,
      //       optionId
      //     );
      //     allOptionValues.push(optionValue);
      //     for (const optionDetail of optionValue) {
      //       optionDetailsArray.push(optionDetail.value);
      //     }
      //     optionValuesArray.push(optionDetailsArray);
      //   }

      //   if (optionValuesArray.length > 0) {
      //     var combinationArray = getAllCombination(optionValuesArray, "+");
      //   }
      //   for (const combinationName of combinationArray) {
      //     const productName = savedProduct.name + "+" + combinationName;
      //     const productOption = await this.getProductByName(
      //       transactionManager,
      //       productName,
      //       organization.id
      //     );
      //     if (!productOption) {
      //       let productSku;
      //       if (productDetails.sku) {
      //         productSku = productDetails.sku;
      //       }
      //       const productDetail = {
      //         code: productName.replace(/\s+/g, ""),
      //         name: productName,
      //         description: savedProduct.description,
      //         productType: PRODUCT_TYPE.VARIANT,
      //         organization: organization,
      //         sku: productSku,
      //         status: savedProduct.status,
      //         categoryId: savedProduct.id,
      //         listable: savedProduct.listable
      //       };
      //       const createProductVariant = await transactionManager.create(
      //         Product,
      //         productDetail
      //       );
      //       const savedOptionProduct = await transactionManager.save(
      //         createProductVariant
      //       );
      //       if (productCategoriesArray.length > 0) {
      //         for (const productCategory of productCategoriesArray) {
      //           const newProductCategory = transactionManager.create(
      //             ProductCategory,
      //             {}
      //           );
      //           newProductCategory.product = createProductVariant;
      //           newProductCategory.category = transactionManager.create(
      //             Category,
      //             {
      //               id: productCategory.categoryId
      //             }
      //           );
      //           const keys = [
      //             `${CACHING_KEYS.PRODUCT_CATEGORY}_${productCategory.categoryId}`
      //           ];
      //           removeValueFromCache(keys);
      //           await transactionManager.save(
      //             ProductCategory,
      //             newProductCategory
      //           );
      //         }
      //       }
      //       try {
      //         const values = combinationName.split("+");
      //         for (const optionId of productDetails.optionIds) {
      //           const newCategoryProductOption = transactionManager.create(
      //             CategoryProductOption,
      //             {}
      //           );
      //           newCategoryProductOption.option = transactionManager.create(
      //             Option,
      //             {
      //               id: optionId
      //             }
      //           );
      //           newCategoryProductOption.product = createProductVariant;
      //           await transactionManager.save(newCategoryProductOption);

      //           const optionValues = await this.optionValueProvider.getOptionValuesDetails(
      //             transactionManager,
      //             values,
      //             optionId
      //           );
      //           if (optionValues) {
      //             for (const optionValue of optionValues) {
      //               const newProductOptionValue = transactionManager.create(
      //                 ProductOptionValue,
      //                 {
      //                   optionValue: optionValue,
      //                   productOption: newCategoryProductOption
      //                 }
      //               );
      //               await transactionManager.save(newProductOptionValue);
      //             }
      //           }
      //         }
      //         const productRelationShipObject = {
      //           parentId: savedProduct.id,
      //           childId: createProductVariant.id,
      //           parentType: savedProduct.productType,
      //           childType: PRODUCT_TYPE.VARIANT,
      //           relationship: PRODUCT_RELATIONSHIP.PRODUCT_VARIANT
      //         };
      //         const createproductRelationShip = await transactionManager.create(
      //           ProductRelationship,
      //           productRelationShipObject
      //         );
      //         const saveProductRelation = transactionManager.save(
      //           createproductRelationShip
      //         );
      //         const keys = [
      //           `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${savedProduct.id}`
      //         ];
      //         removeValueFromCache(keys);
      //       } catch (error) {
      //         console.log("ERROR IN CREATING PRODUCT WITH OPTION", error);
      //       }
      //       for (const optionId of productDetails.optionIds) {
      //         const newCategoryProductOption = transactionManager.create(
      //           CategoryProductOption,
      //           {}
      //         );
      //         newCategoryProductOption.option = transactionManager.create(
      //           Option,
      //           {
      //             id: optionId
      //           }
      //         );
      //         newCategoryProductOption.product = product;
      //         await transactionManager.save(newCategoryProductOption);

      //         const optionValues = await this.optionValueProvider.getOptionValuesByOptionId(
      //           transactionManager,
      //           optionId
      //         );
      //         if (optionValues) {
      //           for (const optionValue of optionValues) {
      //             const newProductOptionValue = transactionManager.create(
      //               ProductOptionValue,
      //               {
      //                 optionValue: optionValue,
      //                 productOption: newCategoryProductOption
      //               }
      //             );
      //             await transactionManager.save(newProductOptionValue);
      //           }
      //         }
      //       }
      //     }
      //     if (productOption) {
      //       const productRelationShip = await this.productRelationshipProvider.getProductRelationshipByChildId(
      //         transactionManager,
      //         productOption
      //       );
      //       if (productRelationShip.length == 0) {
      //         const productRelationShipObject = {
      //           parentId: savedProduct.id,
      //           childId: productOption.id,
      //           parentType: savedProduct.productType,
      //           childType: PRODUCT_TYPE.VARIANT,
      //           relationship: PRODUCT_RELATIONSHIP.PRODUCT_VARIANT
      //         };
      //         const createproductRelationShip = await transactionManager.create(
      //           ProductRelationship,
      //           productRelationShipObject
      //         );
      //         const saveProductRelation = transactionManager.save(
      //           createproductRelationShip
      //         );
      //         const keys = [
      //           `${CACHING_KEYS.PRODUCT_RELATIONSHIP}_${savedProduct.id}`
      //         ];
      //         removeValueFromCache(keys);
      //       }
      //     }
      //   }
      // }
      // if (productDetails.optionValueIds) {
      //   await this.createVariantByOptionValue(
      //     transactionManager,
      //     productDetails,
      //     organization,
      //     savedProduct
      //   );
      // }
      const keys = [`${CACHING_KEYS.PRODUCT}_${savedProduct.id}`];
      removeValueFromCache(keys);
      return transactionManager.findOne(Product, {
        where: { id: savedProduct.id },
        relations: ["organization"]
      });
    };

    return validationDecorator(updateProductPromise, validationPromises);
  }

  public async disableProduct(transactionManager, productName, organizationId) {
    const product = await transactionManager.findOne(Product, {
      name: productName,
      organization_id:organizationId
    });
    if (product && product.status === STATUS.ACTIVE) {
      const updateProduct = await transactionManager.update(
        Product,
        { id: product.id },
        { status: STATUS.INACTIVE }
      );
      console.log(updateProduct);
      const productDetails = await transactionManager.findOne(Product, {
        where: { id: product.id, organization_id: organizationId },
        relations: ["organization"]
      });
      // Remove the menu timings for the product
      // if (productDetails.menuTimingsForProduct) {
      //   await this.menuTimingService.removeMenuTimingsForProduct(
      //     transactionManager,
      //     {
      //       code: productDetails.menuTimingsForProduct.code,
      //       product: product.id
      //     }
      //   );
      // }
      return productDetails;
    } else if (product && product.status === STATUS.INACTIVE) {
      throw new Error("Product is already inactive.");
    } else {
      throw new Error("Product not found");
    }
  }

  public async getProductById(
    transactionManager,
    id,
    organizationId
  ): Promise<Product | any> {
    const key = `${CACHING_KEYS.PRODUCT}_${id}`;
    let product = await getValueFromCache(key);
    if (!product) {
      product = await transactionManager.findOne(Product, {
        where: {
          id,
          organization: organizationId
        },
        relations: ["menuTimingsForProduct"]
      });
      if (product) {
        await setValueToCache(key, product, EXPIRY_MODE.EXPIRE, CACHE_TTL);
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return product;
  }

  public async getProductDetails(
    transactionManager,
    id
  ): Promise<Product | any> {
    const product = await transactionManager.findOne(Product, {
      where: {
        id
      },
      relations: ["organization"]
    });

    return product;
  }

  public async getLeafCategories(
    transactionManager,
    category: Category
  ): Promise<any> {
    const leafCategories = [];
    if (!category.children || category.children.length === 0) {
      return category;
    }
    for (const categoryChild of category.children) {
      leafCategories.push(
        await this.getLeafCategories(transactionManager, categoryChild)
      );
    }
    return leafCategories;
  }

  public async getProducts(
    transactionManager: EntityManager,
    productsSearchObj
  ) {
    const organizationId = productsSearchObj.organizationId;
    let products;
    if (
      productsSearchObj.categoryId !== undefined &&
      productsSearchObj.categoryId !== ""
    ) {
      const category = await transactionManager.findOne(Category, {
        where: { id: productsSearchObj.categoryId },
        cache: 10000
      });

      const categoryTreeRepo = transactionManager.getTreeRepository(Category);

      const categoryTree = await categoryTreeRepo.findDescendantsTree(category);

      let leafCategories: any = await this.getLeafCategories(
        transactionManager,
        categoryTree
      );
      if (!isArray(leafCategories)) {
        // Individual category and not an array
        leafCategories = [leafCategories];
      }

      const leafCategoryIds = leafCategories.map(cat => {
        return cat.id;
      });

      let whereClause =
        "organization.id =:organizationId and productCategory.category.id in (:leafCategoryIds)";
      let whereClauseParams = {
        leafCategoryIds: leafCategoryIds,
        organizationId
      };

      if (productsSearchObj.externalProductId) {
        whereClause =
          whereClause +
          " " +
          "and product.externalProductId=:externalProductId";
        whereClauseParams["externalProductId"] =
          productsSearchObj.externalProductId;
      }

      if (productsSearchObj.listable !== undefined) {
        whereClause = whereClause + " " + "and product.listable=:listable";
        whereClauseParams["listable"] = productsSearchObj.listable;
      }

      if (
        productsSearchObj.name !== undefined &&
        productsSearchObj.name !== ""
      ) {
        whereClause = whereClause + " " + "and product.name=:name";
        whereClauseParams["name"] = productsSearchObj.name;
      }
      


      const productCategories = await transactionManager
        .getRepository(ProductCategory)
        .createQueryBuilder("productCategory")
        .innerJoinAndSelect("productCategory.category", "category")
        .innerJoinAndSelect("productCategory.product", "product")
        .innerJoinAndSelect("product.organization", "organization")
        .where(whereClause, whereClauseParams)
        .getMany();

      products = productCategories.map(productCategory => {
        return productCategory.product;
      });

      return products;
    } else {
      let newProductSearchObj = {
        organization: {
          id: organizationId
        }
      };
      if (productsSearchObj.externalProductId !== undefined) {
        newProductSearchObj["externalProductId"] =
          productsSearchObj.externalProductId;
      }
      if (productsSearchObj.listable !== undefined) {
        newProductSearchObj["listable"] = productsSearchObj.listable;
      }
      if (productsSearchObj.name !== undefined) {
        newProductSearchObj["name"] = productsSearchObj.name;
      }

      products = await transactionManager.find(Product, {
        where: { ...newProductSearchObj,status:STATUS.ACTIVE },
        relations: ["organization"]
      });
      return products;
    }
  }
  public async getProductByExternalProductId(
    entityManager: EntityManager,
    input: any
  ) {
    const product = await entityManager.findOne(Product, {
      where: {
        externalProductId: input.externalProductId,
        organization: {
          id: input.organizationId
        }
      }
    });
    if (!product) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }

    return product;
  }

  public async getProductByName(
    transactionManager,
    productName,
    organizationId
  ): Promise<Product | any> {
    const product = await transactionManager.findOne(Product, {
      where: {
        name: productName,
        organization: {
          id: organizationId
        }
      }
    });

    return product;
  }
  public async getProductValuesByProduct(entityManager, product) {
    let productValues;
    const productPriceValues = await entityManager.find(ProductPriceValue, {
      where: {
        product: product.id
      },
      relations: ["channel", "storeFormat", "product", "product.organization"]
    });

    const productTaxValues = await entityManager.find(ProductTaxValue, {
      where: {
        product: product.id,
        status: STATUS.ACTIVE
      },
      relations: ["channel", "storeFormat", "product", "product.organization"]
    });

    const productChargeValues = await entityManager.find(ProductChargeValue, {
      where: {
        product: product.id,
        status: STATUS.ACTIVE
      },
      relations: ["channel", "storeFormat", "product", "product.organization"]
    });

    const productDiscountValues = await entityManager.find(
      ProductDiscountValue,
      {
        where: {
          product: product.id,
          status: STATUS.ACTIVE
        },
        relations: ["channel", "storeFormat", "product", "discountType"]
      }
    );

    productValues = {
      productChargeValues,
      productTaxValues,
      productPriceValues,
      productDiscountValues
    };
    return productValues;
  }
  public async getProductTagsByProduct(
    entityManager: EntityManager,
    productId
  ) {
    const productTag = await entityManager.find(ProductTag, {
      where: {
        product: {
          id: productId
        }
      },
      relations: ["product"]
    });
    return productTag;
  }
  public async getProductByProductId(
    transactionManager,
    productId
  ): Promise<Product | any> {
    const product = await transactionManager.findOne(Product, {
      where: {
        id: productId,
        listable: true
      }
    });
    if (!product) {
      logger.info(`getProductByProductId-PNA-BYID: ${productId}`);
      throw new WCoreError({
        HTTP_CODE: 500,
        MESSAGE: "Product Not Available",
        CODE: "PNA"
      });
    }
    return product;
  }
  public async validateChildProductData(
    entityManager,
    childId,
    parentId
  ): Promise<Product | any> {
    const child = await entityManager.findOne(Product, {
      where: {
        id: childId,
        listable: true
      }
    });
    if (!child) {
      throw new WCoreError({
        HTTP_CODE: 500,
        MESSAGE: "Product Not Available",
        CODE: "PNA"
      });
    }
    const foundRelation = await entityManager.findOne(ProductRelationship, {
      where: {
        parentId,
        childId
      }
    });
    if (!foundRelation) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_RELATIONSHIP_NOT_FOUND);
    }
    return child;
  }
  public async createVariantByOptionValue(
    transactionManager,
    productDetails,
    organization,
    savedProduct
  ) {
    let optionValue: any;
    for (const optionValueId of productDetails.optionValueIds) {
      optionValue = await this.optionValueProvider.getOptionValueById(
        transactionManager,
        optionValueId
      );
      if (optionValue) {
        const productName = savedProduct.name + "+" + optionValue.value;
        let productSku;
        if (productDetails.sku) {
          productSku = productDetails.sku;
        }
        const productCode = formatProductCode(productName);
        const productDetail = {
          code: productCode,
          name: productName,
          description: savedProduct.description,
          productType: PRODUCT_TYPE.VARIANT,
          organization: organization,
          sku: productSku,
          status: savedProduct.status,
          listable: savedProduct.listable
        };
        const createProductVariant = await transactionManager.create(
          Product,
          productDetail
        );
        const savedOptionProduct = await transactionManager.save(
          createProductVariant
        );
        if (productDetails.categoryIds) {
          for (const categoryId of productDetails.categoryIds) {
            const newProductCategory = transactionManager.create(
              ProductCategory,
              {}
            );
            newProductCategory.product = createProductVariant;
            newProductCategory.category = transactionManager.create(Category, {
              id: categoryId
            });
            await transactionManager.save(ProductCategory, newProductCategory);
          }
        }
        try {
          const newCategoryProductOption = transactionManager.create(
            CategoryProductOption,
            {}
          );
          newCategoryProductOption.option = transactionManager.create(Option, {
            id: optionValue.optionId
          });
          newCategoryProductOption.product = createProductVariant;
          await transactionManager.save(newCategoryProductOption);

          const newProductOptionValue = transactionManager.create(
            ProductOptionValue,
            {
              optionValue: optionValue,
              productOption: newCategoryProductOption
            }
          );
          await transactionManager.save(newProductOptionValue);

          const productRelationShipObject = {
            parentId: savedProduct.id,
            childId: createProductVariant.id,
            parentType: savedProduct.productType,
            childType: PRODUCT_TYPE.VARIANT,
            relationship: PRODUCT_RELATIONSHIP.PRODUCT_VARIANT
          };
          const createproductRelationShip = await transactionManager.create(
            ProductRelationship,
            productRelationShipObject
          );
          const saveProductRelation = transactionManager.save(
            createproductRelationShip
          );
        } catch (error) {
          console.log("ERROR IN CREATING PRODUCT WITH OPTION", error);
        }
      }
    }
  }
}

@Injectable()
export class CategoryProductOptionProvider {
  public getCategoryProductOptionsByProductId(
    transactionManager,
    productId,
    organizationId
  ) {
    const validationPromises = [];

    if (productId) {
      validationPromises.push(
        Product.availableByIdForOrganization(
          transactionManager,
          productId,
          organizationId
        )
      );
    }

    const getCategoryProductOptionPromise = async () => {
      return transactionManager.find(CategoryProductOption, {
        where: {
          product: {
            id: productId
          }
        },
        relations: ["product", "option"]
      });
    };

    return validationDecorator(
      getCategoryProductOptionPromise,
      validationPromises
    );
  }

  public createCategoryProductOption(transactionManager, productOption) {
    const organizationId = productOption.organizationId;

    const validationPromises = [];
    if (productOption.productId) {
      validationPromises.push(
        Product.availableByIdForOrganization(
          transactionManager,
          productOption.productId,
          organizationId
        )
      );
    }
    if (productOption.optionId) {
      validationPromises.push(
        Option.availableByIdForOrganization(
          transactionManager,
          productOption.optionId,
          organizationId
        )
      );
    }
    const createCategoryProductOptionPromise = () => {
      const newCategoryProductOption = transactionManager.create(
        CategoryProductOption,
        productOption
      );
      newCategoryProductOption.option = transactionManager.create(Option, {
        id: productOption.optionId
      });
      newCategoryProductOption.product = transactionManager.create(Product, {
        id: productOption.productId
      });

      return transactionManager.save(newCategoryProductOption);
    };
    return validationDecorator(
      createCategoryProductOptionPromise,
      validationPromises
    );
  }

  public updateCategoryProductOption(transactionManager, productOption) {
    const validationPromises = [];
    if (productOption.productId) {
      validationPromises.push(
        Product.availableById(transactionManager, productOption.productId)
      );
    }
    if (productOption.optionId) {
      validationPromises.push(
        Option.availableById(transactionManager, productOption.optionId)
      );
    }
    if (productOption.id) {
      validationPromises.push(
        CategoryProductOption.availableById(
          transactionManager,
          productOption.id
        )
      );
    }

    const updateCategoryProductOptionPromise = async () => {
      const mergedCategoryProductOption = await transactionManager.preload(
        CategoryProductOption,
        {
          id: Number(productOption.id)
        }
      );
      mergedCategoryProductOption.option = transactionManager.create(Option, {
        id: productOption.optionId
      });
      mergedCategoryProductOption.product = transactionManager.create(Product, {
        id: productOption.productId
      });

      return CategoryProductOption.save(mergedCategoryProductOption);
    };
    return validationDecorator(
      updateCategoryProductOptionPromise,
      validationPromises
    );
  }
}
@Injectable()
export class ProductVariantProvider {
  public getProductVariantById(transactionManager, id) {
    return transactionManager.findOne(ProductVariant, id);
  }

  public async getProductVariantsByProductId(
    transactionManager,
    productId,
    organizationId?: string
  ) {
    const validationPromises = [];

    if (productId && organizationId) {
      validationPromises.push(
        Product.availableByIdForOrganization(
          transactionManager,
          productId,
          organizationId
        )
      );
    }

    const getProductVariantsByProductPromise = async () => {
      return transactionManager.find(ProductVariant, {
        where: {
          product: {
            id: productId
          }
        },
        relations: ["product"]
      });
    };

    return validationDecorator(
      getProductVariantsByProductPromise,
      validationPromises
    );
  }

  public createProductVariant(transactionManager, productVariant) {
    const validationPromises = [];
    if (productVariant.productId) {
      validationPromises.push(
        Product.availableById(transactionManager, productVariant.productId)
      );
    }
    const createProductVariantPromise = () => {
      const newProductVariant = transactionManager.create(
        ProductVariant,
        productVariant
      );
      newProductVariant.product = transactionManager.create(Product, {
        id: productVariant.productId
      });

      return transactionManager.save(newProductVariant);
    };
    return validationDecorator(createProductVariantPromise, validationPromises);
  }

  public updateProductVariant(transactionManager, productVariant) {
    const validationPromises = [];
    if (!productVariant.productId) {
      throw new WCoreError(WCORE_ERRORS.INVALID_INPUT_PASSED);
    }
    if (productVariant.productId) {
      validationPromises.push(
        Product.availableById(transactionManager, productVariant.productId)
      );
    }
    if (!productVariant.id) {
      throw new WCoreError(WCORE_ERRORS.INVALID_INPUT_PASSED);
    }
    if (productVariant.id) {
      validationPromises.push(
        ProductVariant.availableById(transactionManager, productVariant.id)
      );
    }

    const updateProductVariantPromise = async () => {
      const mergedProductVariant = await transactionManager.preload(
        ProductVariant,
        {
          ...productVariant,
          id: Number(productVariant.id)
        }
      );
      if (!mergedProductVariant) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_VARIANT_NOT_FOUND);
      }
      mergedProductVariant.product = transactionManager.create(Product, {
        id: productVariant.productId
      });

      return transactionManager.save(mergedProductVariant);
    };
    return validationDecorator(updateProductVariantPromise, validationPromises);
  }
}
@Injectable()
export class ProductVariantValueProvider {
  public getProductVariantValuesByProductVariantId(
    transactionManager,
    productVariantId,
    organizationId?: string
  ) {
    const validationPromises = [];

    if (productVariantId && organizationId) {
      const productVariant = transactionManager.find(ProductVariant, {
        where: {
          id: productVariantId
        },
        relations: ["product"]
      });

      if (productVariant) {
        throw new WCoreError(WCORE_ERRORS.PRODUCT_VARIANT_NOT_FOUND);
      }

      const productId = productVariant.product.id;
      validationPromises.push(
        Product.availableByIdForOrganization(
          transactionManager,
          productId,
          organizationId
        )
      );
    }

    const getProductVariantValuesByProductVariiantPromise = async () => {
      return transactionManager.find(ProductVariantValue, {
        where: {
          productVariant: {
            id: productVariantId
          }
        },
        relations: ["productVariant", "optionValue"]
      });
    };
    return validationDecorator(
      getProductVariantValuesByProductVariiantPromise,
      validationPromises
    );
  }

  public async createProductVariantValue(
    transactionManager,
    productVariantValue
  ) {
    const validationPromises = [];
    if (productVariantValue.productVariantId) {
      validationPromises.push(
        ProductVariant.availableById(
          transactionManager,
          productVariantValue.productVariantId
        )
      );
    }
    const createProductVariantValuePromise = () => {
      const newProductVariantValue = transactionManager.create(
        ProductVariantValue,
        productVariantValue
      );
      newProductVariantValue.productVariant = transactionManager.create(
        ProductVariant,
        {
          id: productVariantValue.productVariantId
        }
      );
      newProductVariantValue.optionValue = transactionManager.create(
        OptionValue,
        {
          id: productVariantValue.optionValueId
        }
      );
      return transactionManager.save(newProductVariantValue);
    };
    return validationDecorator(
      createProductVariantValuePromise,
      validationPromises
    );
  }

  public updateProductVariantValue(transactionManager, productVariantValue) {
    const validationPromises = [];
    if (productVariantValue.productVariantId) {
      validationPromises.push(
        ProductVariant.availableById(
          transactionManager,
          productVariantValue.productVariantId
        )
      );
    }
    if (productVariantValue.id) {
      validationPromises.push(
        ProductVariantValue.availableById(
          transactionManager,
          productVariantValue.id
        )
      );
    }

    const updateProductVariantValuePromise = async () => {
      const mergedProductVariantValue = await transactionManager.preload(
        ProductVariantValue,
        {
          ...productVariantValue,
          id: Number(productVariantValue.id)
        }
      );
      mergedProductVariantValue.productVariant = transactionManager.create(
        ProductVariant,
        {
          id: productVariantValue.productVariantId
        }
      );
      mergedProductVariantValue.optionValue = OptionValue.create({
        id: productVariantValue.optionValueId,
        ...OptionValue
      });
      return ProductVariantValue.save(mergedProductVariantValue);
    };
    return validationDecorator(
      updateProductVariantValuePromise,
      validationPromises
    );
  }
}
@Injectable()
export class ProductCategoryProvider {
  constructor(
    @Inject(ProductProvider)
    private productProvider: ProductProvider
  ) {}

  public findProductCategoryById(transactionManager, id) {
    return transactionManager.findOne(ProductCategory, id);
  }

  public async findProductCategoryByCategoryId(
    transactionManager: EntityManager,
    categoryId,
    organizationId
  ) {
    const validationPromises = [];

    if (categoryId && organizationId) {
      const category = await transactionManager.findOne(Category, {
        where: {
          id: categoryId
        },
        relations: ["catalog"]
      });

      if (!category) {
        throw new WCoreError(WCORE_ERRORS.CATEGORY_NOT_FOUND);
      }

      const catalogId = category.catalog.id;

      const catalog = await transactionManager.findOne(Catalog, {
        where: {
          id: catalogId
        },
        relations: ["organization"]
      });

      if (!catalog) {
        throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
      }

      validationPromises.push(
        Catalog.availableByIdForOrganization(
          transactionManager,
          catalogId,
          organizationId
        )
      );
    }

    const findProductCategoryByCategoryPromise = async () => {
      return transactionManager.find(ProductCategory, {
        where: {
          category: {
            id: categoryId
          }
        },
        relations: ["product", "category"],
        order: {
          sortSeq: "ASC"
        }
      });
    };

    return validationDecorator(
      findProductCategoryByCategoryPromise,
      validationPromises
    );
  }

  public async findProductCategoryByCategoryCode(
    transactionManager: EntityManager,
    categoryCode,
    organizationId
  ) {
    const category = await transactionManager.findOne(Category, {
      where: {
        code: categoryCode
      }
    });

    if (!category) {
      throw new WCoreError(WCORE_ERRORS.CATALOG_NOT_FOUND);
    }

    return transactionManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.category", "category")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("product.organization", "organization")
      .where("category.code=:code and organization.id=:organizationId", {
        code: categoryCode,
        organizationId
      })
      .getMany();
  }

  public async createProductCategory(
    transactionManager: EntityManager,
    productCategory
  ) {
    const { organizationId, categoryId, productId } = productCategory;

    const product = await this.productProvider.getProductById(
      transactionManager,
      productId,
      organizationId
    );

    if (!product) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }

    const category = await transactionManager
      .getRepository(Category)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.catalog", "catalog")
      .leftJoinAndSelect("catalog.organization", "organization")
      .where("category.id=  :categoryId and organization.id= :organizationId", {
        categoryId,
        organizationId
      })
      .getOne();

    if (!category) {
      throw new WCoreError(WCORE_ERRORS.CATEGORY_NOT_FOUND);
    }

    const findExistingRelations = await transactionManager.findOne(
      ProductCategory,
      {
        where: {
          category: categoryId,
          product: productId
        }
      }
    );
    if (findExistingRelations) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_ALREADY_AVAILABLE_IN_CATEGORY);
    }

    const newProductCategory = transactionManager.create(
      ProductCategory,
      productCategory
    );
    newProductCategory.product = transactionManager.create(Product, {
      id: productId
    });
    newProductCategory.category = transactionManager.create(Category, {
      id: categoryId
    });
    return transactionManager.save(newProductCategory);
  }

  public async removeProductCategory(transactionManager, input) {
    const productCategory = await transactionManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("product.organization", "organization")
      .where("productCategory.id=  :id and organization.id= :organizationId", {
        id: input.id,
        organizationId: input.organizationId
      })
      .getMany();

    if (productCategory.length == 0) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_CATEGORY_NOT_FOUND);
    }
    return transactionManager.remove(productCategory);
  }

  public async updateProductCategory(transactionManager, productCategory) {
    const { organizationId, categoryId, productId, id } = productCategory;

    const product = await this.productProvider.getProductById(
      transactionManager,
      productId,
      organizationId
    );

    if (!product) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_NOT_FOUND);
    }

    const category = await transactionManager
      .getRepository(Category)
      .createQueryBuilder("category")
      .leftJoinAndSelect("category.catalog", "catalog")
      .leftJoinAndSelect("catalog.organization", "organization")
      .where("category.id=  :categoryId and organization.id= :organizationId", {
        categoryId,
        organizationId
      })
      .getOne();

    if (!category) {
      throw new WCoreError(WCORE_ERRORS.CATEGORY_NOT_FOUND);
    }

    const productCategoryDetails = await transactionManager
      .getRepository(ProductCategory)
      .createQueryBuilder("productCategory")
      .leftJoinAndSelect("productCategory.product", "product")
      .leftJoinAndSelect("product.organization", "organization")
      .where("productCategory.id=  :id and organization.id= :organizationId", {
        id,
        organizationId
      })
      .getOne();

    if (!productCategoryDetails) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_CATEGORY_NOT_FOUND);
    }

    const findExistingRelations = await transactionManager.findOne(
      ProductCategory,
      {
        where: {
          id: Not(id),
          category: categoryId,
          product: productId
        }
      }
    );
    if (findExistingRelations) {
      throw new WCoreError(WCORE_ERRORS.PRODUCT_ALREADY_AVAILABLE_IN_CATEGORY);
    }
    const mergedProductCategory = await transactionManager.preload(
      ProductCategory,
      {
        ...productCategory,
        id: Number(id)
      }
    );
    mergedProductCategory.product = transactionManager.create(Product, {
      id: productId
    });
    mergedProductCategory.category = transactionManager.create(Category, {
      id: categoryId
    });
    return transactionManager.save(mergedProductCategory);
  }
}
