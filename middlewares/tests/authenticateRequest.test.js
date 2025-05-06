const {BadRequest, Unauthorized} = require('http-errors');
const authenticateRequest = require('../authenticateRequest');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));
describe('authenticateRequest middleware unit tests',() => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const req = {
        headers: {
            authorization:'Bearer token'
        }
    }
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();
    it('should pass when token is valid', () => {
        authenticateRequest(req, res, next);
        expect(next).not.toHaveBeenCalledWith();
    });
    it('should throw Unauthorized error when token is invalid', () => {
        req.headers.authorization = 'Bearer invalidToken';
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Unauthorized('Token is invalid'), null);
        });
        authenticateRequest(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });
    it('should throw BadRequest error when token is not present', () => {
        req.headers.authorization = undefined;
        authenticateRequest(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });
});