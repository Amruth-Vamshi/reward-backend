export const WalkinProductsSeed: IWalkinProductSeed[] = [
  // {
  //   name: "NEARX",
  //   description: "Walkin NearX",
  //   latest_version: "0.10",
  //   status: "ACTIVE",
  // },
  // {
  //   name: "REFINEX",
  //   description: "Walkin RefineX",
  //   latest_version: "0.10",
  //   status: "ACTIVE",
  // },
  // {
  //   name: "HYPERX",
  //   description: "Walkin HyperX",
  //   latest_version: "0.10",
  //   status: "ACTIVE",
  // },
  // {
  //   name: "UPTYME",
  //   description: "Walkin Uptyme",
  //   latest_version: "0.10",
  //   status: "ACTIVE",
  // },
  {
    name: "PLATFORM",
    description: "Walkin Platform",
    latest_version: "0.10",
    status: "ACTIVE"
  },
  {
    name: "REWARDX",
    description: "Walkin RewardX",
    latest_version: "0.10",
    status: "ACTIVE"
  }
  // {
  //   name: "ORDERX",
  //   description: "Walkin OrderX",
  //   latest_version: "0.10",
  //   status: "ACTIVE",
  // },
];

interface IWalkinProductSeed {
  name: string;
  description: string;
  latest_version: string;
  status: string;
}
