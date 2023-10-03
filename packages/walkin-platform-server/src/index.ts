import { captureException, Handlers, init } from "@sentry/node";
import { Integrations } from "@sentry/tracing";
import { createWalkinServer } from "./server";
import { hostname } from "os";
import status from "http-status-codes";
import sofa, { OpenAPI } from "sofa-api";
import path from "path";
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";
// Create and start server
createWalkinServer()
  .then(({ app, context, schema, server }) => {
    let traceRate: number = 1;
    if (process.env.SENTRY_TRACE_RATE) {
      traceRate = Number(process.env.SENTRY_TRACE_RATE);
    }
    // Initialise sentry
    if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
      init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: traceRate,
        integrations: [
          new Integrations.Express({
            app
          }),
          new Integrations.Mysql()
        ],
        environment: process.env.SENTRY_ENV || "production",
        release: process.env.SERVER_RELEASE_VERSION,
        serverName: hostname()
      });
      console.log("Sentry Activated");
    } else {
      console.log("Sentry not activated");
    }

    const openApi = OpenAPI({
      schema,
      info: {
        title: "Peppo RewardX API",
        version: "1.0.0"
      }
    });

    app.use(
      "/api-sofa",
      sofa({
        schema,
        context,
        depthLimit: 2,
        ignore: ["Response,Query.earnableBurnablePoints"],
        method: {
          "Query.evaluateRule": "POST",
          // "Query.earnableBurnablePoints": "POST",
          // "Query.customerFeedbackByMobileNumber": "POST",
          // "Query.customerFeedbackByExternalCustomerId": "POST",
          "Query.removeCustomer": "POST"
        },
        onRoute(info) {
          openApi.addRoute(info, {
            basePath: "/api"
          });
        },
        errorHandler: (res, errors) => {
          let httpCode = status.INTERNAL_SERVER_ERROR;
          let message: any;
          let extensions: { code: any };
          if (errors[0].originalError) {
            ({ httpCode, message, extensions } = errors[0].originalError);
            httpCode = httpCode ? httpCode : status.INTERNAL_SERVER_ERROR;
          }
          if (errors[0].message) {
            message = errors[0].message;
          }

          if (errors[0]) {
            captureException(errors[0]);
          }
          res.status(httpCode).send({
            code:
              extensions && extensions.code
                ? extensions.code
                : "INTERNAL_SERVER_ERROR",
            message: message ? message : status.getStatusText(httpCode)
          });
        }
      })
    );

    app.use(
      Handlers.requestHandler({
        ip: true
      })
    );
    // TracingHandler creates a trace for every incoming request
    app.use(Handlers.tracingHandler());

    // TODO: Do we still need this? i18n test api.
    // app.get("/test", (req, res) => {
    //   const acceptLanguage: string = req.headers["accept-language"][0];
    //   i18n.setLocale(acceptLanguage);
    //   res.send({ message: i18n.__("welcome") });
    // });
    // save the REST documentation

    const swaggerFile = path.join(__dirname, "..", "swagger.yml");
    openApi.save(swaggerFile);

    const swaggerDocument = require("../swagger.json");
    app.use(
      "/swagger",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, { explorer: true })
    );

    const PORT = process.env.PORT || 2000;
    // Start the server
    app.listen({ port: PORT }, () => {
      // eslint-disable-next-line no-console
      console.log(
        `       
      🎉 Walkin platform server running in ${process.env.NODE_ENV} mode
      🚀 Graphql Server ready at http://localhost:${PORT}${server.graphqlPath}
      🔌 REST API ready at http://localhost:${PORT}/api-sofa
      🔌 Specific REST API's ready at http://localhost:${PORT}/api
      💻 Swagger UI ready at http://localhost:${PORT}/swagger
      🐂 Bull queue connected to redis at ${"redis://" +
        process.env.REDIS_HOST +
        ":" +
        process.env.REDIS_PORT}
      `
      );
    });
  })
  .catch(error => {
    console.log("Error in starting dev/prod server", error);
    captureException(error);
  });
