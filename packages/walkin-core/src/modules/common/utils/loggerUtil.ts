import winston, { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf } = format;

const loggerFormat = printf(info => {
  return `${info.timestamp}  ${info.level}: ${info.message}`;
});

const customLoggingLevels = {
  levels: {
    alert: 0,
    audit: 1,
    error: 2,
    info: 3,
    debug: 4
  },
  colors: {
    alert: "blue",
    audit: "green",
    error: "yellow",
    info: "red",
    debug: "orange"
  }
};

var errorTransport = new DailyRotateFile({
  filename: `${process.env.LOG_ERROR_FILE_PATH}-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "50m",
  maxFiles: "20d",
  level: "error"
});

var infoTransport = new DailyRotateFile({
  filename: `${process.env.LOG_INFO_FILE_PATH}-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "50m",
  maxFiles: "10d",
  level: "info"
});

var exceptionTransport = new DailyRotateFile({
  filename: `${process.env.LOG_EXCEPTION_FILE_PATH}-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "50m",
  maxFiles: "10d"
});

var auditLog = new DailyRotateFile({
  filename: `${process.env.LOG_AUDIT_FILE_PATH}-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "100m",
  maxFiles: "10d",
  level: "audit"
});

export const logger = winston.createLogger({
  levels: customLoggingLevels.levels,
  level: `${process.env.LOG_LEVEL}` || "info",
  format: combine(timestamp(), loggerFormat),
  transports: [errorTransport, infoTransport, auditLog],
  exceptionHandlers: [exceptionTransport],
  exitOnError: false
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}
