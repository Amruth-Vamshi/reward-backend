import gql from "graphql-tag";
import { SEGMENT_TYPE } from "../common/constants/constants";

const typeDefs = gql`
  type Query {

    segment(id: ID!): Segment @disabled @auth
    segments(name: String, organization_id: ID!, application_id: ID, segmentType: String, status: STATUS!): [Segment] @disabled @auth

  }

  type Mutation {
    createSegmentForCustomers(customerPhoneNumbers:[String], segmentName: String): Segment @auth @disabled
    createSegment(input: SegmentAddInput): Segment @disabled @auth
    updateSegment(input: SegmentUpdateInput): Segment @disabled @auth
    disableSegment(id: ID!): Segment @disabled @auth
  }

  input SegmentAddInput {
    name: String!
    description: String
    segmentType: SEGMENT_TYPE!
    organization_id: ID!
    application_id: ID!
    rule_id: ID!
    status: STATUS!
  }

  input SegmentUpdateInput {
    id: ID!
    name: String
    description: String
    segmentType: SEGMENT_TYPE
    rule_id: ID
    status: STATUS
  }

  type Segment {
    createdBy:String
    lastModifiedBy:String
    createdTime:DateTime
    lastModifiedTime:DateTime
    id: ID
    name: String
    description: String
    segmentType: String
    organization: Organization
    application: Application
    rule: Rule    
    status: STATUS
  }

  type Organization {
    id: ID!
  }
  
  type Application {
    id: ID!
  }

  type Rule{
    id: ID!
  }

  scalar JSON
  scalar DateTime

  enum STATUS
  
  enum SEGMENT_TYPE{
    ${[...Object.values(SEGMENT_TYPE)]}
  }
  
 

  
`;

export default typeDefs;
