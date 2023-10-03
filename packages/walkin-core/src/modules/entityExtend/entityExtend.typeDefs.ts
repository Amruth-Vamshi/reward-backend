import gql from "graphql-tag";
import { EXTEND_ENTITIES, SLUGTYPE } from "../common/constants/constants";

const typeDefs = gql`

type Query {

  """ Fetches entityNames """

  entities: [EXTEND_ENTITIES] @auth

  """ Fetches all extended entities, specific to organization """

  entityExtend(id:ID!): EntityExtend @auth

  """ Fetches all extended entities, specific to organization """

  entityExtendByName(entityName:EXTEND_ENTITIES!): EntityExtend @auth

  """ Fetches corresponding fields of the extended entities specific to organization """

  entityExtendField(id:ID!): EntityExtendField @auth

  """ Fetches basic fields of an entity """

  basicFields(entityName:EXTEND_ENTITIES!) : [BasicField] @auth
}

type Mutation {

  """ Creates new entry for entityExtend """

  addEntityExtend(input:AddEntityExtend!): EntityExtend @auth

  """ Creates new entry for entity extend fields """

  addEntityExtendField(input:AddEntityExtendField!): EntityExtendField @auth
}

input AddEntityExtend{
  organization_id:ID!,
  entity_name: EXTEND_ENTITIES!,
  description:String!
}

input AddEntityExtendField{
  entityExtendId:ID!
  slug:String!
  label:String
  help:String
  type:SLUGTYPE!
  required:Boolean
  choices:[String]
  defaultValue:String
  description:String
  searchable:Boolean
  validator:String
}

type BasicField {
  slug: String
  label: String
  type: SLUGTYPE
  required: Boolean
  defaultValue: String
  searchable: Boolean,
  description: String
}


type EntityExtend {
  id: ID!
  entityName: EXTEND_ENTITIES!
  description: String!
  organization: Organization!
  fields: [EntityExtendField]
}

type EntityExtendField {
  id: ID!
  slug: String!
  label: String
  help: String
  type: SLUGTYPE!
  required: Boolean!
  choices: [String]
  defaultValue: String
  description: String
  searchable: Boolean
  validator: String
}

type Organization {
  id: ID!
}

enum SLUGTYPE{
  ${[...Object.values(SLUGTYPE)]}
}

enum EXTEND_ENTITIES{
  ${[...Object.values(EXTEND_ENTITIES)]}
}

`;

export default typeDefs;
