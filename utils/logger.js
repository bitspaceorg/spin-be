import winston from "winston";

const logFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `[${level}]  ${timestamp} ${message}`;
  },
);

const logger = new winston.createLogger({
  level: "http",
  format: winston.format.combine(
    winston.format.label(),
    winston.format.timestamp(),
    logFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "spin.log",
    }),
  ],
});

export const useLogger = (req, res, next) => {
  logger.log({
    level: "http",
    message: `[${req.method}] ${req.originalUrl}`,
  });
  next();
};

export default logger;
