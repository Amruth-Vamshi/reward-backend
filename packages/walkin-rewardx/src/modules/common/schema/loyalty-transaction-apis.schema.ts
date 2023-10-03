import { JSON_SCHEMA } from "../constants/constant";

export const REWARDX_SCHEMA = Object;

REWARDX_SCHEMA[JSON_SCHEMA.EARNABLE_BURNABLE_POINTS] = {
  type: "object",
  description: "earnable-burnable-points input",
  title: "EarnableBurnablePoints Input",
  required: ["loyaltyType", "externalCustomerId", "data"],
  properties: {
    loyaltyType: { type: "string" },
    loyaltyReferenceId: { type: "string" },
    externalCustomerId: {
      anyOf: [{ type: "string" }, { type: "number" }]
    },
    data: {
      type: "object",
      required: ["date"],
      properties: {
        date: {
          type: "array",
          items: {
            anyOf: [{ type: "string" }, { type: "number" }]
          }
        },
        order: {
          type: "object",
          required: [
            "externalStoreId",
            "orderType",
            "orderChannel",
            "products"
          ],
          properties: {
            externalStoreId: {
              type: "string"
            },
            orderType: {
              type: "string"
            },
            orderChannel: {
              type: "string"
            },
            products: {
              type: "array",
              items: {
                type: "object",
                required: ["productCode", "quantity", "pricePerQty"],
                properties: {
                  productCode: {
                    type: "string"
                  },
                  name: {
                    type: "string"
                  },
                  productType: {
                    type: "string"
                  },
                  isEDVOApplied: {
                    type: "boolean"
                  },
                  pricePerQty: {
                    type: "number"
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1
                  }
                }
              }
            }
          }
        },
        customer: {
          type: "object"
        },
        store: {
          type: "object"
        }
      }
    }
  }
};

REWARDX_SCHEMA[JSON_SCHEMA.PROCESS_LOYALTY_ISSUANCE] = {
  type: "object",
  description: "PROCESS LOYALTY ISSUANCE input",
  title: "ProcessLoyaltyIssuance Input",
  required: ["loyaltyType", "externalCustomerId", "loyaltyReferenceId", "data"],
  properties: {
    loyaltyType: { type: "string" },
    externalCustomerId: {
      anyOf: [{ type: "string" }, { type: "number" }]
    },
    loyaltyReferenceId: { type: "string" },
    data: {
      type: "object",
      required: ["date"],
      properties: {
        date: {
          type: "array",
          items: {
            anyOf: [{ type: "string" }, { type: "number" }]
          }
        },
        order: {
          type: "object",
          required: [
            "externalStoreId",
            "orderType",
            "orderChannel",
            "products"
          ],
          properties: {
            externalStoreId: {
              type: "string"
            },
            orderType: {
              type: "string"
            },
            orderChannel: {
              type: "string"
            },
            products: {
              type: "array",
              items: {
                type: "object",
                required: ["productCode", "quantity", "pricePerQty"],
                properties: {
                  productCode: {
                    type: "string"
                  },
                  name: {
                    type: "string"
                  },
                  productType: {
                    type: "string"
                  },
                  isEDVOApplied: {
                    type: "boolean"
                  },
                  pricePerQty: {
                    type: "number"
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1
                  }
                }
              }
            }
          }
        },
        customer: {
          type: "object"
        },
        store: {
          type: "object"
        }
      }
    }
  }
};

REWARDX_SCHEMA[JSON_SCHEMA.PROCESS_LOYALTY_REDMPTION] = {
  type: "object",
  description: "PROCESS LOYALTY REDMPTION input",
  title: "ProcessLoyaltyRedemption Input",
  required: ["loyaltyType", "externalCustomerId", "loyaltyReferenceId", "data"],
  properties: {
    loyaltyType: { type: "string" },
    externalCustomerId: {
      anyOf: [{ type: "string" }, { type: "number" }]
    },
    loyaltyReferenceId: { type: "string" },
    data: {
      type: "object",
      required: ["date"],
      properties: {
        date: {
          type: "array",
          items: {
            anyOf: [{ type: "string" }, { type: "number" }]
          }
        },
        order: {
          type: "object",
          required: [
            "externalStoreId",
            "orderType",
            "orderChannel",
            "products"
          ],
          properties: {
            externalStoreId: {
              type: "string"
            },
            orderType: {
              type: "string"
            },
            orderChannel: {
              type: "string"
            },
            products: {
              type: "array",
              items: {
                type: "object",
                required: ["productCode", "quantity", "pricePerQty"],
                properties: {
                  productCode: {
                    type: "string"
                  },
                  name: {
                    type: "string"
                  },
                  productType: {
                    type: "string"
                  },
                  isEDVOApplied: {
                    type: "boolean"
                  },
                  pricePerQty: {
                    type: "number"
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1
                  }
                }
              }
            }
          }
        },
        customer: {
          type: "object"
        },
        store: {
          type: "object"
        }
      }
    }
  }
};

REWARDX_SCHEMA[JSON_SCHEMA.CREATE_OR_UPDATE_LOYALTY_TRANSACTION] = {
  type: "object",
  description: "PROCESS LOYALTY ISSUANCE input",
  title: "ProcessLoyaltyIssuance Input",
  required: ["loyaltyType", "externalCustomerId", "loyaltyReferenceId"],
  properties: {
    loyaltyType: { type: "string" },
    externalCustomerId: {
      anyOf: [{ type: "string" }, { type: "number" }]
    },
    loyaltyReferenceId: { type: "string" },
    data: {
      type: "object",
      required: ["date"],
      properties: {
        date: {
          type: "array",
          items: {
            anyOf: [{ type: "string" }, { type: "number" }]
          }
        },
        order: {
          type: "object",
          required: [
            "externalStoreId",
            "orderType",
            "orderChannel",
            "products"
          ],
          properties: {
            externalStoreId: {
              type: "string"
            },
            orderType: {
              type: "string"
            },
            orderChannel: {
              type: "string"
            },
            products: {
              type: "array",
              items: {
                type: "object",
                required: ["productCode", "quantity", "pricePerQty"],
                properties: {
                  productCode: {
                    type: "string"
                  },
                  name: {
                    type: "string"
                  },
                  productType: {
                    type: "string"
                  },
                  isEDVOApplied: {
                    type: "boolean"
                  },
                  pricePerQty: {
                    type: "number"
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1
                  }
                }
              }
            }
          }
        },
        customer: {
          type: "object"
        },
        store: {
          type: "object"
        }
      }
    }
  }
};
