import gql from "graphql-tag";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";
import { STATUS } from "../common/constants/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "../common/permissions";

const typeDefs = gql`
  input PageOptions

  input SortOptions

  type PaginationInfo

  type ReportConfigPage {
    data: [ReportConfig!],
    paginationInfo: PaginationInfo
  }

  type ReportPage {
    data: [Report!],
    paginationInfo: PaginationInfo
  }


  type Query {

    reportConfig(id: ID!, organizationId: ID!): ReportConfig @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORT_CONFIG},permission:${POLICY_PERMISSION_ENTITY.READ}}])

    reportConfigs(organizationId: ID!, pageOptions: PageOptions ={} , sortOptions:SortOptions): ReportConfigPage @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORT_CONFIG},permission:${POLICY_PERMISSION_ENTITY.LIST}}])

    report(id: ID!, organizationId: ID!): Report @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORTS},permission:${POLICY_PERMISSION_ENTITY.READ}}])

    reports(
      reportConfigId: ID!
      reportDate: Date!
      organizationId: ID!
      pageOptions: PageOptions ={}
      sortOptions:SortOptions
    ): ReportPage @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORTS},permission:${POLICY_PERMISSION_ENTITY.LIST}}])


  }

  type Mutation {

    addReportConfig(
      name: String!
      description: String!
      organizationId: ID!
    ): ReportConfig @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORT_CONFIG},permission:${POLICY_PERMISSION_ENTITY.CREATE}}])


    deactivateReportConfig(id: ID!, organizationId: ID!): Boolean @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORT_CONFIG},permission:${POLICY_PERMISSION_ENTITY.DELETE}}])

    addReport(
      reportConfigId: ID!
      reportFileId: ID!
      reportDate: Date!
      organizationId: ID!
    ): Report @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORTS},permission:${POLICY_PERMISSION_ENTITY.CREATE}}])

    deleteReport(id: ID!, organizationId: ID!): Boolean @disabled @auth(requires:[{resource:${POLICY_RESOURCES_ENTITY.REPORTS},permission:${POLICY_PERMISSION_ENTITY.DELETE}}])
  }

  type ReportConfig {
    id: ID!
    name: String
    description: String
    organizationId: ID!
    status: STATUS
  }

  type Report {
    id: ID!
    reportConfig: ReportConfig
    organizationId: ID!
    reportDate: Date
    reportFile: File
    status: STATUS
  }

  type File {
    id: ID!
  }

  enum STATUS

  scalar JSON
  scalar Date
`;

export default typeDefs;
