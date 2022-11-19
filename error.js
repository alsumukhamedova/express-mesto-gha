class DocumentNotFoundError extends Error {
  constructor() {
    super();
    this.name = 'ResourceNotFoundError';
  }
}

module.exports = DocumentNotFoundError;
