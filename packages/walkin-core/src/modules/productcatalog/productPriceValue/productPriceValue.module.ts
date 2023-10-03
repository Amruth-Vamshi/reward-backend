import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./productPriceValue.resolvers";
import { typeDefs } from "./productPriceValue.typedefs";
import { ProductPriceValueProvider } from "./productPriceValue.providers";
import { StoreInventoryProvider } from "../storeInventory/storeInventory.providers";
import { StoreFormatModule } from "../storeformat/storeFormat.module";
import { ChannelModule } from "../channel/channel.module";

export const ProductPriceValueModule = new GraphQLModule({
  name: "ProductPriceValue",
  imports: [AuthGuardModule, StoreFormatModule, ChannelModule],
  typeDefs,
  resolvers,
  providers: [ProductPriceValueProvider, StoreInventoryProvider]
});
