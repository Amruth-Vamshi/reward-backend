import Dataloader from "dataloader";
import { getManager, In } from "typeorm";
import { MenuTimingForProduct } from "../../../entity";
import { CACHE_TTL, CACHING_KEYS, EXPIRY_MODE } from "../../common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { formatMenuTimings } from "../../common/utils/utils";
import { MenuTimingProvider } from "../menuTiming/menuTiming.providers";

export const productMenuTimingLoader = () => {
  return new Dataloader(getMenuTimingsForProduct);
};

async function getMenuTimingsForProduct(input) {
  const injector = input[0].injector;
  const entityManager = getManager();
  const productIds = input.map(product => product.id);

  const existingProductTimings = {};
  const productIdsToFetchTimings = [];
  let productIdLookup: any = [];

  for (const productId of productIds) {
    // Fetch the list of actual menu timings for product from cache
    const key = `${CACHING_KEYS.MENU_TIMINGS_FOR_PRODUCT}_${productId}`;
    let productTimings = await getValueFromCache(key);
    if (productTimings) {
      existingProductTimings[productId] = productTimings;
    } else {
      productIdsToFetchTimings.push(productId);
    }
  }

  if (productIdsToFetchTimings.length > 0) {
    const menuTimingCodeForProduct = await entityManager.find(
      MenuTimingForProduct,
      {
        where: {
          product: In(productIdsToFetchTimings)
        },
        relations: ["product"]
      }
    );

    for (const menuCode of menuTimingCodeForProduct) {
      let menuTimings = await injector
        .get(MenuTimingProvider)
        .fetchAllMenuTimingsByCode(
          entityManager,
          menuCode,
          input[0].organizationId
        );
      if (menuTimings.length > 0) {
        menuTimings = formatMenuTimings(menuTimings);

        // Set the list of actual menu timings for product in cache
        // const key = `${CACHING_KEYS.MENU_TIMINGS_FOR_PRODUCT}_${menuCode.product.id}`;
        const key = `${CACHING_KEYS.MENU_TIMINGS_FOR_PRODUCT}`;
        await setValueToCache(key, menuTimings, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
      menuCode["menuTimings"] = menuTimings;
    }

    productIdLookup = menuTimingCodeForProduct.reduce(
      (accumulator: any, menuTimingCode: any) => {
        accumulator[menuTimingCode.product.id] = menuTimingCode.menuTimings;
        return accumulator;
      },
      {}
    );
  }

  const combinedProductMenuTimings = {
    ...existingProductTimings,
    ...productIdLookup
  };
  const response = productIds.map(id => combinedProductMenuTimings[id]);
  return response;
}
