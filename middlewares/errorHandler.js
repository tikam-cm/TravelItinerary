const errorHandler = function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        status:err.status
    });
}

module.exports = errorHandler;