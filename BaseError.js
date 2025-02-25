const {
  BAD_REQUEST,
  SERVER_ERROR,
  CONFLICT,
  FORBIDDEN,
  NOT_ALLOWED,
  NOT_AUTHORIZED,
} = require("./statusCodes");

class BaseError extends Error {
  statusCode;
  desc;
  constructor(httpStatusCode, description) {
    super(description);
    this.statusCode = httpStatusCode;
    this.desc = description;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  getStatusCode() {
    return this.statusCode;
  }
}

class BadRequest extends BaseError {
  constructor(description) {
    super(BAD_REQUEST, description);
  }
}

class Conflict extends BaseError {
  constructor(description) {
    super(CONFLICT, description);
  }
}

class NotFound extends BaseError {
  constructor(description) {
    super(BAD_REQUEST, description);
  }
}

class SQLError extends BaseError {
  constructor(description) {
    super(CONFLICT, description);
  }
}

class Forbidden extends BaseError {
  constructor(description) {
    super(FORBIDDEN, description);
  }
}

class NotAllowed extends BaseError {
  constructor(description) {
    super(NOT_ALLOWED, description);
  }
}

class NotAuthorized extends BaseError {
  constructor(description) {
    super(NOT_AUTHORIZED, description);
  }
}

class ServerError extends BaseError {
  constructor(description) {
    super(SERVER_ERROR, description);
  }
}

module.exports.BaseError = BaseError;
module.exports.BadRequest = BadRequest;
module.exports.SQLError = SQLError;
module.exports.NotFound = NotFound;
module.exports.Conflict = Conflict;
module.exports.Forbidden = Forbidden;
module.exports.NotAllowed = NotAllowed;
module.exports.NotAuthorized = NotAuthorized;
module.exports.ServerError = ServerError;
