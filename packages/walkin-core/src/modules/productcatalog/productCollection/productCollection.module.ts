import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./productCollection.resolvers";
import typeDefs from "./productCollection.typedefs";
import { ProductCollectionProvider } from "./productCollection.providers";

export const ProductCollectionModule = new GraphQLModule({
  name: "ProductCollectionModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [ProductCollectionProvider]
});
