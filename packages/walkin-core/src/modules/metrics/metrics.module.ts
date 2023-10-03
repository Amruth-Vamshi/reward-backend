import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { MetricProvider } from "./metrics.providers";
import { resolvers } from "./metrics.resolvers";
import typeDefs from "./metrics.typeDefs";
export const metricsModule = new GraphQLModule({
  name: "Metrics",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [Organizations, MetricProvider]
});
