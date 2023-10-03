import { WCoreEntities, WCoreModule } from "@walkinserver/walkin-core/src";
// import { HyperXModule } from "@walkinserver/walkin-hyperx/src";
// import {
//   RefineXEntities,
//   RefineXModule,
// } from "@walkinserver/walkin-refinex/src";

import {
  RewardXModule,
  RewardxEntities,
} from "@walkinserver/walkin-rewardx/src";

import { GraphQLModule } from "@graphql-modules/core";
import i18n from "i18n";
// import { from } from "zen-observable";
// import { NearXModule } from "@walkinserver/walkin-nearx/src";
// import { OrderXModule } from "@walkinserver/walkin-orderx/src";

export const AppModule = new GraphQLModule({
  name: "App",
  imports: [
    WCoreModule,
    // HyperXModule,
    // RefineXModule,
    RewardXModule,
    // NearXModule,
    // OrderXModule,
  ], // *IMPORTANT* ADD MODULES HERE AND ITS RELATED ENTITIES TO ormconfig.ts at the root
  context: (session, context, sessionInfo) => {
    if (session && session.req && session.req.headers["accept-language"]) {
      const acceptLanguage: string = session.req.headers["accept-language"];
      i18n.setLocale(acceptLanguage);
    } else {
      // i18n.setLocale(); // Add a default locale
    }
    return session;
  },
});
