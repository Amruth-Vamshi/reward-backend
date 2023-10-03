import Dataloader from "dataloader";
import { getManager, In } from "typeorm";
import { Product, ProductCategory, ProductChargeValue, ProductDiscountValue, ProductPriceValue, ProductTag, ProductTaxValue, ProductVariant, ProductVariantValue } from "../../../entity";
import { CACHE_TTL, CACHING_KEYS, DISCOUNT_VALUE_TYPE, EXPIRY_MODE, STATUS } from "../../common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { toNumber } from "lodash";
import { ProductVariantValueProvider } from "./product.providers";

export const productLoader = () => {
  return new Dataloader(getProductByParentId);
};

async function getProductByParentId(productIds) {
  const productIdsTobeFetched = [];
  const foundProducts = {};
  const entityManager = getManager();

  for (const productId of productIds) {
    const key = `${CACHING_KEYS.PRODUCT}_${productId}`;
    let product: any = await getValueFromCache(key);
    if (product) {
      foundProducts[productId] = product;
    } else {
      productIdsTobeFetched.push(productId);
    }
  }

  let products = [];
  const productMap: any = {};
  if (productIdsTobeFetched.length > 0) {
    products = await entityManager
      .createQueryBuilder(Product, "product")
      .leftJoinAndSelect("product.organization", "organization")
      .where("product.id IN (:productIds)", {
        productIds: productIdsTobeFetched
      })
      .getMany();
    products.map(productData => {
      productMap[productData.id] = productData;
    });

    for (let [productId, relationShip] of Object.entries(productMap)) {
      const key = `${CACHING_KEYS.PRODUCT}_${productId}`;
      const rel: any = relationShip;
      await setValueToCache(key, rel, EXPIRY_MODE.EXPIRE, CACHE_TTL);
    }
  }

  products = { ...productMap, ...foundProducts };
  return productIds.map(id => products[id]);
}

