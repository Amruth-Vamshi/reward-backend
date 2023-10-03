export const WalkinStatusSeed: IWalkinStatusSeed[] = [
    {
        statusId: 101,
        statusCode: "INITIATED",
        statusType: null,
        description: null,
    },
    {
        statusId: 102,
        statusCode: "COMPLETED",
        statusType: null,
        description: null,
    },
    {
        statusId: 103,
        statusCode: "REVIEW",
        statusType: null,
        description: null,
    },
    {
        statusId: 104,
        statusCode: "CALCULATE",
        statusType: null,
        description: null,
    },
    {
        statusId: 401,
        statusCode: "CANCELLED",
        statusType: null,
        description: null,
    },
    {
        statusId: 402,
        statusCode: "NOT_ELIGIBLE",
        statusType: null,
        description: null,
    },
  ];
  
  interface IWalkinStatusSeed {
    statusId: number;
    statusCode: string;
    statusType: string;
    description: string;
  }
  