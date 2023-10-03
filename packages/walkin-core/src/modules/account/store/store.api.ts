import express, { NextFunction } from "express";
const StoreRouter = express.Router();
import authMiddleware from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { StoreModule } from "./store.module";
import { Stores as StoreProvider } from "./store.providers";
const Stores = StoreModule.injector.get(StoreProvider);

import { StoreFormatModule } from "../../productcatalog/storeformat/storeFormat.module";
import { StoreFormatProvider as StoreFormat } from "../../productcatalog/storeformat/storeFormat.providers";
const StoreFormatProvider = StoreFormatModule.injector.get(StoreFormat);

import { CatalogModule } from "../../productcatalog/catalog/catalog.module";
import { CatalogProvider as Catalog } from "../../productcatalog/catalog/catalog.providers";
const CatalogProvider = CatalogModule.injector.get(Catalog);

import { ChannelModule } from "../../productcatalog/channel/channel.module";
import { ChannelProvider as Channel } from "../../productcatalog/channel/channel.providers";
const ChannelProvider = ChannelModule.injector.get(Channel);

import { UserModule } from "../user/user.module";
import { Users as UserProvider } from "../user/user.providers";
const Users = UserModule.injector.get(UserProvider);

import { StoreServiceAreaModule } from "../store-service-area/store-service-area.module";
import { StoreServiceAreaProvider as StoreServiceArea } from "../store-service-area/store-service-area.providers";
const StoreServiceAreaProvider = StoreServiceAreaModule.injector.get(
  StoreServiceArea
);

import { StoreInventoryModule } from "../../productcatalog/storeInventory/storeInventory.module";
import { StoreInventoryProvider as StoreInventory } from "../../productcatalog/storeInventory/storeInventory.providers";
const StoreInventoryProvider = StoreInventoryModule.injector.get(
  StoreInventory
);

import { getManager, getConnection } from "typeorm";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import {
  setOrganizationToInput,
  isUserOrAppAuthorizedToWorkOnOrganization,
  getOrganizationIdFromAuthToken
} from "../../../modules/common/utils/utils";
import {
  DEFAULT_SERVICE_AREA_RADIUS,
  STATUS,
  STORE_SERVICE_AREA_TYPE
} from "../../common/constants/constants";
import { callLoadStoreSearch } from "../../common/utils/utils";
import { asyncHandler } from "../../../../../walkin-rewardx/src/modules/rest/middleware/async";

StoreRouter.get(
  "/store-by-code/:storeCode",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const storeCode = req.params.storeCode;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      let result = await getManager().transaction(async transactionManager => {
        const store = Stores.getStorebyStoreCode(
          transactionManager,
          storeCode,
          organizationId
        );
        return store;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

StoreRouter.post(
  "/stores",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const user = req.user;
      const application = null;
      let input = req.body;
      input = setOrganizationToInput(input, user, application);
      await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        input.organizationId
      );
      let result = await getConnection().transaction(
        async transactionManager => {
          const createdStore = await Stores.createStore(
            transactionManager,
            input
          );
          return createdStore;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

StoreRouter.put(
  "/update-store/:id",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const user = req.user;
      let input = req.body;
      const id = req.params.id;
      input["id"] = id;
      const application = null;
      let result = await getConnection().transaction(
        async transactionManager => {
          input = setOrganizationToInput(input, user, application);
          await isUserOrAppAuthorizedToWorkOnOrganization(
            user,
            application,
            input.organizationId
          );
          const updatedStore = await Stores.updateStore(
            transactionManager,
            input
          );
          return updatedStore;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

StoreRouter.put(
  "/update-store-by-code/:code",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const user = req.user;
      const application = null;
      let input = req.body;
      const code = req.params.code;
      input["code"] = code;
      let result = await getConnection().transaction(
        async transactionManager => {
          input = setOrganizationToInput(input, user, application);
          await isUserOrAppAuthorizedToWorkOnOrganization(
            user,
            application,
            input.organizationId
          );
          const store = await Stores.updateStoreByCode(
            transactionManager,
            input
          );
          return store;
        }
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default StoreRouter;
