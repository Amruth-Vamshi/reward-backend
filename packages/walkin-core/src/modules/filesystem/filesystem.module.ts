import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../account/auth-guard/auth-guard.module";
import { Organizations } from "../account/organization/organization.providers";
import { EntityExtendProvider } from "../entityExtend/entityExtend.providers";

import { FileSystemProvider, FileProvider } from "./filesystem.providers";
import resolvers from "./filesystem.resolvers";
import typeDefs from "./filesystem.typeDefs";
export const fileSystemModule = new GraphQLModule({
  name: "FileSystem",
  imports: [AuthGuardModule],
  typeDefs,
  resolvers,
  providers: [
    Organizations,
    FileSystemProvider,
    FileProvider,
    EntityExtendProvider
  ]
});
