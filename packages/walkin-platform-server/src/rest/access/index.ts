import { Request, Response, NextFunction } from "express";
import { isEqual } from "lodash";
export const canAccessPermissions = () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { headers } = request;
    console.log("headers", headers);
    try {
      const { sa_api_key }: any = headers;
      const serviceApiKey = process.env.SA_API_KEY;
      const token = sa_api_key.split(" ")[1];
      console.log(isEqual(serviceApiKey, token));
      if (isEqual(serviceApiKey, token)) {
        next();
      } else {
        response.status(401).send({
          success: false,
          data: [],
          error: {
            message: "You do not have permissions to access this Resource",
          },
        });
      }
    } catch (error) {
      response.status(401).send({
        success: false,
        data: [],
        error: {
          message: "You do not have permissions to access this Resource",
        },
      });
    }
  };
};
