import gql from "graphql-tag";
import passport from "passport";
import { Strategy as JsonCustomStrategy } from "passport-json-custom";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { getManager } from "typeorm";
import { APIKey, User } from "../../../entity";
import { STATUS } from "../../common/constants";
import { ApplicationModule } from "../application/application.module";
import { ApplicationProvider } from "../application/application.providers";
import { UserModule } from "../user/user.module";
import { Users } from "../user/user.providers";
const applicationProvider = ApplicationModule.injector.get(ApplicationProvider);
const userProvider: Users = UserModule.injector.get(Users);
// Set up jwt auth

export const getPassport = () => {
  passport.use(
    // tslint:disable-next-line: variable-name
    new JwtStrategy(
      {
        algorithms: [process.env.JWT_ALGORITHM],
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.PUBLIC_KEY,
        issuer: process.env.JWT_ISSUER
      },
      async (jwt_payload, done) => {
        const manager = getManager();
        if (jwt_payload.app_id) {
          const apiKey = await applicationProvider.getApiKeyById(
            manager,
            jwt_payload.jti
          );
          if (!apiKey) {
            return done("API Key not found");
          }
          return done(null, { application: apiKey.application, apiKey });
        } else {
          const id = jwt_payload.id;
          try {
            const user = await userProvider.getUserById(manager, id);
            return done(null, { user });
          } catch (error) {
            console.log("Error in passport setup: ", error);
            return done(null, false, { message: "User Not Found" });
          }
        }
      }
    )
  );
  return passport;
};
