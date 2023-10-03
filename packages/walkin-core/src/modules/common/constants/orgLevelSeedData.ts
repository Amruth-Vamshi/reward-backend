import {
  BASIC_METRICS,
  METRIC_TYPE,
  DB_SOURCE,
  STATUS,
  VALUE_TYPE,
  CORE_WEBHOOK_EVENTS,
  WORKFLOW_STATES,
  MESSAGE_FORMAT,
  DEFAULT_TEMPLATES,
  TEMPLATE_STYLE
} from "./constants";
import { MessageTemplate } from "../../../entity";

export const BASIC_METRIC_DATA = [
  {
    name: BASIC_METRICS.CUSTOMER_COUNTS,
    description: "customer counts",
    query: `select count(toStartOfDay(created)) as count, toDate(toStartOfDay(created)) as Date from ${process.env.CLICKHOUSE_DATABASE}.customer group by toStartOfDay(created)`,
    filters: ["from", "to", "organization_id"],
    type: METRIC_TYPE.SCALAR,
    source: DB_SOURCE.WAREHOUSE,
    status: STATUS.ACTIVE
  },
  {
    name: BASIC_METRICS.TOTAL_CAMPAIGNS,
    description: "TOTAL_CAMPAIGNS",
    query: `select count(*) AS count from ${process.env.CLICKHOUSE_DATABASE}.campaigns`,
    filters: ["from", "to", "organization_id"],
    type: METRIC_TYPE.SCALAR,
    source: DB_SOURCE.WAREHOUSE,
    status: STATUS.ACTIVE
  }
];

export const BASIC_RULE_ENTITY_DATA = [
  {
    entityName: "Customer",
    entityCode: "Customer",
    status: STATUS.ACTIVE,
    attributes: [
      {
        attributeName: "firstName",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "lastName",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "email",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "phoneNumber",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "externalCustomerId",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "customerIdentifier",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "onboard_source",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "gender",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "dateOfBirth",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "organization_id",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_state",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_city",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_date_of_anniversary",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_food_preference",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_marital_status",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_analytics_id",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_percent_completion",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_recency",
        attributeValueType: VALUE_TYPE.NUMBER,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_frequency",
        attributeValueType: VALUE_TYPE.NUMBER,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_monetary",
        attributeValueType: VALUE_TYPE.NUMBER,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "customer_tags",
        attributeValueType: VALUE_TYPE.ARRAY,
        status: STATUS.ACTIVE
      }
    ]
  },
  {
    entityName: "CustomerSearch",
    entityCode: "CustomerSearch",
    status: STATUS.ACTIVE,
    attributes: [
      {
        attributeName: "firstName",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "lastName",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "email",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "phoneNumber",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "externalCustomerId",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "customerIdentifier",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "onboard_source",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "gender",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "dateOfBirth",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "organization_id",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_state",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_city",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_date_of_anniversary",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_food_preference",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_marital_status",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_analytics_id",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_percent_completion",
        attributeValueType: VALUE_TYPE.STRING,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_recency",
        attributeValueType: VALUE_TYPE.NUMBER,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_frequency",
        attributeValueType: VALUE_TYPE.NUMBER,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "extend_monetary",
        attributeValueType: VALUE_TYPE.NUMBER,
        status: STATUS.ACTIVE
      },
      {
        attributeName: "customer_tags",
        attributeValueType: VALUE_TYPE.ARRAY,
        status: STATUS.ACTIVE
      }
    ]
  }
];

