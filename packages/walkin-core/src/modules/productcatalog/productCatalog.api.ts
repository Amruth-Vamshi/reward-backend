import express from "express";
import CustomerRouter from "../customer/customer.api";
import ProductRouter from "./product/product.api";

const ProductCatalogRouter = express.Router();

ProductCatalogRouter.use("/", ProductRouter);
ProductCatalogRouter.use("/", CustomerRouter);

export default ProductCatalogRouter;
