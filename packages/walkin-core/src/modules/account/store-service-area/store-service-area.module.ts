import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { StoreServiceAreaProvider } from "./store-service-area.providers";
import resolvers from "./store-service-area.resolvers";
import typeDefs from "./store-service-area.typeDefs";
import { UserModule } from "../user/user.module";
import { Stores } from "../store/store.providers";
export const StoreServiceAreaModule = new GraphQLModule({
  name: "StoreServiceArea",
  imports: [AuthGuardModule, UserModule],
  resolvers,
  typeDefs,
  providers: [Stores, StoreServiceAreaProvider],
});
