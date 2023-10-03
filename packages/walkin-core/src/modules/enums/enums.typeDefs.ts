import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import { STATUS, WALKIN_QUEUES, SCHEMA_FORMAT } from "../common/constants";

export const typeDefs: DocumentNode = gql`
  enum STATUS{
      ${[...Object.values(STATUS)]}
    }
  enum FORMAT{
	  ${[...Object.values(SCHEMA_FORMAT)]}
  }

`;
