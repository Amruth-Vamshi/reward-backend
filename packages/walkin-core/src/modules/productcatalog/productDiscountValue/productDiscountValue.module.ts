import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./productDiscountValue.resolvers";
import { typeDefs } from "./productDiscountValue.typedefs";
import { ProductDiscountValueProvider } from "./productDiscountValue.providers";
import { StoreInventoryProvider } from "../storeInventory/storeInventory.providers";
import { StoreFormatModule } from "../storeformat/storeFormat.module";
import { ChannelModule } from "../channel/channel.module";
import { DiscountTypeProvider } from "../discountType/discountType.providers";

export const ProductDiscountValueModule = new GraphQLModule({
  name: "ProductDiscountValue",
  imports: [AuthGuardModule, StoreFormatModule, ChannelModule],
  typeDefs,
  resolvers,
  providers: [
    ProductDiscountValueProvider,
    StoreInventoryProvider,
    DiscountTypeProvider
  ]
});
