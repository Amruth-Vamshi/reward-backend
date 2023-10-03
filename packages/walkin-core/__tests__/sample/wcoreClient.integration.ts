import gql from "graphql-tag";
import { setupTestBed } from "../utils/integration/testUtils";

import Chance from "chance";

let chance = new Chance();

// interface IUserInput {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string
// }

let client: any;
let user: any;

beforeAll(async () => {
  ({ client, user } = await setupTestBed());
});

describe("Campaign test cases", () => {
  test("Creating Campaign", async () => {
    let name = chance.string({ length: 5 });

    const mutation = gql`
  mutation {
  createActionDefinition(
    input: {
      name: "${name}"
      type: "AXIOS_REQUEST"
      organizationId: "${user.organization.id}"
      configuration: {
        url: "/info"
        method: "get"
        baseURL: "https://test-lapp-api.getwalk.in/ccd-api"
        auth: { username: "pawanyara", password: "password" }
      }
      inputSchema: "{}"
      outputSchema: "{}"
      status: "ACTIVE"
    }
  ) {
    id
    name
    type
    organization {
      id
      name
      addressLine1
    }
    configuration
    inputSchema
    outputSchema
  }
}
    `;

    const { data, errors } = await client.mutate({
      mutation
    });
    expect(data).toBeDefined();
    expect(data.createActionDefinition).toBeDefined();
    expect(data.createActionDefinition.id).toBeDefined();
    console.log(data.createActionDefinition.id);
    expect(data.createActionDefinition.name).toEqual(name);
  });
});