export const BASIC_WEBHOOK_EVENT_TYPE: IBasicWebhookEventType[] = [
  {
    event: CORE_WEBHOOK_EVENTS.CREATE_CUSTOMER,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CREATE_CUSTOMER
  },
  {
    event: CORE_WEBHOOK_EVENTS.UPDATE_CUSTOMER,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.UPDATE_CUSTOMER
  },
  {
    event: CORE_WEBHOOK_EVENTS.DISABLE_CUSTOMER,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.DISABLE_CUSTOMER
  },
  {
    event: CORE_WEBHOOK_EVENTS.CREATE_CUSTOMER_DEVICE,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CREATE_CUSTOMER_DEVICE
  },
  {
    event: CORE_WEBHOOK_EVENTS.UPDATE_CUSTOMER_DEVICE,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.UPDATE_CUSTOMER_DEVICE
  },
  {
    event: CORE_WEBHOOK_EVENTS.DISABLE_CUSTOMER_DEVICE,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.DISABLE_CUSTOMER_DEVICE
  },
  {
    event: "nearx.firehose",
    status: STATUS.ACTIVE,
    description: "nearx.firehose"
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_CREATE_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_CREATE_SUCESS
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_UPDATE_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_UPDATE_SUCESS
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_LAUNCH_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_LAUNCH_SUCESS
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_PAUSE_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_PAUSE_SUCESS
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_UNPAUSE_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_UNPAUSE_SUCESS
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_COMPLETE_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_COMPLETE_SUCESS
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_ABANDONED_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_ABANDONED_SUCESS
  },
  {
    event: CORE_WEBHOOK_EVENTS.CAMPAIGN_DISABLED_SUCESS,
    status: STATUS.ACTIVE,
    description: CORE_WEBHOOK_EVENTS.CAMPAIGN_DISABLED_SUCESS
  }
];

