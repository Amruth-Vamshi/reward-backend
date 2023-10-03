export const MetricFilterSeed: IMetricFilter[] = [
  {
    key: "from",
    name: "from",
    type: "DATETIME",
    status: "ACTIVE"
  },
  {
    key: "to",
    name: "to",
    type: "DATETIME",
    status: "ACTIVE"
  },
  {
    key: "organization_id",
    name: "organization_id",
    type: "STRING",
    status: "ACTIVE"
  },
  {
    key: "event_type",
    name: "event_type",
    type: "STRING",
    status: "ACTIVE"
  }
];

interface IMetricFilter {
  key: string;
  name: string;
  type: string;
  status: string;
}
