import gql from "graphql-tag";
import {
  DB_SOURCE,
  WALKIN_PRODUCTS,
  METRIC_TYPE,
  METRIC_FILTER_TYPE,
  STATUS,
  RELEASED_WALKIN_PRODUCTS
} from "../common/constants/constants";
import {
  POLICY_RESOURCES_ENTITY,
  POLICY_PERMISSION_ENTITY
} from "@walkinserver/walkin-core/src/modules/common/permissions";

const typeDefs = gql`


scalar JSON

input SortOptions

input PageOptions{
  page: Int = 1
  pageSize: Int = 10
}

enum STATUS

enum METRIC_TYPE{
  ${[...Object.values(METRIC_TYPE)]}
}

enum METRIC_FILTER_TYPE{
  ${[...Object.values(METRIC_FILTER_TYPE)]}
}

enum DB_SOURCE {
  ${[...Object.values(DB_SOURCE)]}
}

enum WALKIN_PRODUCTS {
  ${[...Object.values(RELEASED_WALKIN_PRODUCTS)]}
}

type Organization
type PaginationInfo

  type Query {

    metric(id: ID!, organizationId: ID): Metric @disabled @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
		])
    metrics(pageOptions: PageOptions ={}, sortOptions:SortOptions,organizationId: ID, status: STATUS!): MetricPage @disabled @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
		])


    metricFilter(id: ID!, organizationId: ID): MetricFilter @disabled @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
    metricFilters(pageOptions: PageOptions ={}, sortOptions:SortOptions,status: STATUS!,organizationId:ID) : MetricFilterPage @disabled @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
    executeMetric(name:String, organizationId: ID, filterValues:JSON ): MetricExecutionResult @disabled @auth
    (requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
    executeMetrics(names:[String],organizationId:ID walkinProducts: WALKIN_PRODUCTS!,filterValues:JSON) : MetricExecutionResultPage @disabled @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.READ
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
  }

  type Mutation {
    createMetric(input: MetricAddInput): Metric @disabled @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])
    updateMetric(input: MetricUpdateInput): Metric @disabled @auth(requires:[
      {resource:${POLICY_RESOURCES_ENTITY.METRIC},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}},
      {resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.READ
}}
		])

    createMetricFilter(input: MetricFilterAddInput): MetricFilter @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.CREATE
}}
		])
    updateMetricFilter(input: MetricFilterUpdateInput): MetricFilter @disabled @auth(requires:[
			{resource:${POLICY_RESOURCES_ENTITY.METRIC_FILTER},permission:${
  POLICY_PERMISSION_ENTITY.UPDATE
}}
		])

  }

  input MetricAddInput {
    name: String!
    description: String!
    query: String!
    type: METRIC_TYPE!
    filters: [String]!
    organizationId: ID
    source: DB_SOURCE!
  }


  input MetricUpdateInput {
    id: ID!
    name: String
    description: String
    query: String
    organizationId: ID!
    type: METRIC_TYPE
    filters: [String]
    status: STATUS
    source: DB_SOURCE
  }

  input MetricFilterAddInput{
    key: String!
    name: String!
    type: METRIC_FILTER_TYPE!
    organizationId: ID
  }

  input MetricFilterUpdateInput {
    id: ID!
    name: String
    type: METRIC_FILTER_TYPE
    key: String
    status: STATUS
    organizationId: ID!
   }

  type Metric {
    id: ID
    name: String
    description: String
    query: String
    type: METRIC_TYPE
    filters: [MetricFilter]
    organization: Organization
    status: STATUS
    source: DB_SOURCE
  }

  type MetricFilter {
    id: ID
    name: String
    key: String
    type: METRIC_FILTER_TYPE
    status: STATUS
    organization: Organization
  }

  type MetricExecutionResult {
    name: String
    type: METRIC_TYPE
    rows: Int
    cols: Int
    headers:[String]
    data: JSON
    total: Int
  }

  type MetricPage {
    data: [Metric!],
    paginationInfo: PaginationInfo
  }

  type MetricExecutionResultPage {
    data: [MetricExecutionResult]
    paginationInfo: PaginationInfo
  }

  type MetricFilterPage {
    data: [MetricFilter]
    paginationInfo: PaginationInfo
  }

`;

export default typeDefs;
