import express, { NextFunction } from "express";
import { getManager } from "typeorm";
import { asyncHandler } from "../../../../../walkin-rewardx/src/modules/rest/middleware/async";
import authMiddleware from "../../account/auth-guard/auth-gaurd.middleware";
import {
  isUserOrAppAuthorizedToWorkOnOrganization,
  setOrganizationToInput
} from "../../common/utils/utils";
import { ProductModule } from "./product.module";
import { ProductProvider as Product } from "./product.providers";
const ProductProvider = ProductModule.injector.get(Product);
const ProductRouter = express.Router();

ProductRouter.get(
  "/products",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      const user = req.user;
      const application = req.application;
      input = setOrganizationToInput(input, user, application);

      let result = await getManager().transaction(async transactionManager => {
        const products = ProductProvider.getProducts(transactionManager, input);
        return products;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

ProductRouter.get(
  "/products/:productCode",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const code = req.params.productCode;
      let input = {
        code
      };
      const user = req.user;
      const application = req.application;
      input = setOrganizationToInput(input, user, application);
      let result = await getManager().transaction(async transactionManager => {
        const products = ProductProvider.getProductByProductCode(
          transactionManager,
          input
        );
        return products;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

ProductRouter.post(
  "/products",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      const user = req.user;
      const application = req.application;
      input = setOrganizationToInput(input, user, application);
      let result = await getManager().transaction(async transactionManager => {
        const products = ProductProvider.createProduct(
          transactionManager,
          input
        );
        return products;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

ProductRouter.put(
  "/update-product/:productId",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      const user = req.user;
      const application = req.application;
      input = setOrganizationToInput(input, user, application);

      const id = req.params.productId;
      input["id"] = id;
      let result = await getManager().transaction(async transactionManager => {
        const products = ProductProvider.updateProduct(
          transactionManager,
          input
        );
        return products;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

ProductRouter.put(
  "/disable-product",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      const user = req.user;
      const application = req.application;
      input = setOrganizationToInput(input, user, application);
      await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        input.organizationId
      );

      let result = await getManager().transaction(async transactionManager => {
        const product = ProductProvider.disableProduct(
          transactionManager,
          input.productName,
          input.organizationId
        );
        return product;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default ProductRouter;
