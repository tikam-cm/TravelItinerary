const errorHandler = (err, req, res, next) => {
    const statusCode = err.status && Number.isInteger(err.status) ? err.status : 500;

    res.status(statusCode).json({
        message: err.message || "An unexpected error occurred",
        status: statusCode,
    });
};

module.exports = errorHandler;