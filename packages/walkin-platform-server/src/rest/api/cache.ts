import express from "express";
const router = express.Router();
import { canAccessPermissions } from "../access/index";
import {
  clearAllKeys,
  clearEntityCache,
  removeValueFromCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";

router.post(
  "/sa/remove_cache",
  canAccessPermissions(),
  async (request, response, next) => {
    const { keys, entity } = request.body;
    if (keys && keys.length > 0) {
      await removeValueFromCache(keys);
      return response.status(200).send({
        success: true,
        data: {
          message: "Cache remove successfully"
        },
        error: []
      });
    } else if (entity) {
      await clearEntityCache(entity, () => {
        console.log("values removed");
        return response.status(200).send({
          success: true,
          data: {
            message: "Cache removed successfully"
          },
          error: []
        });
      });
    } else {
      return response.status(400).send({
        success: false,
        error: "Error removing cache value"
      });
    }
  }
);

router.post(
  "/sa/clear_cache",
  canAccessPermissions(),
  async (request, response, next) => {
    await clearAllKeys();
    return response.status(200).send({
      success: true,
      data: {
        message: "Cache removed successfully"
      },
      error: []
    });
  }
);

export { router as cache };
