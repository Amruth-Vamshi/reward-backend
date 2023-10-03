import { GraphQLModule } from "@graphql-modules/core";
import { WebhookProvider } from "@walkinserver/walkin-core/src/modules/webhook/webhook.providers";
import { AuthGuardModule } from "../../../../walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { Organizations } from "../../../../walkin-core/src/modules/account/organization/organization.providers";
import { Stores } from "../../../../walkin-core/src/modules/account/store/store.providers";
import { CustomerProvider } from "../../../../walkin-core/src/modules/customer/customer.providers";
import { CatalogProvider } from "../../../../walkin-core/src/modules/productcatalog/catalog/catalog.providers";
import { CategoryProvider } from "../../../../walkin-core/src/modules/productcatalog/category/category.providers";
import { ChannelProvider } from "../../../../walkin-core/src/modules/productcatalog/channel/channel.providers";
import { ChargeTypeProvider } from "../../../../walkin-core/src/modules/productcatalog/chargeType/chargeType.providers";
import { MenuTimingProvider } from "../../../../walkin-core/src/modules/productcatalog/menuTiming/menuTiming.providers";
import {
  OptionProvider,
  OptionValueProvider
} from "../../../../walkin-core/src/modules/productcatalog/option/option.providers";
import { ProductProvider } from "../../../../walkin-core/src/modules/productcatalog/product/product.providers";
import { ProductPriceValueProvider } from "../../../../walkin-core/src/modules/productcatalog/productPriceValue/productPriceValue.providers";
import { ProductRelationshipProvider } from "../../../../walkin-core/src/modules/productcatalog/productRelationship/productRelationship.providers";
import { StoreFormatProvider } from "../../../../walkin-core/src/modules/productcatalog/storeformat/storeFormat.providers";
import { StoreInventoryProvider } from "../../../../walkin-core/src/modules/productcatalog/storeInventory/storeInventory.providers";
import { CollectionsProvider } from "../collections/collections.provider";
import { CustomerLoyaltyProgramProvider } from "../customer-loyalty-program/customer-loyalty-program.provider";
import { CustomerLoyaltyProvider } from "../customer-loyalty/customer-loyalty.provider";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { CollectionsItemsProvider } from "./collection-items.provider";
import { resolvers } from "./collection-items.resolvers";
import { typeDefs } from "./collection-items.typeDefs";

export const CollectionsItemsModule = new GraphQLModule({
  name: "CollectionsItems",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [
    CollectionsItemsProvider,
    CollectionsProvider,
    CustomerProvider,
    ProductProvider,
    ProductPriceValueProvider,
    StoreFormatProvider,
    ChannelProvider,
    ChargeTypeProvider,
    StoreInventoryProvider,
    OptionProvider,
    OptionValueProvider,
    ProductRelationshipProvider,
    MenuTimingProvider,
    Stores,
    Organizations,
    CategoryProvider,
    CatalogProvider,
    CustomerLoyaltyProvider,
    LoyaltyCardProvider,
    CustomerLoyaltyProgramProvider,
    WebhookProvider
  ]
});
