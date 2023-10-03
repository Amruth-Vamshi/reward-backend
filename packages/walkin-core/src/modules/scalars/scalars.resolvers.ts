import { IResolvers } from "graphql-tools";
import GraphQLJSON from "graphql-type-json";

export const ScalarsResolvers: IResolvers = {
  JSON: GraphQLJSON
};
