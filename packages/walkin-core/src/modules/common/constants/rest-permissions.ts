import {
  POLICY_PERMISSION_ENTITY,
  POLICY_RESOURCES_ENTITY
} from "../../common/permissions";

export const REST_API_REQUIRED_PERMISSIONS = {
  "/store": [
    {
      resource: POLICY_RESOURCES_ENTITY.STORE,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.STORE,
      permission: POLICY_PERMISSION_ENTITY.LIST
    }
  ],
  "/create-store": [
    {
      resource: POLICY_RESOURCES_ENTITY.STORE,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.STORE,
      permission: POLICY_PERMISSION_ENTITY.CREATE
    }
  ],
  "/update-store": [
    {
      resource: POLICY_RESOURCES_ENTITY.STORE,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.STORE,
      permission: POLICY_PERMISSION_ENTITY.UPDATE
    }
  ],
  "/create-collections": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.CREATE
    }
  ],
  "/delete-collection": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.UPDATE
    }
  ],
  "/get-collection-by-collectionId": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    }
  ],
  "/get-collections-by-campaignId": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    }
  ],
  "/upload-collections": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.CREATE
    }
  ],
  "/add-collection-items-from-csv": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.CREATE
    }
  ],
  "/get-collection-items": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    }
  ],
  "/fetch-collections-with-filters": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.CAMPAIGN,
      permission: POLICY_PERMISSION_ENTITY.READ
    }
  ],
  "get-collections-by-campaignId": [
    {
      resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
      permission: POLICY_PERMISSION_ENTITY.READ
    },
    {
      resource: POLICY_RESOURCES_ENTITY.CAMPAIGN,
      permission: POLICY_PERMISSION_ENTITY.READ
    }
  ],
  "/get-loyalty-program-config-by-id": [
    {
      resource: POLICY_RESOURCES_ENTITY.LOYALTY_PROGRAM,
      permission: POLICY_PERMISSION_ENTITY.READ
    }
  ],
  "/get-loyalty-program-configs": [
    {
      resource: POLICY_RESOURCES_ENTITY.LOYALTY_PROGRAM,
      permission: POLICY_PERMISSION_ENTITY.READ
    }
  ]
};

export const fetchApiRequiredPermissions = url => {
  const apiEndpointInfo = [
    {
      endpoint: "/store/:storeID",
      regex: /\/store\/.*/gi
    },
    {
      endpoint: "/update-collections/:collectionsId",
      regex: /\/update-collections\/.*/gi
    },
    {
      endpoint: "/remove-collection-item/:collectionItemsId",
      regex: /\/remove-collection-item\/.*/gi
    },
    {
      endpoint: "/add-collection-item/:collectionsId",
      regex: /\/add-collection-item\/.*/gi
    },
    {
      endpoint: "/get-collection-item/:collectionItemId",
      regex: /\/get-collection-item\/.*/gi
    }
  ];

  let restEndPointPermissions = [];
  let endpoint = "";
  for (const apiDetails of apiEndpointInfo) {
    if (url.match(apiDetails.regex)) {
      endpoint = apiDetails.endpoint;
      break;
    }
  }

  switch (endpoint) {
    case "/store/:storeID":
      restEndPointPermissions = [
        {
          resource: POLICY_RESOURCES_ENTITY.STORE,
          permission: POLICY_PERMISSION_ENTITY.READ
        }
      ];
      break;
    case "/update-collections/:collectionsId":
      restEndPointPermissions = [
        {
          resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
          permission: POLICY_PERMISSION_ENTITY.READ
        },
        {
          resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
          permission: POLICY_PERMISSION_ENTITY.UPDATE
        }
      ];
      break;
    case "/remove-collection-item/:collectionItemsId":
      restEndPointPermissions = [
        {
          resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
          permission: POLICY_PERMISSION_ENTITY.READ
        },
        {
          resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
          permission: POLICY_PERMISSION_ENTITY.UPDATE
        }
      ];
      break;
    case "/add-collection-item/:collectionsId":
      restEndPointPermissions = [
        {
          resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
          permission: POLICY_PERMISSION_ENTITY.READ
        },
        {
          resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
          permission: POLICY_PERMISSION_ENTITY.CREATE
        }
      ];
      break;
    case "/get-collection-item/:collectionItemId":
      restEndPointPermissions = [
        {
          resource: POLICY_RESOURCES_ENTITY.COLLECTIONS,
          permission: POLICY_PERMISSION_ENTITY.READ
        }
      ];
      break;
    default:
      restEndPointPermissions = [];
  }

  return restEndPointPermissions;
};