export const BASIC_METRIC_FILTERS: IMetricFilter[] = [
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

/* ---------------------- Workflow related setup --------------------- */

export const WORKFLOW_DESCRIPTION = {
  THREE_STATE_WORKFLOW: "Three state workflow"
};

export const WORKFLOW_NAMES = {
  DEFAULT_SIMPLE_CAMPAIGN_WORKFLOW: "DEFAULT_SIMPLE_CAMPAIGN_WORKFLOW"
};

export const WORKFLOW_STATE_CODES = {
  C1001: "1001",
  C1002: "1002",
  C2000: "2000",
  C2002: "2002",
  C3000: "3000",
  C4000: "4000",
  C5000: "5000",
  C5005: "5005",
  C3001: "3001",
  C8008: "8008",
  C9998: "9998",
  C9999: "9999"
};

export const campaginWorkflowProcessConst = [
  {
    CREATE_CAMPAIGN: "CREATE_CAMPAIGN",
    LAUNCH_CAMPAIGN: "LAUNCH_CAMPAIGN",
    COMPLETE_CAMPAIGN: "COMPLETE_CAMPAIGN",
    ABANDON_CAMPAIGN: "ABANDON_CAMPAIGN",
    PAUSE_CAMPAIGN: "PAUSE_CAMPAIGN",
    UNPAUSE_CAMPAIGN: "UNPAUSE_CAMPAIGN",
    UPDATE_CAMPAIGN: "UPDATE_CAMPAIGN"
  }
];

export const frameWorkflowProcessTransitionInput = async (
  getWorkflowState,
  createRuleResponseId,
  workflowProcessResponseNames
) => {
  let workflowStateIdMapper: any = [];
  getWorkflowState.forEach(state => {
    if (state.name) {
      workflowStateIdMapper.push({
        [state.name]: state.id
      });
    }
  });

  let workflowProcessIdMapper: any = [];
  workflowProcessResponseNames.forEach(process => {
    if (process.name) {
      workflowProcessIdMapper.push({
        [process.name]: process.id
      });
    }
  });

  workflowStateIdMapper = Object.assign({}, ...workflowStateIdMapper);
  workflowProcessIdMapper = Object.assign({}, ...workflowProcessIdMapper);

  const workflowProcessTransitionInput = [
    {
      pickupStateId: workflowStateIdMapper.NO_STATE,
      dropStateId: workflowStateIdMapper.DRAFT,
      workflowProcessId: workflowProcessIdMapper.CREATE_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "From nothing to draft"
    },
    {
      pickupStateId: workflowStateIdMapper.DRAFT,
      dropStateId: workflowStateIdMapper.LIVE,
      workflowProcessId: workflowProcessIdMapper.LAUNCH_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "From Draft to Live"
    },
    {
      pickupStateId: workflowStateIdMapper.LIVE,
      dropStateId: workflowStateIdMapper.PAUSE,
      workflowProcessId: workflowProcessIdMapper.PAUSE_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "Pause a campaign"
    },
    {
      pickupStateId: workflowStateIdMapper.PAUSE,
      dropStateId: workflowStateIdMapper.LIVE,
      workflowProcessId: workflowProcessIdMapper.UNPAUSE_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "Unpause campaign"
    },
    {
      pickupStateId: workflowStateIdMapper.PAUSE,
      dropStateId: workflowStateIdMapper.ABANDONED,
      workflowProcessId: workflowProcessIdMapper.ABANDON_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "Abandon campaign"
    },
    {
      pickupStateId: workflowStateIdMapper.LIVE,
      dropStateId: workflowStateIdMapper.COMPLETE,
      workflowProcessId: workflowProcessIdMapper.COMPLETE_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "complete a live campaign"
    },
    {
      pickupStateId: workflowStateIdMapper.PAUSE,
      dropStateId: workflowStateIdMapper.COMPLETE,
      workflowProcessId: workflowProcessIdMapper.COMPLETE_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "complete a paused campaign"
    },
    {
      pickupStateId: workflowStateIdMapper.DRAFT,
      dropStateId: workflowStateIdMapper.DRAFT,
      workflowProcessId: workflowProcessIdMapper.UPDATE_CAMPAIGN,
      ruleConfig: createRuleResponseId,
      name: "update a draft campaign"
    }
  ];
  return workflowProcessTransitionInput;
};

export const frameWorkflowStatesInputs = async createWorkflowResponse => [
  {
    name: WORKFLOW_STATES.DRAFT,
    code: WORKFLOW_STATE_CODES.C1001,
    description: WORKFLOW_STATES.DRAFT,
    workflowId: createWorkflowResponse.id
  },
  {
    name: WORKFLOW_STATES.LIVE,
    code: WORKFLOW_STATE_CODES.C2000,
    description: WORKFLOW_STATES.LIVE,
    workflowId: createWorkflowResponse.id
  },
  {
    name: WORKFLOW_STATES.COMPLETE,
    code: WORKFLOW_STATE_CODES.C3000,
    description: WORKFLOW_STATES.COMPLETE,
    workflowId: createWorkflowResponse.id
  },
  {
    name: WORKFLOW_STATES.PAUSE,
    code: WORKFLOW_STATE_CODES.C5000,
    description: WORKFLOW_STATES.PAUSE,
    workflowId: createWorkflowResponse.id
  },
  {
    name: WORKFLOW_STATES.ABANDONED,
    code: WORKFLOW_STATE_CODES.C3001,
    description: WORKFLOW_STATES.ABANDONED,
    workflowId: createWorkflowResponse.id
  },
  {
    name: WORKFLOW_STATES.NO_STATE,
    code: WORKFLOW_STATE_CODES.C9999,
    description: WORKFLOW_STATES.NO_STATE,
    workflowId: createWorkflowResponse.id
  }
];
export const BASIC_TEMPLATES: Array<Partial<MessageTemplate>> = [
  {
    name: DEFAULT_TEMPLATES.PASSWORD_RESET_MAIL_TEMPLATE,
    description: DEFAULT_TEMPLATES.PASSWORD_RESET_MAIL_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.EMAIL,
    templateBodyText: `Hi {{firstName}}, <br/> You're receiving this e-mail because you requested a password reset for your Peppo account. <br/><br/> Click <a href="{{verifyUrl}}"> here</a> to reset your password. <br/> </br> (This link expires in 30 minutes) <br/> <br/> If you didn't request this change, you can ignore this email. We have not yet reset your password. <br/> <br/> Thanks, <br/> -The Peppo Team`,
    templateSubjectText: "Password Reset Email",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.NEW_USER_CONFIRM_MAIL_TEMPLATE,
    description: DEFAULT_TEMPLATES.NEW_USER_CONFIRM_MAIL_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.EMAIL,
    templateBodyText: `Hi {{firstName}}, <br/> <br/> Thank you for registering with First WalkIn Technologies. <br/> <b>Your email:</b> {{email}} <br/><br/> In order to complete your registration, please click <a href="{{verifyLink}}"> here </a> <br/> <br/> Regards, <br/> Peppo Support Team`,
    templateSubjectText: "Registration confirmation for Peppo",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.PASSWORD_RESET_CONFIRMATION,
    description: DEFAULT_TEMPLATES.PASSWORD_RESET_CONFIRMATION,
    messageFormat: MESSAGE_FORMAT.EMAIL,
    templateBodyText: `Hi {{firstName}}, <br/> <br/> You have successfully changed your Peppo password. <br/> <br/><br/> If this was you, then you can safely ignore this email. If you didn't make this change, please contact info@peppo.co.in immediately, so we can sort this out for you. <br/> <br/> Thanks!, <br/> The Peppo Team`,
    templateSubjectText: "Your password has been updated",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.USER_PASSWORD_RESET_TEMPLATE,
    description: DEFAULT_TEMPLATES.USER_PASSWORD_RESET_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.EMAIL,
    templateBodyText: `Hi {{firstName}}, <br/> <br/> You have successfully changed password for {{managerUserName}}. <br/> <br/><br/> If this was you, then you can safely ignore this email. If you didn't make this change, please contact info@peppo.co.in immediately, so we can sort this out for you. <br/> <br/> Thanks!, <br/> The Peppo Team`,
    templateSubjectText: "Password has been updated",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  }
];

interface IMetricFilter {
  key: string;
  name: string;
  type: string;
  status: string;
}
interface IBasicWebhookEventType {
  event: string;
  status: string;
  description: string;
}

export const NOTIFICATION_TEMPLATES: Array<Partial<MessageTemplate>> = [
  {
    name: DEFAULT_TEMPLATES.NEW_ORDER_CREATION_TEMPLATE,
    description: DEFAULT_TEMPLATES.NEW_ORDER_CREATION_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.PUSH,
    templateBodyText: "New Order is Created",
    templateSubjectText: "New Order Created",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.ORDER_DELIVERY_FOUND_TEMPLATE,
    description: DEFAULT_TEMPLATES.ORDER_DELIVERY_FOUND_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.PUSH,
    templateBodyText: "Delivery found for the order",
    templateSubjectText: "Delivery found for the order",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.ORDER_SHIPPED_TEMPLATE,
    description: DEFAULT_TEMPLATES.ORDER_SHIPPED_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.PUSH,
    templateBodyText: "Order Shipped",
    templateSubjectText: "Order Shipped",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.ORDER_DELIVERED_TEMPLATE,
    description: DEFAULT_TEMPLATES.ORDER_DELIVERED_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.PUSH,
    templateBodyText: "Order Delivered successfully",
    templateSubjectText: "Order Delivered successfully",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.ORDER_ACCEPTANCE_TEMPLATE,
    description: DEFAULT_TEMPLATES.ORDER_ACCEPTANCE_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.PUSH,
    templateBodyText: "Order is Accepted",
    templateSubjectText: "Order is Accepted",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.ORDER_REJECTED_TEMPLATE,
    description: DEFAULT_TEMPLATES.ORDER_REJECTED_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.PUSH,
    templateBodyText: "Order is Rejected",
    templateSubjectText: "Order is Rejected",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  },
  {
    name: DEFAULT_TEMPLATES.ORDER_CANCELED_TEMPLATE,
    description: DEFAULT_TEMPLATES.ORDER_CANCELED_TEMPLATE,
    messageFormat: MESSAGE_FORMAT.PUSH,
    templateBodyText: "Order is Canceled",
    templateSubjectText: "Order is Canceled",
    templateStyle: TEMPLATE_STYLE.MUSTACHE,
    status: STATUS.ACTIVE,
    url: "",
    imageUrl: ""
  }
];
