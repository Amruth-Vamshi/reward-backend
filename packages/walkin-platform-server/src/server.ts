import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server-express";
import { createConnection, Connection } from "typeorm";
import ormConfig from "../ormconfig";
import { AppModule } from "./modules/app.module";
import { captureException } from "@sentry/node";
import { loadTestKeys } from "./modules/common/loadKeys";
import { getPassport } from "@walkinserver/walkin-core/src/modules/account/authentication/passport.setup";
import { PassportStatic } from "passport";
import express, { Express } from "express";
import bodyParser = require("body-parser");
import { GraphQLSchema } from "graphql";
import i18n from "i18n";
import cors from "cors";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import { auth } from "./rest/api/auth";
import { corsOptionsDelegate, serializeDate } from "./modules/common/utils";
import { transactionHandler } from "./modules/common/plugins";
import { cache } from "./rest/api/cache";
import {
  CACHE_TTL,
  CACHING_KEYS,
  EXPIRY_MODE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import { setValueToCache } from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
// import { ORDERX_OPERATIONS } from "@walkinserver/walkin-orderx/src/common/constants/constants";
import Router from "./rest/api";
import { errorHandler } from "../../walkin-rewardx/src/modules/rest/middleware/errorHandler";
export const createWalkinServer = async (): Promise<IWalkinServer> => {
  // Declare server
  let server: ApolloServer;
  const introspection: boolean =
    process.env.INTROSPECTION === "true" ? true : false;
  const playground: boolean = process.env.PLAYGROUND === "true" ? true : false;
  // Load local keys for development in environment
  loadTestKeys();
  // Get GQL schema
  const { schema, context, schemaDirectives } = AppModule;
  // Add schema directives
  SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives);
  // Create Apollo Server
  server = new ApolloServer({
    schema,
    context,
    introspection,
    playground,
    // formatResponse: (response, { context, operationName, request }) => {
    //   if (
    //     operationName === ORDERX_OPERATIONS.GET_STORE_CATALOG_WITH_CATEGORIES
    //   ) {
    //     const { storeCode } = request.variables;
    //     const data = JSON.parse(JSON.stringify(response.data));
    //     const key = `${CACHING_KEYS.PUBLISHED_CATALOG}_${context["organizationId"]}_${storeCode}`;
    //     setValueToCache(key, JSON.stringify(data));
    //     return { data };
    //   } else if (
    //     operationName ===
    //     ORDERX_OPERATIONS.GET_PUBLISHED_STORE_CATALOG_WITH_CATEGORIES_FROM
    //   ) {
    //     const data = JSON.parse(JSON.stringify(response.data));
    //     return { data };
    //   }
    //   return response;
    // },
    formatError: err => {
      if (
        !err.extensions.exception ||
        !err.extensions.exception.httpCode ||
        err.extensions.exception.httpCode === INTERNAL_SERVER_ERROR
      ) {
        captureException(err.originalError);
      }
      return Object.keys(err.originalError || {}).length > 0
        ? err.originalError
        : err;
    },
    plugins: [transactionHandler]
  });
  // Connect to database from environment variables
  const connection = await createConnection(ormConfig);
  console.log("🗄️ TypeORM Connected", connection.isConnected);
  // Start Express Server
  const app = express();
  // Start Bodyparser
  app.use(bodyParser.json());

  const { LOGGING_PROVIDER, CAPTURE_GATEWAY_LOGS } = process.env;
  const ALLOWED_OPERATIONS = process.env.ALLOWED_OPERATIONS?.split(",");

  if (CAPTURE_GATEWAY_LOGS === "true") {
    app.use((req, res: any, next) => {
      try {
        const INTERNAL_REQUEST: Boolean = req.headers['user-type']?.toString().toUpperCase() == 'INTERNAL';
        //Do not log if it is an internal API call.
        if (!INTERNAL_REQUEST) {
          new Promise(async () => {
            const API_ROUTE = req.originalUrl
              .split("/")
              .pop()
              ?.split("?")[0];
            if (
              (ALLOWED_OPERATIONS[0] == "*" || ALLOWED_OPERATIONS.includes(API_ROUTE))
            ) {
              console.log((`API Route: ${req.originalUrl}`));
              if (req.query && Object.keys(req.query).length != 0) {
                console.log((`API URL Parmams: ${JSON.stringify(req.query)}`));
              }
              if (req.body && Object.keys(req.body).length != 0) {
                console.log((`API Request Body: ${JSON.stringify(req.body)}`));
              }

              let responseBackup = res.json;
              res.json = function (response) {
                console.log((`API Response: ${JSON.stringify(response)}`));
                responseBackup.apply(res, arguments);
              };
            }
          });
        }
      } catch (error) {
        console.log((`Error capturing gateway logs`));
      }
      next();
    });
  }
  let FORMAT_DATE_IN_RESPONSE = process.env.FORMAT_DATE_IN_RESPONSE ? process.env.FORMAT_DATE_IN_RESPONSE : "true"
  if (FORMAT_DATE_IN_RESPONSE === "true") {
    app.use((req: any, res: any, next) => {
      try {
        let responseBackup = res.json;
        res.json = function (response) {
          serializeDate(response)
          responseBackup.apply(res, arguments);
        };
      } catch (error) {
        console.log((`Error while formatting the date`));
      }
      next();
    })
  }

  // Added cors
  app.use(cors(corsOptionsDelegate));
  // Get passport
  const passport: PassportStatic = getPassport();
  // Start passport
  app.use(passport.initialize());
  // Add i18N
  i18n.configure({
    locales: ["en-IN", "hi-IN", "kn-IN"],
    directory: __dirname + "/modules/common/locales",
    defaultLocale: "en-IN",
    syncFiles: false,
    autoReload: false,
    updateFiles: false,
    objectNotation: true
  });
  app.use(i18n.init);
  app.use("/service", auth);
  app.use("/service", cache);
  app.get("/health", async (req, res) => {
    const commonFields = {
      uptime: process.uptime(),
      timestamp: Date.now()
    }
    try {
      await connection.query('SELECT 1;');
      res.status(200).json({ ...commonFields, status: 200, text: "OK" });
    } catch (error) {
      captureException(error);
      res.status(502).json({ ...commonFields, status: 502, text: "NOT OK" });
    }
  });
  app.get("/version", (req, res) => {
    res.status(200).json({
      version: process.env.SERVER_RELEASE_VERSION
    });
  });

  app.use("/api", Router);

  app.use(errorHandler);

  // Apply graphql server to Express
  server.applyMiddleware({ app });
  return {
    server,
    app,
    schema,
    context
  };
};

interface IWalkinServer {
  server: ApolloServer;
  app: Express;
  schema: GraphQLSchema;
  context: any;
}
