import { GraphQLModule } from "@graphql-modules/core";
import { ScalarsResolvers } from "./scalars.resolvers";
import { ScalarTypeDefs } from "./scalars.typeDefs";

export const scalarsModule: GraphQLModule = new GraphQLModule({
  name: "scalarsModule",
  resolvers: [ScalarsResolvers],
  typeDefs: [ScalarTypeDefs]
});
