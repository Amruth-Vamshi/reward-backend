import express, { NextFunction } from "express";
import { getManager } from "typeorm";
import authMiddleware from "../account/auth-guard/auth-gaurd.middleware";
import { SUPPORT_MAIL_CONFIGURATION } from "../common/constants";
import { asyncHandler } from "../rest/middleware/async";
import { communicationModule } from "./communication.module";
import { CommunicationProvider as Communication } from "./communication.providers";
const multer = require("multer");

const CommunicationProvider = communicationModule.injector.get(Communication);
const CommunicationRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: SUPPORT_MAIL_CONFIGURATION.FILE_SIZE_LIMIT }
});

CommunicationRouter.post(
  "/send-support-mail",
  authMiddleware,
  upload.array(
    "attachments",
    parseInt(process.env.SUPPORT_EMAIL_ATTACHMENT_LIMIT)
  ),
  asyncHandler(async (req: any, res: any, next: NextFunction) => {
    try {
      const input = req.body;
      const user = req.user;
      input["user"] = user;

      const attachments = req.files || [];
      input["attachments"] = attachments;

      const result = await getManager().transaction(transactionManager => {
        return CommunicationProvider.sendSupportMail(
          transactionManager,
          communicationModule.injector,
          input
        );
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  })
);

export default CommunicationRouter;
