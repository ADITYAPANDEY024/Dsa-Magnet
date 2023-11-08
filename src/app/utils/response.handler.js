
class ResponseService {
    constructor() { }

    isSuccess = (statusCode) => {
        const errorStatusCodes = [400, 401, 404, 403, 500, 469]; // Can add more if required
        return errorStatusCodes.every((status) => status !== statusCode);
    };

    sendResponse = (res, statusCode, payload, message) => {
        return res.status(statusCode).json({
            success: this.isSuccess(statusCode) ? true : false,
            payload,
            message: message,
        });
    };

    serviceResponse = (statusCode, payload, message) => {
        return { statusCode, payload, message };
    };
}

module.exports = ResponseService;
