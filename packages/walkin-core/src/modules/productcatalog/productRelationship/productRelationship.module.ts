import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./productRelationship.resolvers";
import { typeDefs } from "./productRelationship.typedefs";
import { ProductRelationshipProvider } from "./productRelationship.providers";
import {
  CategoryProductOptionProvider,
  ProductCategoryProvider,
  ProductProvider,
  ProductVariantProvider,
  ProductVariantValueProvider,
} from "../product/product.providers";
import { ProductPriceValueProvider } from "../productPriceValue/productPriceValue.providers";
import { StoreFormatProvider } from "../storeformat/storeFormat.providers";
import { ChannelProvider } from "../channel/channel.providers";
import { StoreInventoryProvider } from "../storeInventory/storeInventory.providers";
import { ChargeTypeProvider } from "../chargeType/chargeType.providers";
import { OptionProvider, OptionValueProvider } from "../option/option.providers";
import { productLoader } from '../product/product.loader';
import { MenuTimingModule } from "../menuTiming/menuTiming.module";

export const ProductRelationshipModule = new GraphQLModule({
  name: "ProductRelationship",
  imports: [AuthGuardModule, MenuTimingModule],
  typeDefs,
  context: (session, context, sessionInfo) => {
    return {
      productLoader: productLoader(),
    }
  },
  resolvers,
  providers: [
    ProductRelationshipProvider,
    ProductProvider,
    ProductCategoryProvider,
    CategoryProductOptionProvider,
    ProductVariantProvider,
    ProductVariantValueProvider,
    ProductPriceValueProvider,
    StoreInventoryProvider,
    ChannelProvider,
    StoreFormatProvider,
    ChargeTypeProvider,
    OptionProvider,
    OptionValueProvider
  ],
});
