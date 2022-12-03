const { STATUS_NOT_FOUND } = require('../utils/constants');

class DocumentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}

module.exports = {
  DocumentNotFoundError,
};
