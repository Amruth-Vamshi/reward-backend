import {
  ModuleContext,
  ModuleSessionInfo,
  Resolvers
} from "@graphql-modules/core";
import { AuthenticationProvider } from "./authentication.providers";
import { ISessionContext } from "./authentication.module";
import { LoginInput } from "../../../graphql/generated-models";

export const authenticationResolvers: Resolvers = {
  Mutation: {
    login: (_, { input }, { injector }: ModuleContext<ISessionContext>) => {
      return injector.get(AuthenticationProvider).login(input);
    },
    logout: (_, __, { injector, req, res }: ModuleContext<ISessionContext>) =>
      injector.get(AuthenticationProvider).logout(req, res),
    refreshToken: (_, { jwt }, { injector }) =>
      injector.get(AuthenticationProvider).refreshToken(jwt)
  }
};
