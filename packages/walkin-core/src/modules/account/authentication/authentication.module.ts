import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { AuthenticationProvider } from "./authentication.providers";
import { authenticationResolvers } from "./authentication.resolvers";
import typeDefs from "./authentication.typeDefs";
import { Request, Response } from "express";

export const AuthenicationModule = new GraphQLModule({
  name: "Authentication",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers: authenticationResolvers,
  providers: [AuthenticationProvider]
});

export interface ISessionContext {
  req: Request;
  res: Response;
}
