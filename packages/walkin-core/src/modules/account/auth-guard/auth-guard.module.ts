import { GraphQLModule } from "@graphql-modules/core";
import { AuthDirective, DeprecatedDirective } from "./auth-guard.directive";
import { AccessdDirective } from "../access-control/access-control.directive";
import typeDefs from "./auth-guard.typeDefs";

export const AuthGuardModule = new GraphQLModule({
  name: "AuthGuard",
  typeDefs,
  schemaDirectives: {
    auth: AuthDirective,
    disabled: DeprecatedDirective,
    accessControl: AccessdDirective
  }
});
