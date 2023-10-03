import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { Organizations } from "../../account/organization/organization.providers";
import { resolvers } from "./productTaxValue.resolvers";
import { typeDefs } from "./productTaxValue.typedefs";
import { ProductTaxValueProvider } from "./productTaxValue.providers";
import { ProductModule } from "../product/product.module";
import { StoreFormatModule } from "../storeformat/storeFormat.module";
import { ChannelModule } from "../channel/channel.module";
import { TaxTypeModule } from "../taxtype/taxtype.module";

export const ProductTaxValueModule = new GraphQLModule({
  name: "ProductTaxValue",
  imports: [
    AuthGuardModule,
    ProductModule,
    StoreFormatModule,
    ChannelModule,
    TaxTypeModule
  ],
  typeDefs,
  resolvers,
  providers: [ProductTaxValueProvider, Organizations]
});
