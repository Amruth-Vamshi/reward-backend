import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { OrganizationModule } from "../../account/organization/organization.module";
import { Organizations } from "../../account/organization/organization.providers";
import { getJWTPayload } from "../../common/utils/utils";
import { categoryproductsLoader } from "../category/category.loader";
import { categoryMenuTimingLoader } from "../category/categoryMenuTiming.loader";
import { MenuTimingProvider } from "../menuTiming/menuTiming.providers";
import { productMenuTimingLoader } from "../product/productMenuTiming.loader";
import { catalogUsageLoader } from "./catalog.loader";
import { CatalogProvider } from "./catalog.providers";
import resolvers from "./catalog.resolvers";
import typeDefs from "./catalog.typeDefs";

export const CatalogModule = new GraphQLModule({
  name: "Catalog",
  imports: [AuthGuardModule, OrganizationModule],
  typeDefs,
  resolvers,
  providers: [CatalogProvider, Organizations, MenuTimingProvider],
  context: session => {
    let organizationId;
    try {
      const token = session.req.headers.authorization.split(" ")[1];
      organizationId = getJWTPayload(token)["org_id"];
    } catch (e) {
      // Do nothing - jwt token could be expired
    }
    return {
      categoryMenuTimingLoader: categoryMenuTimingLoader(),
      categoryproductsLoader: categoryproductsLoader(),
      productMenuTimingLoader: productMenuTimingLoader(),
      catalogUsageLoader: catalogUsageLoader(),
      organizationId
    };
  }
});
