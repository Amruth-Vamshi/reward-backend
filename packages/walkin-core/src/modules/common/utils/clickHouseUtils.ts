import { ClickHouse } from "clickhouse";
import { WCoreError } from "../exceptions/index";
import { WCORE_ERRORS } from "../constants/errors";
export const clickhouse = new ClickHouse({
  url: process.env.CLICKHOUSE_URL,
  port: process.env.CLICKHOUSE_PORT,
  debug: false,
  basicAuth: {
    username: process.env.CLICKHOUSE_BASICAUTH_USERNAME,
    password: process.env.CLICKHOUSE_BASICAUTH_PASSWORD
  },
  isUseGzip: false,
  config: {
    session_timeout: 60,
    output_format_json_quote_64bit_integers: 0,
    enable_http_compression: 0,
    add_http_cors_header: 1
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Origin, Access-Control-Allow-Origin,User-Agent,Authorization"
  }
});

export const clickHouseQuery = async query => {
  console.log("clickhouse query", query);
  console.log("clickhouse env", process.env.CLICKHOUSE_URL);
  try {
    const queryResult = await clickhouse
      .query(query)
      .toPromise()
      .catch(err => {
        console.log(err);
        throw new WCoreError(WCORE_ERRORS.WAREHOUSE_QUERY_INVALID);
      });
    console.log("clickhouse query result", queryResult);
    return queryResult;
  } catch (e) {
    console.log(e);
  }
};
