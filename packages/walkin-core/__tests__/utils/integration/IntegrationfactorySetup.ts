import { IApolloTestClient } from "./client";
import gql from "graphql-tag";
import { User } from "../../../src/graphql/generated-models";
import ApolloClient from "apollo-client";
import { NormalizedCacheObject } from "apollo-cache-inmemory";
import Chance from "chance";

let chance = new Chance();

let email = chance.email({ domain: "@getwalk.in" });
let code = chance.string({ length: 5 });

const createUser = async (client: ApolloClient<NormalizedCacheObject>) => {
  const userInput: IUserInput = {
    email: `${email}`,
    password: "password",
    firstName: "testUserFirstName",
    lastName: "testUserLastName"
  };

  const mutation = gql`
  mutation createUser {
    createUser(
      input: {
        email: "${userInput.email}"
        password: "${userInput.password}"
        firstName: "${userInput.firstName}"
        lastName: "${userInput.lastName}"
      }
      createOrganization: {
        code: "${code}"
        name: "TestOrg"
        organizationType: ORGANIZATION
        status: ACTIVE
      }
      walkinProducts: [HYPERX, NEARX, REFINEX, REWARDX]
    ) {
      id
      email
      firstName
      lastName
      organization {
        id
      }
    }
  }
`;
  const { data, errors } = await client.mutate({
    mutation
  });
  return { userInput, user: data.createUser };
};

const loginUser = async (
  client: ApolloClient<NormalizedCacheObject>,
  userInput: IUserInput
) => {
  const mutation = gql`
    mutation login {
      login(input: { email: "${userInput.email}", password: "${userInput.password}" }) {
        jwt
      }
    }
  `;
  const { data } = await client.mutate({ mutation });
  return data.login.jwt;
};

export const setupUserForIntegrationTesting = async (
  client: ApolloClient<NormalizedCacheObject>
) => {
  const { user, userInput } = await createUser(client);
  const jwt = await loginUser(client, userInput);
  return { user, jwt };
};

interface IUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
