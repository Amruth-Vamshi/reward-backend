import { GraphQLModule } from "@graphql-modules/core";
import { typeDefs } from "./enums.typeDefs";
export const enumsModule: GraphQLModule = new GraphQLModule({
  name: "EnumsModule",
  typeDefs
});
