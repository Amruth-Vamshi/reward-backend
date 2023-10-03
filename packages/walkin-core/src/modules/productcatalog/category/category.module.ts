import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { getJWTPayload } from "../../common/utils/utils";
import { CatalogModule } from "../catalog/catalog.module";
import { MenuTimingProvider } from "../menuTiming/menuTiming.providers";
import {
  categoryCatalogLoader,
  categoryDetailsLoader,
  categoryproductsLoader
} from "./category.loader";
import { CategoryProvider } from "./category.providers";
import { resolvers } from "./category.resolvers";
import typeDefs from "./category.typeDefs";
import { categoryMenuTimingLoader } from "./categoryMenuTiming.loader";

export const CategoryModule = new GraphQLModule({
  name: "Category",
  imports: [AuthGuardModule, CatalogModule],
  typeDefs,
  resolvers,
  providers: [CategoryProvider, MenuTimingProvider],
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
      categoryDetailsLoader: categoryDetailsLoader(),
      categoryCatalogLoader: categoryCatalogLoader(),
      categoryproductsLoader: categoryproductsLoader(),
      organizationId
    };
  }
});
