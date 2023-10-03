import { GraphQLModule } from "@graphql-modules/core";
import { AuthGuardModule } from "../auth-guard/auth-guard.module";
import { LegalDocumentsProvider } from "./legal-documents.providers";
import resolvers from "./legal-documents.resolvers";
import typeDefs from "./legal-documents.typedefs";
import { UserModule } from "../user/user.module";
import { Organizations } from "../organization/organization.providers";
export const LegalDocumentsModule = new GraphQLModule({
  name: "LegalDocuments",
  imports: [AuthGuardModule, UserModule],
  resolvers,
  typeDefs,
  providers: [Organizations, LegalDocumentsProvider],
});
