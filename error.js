const { STATUS_NOT_FOUND, STATUS_BAD_REQUEST, CONFLICT_ERROR, FORBIDDEN_ERROR, AUTH_ERROR } = require('./utils/constants');

class DocumentNotFoundError extends Error {
    constructor(message) {
      super(message);
      this.statusCode = STATUS_NOT_FOUND;
  }
}
class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

class Conflicted extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

class Forbidden extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

class authError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTH_ERROR;
  }
}

module.exports = {DocumentNotFoundError, BadRequest, Conflicted, Forbidden, authError};
