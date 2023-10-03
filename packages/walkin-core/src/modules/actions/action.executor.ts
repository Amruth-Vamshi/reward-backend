import { ActionDefinition } from "../../entity";
import axios, { AxiosRequestConfig } from "axios";
import { NodeVM, VMScript, NodeVMOptions } from "vm2";
import { ACTION_DEFINITION_TYPE } from "../common/constants";
import { merge } from "lodash";

export const executeAction = async (
  actionDefinition: ActionDefinition,
  request: any
) => {
  const actionDefinitionType: string = actionDefinition.type;
  let result;
  switch (actionDefinitionType) {
    case ACTION_DEFINITION_TYPE.GET:
      result = await executeGetAction(actionDefinition, request);
      console.log("GET action with request", request);
      break;
    case ACTION_DEFINITION_TYPE.POST:
      result = await executePostAction(actionDefinition, request);
      console.log("POST action with request", request);
      break;
    case ACTION_DEFINITION_TYPE.AXIOS_REQUEST:
      result = await executeAxiosRequestAction(actionDefinition, request);
      break;
    case ACTION_DEFINITION_TYPE.SCRIPT:
      result = await executeScriptAction(actionDefinition, request);
      break;
    default:
      result = {
        status: "SUCESS"
      };
      console.log("Default action");
  }
  return result;
};

const executeGetAction = async (
  actionDefinition: ActionDefinition,
  request: any
) => {
  let url = actionDefinition.configuration.url;
  let mergedConfig = merge(
    actionDefinition.configuration,
    request.configuration
  );
  // execute get action
  return axios
    .get(url, mergedConfig)
    .then(response => {
      console.log("Response", response);
      return response.data;
    })
    .catch(error => {
      console.log("Error", error);
      let errorResponse: any;
      if (error.response) {
        errorResponse = {
          status: error.response.status,
          statusText: error.response.statusText
        };
      } else {
        errorResponse = { status: "ERROR", statusText: JSON.stringify(error) };
      }
      return errorResponse;
    });
};

const executePostAction = async (
  actionDefinition: ActionDefinition,
  request: any
) => {
  let url = actionDefinition.configuration.url;
  let payload = request.payload;
  let axiosConfig: AxiosRequestConfig = merge(
    actionDefinition.configuration,
    request.configuration
  );
  // execute post action
  return axios
    .post(url, payload, axiosConfig)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      let errorResponse: any;
      if (error.response) {
        errorResponse = {
          status: error.response.status,
          statusText: error.response.statusText
        };
      } else {
        errorResponse = { status: "ERROR", statusText: JSON.stringify(error) };
      }
      return errorResponse;
    });
};

const executeAxiosRequestAction = async (
  actionDefinition: ActionDefinition,
  request: any
) => {
  let payload = request.payload;
  let axiosConfig: AxiosRequestConfig = merge(
    actionDefinition.configuration,
    request.configuration
  );
  // if payload available add it to config.
  if (payload) {
    axiosConfig["data"] = payload;
  }
  console.log("axiosConfig", axiosConfig);

  // executing action
  return axios(axiosConfig)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      let errorResponse: any;
      if (error.response) {
        errorResponse = {
          status: error.response.status,
          statusText: error.response.statusText
        };
      } else {
        errorResponse = { status: "ERROR", statusText: JSON.stringify(error) };
      }
      return errorResponse;
    });
};

const executeScriptAction = async (actionDefinition: any, request: any) => {
  let errorResponse = {};
  let code = actionDefinition.code;
  let configuration = actionDefinition.configuration;
  // if given code string base 64 then convert to base plain text.
  if (isBase64(code)) {
    code = Buffer.from(code, "base64");
  }

  if (!configuration) {
    errorResponse = { status: "ERROR", statusText: "configuration empty" };
    return errorResponse;
  }

  console.log("process.env.VM2_LOAD_MODULES", process.env.VM2_LOAD_MODULES);
  console.log(
    "process.env.VM2_LOAD_MODULES",
    typeof process.env.VM2_LOAD_MODULES
  );

  let vmOptions: NodeVMOptions = configuration.options || {
    timeout: 5000,
    sandbox: {},
    require: {
      external: {
        modules: JSON.parse(process.env.VM2_LOAD_MODULES),
        transitive: false
      }
    },
    eval: false
  };
  let vm = new NodeVM(vmOptions);
  let response = {};
  try {
    let moduleCode = ` ${code} `;
    const vmScript: any = new VMScript(moduleCode);
    const functionInSanbox = vm.run(
      vmScript,
      process.env.VM2_LOAD_MODULES_PATH
    );
    response = functionInSanbox(request);
  } catch (err) {
    errorResponse = {
      status: "ERROR",
      statusText: JSON.stringify(err, Object.getOwnPropertyNames(err))
    };
    return errorResponse;
  }
  return response;
};

function isBase64(str: any) {
  if (str === "" || str.trim() === "") {
    return false;
  }
  try {
    return Buffer.from(str, "base64").toString("base64") === str;
  } catch (err) {
    return false;
  }
}
