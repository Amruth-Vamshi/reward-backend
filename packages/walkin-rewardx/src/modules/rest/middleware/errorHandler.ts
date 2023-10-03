import * as Sentry from "@sentry/node";

export const errorHandler = (error, req, res, next) => {
    Sentry.captureException(error);
    const httpCode = error.httpCode || 500;
    const code = error.code || error.extensions?.code;
    res.status(httpCode).send({
        httpCode,
        message: error.message,
        code
    });
};