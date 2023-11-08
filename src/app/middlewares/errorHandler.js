const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Error from common error handler ==>', err.message);

    return res.status(err.statusCode || 500).json({ success: false, payload: {}, message: err.message });
};

module.exports = { errorHandler };
