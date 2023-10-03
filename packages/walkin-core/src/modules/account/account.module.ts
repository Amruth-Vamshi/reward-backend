import { GraphQLModule } from "@graphql-modules/core";
import { AccessControlModule } from "./access-control/access-control.module";
import { ApplicationModule } from "./application/application.module";
import { AuthenicationModule } from "./authentication/authentication.module";
import { OrganizationModule } from "./organization/organization.module";
import { StoreModule } from "./store/store.module";
import { UserModule } from "./user/user.module";
import { AuthGuardModule } from "./auth-guard/auth-guard.module";
import { BankAccountModule } from "./bank-account/bank-account.module";
import { StoreServiceAreaModule } from "./store-service-area/store-service-area.module";
import { LegalDocumentsModule } from "./legal-documents/legal-documents.module";
export const accountModule = new GraphQLModule({
  name: "Account",
  imports: [
    UserModule,
    OrganizationModule,
    ApplicationModule,
    AuthenicationModule,
    AccessControlModule,
    StoreModule,
    AuthGuardModule,
    BankAccountModule,
    StoreServiceAreaModule,
    LegalDocumentsModule,
  ],
});
