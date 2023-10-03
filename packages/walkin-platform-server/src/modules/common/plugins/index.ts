import { ApolloError } from "apollo-server";

import {
  withScope,
  Severity,
  captureException,
  getCurrentHub,
  startTransaction,
  setUser,
  configureScope
} from "@sentry/node";
import { PluginDefinition, GraphQLRequestContext } from "apollo-server-core";
import { decode } from "jsonwebtoken";
import gql from "graphql-tag";

// reference to documentation can be found here https://www.apollographql.com/docs/apollo-server/integrations/plugins/

export const transactionHandler: PluginDefinition = {
  requestDidStart(requestContext: GraphQLRequestContext) {
    const authHeader = requestContext.request.http.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const decodedToken = decode(token);
      const { app_id, id } = decodedToken as any;
      const userDetails = {
        id
      };
      if (app_id) {
        userDetails["id"] = app_id;
      }
      setUser(userDetails);
    }
    const obj: any = gql`
      ${requestContext.request.query}
    `;
    const transactionScope = {
      name: obj.definitions[0].selectionSet.selections[0].name.value
    };
    const transactionId = requestContext.request.http.headers.get(
      "x-transaction-id"
    );

    const transaction = startTransaction({
      ...transactionScope
    });

    if (transactionId) {
      transaction.setTag("transaction_id", transactionId);
    }

    configureScope(scope => {
      scope.setSpan(transaction);
    });

    return {
      didEncounterErrors(ctx) {
        if (!ctx.operation) {
          return;
        }

        for (const err of ctx.errors) {
          // Only report internal server errors,
          // all errors extending ApolloError should be user-facing
          if (err instanceof ApolloError) {
            continue;
          }

          // Add scoped report details and send to Sentry
          withScope(scope => {
            // whether failing operation was query/mutation/subscription
            scope.setTag("kind", ctx.operation.operation);
            scope.setTag("trace", transaction.traceId);
            scope.setTag("transaction", transaction.transaction.name);
            if (transactionId) {
              scope.setTag("transaction_id", transactionId);
            }
            if (authHeader) {
              const token = authHeader.split(" ")[1];
              const decodedToken = decode(token);
              const { app_id, id } = decodedToken as any;
              if (app_id) {
                scope.setTag("app_id", app_id);
              } else {
                scope.setTag("user_id", id);
              }
            }
            // Log query and variables as extras
            scope.setExtra("query", ctx.request.query);
            // scope.setExtra("variables", ctx.request.variables);

            if (err.path) {
              scope.addBreadcrumb({
                category: "query-path",
                message: err.path.join(" > "),
                level: Severity.Debug
              });
            }
            captureException(err);
          });
        }
      },
      willSendResponse(ctx) {
        transaction.finish();
      }
    };
  }
};
