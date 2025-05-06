const asyncHandler = require('express-async-handler');
const {Unauthorized, BadRequest} = require('http-errors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateRequest = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Unauthorized('Not authorized, token failed');
            }
            req.user = decoded.user;
            next(err);
        });
    }
    else{
        res.status(400);
        throw new BadRequest('Auth Token is not present or malformed');
    }
});

module.exports = authenticateRequest;