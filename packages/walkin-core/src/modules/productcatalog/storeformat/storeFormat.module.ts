import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { Organizations } from "../../account/organization/organization.providers";
import resolvers from "./storeFormat.resolvers";
import typeDefs from "./storeFormat.typeDefs";
import { StoreFormatProvider } from "./storeFormat.providers";

export const StoreFormatModule = new GraphQLModule({
  name: "StoreFormat",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [StoreFormatProvider, Organizations]
});
