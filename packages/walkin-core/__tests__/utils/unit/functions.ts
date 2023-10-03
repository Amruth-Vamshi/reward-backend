import { ApplicationProvider } from "../../../src/modules/account/application/application.providers";
import { ApplicationModule } from "../../../src/modules/account/application/application.module";
import { getManager, EntityManager } from "typeorm";
import { Chance } from "chance";
// import { feedbackFormDeployments1572871523228 } from "@walkinserver/walkin-seeds/seeds/1572871523228-feedbackFormDeployments";
import { walkinProducts1568635687359 } from "@walkinserver/walkin-seeds/seeds/1568635687359-walkin_products";

const chance = new Chance();

export const createApplication = (organizationId: string) => {
  const applicationProvider = ApplicationModule.injector.get(
    ApplicationProvider
  );
  applicationProvider.createApplication(getManager(), organizationId, {
    name: chance.company()
  });
};

// export const loadRefineXSeeds = (
//   entityManager: EntityManager
// ): Promise<any> => {
//   const feedbackFormDeployments = new feedbackFormDeployments1572871523228();
//   return feedbackFormDeployments.up(
//     entityManager.connection.createQueryRunner()
//   );
// };

export const loadWalkInProductsSeed = (
  entityManager: EntityManager
): Promise<any> => {
  const feedbackFormDeployments = new walkinProducts1568635687359();
  return feedbackFormDeployments.up(
    entityManager.connection.createQueryRunner()
  );
};
