import gql from "graphql-tag";
import { setupTestBed } from "../../../../../utils/integration/client";

import { ApolloClient } from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { addRole } from "../../../../../utils/integration/functions";
let client: ApolloClient<NormalizedCacheObject>;

beforeAll(async () => {
  const testbed = await setupTestBed();
  client = testbed.client;
  return;
}, 10000);

describe("Get all Roles", () => {
  test("should a", async () => {
    const role1 = await addRole(client);
    const role2 = await addRole(client);
    const role3 = await addRole(client);
    console.log(role1, role2, role3);
    const query = gql`
      query roles {
        roles {
          id
          name
        }
      }
    `;

    const { data, errors } = await client.query({
      query
    });
    expect(data).toBeDefined();
    expect(errors).toBeUndefined();
    return;
  });
});
