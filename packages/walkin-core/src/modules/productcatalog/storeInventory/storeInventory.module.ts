import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { Organizations } from "../../account/organization/organization.providers";
import resolvers from "./storeInventory.resolvers";
import typeDefs from "./storeInventory.typedefs";
import { StoreInventoryProvider } from "./storeInventory.providers";
import { ProductProvider } from "../product/product.providers";

export const StoreInventoryModule = new GraphQLModule({
  name: "StoreInventory",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [StoreInventoryProvider, ProductProvider],
});
