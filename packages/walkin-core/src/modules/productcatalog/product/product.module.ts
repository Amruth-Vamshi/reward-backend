import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { CategoryModule } from "../category/category.module";
import { OptionModule } from "../option/option.module";
import {
  ProductCategoryProvider,
  CategoryProductOptionProvider,
  ProductProvider,
  ProductVariantProvider,
  ProductVariantValueProvider
} from "./product.providers";
import resolvers from "./product.resolvers";
import typeDefs from "./product.typeDefs";
import { ProductRelationshipProvider } from "../productRelationship/productRelationship.providers";
import { ProductPriceValueProvider } from "../productPriceValue/productPriceValue.providers";
import { StoreInventoryProvider } from "../storeInventory/storeInventory.providers";
import { ProductPriceValueModule } from "@walkinserver/walkin-core/src/modules/productcatalog/productPriceValue/productPriceValue.module";
import { ProductRelationshipModule } from "../productRelationship/productRelationship.module";
import { productCategoryLoader, productLoader, productTagsLoader, productVariantsLoader, productVariantsValueLoader, productVariantsByVariantsId } from "./product.loader";
import { productValuesLoader } from "../../productcatalog/product/product.loader";
import { productRelationshipLoader } from "../productRelationship/productRelationship.loaders";
import { productMenuTimingLoader } from "./productMenuTiming.loader";
import { getJWTPayload } from "../../common/utils/utils";
import { MenuTimingModule } from "../menuTiming/menuTiming.module";
import { optionValuesByIdLoader, optionsLoader, optionValuesLoader } from "../option/option.loader";

export const ProductModule = new GraphQLModule({
  name: "Product",
  imports: [
    AuthGuardModule,
    CategoryModule,
    OptionModule,
    ProductPriceValueModule,
    ProductRelationshipModule,
    MenuTimingModule
  ],
  typeDefs,
  context: (session, context, sessionInfo) => {
    let organizationId;
    try {
      const token = session.req.headers.authorization.split(" ")[1];
      organizationId = getJWTPayload(token)["org_id"];
    } catch (e) {
      // Do nothing - jwt token could be expired
    }
    return {
      productLoader: productLoader(),
      productValuesLoader: productValuesLoader(),
      productRelationshipLoader: productRelationshipLoader(),
      productMenuTimingLoader: productMenuTimingLoader(),
      productCategoryLoader: productCategoryLoader(),
      productTagsLoader: productTagsLoader(),
      productVariantsLoader: productVariantsLoader(),
      optionValuesLoader: optionValuesLoader(),
      productVariantsValueLoader: productVariantsValueLoader(),
      productVariantsByVariantsId: productVariantsByVariantsId(),
      optionValuesByIdLoader: optionValuesByIdLoader(),
      optionsLoader: optionsLoader(),
      organizationId
    };
  },
  resolvers,
  providers: [
    ProductProvider,
    ProductCategoryProvider,
    CategoryProductOptionProvider,
    ProductVariantProvider,
    ProductVariantValueProvider,
    ProductRelationshipProvider,
    ProductPriceValueProvider,
    StoreInventoryProvider
  ]
});
