import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { Organizations } from "../../account/organization/organization.providers";
import resolvers from "./taxtype.resolvers";
import typeDefs from "./taxtype.typeDefs";
import { TaxTypeProvider } from "./taxtype.providers";

export const TaxTypeModule = new GraphQLModule({
  name: "TaxType",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [TaxTypeProvider, Organizations]
});
