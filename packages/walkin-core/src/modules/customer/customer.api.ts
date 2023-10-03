import express, { NextFunction } from "express";
import { getConnection, getManager } from "typeorm";
import authMiddleware from "../account/auth-guard/auth-gaurd.middleware";
import {
  getOrganizationIdFromAuthToken,
  isUserOrAppAuthorizedToWorkOnOrganization,
  setOrganizationToInput,
  setOrganizationToInputV2
} from "../common/utils/utils";
import { asyncHandler } from "../rest/middleware/async";
import { customerModule } from "./customer.module";
import { CustomerProvider as Customer } from "./customer.providers";
const CustomerProvider = customerModule.injector.get(Customer);
const CustomerRouter = express.Router();

CustomerRouter.get(
  "/customers/:customerId",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let input = req.body;
      const user = req.user;
      const application = req.application;
      const id = req.params.customerId;
      input["id"] = id;
      await isUserOrAppAuthorizedToWorkOnOrganization(
        user,
        application,
        input.organizationId
      );
      let result = await getManager().transaction(async transactionManager => {
        const customer = CustomerProvider.getCustomer(
          transactionManager,
          input,
          input.organization_id
        );
        return customer;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CustomerRouter.get(
  "/customers",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let customer = req.query;
      const { page, pageSize } = req.query;
      const pageOptions = {
        page,
        pageSize
      };

      const user = req.user;
      const application = req.application;
      customer = setOrganizationToInputV2(customer, user, application);
      let result = await getManager().transaction(async transactionManager => {
        const customers = CustomerProvider.getAllCustomers(
          transactionManager,
          customer,
          pageOptions
        );
        return customers;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CustomerRouter.post(
  "/customers",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let customer = req.body;
      const user = req.user;
      const application = req.application;
      customer = setOrganizationToInputV2(customer, user, application);
      customer.organization = customer.organizationId;
      let result = await getManager().transaction(async transactionManager => {
        const createdCustomer = CustomerProvider.createOrUpdateCustomer(
          transactionManager,
          customer
        );
        return createdCustomer;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

CustomerRouter.put(
  "/customers/update-customer/:customerId",
  authMiddleware,
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      let customer = req.body;
      const user = req.user;
      const application = req.application;

      const id = req.params.customerId;
      customer["id"] = id;

      customer = setOrganizationToInputV2(customer, user, application);
      customer.organization = customer.organizationId;

      let result = await getManager().transaction(async transactionManager => {
        const createdCustomer = CustomerProvider.createOrUpdateCustomer(
          transactionManager,
          customer
        );
        return createdCustomer;
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default CustomerRouter;
