import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./collection.resolvers";
import typeDefs from "./collection.typedefs";
import { CollectionProvider } from "./collection.providers";

export const CollectionModule = new GraphQLModule({
  name: "CollectionModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [CollectionProvider]
});
