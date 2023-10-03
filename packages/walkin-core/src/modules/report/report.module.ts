import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { ReportProvider } from "./report.providers";
import resolvers from "./report.resolvers";
import typeDefs from "./report.typeDefs";
import { FileProvider } from "../filesystem/filesystem.providers";
export const reportModule = new GraphQLModule({
  name: "Report",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [Organizations, ReportProvider, FileProvider]
});
