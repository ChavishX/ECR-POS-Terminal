const winston = require("winston");

let custFormat = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: "CBA ECR REST BRIDGE------",
  }),
  winston.format.timestamp({
    format: "YY-MM-DD HH-mm-SS",
  }),
  winston.format.printf((info) => `${info.label}  ${info.message} `)
);

const logger = winston.createLogger({
  format: winston.format.combine(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.json(), custFormat),
    }),
  ],
});

process.on("uncaughtException", (err) => {
  console.log(err);
  logger.error(err);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  logger.error(err);
});

function logLine(msg) {
  console.log(msg);
}

module.exports = logger;
module.exports.logLine = logLine;
