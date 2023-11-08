module.exports = class CustomApiError extends Error {
    statusCode;
    constructor(message) {
        super(message);
    }
}

