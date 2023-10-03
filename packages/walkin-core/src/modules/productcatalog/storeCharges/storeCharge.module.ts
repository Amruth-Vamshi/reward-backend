import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { Organizations } from "../../account/organization/organization.providers";
import resolvers from "./storeCharge.resolvers";
import typeDefs from "./storeCharge.typedefs";
import { StoreChargeProvider } from "./storeCharge.providers";

export const StoreChargeModule = new GraphQLModule({
  name: "StoreCharge",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [StoreChargeProvider, Organizations],
});
