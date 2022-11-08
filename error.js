class DocumentNotFoundError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

module.exports = DocumentNotFoundError;

// class ValidationError extends Error {
//   constructor(message) {
//     super(message);
//     this.name = ValidationError;
//     this.statusCode = 400;
//   }
// }