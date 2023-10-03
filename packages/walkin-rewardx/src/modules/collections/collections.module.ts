import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../../../walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { CollectionsProvider } from "./collections.provider";
import { resolvers } from "./collections.resolvers";
import { typeDefs } from "./collections.typeDefs";

export const CollectionsModule = new GraphQLModule({
  name: "Collections",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [CollectionsProvider]
});
