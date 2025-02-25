const logger = require("../common/logger");
const { BaseError } = require("./BaseError");

const handleError = (error, res) => {
  if (error instanceof BaseError) {
    logger.error(error.desc);
    return res.status(error.statusCode).send(error.desc);
  } else {
    console.log(error);
    return res.status(SERVER_ERROR).send();
  }
};

module.exports.handleError = handleError;
