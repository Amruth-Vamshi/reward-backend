import express from "express";
const CollectionsRouter = express.Router();
import authMiddleware from "../../../../walkin-core/src/modules/account/auth-guard/auth-gaurd.middleware";
import { CollectionsModule } from "./collections.module";
import { CollectionsProvider as Collections } from "./collections.provider";
const CollectionsProvider = CollectionsModule.injector.get(Collections);

import { getManager } from "typeorm";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";

import { NextFunction } from "express";
import { asyncHandler } from "../rest/middleware/async";
import {
  getJWTPayload,
  getOrganizationIdFromAuthToken,
  isValidString
} from "../../../../walkin-core/src/modules/common/utils/utils";

const fs = require("fs");
const multer = require("multer");

CollectionsRouter.use(express.json());
CollectionsRouter.use(
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

CollectionsRouter.post(
  "/upload-collections",
  authMiddleware,
  upload.single("CollectionsCSV"),
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      let createdCollections: any = [];
      let alreadyExistingCollections: any = [];
      let failedToCreate: any = [];
      const result = await getManager().transaction(async entityManager => {
        let collectionsData = await csvtojson().fromFile(req.file.path);

        for (let index in collectionsData) {
          let input = collectionsData[index];
          input["organizationId"] = organizationId;
          try {
            let alreadyExists: any = await CollectionsProvider.getCollectionsWithFilters(
              entityManager,
              CollectionsModule.injector,
              input
            );
            if (
              (alreadyExists != null || alreadyExists != undefined) &&
              alreadyExists.count == 1
            ) {
              alreadyExistingCollections.push(alreadyExists);
              continue;
            }
          } catch (error) {
            failedToCreate.push({ ErrorMessage: error.message, input });
          }

          try {
            let fResult = await CollectionsProvider.createCollections(
              entityManager,
              CollectionsModule.injector,
              input
            );
            createdCollections.push(fResult);
          } catch (error) {
            failedToCreate.push({ ErrorMessage: error.message, input });
          }
        }

        return {
          createdCollections,
          alreadyExistingCollections,
          failedToCreate
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

CollectionsRouter.get(
  "/fetch-collections-with-filters",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    // Logic goes here
    try {

      const input = req.query;
      const { page, pageSize } = req.query;
      const pageOptions = {
        page,
        pageSize
      };

      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(async entityManager => {
        return CollectionsProvider.getCollectionsWithFilters(
          entityManager,
          CollectionsModule.injector,
          input,
          pageOptions
        );
      });
      return res.status(200).send(result);

    } catch (error) {
      next(error);
    }
  })
);

CollectionsRouter.get(
  "/get-collections-by-campaignId",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { campaignId } = req.query;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      const result = await getManager().transaction(async entityManager => {
        return CollectionsProvider.getCollectionsByCampaignId(
          entityManager,
          CollectionsModule.injector,
          organizationId,
          campaignId
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CollectionsRouter.get(
  "/get-collection-by-collectionId",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { collectionId } = req.query;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      const result = await getManager().transaction(async entityManager => {
        return CollectionsProvider.getCollectionsById(
          entityManager,
          collectionId,
          organizationId
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CollectionsRouter.get(
  "/get-collection-by-ids",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
     
      // If the collectionIds is not provided then the default value will be ""
      const { collectionIds = "" } = req.query;

      // If the collection ids are not specified in the query then we raise an error
      if ( !isValidString(collectionIds) )
      {
        throw new WCoreError(WCORE_ERRORS.COLLECTIONS_IDS_NOT_FOUND);
      }
      
      const collectionIdsList = collectionIds.split(',');
      
      if ( collectionIdsList.length === 0 )
      {
        throw new WCoreError(WCORE_ERRORS.COLLECTIONS_IDS_NOT_FOUND);
      }

      const organizationId= getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      
      // We redefine the input object to object of two elements of organizationId , collectionIdsList
      const input = {organizationId , collectionIdsList}

      const result = await getManager().transaction(async entityManager => {
        return CollectionsProvider.getCollectionsByIdsList(
          entityManager,
          input
        );
      });
      
      return res.status(200).send(result);

    } catch (error) {
      next(error);
    }
  })
);

CollectionsRouter.post(
  "/create-collections",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(transactionManager => {
        return CollectionsProvider.createCollections(
          transactionManager,
          CollectionsModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);
CollectionsRouter.put(
  "/update-collections/:collectionsId",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const collectionsId = req.params.collectionsId;
      input["collectionsId"] = collectionsId;

      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );
      input["organizationId"] = organizationId;

      const result = await getManager().transaction(transactionManager => {
        return CollectionsProvider.updateCollections(
          transactionManager,
          CollectionsModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CollectionsRouter.delete(
  "/delete-collection",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { collectionId } = req.query;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const result = await getManager().transaction(async entityManager => {
        return CollectionsProvider.deleteCollection(
          entityManager,
          CollectionsModule.injector,
          { collectionId, organizationId }
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CollectionsRouter.post(
  "/disable-collection",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const { collectionId } = req.query;
      const organizationId = getOrganizationIdFromAuthToken(
        req.headers.authorization
      );

      const result = await getManager().transaction(async entityManager => {
        let input = { collectionId, organizationId };
        return CollectionsProvider.disableCollection(
          entityManager,
          CollectionsModule.injector,
          input
        );
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default CollectionsRouter;
