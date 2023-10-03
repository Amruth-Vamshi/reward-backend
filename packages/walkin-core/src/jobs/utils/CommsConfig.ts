import axios from "axios";

axios.defaults.baseURL = process.env.COMMS_MODULE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["x-api-key"] = process.env.COMMS_MODULE_API_KEY;

export default axios;
