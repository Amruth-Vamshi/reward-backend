import { GraphQLModule } from "@graphql-modules/core";
import { ExternalIntegrationProvider } from "./external-integration.provider";
import { CustomerProvider } from "@walkinserver/walkin-core/src/modules/customer/customer.providers";
export const ExternalIntegrationModule = new GraphQLModule({
  name: "ExternalIntegrationModule",
  imports: [],
  providers: [ExternalIntegrationProvider, CustomerProvider]
});
