export const errorHandler = (error, req, res, next) => {
    const httpCode = error.httpCode || 500;
    const code = error.code || error.extensions?.code;
    
    res.status(httpCode).send({
        httpCode,
        message: error.message,
        code
    });
};