export const productValuesLoader = () => {
  return new Dataloader(getProductValues);
}
async function getProductValues(products) {
  const productTaxValueMap = {}
  const productPriceValueMap = {}
  const productChargeValueMap = {};
  const productDiscountValueMap = {};
  let productIds = products.map(product => product.id);

  if (products[0].store) {
    const { channels, storeFormats } = products[0].store;
    const storeFormatIds = storeFormats.map(storeFormat => storeFormat.id);
    const validChannelIds = channels.map(channel => channel.id);
    const productIdsTobeFetched = productIds;

    const productPriceValues = await getManager().find(ProductPriceValue, {
      where: {
        channel: In(Array.from(validChannelIds)),
        storeFormat: In(Array.from(storeFormatIds)),
        product: In(productIdsTobeFetched),
      },
      relations: [
        "channel",
        "storeFormat",
        "product",
        "product.organization",
      ],
    });


    for (const priceValue of productPriceValues) {
      if (priceValue) {
        if (productPriceValueMap[priceValue.product.id]) {
          productPriceValueMap[priceValue.product.id].push(priceValue)
        }
        else {
          productPriceValueMap[priceValue.product.id] = [priceValue]
        }
      }
    }

    const productTaxValues = await getManager().find(ProductTaxValue, {
      where: {
        channel: In(Array.from(validChannelIds)),
        storeFormat: In(Array.from(storeFormatIds)),
        product: In(productIds),
        status: STATUS.ACTIVE,
      },
      relations: [
        "channel",
        "storeFormat",
        "product",
        "product.organization",
        "taxLevel"
      ],
    });

    for (const taxValue of productTaxValues) {
      if (taxValue) {
        if (productTaxValueMap[taxValue.product.id]) {
          productTaxValueMap[taxValue.product.id].push(taxValue)
        }
        else {
          productTaxValueMap[taxValue.product.id] = [taxValue]
        }
      }
    }

    const productChargeValues = await getManager().find(ProductChargeValue, {
      where: {
        channel: In(Array.from(validChannelIds)),
        storeFormat: In(Array.from(storeFormatIds)),
        product: In(productIds),
        status: STATUS.ACTIVE,
      },
      relations: [
        "channel",
        "storeFormat",
        "product",
        "product.organization",
        "chargeType"
      ],
    });


    for (const chargeValue of productChargeValues) {
      if (chargeValue) {
        if (productChargeValueMap[chargeValue.product.id]) {
          productChargeValueMap[chargeValue.product.id].push(chargeValue)
        }
        else {
          productChargeValueMap[chargeValue.product.id] = [chargeValue]
        }
      }
    }

    const productDiscountValues = await getManager().find(
      ProductDiscountValue,
      {
        where: {
          channel: In(Array.from(validChannelIds)),
          storeFormat: In(Array.from(storeFormatIds)),
          product: In(productIds),
          status: STATUS.ACTIVE,
        },
        relations: ["channel", "storeFormat", "product", "discountType"],
      }
    );

    for (const discountValue of productDiscountValues) {
      if (discountValue) {
        if (productDiscountValueMap[discountValue.product.id]) {
          productDiscountValueMap[discountValue.product.id].push(discountValue)
        }
        else {
          productDiscountValueMap[discountValue.product.id] = [discountValue]
        }
      }
    }
    for (const [productId, priceValues] of Object.entries(productPriceValueMap)) {
      const priceValueArray: any = priceValues;
      for (const productPriceValue of priceValueArray) {
        const foundProductDiscountValue = productDiscountValueMap[productId]?.find(
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
      }
      productPriceValueMap[productId] = priceValueArray;
    };
  } else {
    const productPriceValues = await getManager().find(ProductPriceValue, {
      where: {
        product: In(productIds),
        status: STATUS.ACTIVE
      },
      relations: [
        "channel",
        "storeFormat",
        "product",
        "product.organization",
      ],
    });


    for (const priceValue of productPriceValues) {
      if (priceValue) {
        if (productPriceValueMap[priceValue.product.id]) {
          productPriceValueMap[priceValue.product.id].push(priceValue)
        }
        else {
          productPriceValueMap[priceValue.product.id] = [priceValue]
        }
      }
    }

    const productTaxValues = await getManager().find(ProductTaxValue, {
      where: {
        product: In(productIds),
        status: STATUS.ACTIVE,
      },
      relations: [
        "channel",
        "storeFormat",
        "product",
        "product.organization",
        "taxLevel"
      ],
    });

    for (const taxValue of productTaxValues) {
      if (taxValue) {
        if (productTaxValueMap[taxValue.product.id]) {
          productTaxValueMap[taxValue.product.id].push(taxValue)
        }
        else {
          productTaxValueMap[taxValue.product.id] = [taxValue]
        }
      }
    }

    const productChargeValues = await getManager().find(ProductChargeValue, {
      where: {
        product: In(productIds),
        status: STATUS.ACTIVE,
      },
      relations: [
        "channel",
        "storeFormat",
        "product",
        "product.organization",
        "chargeType"
      ],
    });


    for (const chargeValue of productChargeValues) {
      if (chargeValue) {
        if (productChargeValueMap[chargeValue.product.id]) {
          productChargeValueMap[chargeValue.product.id].push(chargeValue)
        }
        else {
          productChargeValueMap[chargeValue.product.id] = [chargeValue]
        }
      }
    }

    const productDiscountValues = await getManager().find(
      ProductDiscountValue,
      {
        where: {
          product: In(productIds),
          status: STATUS.ACTIVE,
        },
        relations: ["channel", "storeFormat", "product", "discountType"],
      }
    );

    for (const discountValue of productDiscountValues) {
      if (discountValue) {
        if (productDiscountValueMap[discountValue.product.id]) {
          productDiscountValueMap[discountValue.product.id].push(discountValue)
        }
        else {
          productDiscountValueMap[discountValue.product.id] = [discountValue]
        }
      }
    }
    for (const [productId, priceValues] of Object.entries(productPriceValueMap)) {
      const priceValueArray: any = priceValues;
      for (const productPriceValue of priceValueArray) {
        const foundProductDiscountValue = productDiscountValueMap[productId]?.find(
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
      }
      productPriceValueMap[productId] = priceValueArray;
    };
  }

  return productIds.map(id => {
    const resultMap = {};
    if (productTaxValueMap[id] == null && productPriceValueMap[id] == null && productChargeValueMap[id] == null && productDiscountValueMap[id] == null) {
      resultMap["productPriceValues"] = []
      resultMap["productTaxValues"] = [];
      resultMap["productChargeValues"] = [];
      resultMap["productDiscountValues"] = [];
      return resultMap;
    }
    resultMap["productPriceValues"] = productPriceValueMap[id] == null ? [] : productPriceValueMap[id];
    resultMap["productTaxValues"] = productTaxValueMap[id] == null ? [] : productTaxValueMap[id];
    resultMap["productChargeValues"] = productChargeValueMap[id] == null ? [] : productChargeValueMap[id];
    resultMap["productDiscountValues"] = productDiscountValueMap[id] == null ? [] : productDiscountValueMap[id];
    return resultMap;
  });
}

export const productCategoryLoader = () => {
  return new Dataloader(getProductCategory);
}

async function getProductCategory(products) {
  const productIds = products.map(product => product.id);
  const productCategoryMapping = {};

  const productCategories = await getManager().find(ProductCategory, {
    where: {
      product: {
        id: In(productIds)
      }
    },
    relations: ["category"]
  })

  for (const productCategory of productCategories) {
    if (productCategory) {
      const productId = productCategory.productId;

      if (productCategoryMapping[productId]) {
        productCategoryMapping[productId].push(productCategory.category)
      } else {
        productCategoryMapping[productId] = [productCategory.category]
      }
    }
  }

  return productIds.map(
    id => productCategoryMapping[id] ? productCategoryMapping[id] : []
  );
}

export const productTagsLoader = () => {
  return new Dataloader(getProductTags);
}

async function getProductTags(products) {
  const productIds = products.map(product => product.id);
  const productTagMapping = {};

  const productTags = await getManager()
    .getRepository(ProductTag)
    .createQueryBuilder("productTag")
    .leftJoinAndSelect("productTag.product", "product")
    .leftJoinAndSelect("productTag.tag", "tag")
    .where(
      "product.id IN (:productIds)",
      {
        productIds
      }
    ).getMany();

  for (const productTag of productTags) {
    if (productTag) {
      const productId = productTag.product.id;

      if (productTagMapping[productId]) {
        productTagMapping[productId].push(productTag)
      }
      else {
        productTagMapping[productId] = [productTag]
      }
    }
  }

  return productIds.map(id =>
    productTagMapping[id] ? productTagMapping[id] : []
  );
}

export const productVariantsLoader = () => {
  return new Dataloader(getProductVariants);
}

async function getProductVariants(products) {
  const productIds = products.map(product => product.id);
  const fetchProductVariant = [];
  const productVariantMap = {};

  for (const product of products) {
    if (product.variants && product.variants.length >= 0) {
      productVariantMap[product.id] = product.variants;
    }
    if (product && product.id) {
      fetchProductVariant.push(product.id);
    }
  }

  const productVariants = await getManager().find(ProductVariant, {
    where: {
      product: {
        id: In(fetchProductVariant)
      }
    },
    relations: ["product"]
  });

  for (const productVariant of productVariants) {
    if (productVariant) {
      const productId = productVariant.product.id;

      if (productVariantMap[productId]) {
        productVariantMap[productId].push(productVariant);
      }
      else {
        productVariantMap[productId] = [productVariant];
      }
    }
  }

  return productIds.map(id =>
    productVariantMap[id] ? productVariantMap[id] : []
  );
}

export const productVariantsValueLoader = () => {
  return new Dataloader(getProductVariantValue);
}

async function getProductVariantValue(parent) {
  const transactionManager = await getManager()

  let optionValues = [];
  if (
    parent.productVariantValues &&
    parent.productVariantValues.length >= 0
  ) {
    for (const productVariantValue of parent.productVariantValues) {
      optionValues.push(productVariantValue.optionValue);
    }
    return optionValues;
  }

  let productVariantValues;
  if (parent) {
    const parentIds = parent.map(parent => parent.id);
    productVariantValues = await transactionManager.find(ProductVariantValue, {
      where: {
        productVariant: {
          id: In(parentIds)
        }
      },
      relations: ["productVariant", "optionValue"]
    });
  };
  for (const productVariantValue of productVariantValues) {
    optionValues.push(productVariantValue.optionValue);
  }
  return optionValues;
}

export const productVariantsByVariantsId = () => {
  return new Dataloader(getproductVariantsByVariantsId);
}

async function getproductVariantsByVariantsId(parents: any) {
  const productVariantIds = parents.map(parent => parent.productVariantId);
  const productVariantMap = {};
  const productVariants = await getManager().find(ProductVariant, {
    where: {
      id: In(productVariantIds)
    }
  })

  for (const productVariant of productVariants) {
    productVariantMap[productVariant.id] = productVariant;
  }

  return productVariantIds.map(id => productVariantMap[id]);
}