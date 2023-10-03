import { getConnection } from "typeorm";
import * as CoreEntities from "../../../../entity";
import {
  createUnitTestConnection,
  closeUnitTestConnection
} from "../../../../../__tests__/utils/unit";

beforeAll(async () => {
  await createUnitTestConnection(CoreEntities);
});

test("should hava a database", () => {
  const connection = getConnection();
  expect(connection).toBeTruthy();
});

afterAll(async () => {
  await closeUnitTestConnection();
});
