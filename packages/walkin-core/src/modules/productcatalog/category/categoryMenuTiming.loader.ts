import Dataloader from "dataloader";
import { getManager, In } from "typeorm";
import { MenuTimingForCategory } from "../../../entity";
import { CACHE_TTL, CACHING_KEYS, EXPIRY_MODE } from "../../common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "../../common/utils/redisUtils";
import { formatMenuTimings } from "../../common/utils/utils";
import { MenuTimingProvider } from "../menuTiming/menuTiming.providers";

export const categoryMenuTimingLoader = () => {
  return new Dataloader(getMenuTimingsForCategory);
};

async function getMenuTimingsForCategory(input) {
  const injector = input[0].injector;
  const entityManager = getManager();
  const categoryIds = input.map(category => category.id);

  const existingCategoryTimings = {};
  const categoryIdsToFetchTimings = [];
  let categoryIdLookup: any = [];

  for (const categoryId of categoryIds) {
    // Fetch the list of actual menu timings for category from cache
    const key = `${CACHING_KEYS.MENU_TIMINGS_FOR_CATEGORY}_${categoryId}`;
    let categoryTimings = await getValueFromCache(key);
    if (categoryTimings) {
      existingCategoryTimings[categoryId] = categoryTimings;
    } else {
      categoryIdsToFetchTimings.push(categoryId);
    }
  }

  if (categoryIdsToFetchTimings.length > 0) {
    const menuTimingCodeForCategory = await entityManager.find(
      MenuTimingForCategory,
      {
        where: {
          category: In(categoryIdsToFetchTimings)
        },
        relations: ["category"]
      }
    );

    for (const menuCode of menuTimingCodeForCategory) {
      let menuTimings = await injector
        .get(MenuTimingProvider)
        .fetchAllMenuTimingsByCode(
          entityManager,
          menuCode,
          input[0].organizationId
        );
      if (menuTimings.length > 0) {
        menuTimings = formatMenuTimings(menuTimings);

        // Set the list of actual menu timings for category in cache
        const key = `${CACHING_KEYS.MENU_TIMINGS_FOR_CATEGORY}_${menuCode.category.id}`;
        await setValueToCache(key, menuTimings, EXPIRY_MODE.EXPIRE, CACHE_TTL);
      }
      menuCode["menuTimings"] = menuTimings;
    }

    categoryIdLookup = menuTimingCodeForCategory.reduce(
      (accumulator: any, menuTimingCode: any) => {
        accumulator[menuTimingCode.category.id] = menuTimingCode.menuTimings;
        return accumulator;
      },
      {}
    );
  }

  const combinedCategoryMenuTimings = {
    ...existingCategoryTimings,
    ...categoryIdLookup
  };
  const response = categoryIds.map(id => combinedCategoryMenuTimings[id]);
  return response;
}
