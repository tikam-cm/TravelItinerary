const errorHandler = require('../errorHandler');
const { BadRequest, Unauthorized } = require('http-errors');

describe('Error Handler Middleware Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 400 Bad Request error', () => {
        const error = new BadRequest('Invalid request');
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid request',
            status: 400
        });
    });

    it('should return 401 Unauthorized error', () => {
        const error = new Unauthorized('User not authenticated');
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User not authenticated',
            status: 401
        });
    });

    it('should return default 500 error for unknown errors', () => {
        const error = new Error('Something went wrong');
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Something went wrong',
            status: 500
        });
    });

    it('should handle errors without message properly', () => {
        const error = { status: 500 }; // No message property
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'An unexpected error occurred',
            status: 500
        });
    });
});
