import { GraphQLModule } from "@graphql-modules/core";

import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { CustomerProvider } from "../customer/customer.providers";
import { SessionProvider } from "./session.providers";
import resolvers from "./session.resolvers";
import typeDefs from "./session.typeDefs";
export const sessionModule = new GraphQLModule({
  name: "sessionModule",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [SessionProvider, CustomerProvider]
});
