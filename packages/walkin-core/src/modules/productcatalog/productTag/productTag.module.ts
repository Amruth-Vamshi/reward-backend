import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./productTag.resolvers";
import typeDefs from "./productTag.typedefs";
import { ProductTagProvider } from "./productTag.providers";
import { OrganizationModule } from "../../account/organization/organization.module";
import { ProductModule } from "../product/product.module";

export const ProductTagModule = new GraphQLModule({
  name: "ProductTagModule",
  imports: [AuthGuardModule, OrganizationModule, ProductModule],
  typeDefs,
  resolvers,
  providers: [ProductTagProvider]
});
