import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { ApplicationProvider } from "./application.providers";
import resolvers from "./application.resolvers";
import typeDefs from "./application.typeDefs";

export const ApplicationModule = new GraphQLModule({
  imports: [AuthGuardModule],
  name: "Application",
  typeDefs,
  resolvers,
  providers: [ApplicationProvider]
});
