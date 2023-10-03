import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../../account/auth-guard/auth-guard.module";
import { getJWTPayload } from "../../common/utils/utils";
import { CategoryModule } from "../category/category.module";
import { optionsLoader, optionValuesLoader } from "./option.loader";
import { OptionProvider, OptionValueProvider } from "./option.providers";
import resolvers from "./option.resolvers";
import typeDefs from "./option.typeDefs";

export const OptionModule = new GraphQLModule({
  name: "Option",
  imports: [AuthGuardModule, CategoryModule],
  typeDefs,
  resolvers,
  providers: [OptionProvider, OptionValueProvider],
  context: (session) => {
    let organizationId;
    try {
      const token = session.req.headers.authorization.split(" ")[1];
      organizationId = getJWTPayload(token)["org_id"];
    } catch (e) {
      // Do nothing - jwt token could be expired
    }
    return {
      optionValuesLoader: optionValuesLoader(),
      optionsLoader: optionsLoader(),
      organizationId
    }
  }
});
