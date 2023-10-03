import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./productChargeValue.resolvers";
import { typeDefs } from "./productChargeValue.typedefs";
import { ProductChargeValueProvider } from "./productChargeValue.providers";
import { ProductModule } from "../product/product.module";
import { StoreFormatModule } from "../storeformat/storeFormat.module";
import { ChannelModule } from "../channel/channel.module";
import { ChargeModule } from "../chargeType/chargeType.module";
import { chargeValueLoader } from "./productCharge.loader";

export const ProductChargeValueModule = new GraphQLModule({
  name: "ProductChargeValue",
  imports: [
    AuthGuardModule,
    ProductModule,
    StoreFormatModule,
    ChannelModule,
    ChargeModule
  ],
  typeDefs,
  resolvers,
  providers: [ProductChargeValueProvider],
  context: () => {
    return {
      chargeValueLoader: chargeValueLoader()
    };
  }
});
