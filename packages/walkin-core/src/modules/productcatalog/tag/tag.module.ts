import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { resolvers } from "./tag.resolvers";
import typeDefs from "./tag.typedefs";
import { TagProvider } from "./tag.providers";

export const TagModule = new GraphQLModule({
  name: "TagModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [TagProvider]
});
