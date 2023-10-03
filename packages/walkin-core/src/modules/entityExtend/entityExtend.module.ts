import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { EntityExtendProvider } from "./entityExtend.providers";
import resolvers from "./entityExtend.resolvers";
import typeDefs from "./entityExtend.typeDefs";
import { RuleEntityProvider } from "../rule/providers/rule-entity.provider";
import { RuleAttributeProvider } from "../rule/providers/rule-attribute.provider";
export const entityExtendModule = new GraphQLModule({
  name: "EntityExtended",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  // context: () => ({ currentUser: "u-me" }),
  providers: [
    EntityExtendProvider,
    Organizations,
    RuleEntityProvider,
    RuleAttributeProvider
  ]
});
