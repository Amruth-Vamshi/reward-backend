import { getORMConfig } from "../walkin-core/ormconfig";
import { WCoreEntities } from "../walkin-core/src";
// import { OrderXEntities } from "@walkinserver/walkin-orderx/src";
import { RewardxEntities } from "../walkin-rewardx/src";

// ADD ENTITIES HERE
const config = getORMConfig(WCoreEntities, RewardxEntities);

export = config;
