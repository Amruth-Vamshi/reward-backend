import { queueProcessorModule } from "../queueProcessor.module";
import { QueueProvider } from "../queue.provider";
import * as CoreEntities from "../../../entity";
import {
  closeUnitTestConnection,
  createUnitTestConnection,
  getAdminUser
} from "../../../../__tests__/utils/unit";
import { getManager, getConnection, EntityManager } from "typeorm";
import { WALKIN_QUEUES } from "../../common/constants";
import { Chance } from "chance";
let user: CoreEntities.User;
beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
  ({ user } = await getAdminUser(getConnection()));
});

const queueProcessor: QueueProvider = queueProcessorModule.injector.get(
  QueueProvider
);

describe("Should add job to the queue", () => {
  test("Add a job with valid queue name", async () => {
    const queue = await queueProcessor.addToQueue(WALKIN_QUEUES.WEBHOOK, {
      name: Chance().word(),
      url: Chance().url()
    });
    expect(queue.queue.name).toBe(WALKIN_QUEUES.WEBHOOK);
  });
});

afterAll(async () => {
  await closeUnitTestConnection();
});
