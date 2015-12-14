function HttpError(message) {

    this.name = 'HttpError';
    this.message = message;
    this.stack = (new Error()).stack;

    this.httpCode = 400;
}

module.exports = HttpError;
