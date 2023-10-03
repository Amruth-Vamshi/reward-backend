import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { Stores, StoreOpenTimingProvider } from "./store.providers";
import resolvers from "./store.resolvers";
import typeDefs from "./store.typeDefs";

import { Organizations } from "../organization/organization.providers";
import { WebhookProvider } from "../../webhook/webhook.providers";
import { EntityExtendProvider } from "../../entityExtend/entityExtend.providers";
import { RuleProvider } from "../../rule/providers/rule.provider";

import { Organization, ProductTag } from "../../../entity";
import { StoreFormatProvider } from "../../productcatalog/storeformat/storeFormat.providers";
import { CatalogProvider } from "../../productcatalog/catalog/catalog.providers";
import { ChannelProvider } from "../../productcatalog/channel/channel.providers";
import { ChargeTypeProvider } from "../../productcatalog/chargeType/chargeType.providers";
import { ProductProvider } from "../../productcatalog/product/product.providers";
import { ProductPriceValueProvider } from "../../productcatalog/productPriceValue/productPriceValue.providers";
import { ProductChargeValueProvider } from "../../productcatalog/productChargeValue/productChargeValue.providers";
import { ProductTaxValueProvider } from "../../productcatalog/productTaxValue/productTaxValue.providers";
import { StoreServiceAreaProvider } from "../store-service-area/store-service-area.providers";
import { Users } from "../user/user.providers";
import { UserModule } from "../user/user.module";
import { StoreInventoryProvider } from "../../productcatalog/storeInventory/storeInventory.providers";
import { CatalogModule } from "../../productcatalog/catalog/catalog.module";
import { ProductRelationshipModule } from "../../productcatalog/productRelationship/productRelationship.module";
import { ProductTagModule } from "../../productcatalog/productTag/productTag.module";
import { OptionModule } from "../../productcatalog/option/option.module";
import { ProductModule } from "../../productcatalog/product/product.module";
import { CategoryModule } from "../../productcatalog/category/category.module";
import { productRelationshipLoader } from "../../productcatalog/productRelationship/productRelationship.loaders";
import {
  productCategoryLoader,
  productTagsLoader,
  productValuesLoader
} from "../../productcatalog/product/product.loader";
import { categoryMenuTimingLoader } from "../../productcatalog/category/categoryMenuTiming.loader";
import { productMenuTimingLoader } from "@walkinserver/walkin-core/src/modules/productcatalog/product/productMenuTiming.loader";
import { getJWTPayload } from "../../common/utils/utils";

export const StoreModule = new GraphQLModule({
  name: "Store",
  imports: [
    AuthGuardModule,
    UserModule,
    CatalogModule,
    ProductRelationshipModule,
    ProductTagModule,
    OptionModule,
    ProductModule,
    CategoryModule
  ],
  resolvers,

  /* Adds dataloader to the context, which allows resolvers to
  load the dataloader with all the requests which allows loader to fetch data
  from the database in batch(bulk) thereby felicitating performance boost. */

  context: (session, context, sessionInfo) => {
    let organizationId;
    let token;
    try {
      token = session.req.headers.authorization.split(" ")[1];
      organizationId = getJWTPayload(token)["org_id"];
    } catch (e) {
      // Do nothing - jwt token could be expired
    }
    return {
      productRelationshipLoader: productRelationshipLoader(),
      productValuesLoader: productValuesLoader(),
      categoryMenuTimingLoader: categoryMenuTimingLoader(),
      productMenuTimingLoader: productMenuTimingLoader(),
      productCategoryLoader: productCategoryLoader(),
      productTagsLoader: productTagsLoader(),
      organizationId,
      token
    };
  },
  typeDefs,
  providers: [
    Stores,
    Organizations,
    WebhookProvider,
    EntityExtendProvider,
    RuleProvider,
    StoreFormatProvider,
    CatalogProvider,
    ChannelProvider,
    ChargeTypeProvider,
    StoreOpenTimingProvider,
    ProductProvider,
    ProductPriceValueProvider,
    ProductChargeValueProvider,
    ProductTaxValueProvider,
    Users,
    StoreServiceAreaProvider,
    StoreInventoryProvider
  ]
});
