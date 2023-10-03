import config from "config";
import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const daileRotate: any = {};
const dailyRotateFileOptions = {
  filename: process.env.LOGGING_TRANSPORT_FILENAME,
  datePattern: process.env.LOGGING_TRANSPORT_DATE_PATTERN,
  zippedArchive: process.env.LOGGING_TRANSPORT_ZIPPED_ARCHIVE === "true",
  maxSize: process.env.LOGGING_TRANSPORT_MAX_SIZE,
  maxFiles: process.env.LOGGING_TRANSPORT_MAX_FILES
};
Object.assign(daileRotate, dailyRotateFileOptions);
daileRotate.filename = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "logs",
  dailyRotateFileOptions.filename
);
const logsDir = path.join(__dirname, "..", "..", "..", "..", "logs");
export const logger = createLogger({
  defaultMeta: {
    service: "wcore-services"
  },
  format: format.json(),
  transports: [new DailyRotateFile(daileRotate), new transports.Console()]
});
