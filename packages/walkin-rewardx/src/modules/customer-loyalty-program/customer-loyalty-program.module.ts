import { GraphQLModule } from "@graphql-modules/core";
import { CustomerLoyaltyProgramProvider } from "./customer-loyalty-program.provider";
import { resolvers } from "./customer-loyalty-program.resolvers";
import { typeDefs } from "./customer-loyalty-program.typeDefs";
import { LoyaltyCardProvider } from "../loyalty-card/loyalty-card.provider";
import { AuthGuardModule } from "@walkinserver/walkin-core/src/modules/account/auth-guard/auth-guard.module";
import { LoyaltyTransactionProvider } from "../loyalty-transaction/loyalty-transaction.provider";
import { CommunicationProvider } from "@walkinserver/walkin-core/src/modules/communication/communication.providers";
import { QueueProvider } from "@walkinserver/walkin-core/src/modules/queueProcessor/queue.provider";
import { CustomerLoyaltyProgramRepository } from "./customer-loyalty-program.repository";

export const CustomerLoyaltyProgramModule = new GraphQLModule({
  name: "CustomerLoyaltyProgram",
  imports: [AuthGuardModule],
  resolvers,
  typeDefs,
  providers: [
    CustomerLoyaltyProgramProvider,
    LoyaltyCardProvider,
    CommunicationProvider,
    QueueProvider,
    LoyaltyTransactionProvider,
    CustomerLoyaltyProgramRepository
  ]
});
