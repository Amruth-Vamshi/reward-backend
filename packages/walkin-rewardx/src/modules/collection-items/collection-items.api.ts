import express from "express";
import authMiddleware from "../../../../walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { CollectionsItemsModule } from "./collection-items.module";
import { CollectionsItemsProvider as CollectionsItemsP } from "./collection-items.provider";
import { getManager } from "typeorm";
import { WCoreError } from "../../../../walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "../../../../walkin-core/src/modules/common/constants/errors";
import { NextFunction } from "express";
import { asyncHandler } from "../rest/middleware/async";
import { CollectionsItems } from "../../entity/collections-items";
import { ENTITY_NAME_MAPPING } from "../common/constants/constant";
const CollectionsItemsProvider = CollectionsItemsModule.injector.get(
  CollectionsItemsP
);
const CollectionsItemsRouter = express.Router();

import { getOrganizationIdFromAuthToken } from "../../../../walkin-core/src/modules/common/utils/utils";
import { CollectionsProvider } from "../collections/collections.provider";
import { Customer } from "@walkinserver/walkin-core/src/entity";

const fs = require("fs");
const multer = require("multer");

CollectionsItemsRouter.use(express.json());
CollectionsItemsRouter.use(
  express.urlencoded({
    extended: true
  })
);
const fileStoregeEngine = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, __dirname + "/uploads");
  },
  filename: (req, file, callBack) => {
    callBack(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  }
});
const upload = multer({
  storage: fileStoregeEngine
});
const csvtojson = require("csvtojson");

CollectionsItemsRouter.post(
  "/upload-collection-items-from-csv",
  authMiddleware,
  upload.single("CollectionItemsCSV"),
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      let failedToCreateForCollection: any = [];
      let createdCollectionItems: any = [];
      let alreadyExistingCollectionItems: any = [];
      const result = await getManager().transaction(async entityManager => {
        let collectionItemsData = await csvtojson().fromFile(req.file.path);

        for (let index in collectionItemsData) {
          let input = collectionItemsData[index];
          input.itemDetails = JSON.parse(input.itemDetails);
          input.organizationId = organizationId;
          try {
            let alreadyExistingCollectionItem: any = async (
              entityManager,
              input
            ) => {
              const collections = await CollectionsItemsModule.injector
                .get(CollectionsProvider)
                .getCollectionsById(
                  entityManager,
                  input.collectionsId,
                  organizationId
                );
              if (!collections) {
                throw new WCoreError(WCORE_ERRORS.COLLECTIONS_NOT_FOUND);
              }
              const entityType = collections.entity;
              const entity = ENTITY_NAME_MAPPING[entityType];
              if (entityType == "CUSTOMER") {
                // if (!input.itemDetails.customerIdentifier) {
                //   throw new WCoreError(
                //     WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMER_IDENTIFIER
                //   );
                // }
                if (!input.itemDetails.externalCustomerId) {
                  throw new WCoreError(WCORE_ERRORS.PLEASE_PROVIDE_CUSTOMERID);
                }
                // if (!input.itemDetails.phoneNumber) {
                //   throw new WCoreError(WCORE_ERRORS.PHONE_NUMBER_NOT_FOUND);
                // }
              }
              const item = await entityManager.findOne(entity, {
                where: input.itemDetails
              });
              if (item) {
                const collectionsItem = await entityManager.find(
                  CollectionsItems,
                  {
                    where: { itemId: item.id, collections: input.collectionsId }
                  }
                );
                if (collectionsItem.length > 0) {
                  return collectionsItem;
                }
              }
            };
            let alreadyExists = await alreadyExistingCollectionItem(
              entityManager,
              input
            );
            if (
              (alreadyExists != null || alreadyExists != undefined) &&
              alreadyExists.length == 1
            ) {
              alreadyExists[0]["collectionsId"] = input.collectionsId;
              alreadyExistingCollectionItems.push(alreadyExists[0]);
              continue;
            }
          } catch (error) {
            failedToCreateForCollection.push({
              ErrorMessage: error.message,
              input
            });
            continue;
          }

          try {
            let fResult = await CollectionsItemsProvider.createCollectionItems(
              entityManager,
              CollectionsItemsModule.injector,
              input
            );
            createdCollectionItems.push(fResult);
          } catch (error) {
            failedToCreateForCollection.push({
              ErrorMessage: error.message,
              input
            });
          }
        }

        return {
          createdCollectionItems,
          alreadyExistingCollectionItems,
          failedToCreateForCollection
        };
      });
      fs.unlinkSync(req.file.path, function(err) {
        if (err) {
          throw new Error("FileNotFound");
        }
      });

      return res.status(200).send(result);
    } catch (error) {
      fs.unlinkSync(req.file.path, function(err) {
        if (err) {
          throw new Error("FileNotFound");
        }
      });
      next(error);
    }
  })
);

CollectionsItemsRouter.post(
  "/add-collection-item",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const collectionItem = await getManager().transaction(
        transactionManager => {
          return CollectionsItemsProvider.createCollectionItems(
            transactionManager,
            CollectionsItemsModule.injector,
            input
          );
        }
      );
      let createdCustomerLoyaltyAndCustomerLoyaltyPrograms;
      if (collectionItem.collections.entity === "CUSTOMER") {
        let customer = await Customer.findOne({
          where: {
            externalCustomerId: input.itemDetails.externalCustomerId,
            phoneNumber: input.itemDetails.phoneNumber,
            customerIdentifier: input.itemDetails.customerIdentifier
          }
        });
        let input2 = {
          organizationId: input.organizationId,
          collectionsId: input.collectionsId,
          externalCustomerId: customer.externalCustomerId,
          customerIdentifier: customer.customerIdentifier,
          phoneNumber: customer.phoneNumber
        };
        if (customer) {
          createdCustomerLoyaltyAndCustomerLoyaltyPrograms = await getManager().transaction(
            transactionManager => {
              return CollectionsItemsProvider.createCustomerLoyaltyAndCustomerLoyaltyProgram(
                transactionManager,
                CollectionsItemsModule.injector,
                input2
              );
            }
          );
        } else {
          createdCustomerLoyaltyAndCustomerLoyaltyPrograms = null;
        }
      }
      return res.status(200).send({
        collectionItem,
        createdCustomerLoyaltyAndCustomerLoyaltyPrograms
      });
    } catch (error) {
      next(error);
    }
  })
);

CollectionsItemsRouter.delete(
  "/remove-collection-item",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = {};
      const { collectionItemsId } = req.query;
      input["collectionItemsId"] = collectionItemsId;

      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;
      const result = await getManager().transaction(transactionManager => {
        return CollectionsItemsProvider.removeCollectionItems(
          transactionManager,
          CollectionsItemsModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CollectionsItemsRouter.get(
  "/get-collection-item",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { collectionItemId } = req.query;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      let result = await getManager().transaction(transactionManager => {
        return CollectionsItemsProvider.getCollectionItemsById(
          transactionManager,
          collectionItemId,
          organizationId
        );
      });
      result = result || {};
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CollectionsItemsRouter.get(
  "/get-collection-items",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(transactionManager => {
        return CollectionsItemsProvider.getCollectionItems(
          transactionManager,
          CollectionsItemsModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default CollectionsItemsRouter;
