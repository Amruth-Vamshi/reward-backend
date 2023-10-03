import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";

import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./bank-account.typedefs";
import { resolvers } from "./bank-account.resolvers";
import { BankAccountProvider } from "./bank-account.providers";

export const BankAccountModule = new GraphQLModule({
  imports: [AuthGuardModule],
  name: "BankAccount",
  typeDefs,
  resolvers,
  providers: [BankAccountProvider],
});
